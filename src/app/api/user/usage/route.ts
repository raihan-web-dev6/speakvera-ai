import {
  NextResponse,
} from "next/server";

import {
  auth,
} from "@/auth";

import {
  getUsageSnapshot,
} from "@/lib/usage";

export async function GET() {
  try {
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
          status: 401,
        }
      );
    }

    const snapshot =
      await getUsageSnapshot(
        userId
      );

    return NextResponse.json({
      plan:
        snapshot.plan,

      dayKey:
        snapshot.dayKey,

      usage:
        snapshot.usage,

      limits:
        snapshot.limits,

      remaining:
        snapshot.remaining,

      speakingMinutes: {
        used:
          Math.ceil(
            snapshot.usage
              .speakingSeconds /
              60
          ),

        limit:
          Math.ceil(
            snapshot.limits
              .speakingSecondsPerDay /
              60
          ),

        remaining:
          Math.floor(
            snapshot.remaining
              .speakingSeconds /
              60
          ),
      },
    });
  } catch (error) {
    console.error(
      "Usage GET:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Could not load usage",
      },

      {
        status: 500,
      }
    );
  }
}