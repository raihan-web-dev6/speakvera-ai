import {
  NextResponse,
} from "next/server";

import {
  Types,
} from "mongoose";

import {
  auth,
} from "@/auth";

import connectDb from "@/lib/db";

import User from "@/models/user.model";

import SpeakingAttempt from "@/models/speakingAttempt.model";

import {
  getEverydayCourseState,
} from "@/lib/everyday-course-progress";

import {
  getUserPlan,
} from "@/lib/usage";

export const runtime =
  "nodejs";

type ActivityAttempt = {
  createdAt?:
    Date | string;

  durationSeconds?:
    number;
};

/*
 * =====================================================
 * UTC DAY KEY
 * =====================================================
 *
 * This matches the same daily style
 * used by the usage-limit system.
 */

function getDayKey(
  date: Date
) {
  return date
    .toISOString()
    .slice(
      0,
      10
    );
}

/*
 * =====================================================
 * LAST N DAYS
 * =====================================================
 */

function getRecentDays(
  count:
    number
) {
  const result: {
    dayKey:
      string;

    label:
      string;
  }[] = [];

  const now =
    new Date();

  for (
    let offset =
      count - 1;
    offset >= 0;
    offset--
  ) {
    const date =
      new Date(now);

    date.setUTCDate(
      date.getUTCDate() -
        offset
    );

    result.push({
      dayKey:
        getDayKey(
          date
        ),

      label:
        date.toLocaleDateString(
          "en-US",
          {
            weekday:
              "short",

            timeZone:
              "UTC",
          }
        ),
    });
  }

  return result;
}

/*
 * =====================================================
 * CURRENT PRACTICE STREAK
 * =====================================================
 *
 * If the learner has not practiced
 * today yet but practiced yesterday,
 * we keep their current streak alive.
 */

function calculateStreak(
  attempts:
    ActivityAttempt[]
) {
  const practicedDays =
    new Set<string>();

  for (
    const attempt
    of attempts
  ) {
    if (
      !attempt.createdAt
    ) {
      continue;
    }

    const date =
      new Date(
        attempt.createdAt
      );

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      continue;
    }

    practicedDays.add(
      getDayKey(
        date
      )
    );
  }

  const today =
    new Date();

  const todayKey =
    getDayKey(
      today
    );

  /*
   * If learner practiced today,
   * start counting from today.
   *
   * Otherwise start from yesterday,
   * allowing the learner to practice
   * later today without losing streak.
   */

  const cursor =
    new Date(
      today
    );

  if (
    !practicedDays.has(
      todayKey
    )
  ) {
    cursor.setUTCDate(
      cursor.getUTCDate() -
        1
    );
  }

  let streak =
    0;

  while (
    practicedDays.has(
      getDayKey(
        cursor
      )
    )
  ) {
    streak++;

    cursor.setUTCDate(
      cursor.getUTCDate() -
        1
    );
  }

  return streak;
}

export async function GET() {
  try {
    /*
     * =================================================
     * AUTH
     * =================================================
     */

    const session =
      await auth();

    const userId =
      session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        {
          message:
            "Unauthorized",
        },
        {
          status:
            401,
        }
      );
    }

    if (
      !Types.ObjectId.isValid(
        userId
      )
    ) {
      return NextResponse.json(
        {
          message:
            "Invalid user.",
        },
        {
          status:
            400,
        }
      );
    }

    await connectDb();

    const objectUserId =
      new Types.ObjectId(
        userId
      );

    /*
     * =================================================
     * SPEAKING HISTORY WINDOW
     * =================================================
     *
     * We only need recent documents
     * for streak + chart.
     */

    const historyStart =
      new Date();

    historyStart.setUTCDate(
      historyStart.getUTCDate() -
        365
    );

    /*
     * =================================================
     * LOAD DASHBOARD DATA
     * =================================================
     */

    const [
      user,
      aggregateResult,
      recentAttempts,
      courseState,
      plan,
    ] =
      await Promise.all([
        User.findById(
          userId
        )
          .select(
            "currentLevel name"
          )
          .lean(),

        /*
         * Aggregate totals in MongoDB
         * instead of loading every
         * speaking attempt into memory.
         */

        SpeakingAttempt.aggregate([
          {
            $match: {
              userId:
                objectUserId,
            },
          },

          {
            $group: {
              _id:
                null,

              totalAttempts: {
                $sum:
                  1,
              },

              totalSpeakingSeconds: {
                $sum: {
                  $ifNull: [
                    "$durationSeconds",
                    0,
                  ],
                },
              },

              /*
               * Supports a few possible
               * score locations while
               * remaining compatible with
               * older speaking attempts.
               */

              averageScore: {
                $avg: {
                  $ifNull: [
                    "$overallScore",

                    {
                      $ifNull: [
                        "$feedback.overallScore",

                        {
                          $ifNull: [
                            "$score",
                            null,
                          ],
                        },
                      ],
                    },
                  ],
                },
              },
            },
          },
        ]),

        SpeakingAttempt.find({
          userId:
            objectUserId,

          createdAt: {
            $gte:
              historyStart,
          },
        })
          .select(
            "createdAt durationSeconds"
          )
          .sort({
            createdAt:
              -1,
          })
          .lean(),

        getEverydayCourseState(
          userId
        ),

        getUserPlan(
          userId
        ),
      ]);

    /*
     * =================================================
     * TOTALS
     * =================================================
     */

    const totals =
      aggregateResult[0] ?? {
        totalAttempts:
          0,

        totalSpeakingSeconds:
          0,

        averageScore:
          null,
      };

    const totalAttempts =
      Number(
        totals.totalAttempts ??
          0
      );

    const totalSpeakingSeconds =
      Number(
        totals.totalSpeakingSeconds ??
          0
      );

    const speakingMinutes =
      Math.round(
        totalSpeakingSeconds /
          60
      );

    const rawAverage =
      totals.averageScore;

    const averageScore =
      typeof rawAverage ===
        "number" &&
      Number.isFinite(
        rawAverage
      )
        ? Math.round(
            rawAverage
          )
        : null;

    /*
     * =================================================
     * STREAK
     * =================================================
     */

    const streak =
      calculateStreak(
        recentAttempts as ActivityAttempt[]
      );

    /*
     * =================================================
     * XP
     * =================================================
     *
     * For now Speakvera XP is derived
     * deterministically:
     *
     * completed lesson = 100 XP
     * speaking attempt = 20 XP
     *
     * Later we can replace this with an
     * event-based persistent XP ledger.
     */

    const xp =
      courseState
        .completedCount *
        100 +
      totalAttempts *
        20;

    /*
     * =================================================
     * LAST 7 DAYS
     * =================================================
     */

    const days =
      getRecentDays(
        7
      );

    const activityMap =
      new Map<
        string,
        {
          attempts:
            number;

          seconds:
            number;
        }
      >();

    for (
      const day
      of days
    ) {
      activityMap.set(
        day.dayKey,
        {
          attempts:
            0,

          seconds:
            0,
        }
      );
    }

    for (
      const attempt
      of recentAttempts as ActivityAttempt[]
    ) {
      if (
        !attempt.createdAt
      ) {
        continue;
      }

      const key =
        getDayKey(
          new Date(
            attempt.createdAt
          )
        );

      const existing =
        activityMap.get(
          key
        );

      if (!existing) {
        continue;
      }

      existing.attempts +=
        1;

      existing.seconds +=
        Number(
          attempt.durationSeconds ??
            0
        );
    }

    const activity =
      days.map(
        (
          day
        ) => {
          const value =
            activityMap.get(
              day.dayKey
            );

          return {
            dayKey:
              day.dayKey,

            label:
              day.label,

            attempts:
              value?.attempts ??
              0,

            minutes:
              Math.round(
                ((value?.seconds ??
                  0) /
                  60) *
                  10
              ) /
              10,
          };
        }
      );

    /*
     * =================================================
     * RESPONSE
     * =================================================
     */

    return NextResponse.json({
      user: {
        name:
          user?.name ??
          session.user.name ??
          "Learner",

        currentLevel:
          user?.currentLevel ??
          null,
      },

      plan,

      stats: {
        streak,

        xp,

        courseProgress:
          courseState
            .progressPercent,

        speakingAttempts:
          totalAttempts,

        speakingMinutes,

        averageScore,
      },

      course: {
        completedCount:
          courseState
            .completedCount,

        highestCompletedDay:
          courseState
            .highestCompletedDay,

        nextLessonDay:
          courseState
            .nextLessonDay,

        courseCompleted:
          courseState
            .courseCompleted,

        progressPercent:
          courseState
            .progressPercent,
      },

      activity,
    });
  } catch (error) {
    console.error(
      "Dashboard stats error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Unable to load dashboard.",
      },
      {
        status:
          500,
      }
    );
  }
}