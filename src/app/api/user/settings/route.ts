import {
  NextResponse,
} from "next/server";

import { auth } from "@/auth";

import connectDb from "@/lib/db";

import UserPreference from "@/models/userPreference.model";

import {
  preferenceSchema,
} from "@/schemas/profile.schema";

export async function GET() {
  try {
    const session =
      await auth();

    const userId = (
      session?.user as {
        id?: string;
      }
    )?.id;

    if (!userId) {
      return NextResponse.json(
        {
          message:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    await connectDb();

    const preference =
      await UserPreference.findOne(
        {
          userId,
        }
      ).lean();

    return NextResponse.json({
      preference:
        preference || {
          goals: [
            "EVERYDAY_ENGLISH",
          ],

          learningTarget:
            "B2",

          dailyGoalMinutes:
            20,

          preferredAccent:
            "NEUTRAL",

          nativeLanguage:
            "",
        },
    });
  } catch (error) {
    console.error(
      "Settings GET:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Could not load settings",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(
  request: Request
) {
  try {
    const session =
      await auth();

    const userId = (
      session?.user as {
        id?: string;
      }
    )?.id;

    if (!userId) {
      return NextResponse.json(
        {
          message:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      await request.json();

    const parsed =
      preferenceSchema.safeParse(
        body
      );

    if (!parsed.success) {
      return NextResponse.json(
        {
          message:
            "Invalid settings",
        },
        {
          status: 400,
        }
      );
    }

    await connectDb();

    const preference =
      await UserPreference.findOneAndUpdate(
        {
          userId,
        },

        {
          $set:
            parsed.data,
        },

        {
          upsert: true,

          new: true,

          runValidators:
            true,
        }
      );

    return NextResponse.json({
      message:
        "Settings updated",

      preference,
    });
  } catch (error) {
    console.error(
      "Settings PATCH:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Could not update settings",
      },
      {
        status: 500,
      }
    );
  }
}