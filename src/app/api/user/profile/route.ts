import {
  NextResponse,
} from "next/server";

import { auth } from "@/auth";

import connectDb from "@/lib/db";

import User from "@/models/user.model";

import UserPreference from "@/models/userPreference.model";

import {
  profileUpdateSchema,
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

    const [
      user,
      preference,
    ] =
      await Promise.all([
        User.findById(
          userId
        )
          .select(
            "name email image currentLevel onboardingCompleted createdAt"
          )
          .lean(),

        UserPreference.findOne(
          {
            userId,
          }
        ).lean(),
      ]);

    if (!user) {
      return NextResponse.json(
        {
          message:
            "User not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      user,
      preference,
    });
  } catch (error) {
    console.error(
      "Profile GET:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Could not load profile",
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
      profileUpdateSchema.safeParse(
        body
      );

    if (!parsed.success) {
      return NextResponse.json(
        {
          message:
            "Invalid profile data",
        },
        {
          status: 400,
        }
      );
    }

    await connectDb();

    const user =
      await User.findByIdAndUpdate(
        userId,

        {
          $set: {
            name:
              parsed.data
                .name,
          },
        },

        {
          new: true,

          runValidators:
            true,
        }
      )
        .select(
          "name email image currentLevel"
        )
        .lean();

    return NextResponse.json({
      message:
        "Profile updated",

      user,
    });
  } catch (error) {
    console.error(
      "Profile PATCH:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Could not update profile",
      },
      {
        status: 500,
      }
    );
  }
}