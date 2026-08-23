import { NextResponse } from "next/server";

import { auth } from "@/auth";
import connectDb from "@/lib/db";

import SpeakingAttempt from "@/models/speakingAttempt.model";

export async function GET(
  request: Request
) {
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

    const { searchParams } =
      new URL(request.url);

    const limit = Math.min(
      Number(
        searchParams.get("limit") ||
          20
      ),
      50
    );

    const attempts =
      await SpeakingAttempt.find({
        userId,
      })
        .sort({
          createdAt: -1,
        })
        .limit(limit)
        .select(
          "courseType lessonDay question transcript overallScore grammarScore vocabularyScore fluencyScore pronunciationScore createdAt"
        )
        .lean();

    return NextResponse.json({
      attempts,
    });
  } catch (error) {
    console.error(
      "Speaking history:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Could not load speaking history",
      },
      {
        status: 500,
      }
    );
  }
}