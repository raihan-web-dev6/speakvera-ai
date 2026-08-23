import {
  NextResponse,
} from "next/server";

import {
  auth,
} from "@/auth";

import {
  assessmentStarterQuestions,
} from "@/data/assessment/questions";

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

    return NextResponse.json({
      totalQuestions: 6,

      questions: [
        assessmentStarterQuestions[0],
        assessmentStarterQuestions[1],
      ],
    });
  } catch (error) {
    console.error(
      "Assessment start:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Could not start assessment",
      },
      {
        status: 500,
      }
    );
  }
}