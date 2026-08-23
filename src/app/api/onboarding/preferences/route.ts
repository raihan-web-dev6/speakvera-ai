import {
  NextResponse,
} from "next/server";

import { auth } from "@/auth";

import connectDb from "@/lib/db";

import UserPreference from "@/models/userPreference.model";

import {
  preferenceSchema,
} from "@/schemas/profile.schema";

export async function POST(
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
            "Invalid onboarding data",

          errors:
            parsed.error.flatten(),
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
        "Preferences saved",

      preference,
    });
  } catch (error) {
    console.error(
      "Save onboarding preferences:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Could not save preferences",
      },
      {
        status: 500,
      }
    );
  }
}