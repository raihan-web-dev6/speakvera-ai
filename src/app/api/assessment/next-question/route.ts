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

type PreviousResponse = {
  question: string;

  transcript: string;

  fluencyScore?: number;

  pronunciationScore?: number;
};

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
      responses,

      currentQuestionNumber,
    }: {
      responses:
        PreviousResponse[];

      currentQuestionNumber:
        number;
    } =
      await request.json();

    if (
      !Array.isArray(
        responses
      ) ||
      !responses.length
    ) {
      return NextResponse.json(
        {
          message:
            "Previous responses are required",
        },
        {
          status: 400,
        }
      );
    }

    const previousAnswers =
      responses
        .map(
          (
            response,
            index
          ) => `
Question ${index + 1}:

${response.question}

Answer:

${response.transcript}

Browser delivery score:

${response.fluencyScore ?? 0}/100
`
        )
        .join("\n");

    const prompt = `
You are Speakvera AI conducting an adaptive English speaking assessment.

This is question ${
      Number(
        currentQuestionNumber
      ) + 1
    } of 6.

Previous performance:

${previousAnswers}

Generate ONE next speaking question.

The purpose is to estimate the learner's English speaking ability.

Adapt difficulty:

- If answers are very short/simple or unclear, stay around A1-A2.
- If answers communicate everyday ideas reasonably well, move toward B1.
- If answers contain detailed explanations and opinions, move toward B2.
- If answers show advanced vocabulary and reasoning, test C1.
- Only test highly complex abstract language if performance suggests C2.

The next question should encourage a spoken answer of approximately 30-90 seconds.

Do NOT evaluate pronunciation.

Do NOT ask specialist knowledge.

Do NOT ask programming questions.

Do NOT repeat previous questions.

Return ONLY JSON:

{
  "question": "...",
  "targetLevel": "A1 | A2 | B1 | B2 | C1 | C2"
}
`;

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
                    0.35,
                },
              }
            );

          if (!response.text) {
            throw new Error(
              "Gemini returned no question"
            );
          }

          const parsed =
            JSON.parse(
              response.text
            );

          if (
            !parsed.question
          ) {
            throw new Error(
              "Invalid adaptive question"
            );
          }

          return parsed;
        }
      );

    return NextResponse.json({
      question:
        result.question,

      targetLevel:
        result.targetLevel ||
        "B1",
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
      "Adaptive assessment question error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Could not generate the next assessment question",
      },
      {
        status: 500,
      }
    );
  }
}