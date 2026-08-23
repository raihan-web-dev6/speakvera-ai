import {
  NextResponse,
} from "next/server";

import mongoose from "mongoose";

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

type AssessmentDocument = {
  overallScore?:
    number;

  score?:
    number;

  estimatedLevel?:
    string;

  cefrLevel?:
    string;

  level?:
    string;

  createdAt?:
    Date;
};

type SpeakingAggregate = {
  _id:
    null;

  attempts:
    number;

  totalSeconds:
    number;

  averageScore:
    number | null;
};

/*
 * =====================================================
 * DATE HELPERS
 * =====================================================
 */

function getUtcDayKey(
  date: Date
) {
  return date
    .toISOString()
    .slice(
      0,
      10
    );
}

function subtractUtcDays(
  dayKey: string,
  days: number
) {
  const date =
    new Date(
      `${dayKey}T00:00:00.000Z`
    );

  date.setUTCDate(
    date.getUTCDate() -
      days
  );

  return getUtcDayKey(
    date
  );
}

/*
 * =====================================================
 * STREAK
 * =====================================================
 *
 * A learner keeps their streak if
 * they practiced today or yesterday.
 */

function calculateStreak(
  dates: Date[]
) {
  if (
    dates.length ===
    0
  ) {
    return 0;
  }

  const practicedDays =
    new Set(
      dates.map(
        (
          date
        ) =>
          getUtcDayKey(
            date
          )
      )
    );

  const today =
    getUtcDayKey(
      new Date()
    );

  const yesterday =
    subtractUtcDays(
      today,
      1
    );

  let cursor:
    string;

  if (
    practicedDays.has(
      today
    )
  ) {
    cursor =
      today;
  } else if (
    practicedDays.has(
      yesterday
    )
  ) {
    cursor =
      yesterday;
  } else {
    return 0;
  }

  let streak =
    0;

  while (
    practicedDays.has(
      cursor
    )
  ) {
    streak +=
      1;

    cursor =
      subtractUtcDays(
        cursor,
        1
      );
  }

  return streak;
}

/*
 * =====================================================
 * VALID CEFR LEVEL
 * =====================================================
 */

function normalizeLevel(
  value:
    unknown
) {
  const validLevels =
    new Set([
      "A1",
      "A2",
      "B1",
      "B2",
      "C1",
      "C2",
    ]);

  if (
    typeof value ===
      "string" &&
    validLevels.has(
      value.toUpperCase()
    )
  ) {
    return value.toUpperCase();
  }

  return null;
}

/*
 * =====================================================
 * GET DASHBOARD
 * =====================================================
 */

export async function GET() {
  try {
    /*
     * ==========================================
     * AUTH
     * ==========================================
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

    await connectDb();

    const objectUserId =
      new mongoose.Types.ObjectId(
        userId
      );

    /*
     * ==========================================
     * LOAD DATA IN PARALLEL
     * ==========================================
     */

    const [
      user,
      courseState,
      plan,
      speakingAggregate,
      recentSpeakingAttempts,
      latestAssessment,
    ] =
      await Promise.all([
        /*
         * USER
         */

        User.findById(
          userId
        )
          .select(
            "name currentLevel"
          )
          .lean(),

        /*
         * COURSE
         */

        getEverydayCourseState(
          userId
        ),

        /*
         * SUBSCRIPTION
         */

        getUserPlan(
          userId
        ),

        /*
         * SPEAKING STATS
         */

        SpeakingAttempt.aggregate<SpeakingAggregate>(
          [
            {
              $match: {
                userId:
                  objectUserId,
              },
            },

            {
              $project: {
                durationSeconds: {
                  $ifNull: [
                    "$durationSeconds",
                    0,
                  ],
                },

                /*
                 * Supports the score structure
                 * used by the AI speaking
                 * feedback.
                 */

                scoreValue: {
                  $ifNull: [
                    "$feedback.overallScore",

                    {
                      $ifNull: [
                        "$overallScore",

                        {
                          $ifNull: [
                            "$feedback.score",
                            null,
                          ],
                        },
                      ],
                    },
                  ],
                },
              },
            },

            {
              $group: {
                _id:
                  null,

                attempts: {
                  $sum:
                    1,
                },

                totalSeconds: {
                  $sum:
                    "$durationSeconds",
                },

                /*
                 * $avg ignores null scores.
                 */

                averageScore: {
                  $avg:
                    "$scoreValue",
                },
              },
            },
          ]
        ),

        /*
         * RECENT PRACTICE DATES
         *
         * Enough history for streak
         * calculation without loading every
         * speaking attempt forever.
         */

        SpeakingAttempt.find({
          userId:
            objectUserId,
        })
          .select(
            "createdAt"
          )
          .sort({
            createdAt:
              -1,
          })
          .limit(
            365
          )
          .lean(),

        /*
         * GENERAL SPEAKING ASSESSMENT
         *
         * Mongoose's default pluralized
         * AssessmentAttempt collection is
         * assessmentattempts.
         */

        mongoose.connection.db
          ? mongoose.connection.db
              .collection<AssessmentDocument>(
                "assessmentattempts"
              )
              .findOne(
                {
                  userId:
                    objectUserId,
                },
                {
                  sort: {
                    createdAt:
                      -1,
                  },
                }
              )
          : Promise.resolve(
              null
            ),
      ]);

    /*
     * ==========================================
     * SPEAKING TOTALS
     * ==========================================
     */

    const speaking =
      speakingAggregate[0];

    const speakingAttempts =
      speaking?.attempts ??
      0;

    const totalSpeakingSeconds =
      speaking?.totalSeconds ??
      0;

    const totalSpeakingMinutes =
      Math.round(
        totalSpeakingSeconds /
          60
      );

    const averageSpeakingScore =
      speaking?.averageScore
        ? Math.round(
            speaking.averageScore
          )
        : 0;

    /*
     * ==========================================
     * STREAK
     * ==========================================
     */

    const practiceDates =
      recentSpeakingAttempts
        .map(
          (
            attempt
          ) => {
            if (
              !attempt.createdAt
            ) {
              return null;
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
              return null;
            }

            return date;
          }
        )
        .filter(
          (
            date
          ): date is Date =>
            date !== null
        );

    const streak =
      calculateStreak(
        practiceDates
      );

    /*
     * ==========================================
     * ASSESSMENT
     * ==========================================
     */

    const rawAssessmentScore =
      latestAssessment
        ?.overallScore ??
      latestAssessment
        ?.score ??
      null;

    const assessmentScore =
      typeof rawAssessmentScore ===
        "number" &&
      Number.isFinite(
        rawAssessmentScore
      )
        ? Math.round(
            rawAssessmentScore
          )
        : null;

    /*
     * User.currentLevel is the main source.
     *
     * If missing, fall back to the most
     * recent speaking assessment.
     */

    const currentLevel =
      normalizeLevel(
        user?.currentLevel
      ) ??
      normalizeLevel(
        latestAssessment
          ?.estimatedLevel
      ) ??
      normalizeLevel(
        latestAssessment
          ?.cefrLevel
      ) ??
      normalizeLevel(
        latestAssessment
          ?.level
      ) ??
      "—";

    /*
     * ==========================================
     * COURSE
     * ==========================================
     */

    const completedLessons =
      courseState.completedCount;

    const courseProgress =
      courseState.progressPercent;

    const nextLessonDay =
      courseState.courseCompleted
        ? 40
        : courseState.nextLessonDay;

    /*
     * ==========================================
     * XP
     * ==========================================
     *
     * Speakvera XP formula:
     *
     * completed lesson = 100 XP
     * speaking attempt = 20 XP
     * completed assessment = 100 XP
     *
     * Deterministic, so we don't need a
     * separate XP database counter yet.
     */

    const xp =
      completedLessons *
        100 +
      speakingAttempts *
        20 +
      (assessmentScore !==
      null
        ? 100
        : 0);

    /*
     * ==========================================
     * RESPONSE
     * ==========================================
     */

    return NextResponse.json({
      user: {
        name:
          user?.name ||
          session.user
            .name ||
          "Learner",
      },

      currentLevel,

      assessmentScore,

      streak,

      xp,

      completedLessons,

      totalLessons:
        40,

      courseProgress,

      nextLessonDay,

      courseCompleted:
        courseState.courseCompleted,

      speakingAttempts,

      totalSpeakingMinutes,

      averageSpeakingScore,

      plan,
    });
  } catch (error) {
    console.error(
      "Dashboard summary error:",
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