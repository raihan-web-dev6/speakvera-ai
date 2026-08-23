import {
  NextResponse,
} from "next/server";

import {
  auth,
} from "@/auth";

import {
  gemini,
} from "@/lib/gemini";

import {
  runWithAiUsage,
} from "@/lib/ai-usage";

import {
  usageLimitResponse,
} from "@/lib/usage-response";

export async function POST(
  request: Request
) {
  try {
    /*
     * Authentication
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

    const {
      cueCardTopic,

      previousAnswer,

      previousQuestions = [],
    } =
      await request.json();

    if (!cueCardTopic) {
      return NextResponse.json(
        {
          message:
            "Cue card topic is required",
        },
        {
          status: 400,
        }
      );
    }

    const prompt = `
You are conducting an IELTS Speaking Part 3 practice interview.

The Part 2 topic was:

"${cueCardTopic}"

The candidate previously said:

"${previousAnswer || ""}"

Questions already asked:

${JSON.stringify(
  previousQuestions
)}

Generate exactly 4 IELTS Speaking Part 3 questions.

Requirements:

- Questions must relate generally to the Part 2 topic.
- They should become more abstract and analytical.
- Ask about opinions, causes, effects, comparisons, future changes or society.
- Do not ask personal Part 1-style questions.
- Questions should sound like a professional IELTS examiner.
- Do not repeat previous questions.

Return ONLY valid JSON:

{
  "questions": [
    "question 1",
    "question 2",
    "question 3",
    "question 4"
  ]
}
`;

    /*
     * One Gemini call =
     * one AI request.
     *
     * Invalid Gemini output also
     * causes the reserved request
     * to be refunded.
     */

    const result =
      await runWithAiUsage(
        userId,

        async () => {
          const response =
            await gemini.models.generateContent(
              {
                model:
                  "gemini-3.6-flash",

                contents:
                  prompt,

                config: {
                  responseMimeType:
                    "application/json",

                  temperature:
                    0.4,
                },
              }
            );

          if (!response.text) {
            throw new Error(
              "Empty AI response"
            );
          }

          const parsed =
            JSON.parse(
              response.text
            );

          if (
            !Array.isArray(
              parsed.questions
            )
          ) {
            throw new Error(
              "Invalid question response"
            );
          }

          return parsed;
        }
      );

    return NextResponse.json({
      questions:
        result.questions.slice(
          0,
          4
        ),
    });
  } catch (error) {
    const usageResponse =
      usageLimitResponse(
        error
      );

    if (usageResponse) {
      return usageResponse;
    }

    console.error(
      "IELTS follow-up error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Could not generate Part 3 questions",
      },
      {
        status: 500,
      }
    );
  }
}