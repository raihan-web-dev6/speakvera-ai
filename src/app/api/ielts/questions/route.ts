import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  auth,
} from "@/auth";

import {
  ieltsPart1Topics,
} from "@/data/ielts/part1-topics";

import {
  ieltsCueCards,
} from "@/data/ielts/cue-cards";

function randomItem<T>(
  items: T[]
): T {
  return items[
    Math.floor(
      Math.random() *
        items.length
    )
  ];
}

export async function GET(
  request: NextRequest
) {
  try {
    /*
     * Authentication only.
     *
     * This route serves static
     * IELTS questions and does
     * not use Gemini.
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
          status: 401,
        }
      );
    }

    const part =
      request.nextUrl.searchParams.get(
        "part"
      );

    if (part === "1") {
      const topic =
        randomItem(
          ieltsPart1Topics
        );

      return NextResponse.json({
        part: 1,

        topic:
          topic.topic,

        questions:
          topic.questions,
      });
    }

    if (part === "2") {
      const cueCard =
        randomItem(
          ieltsCueCards
        );

      return NextResponse.json({
        part: 2,

        cueCard,
      });
    }

    return NextResponse.json(
      {
        message:
          "Use ?part=1 or ?part=2",
      },
      {
        status: 400,
      }
    );
  } catch (error) {
    console.error(
      "IELTS questions:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Could not load IELTS questions",
      },
      {
        status: 500,
      }
    );
  }
}