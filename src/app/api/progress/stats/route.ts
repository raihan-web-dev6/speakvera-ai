import { NextResponse } from "next/server";

import { auth } from "@/auth";
import connectDb from "@/lib/db";

import SpeakingAttempt from "@/models/speakingAttempt.model";
import LessonProgress from "@/models/lessonProgress.model";

export async function GET() {
  try {
    const session = await auth();

    const userId = (
      session?.user as {
        id?: string;
      }
    )?.id;

    if (!userId) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    await connectDb();

    const attempts =
      await SpeakingAttempt.find({
        userId,
      })
        .sort({
          createdAt: -1,
        })
        .limit(100)
        .lean();

    const completedLessons =
      await LessonProgress.countDocuments(
        {
          userId,
          courseType:
            "EVERYDAY_ENGLISH",
          status: "COMPLETED",
        }
      );

    if (!attempts.length) {
      return NextResponse.json({
        grammar: 0,
        vocabulary: 0,
        fluency: 0,
        pronunciation: 0,
        overall: 0,

        speakingAttempts: 0,

        completedLessons,

        courseProgress:
          Math.round(
            (completedLessons / 40) *
              100
          ),
      });
    }

    const totals =
      attempts.reduce(
        (acc, attempt) => {
          acc.grammar +=
            attempt.grammarScore || 0;

          acc.vocabulary +=
            attempt.vocabularyScore ||
            0;

          acc.fluency +=
            attempt.fluencyScore || 0;

          acc.pronunciation +=
            attempt.pronunciationScore ||
            0;

          acc.overall +=
            attempt.overallScore || 0;

          return acc;
        },

        {
          grammar: 0,
          vocabulary: 0,
          fluency: 0,
          pronunciation: 0,
          overall: 0,
        }
      );

    const count =
      attempts.length;

    return NextResponse.json({
      grammar: Math.round(
        totals.grammar / count
      ),

      vocabulary: Math.round(
        totals.vocabulary / count
      ),

      fluency: Math.round(
        totals.fluency / count
      ),

      pronunciation: Math.round(
        totals.pronunciation /
          count
      ),

      overall: Math.round(
        totals.overall / count
      ),

      speakingAttempts: count,

      completedLessons,

      courseProgress:
        Math.round(
          (completedLessons / 40) *
            100
        ),
    });
  } catch (error) {
    console.error(
      "Progress stats:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Could not calculate progress",
      },
      {
        status: 500,
      }
    );
  }
}