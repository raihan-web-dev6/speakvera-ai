import { NextResponse } from "next/server";

import { auth } from "@/auth";
import connectDb from "@/lib/db";

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

    const progress =
      await LessonProgress.find({
        userId,
        courseType:
          "EVERYDAY_ENGLISH",
      })
        .sort({
          dayNumber: 1,
        })
        .lean();

    const completed =
      progress.filter(
        (item) =>
          item.status === "COMPLETED"
      ).length;

    const progressPercent =
      Math.round(
        (completed / 40) * 100
      );

    return NextResponse.json({
      progress,
      completed,
      totalDays: 40,
      progressPercent,
    });
  } catch (error) {
    console.error(
      "Get course progress:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Could not load course progress",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
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

    const {
      dayNumber,
      score,
      status,
    } = await request.json();

    if (
      !dayNumber ||
      dayNumber < 1 ||
      dayNumber > 40
    ) {
      return NextResponse.json(
        {
          message:
            "Invalid course day",
        },
        {
          status: 400,
        }
      );
    }

    const update: Record<
      string,
      unknown
    > = {
      status:
        status || "IN_PROGRESS",

      score,

      startedAt: new Date(),
    };

    if (
      status === "COMPLETED"
    ) {
      update.completedAt =
        new Date();
    }

    const progress =
      await LessonProgress.findOneAndUpdate(
        {
          userId,
          courseType:
            "EVERYDAY_ENGLISH",
          dayNumber,
        },

        {
          $set: update,

          $inc: {
            attempts: 1,
          },
        },

        {
          upsert: true,
          new: true,
          runValidators: true,
        }
      );

    return NextResponse.json({
      message:
        "Progress updated",

      progress,
    });
  } catch (error) {
    console.error(
      "Update course progress:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Could not update progress",
      },
      {
        status: 500,
      }
    );
  }
}