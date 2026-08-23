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
  ieltsEvaluationSchema,
} from "@/schemas/ielts.schema";

import {
  runWithAiUsage,
} from "@/lib/ai-usage";

import {
  usageLimitResponse,
} from "@/lib/usage-response";

type ResponseItem = {
  part: number;

  question: string;

  transcript: string;

  pronunciationScore?: number;

  fluencyScore?: number;

  durationSeconds?: number;
};

function nearestHalf(
  value: number
) {
  return (
    Math.round(
      value * 2
    ) / 2
  );
}

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
    }: {
      responses:
        ResponseItem[];
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
            "IELTS responses are required",
        },
        {
          status: 400,
        }
      );
    }

    const transcriptData =
      responses
        .map(
          (
            response,
            index
          ) => `
Response ${index + 1}

Part:
${response.part}

Question:
${response.question}

Candidate answer:
${response.transcript}

Browser delivery score:
${response.fluencyScore ?? "unknown"}/100
`
        )
        .join("\n");

    const prompt = `
You are helping Speakvera provide IELTS Speaking PRACTICE feedback.

This is NOT an official IELTS test.

Candidate responses:

${transcriptData}

Evaluate only:

1. Fluency and Coherence
2. Lexical Resource
3. Grammatical Range and Accuracy

Do NOT evaluate pronunciation.

The browser speech-recognition API does not provide reliable pronunciation assessment.

Return ONLY JSON:

{
  "fluencyBand": 6.5,

  "lexicalBand": 6.5,

  "grammarBand": 6.0,

  "pronunciationBand": 0,

  "strengths": [
    "..."
  ],

  "improvements": [
    "..."
  ],

  "fluencyFeedback": "...",

  "vocabularyFeedback": "...",

  "grammarFeedback": "...",

  "pronunciationFeedback": "Pronunciation was not scored because Speakvera is currently using browser speech recognition.",

  "summary": "..."
}

Scores must use whole or half bands.

Be conservative.

Do not claim an official IELTS result.
`;

    const evaluation =
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
                    0.15,
                },
              }
            );

          if (!response.text) {
            throw new Error(
              "Empty evaluation"
            );
          }

          return ieltsEvaluationSchema.parse(
            JSON.parse(
              response.text
            )
          );
        }
      );

    /*
     * Partial Speakvera estimate.
     *
     * Pronunciation intentionally
     * excluded.
     */

    const average =
      (
        evaluation.fluencyBand +
        evaluation.lexicalBand +
        evaluation.grammarBand
      ) /
      3;

    const overallBand =
      nearestHalf(
        average
      );

    return NextResponse.json({
      evaluation: {
        ...evaluation,

        pronunciationBand:
          0,

        overallBand,
      },
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
      "IELTS evaluation:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Could not evaluate IELTS speaking practice",
      },
      {
        status: 500,
      }
    );
  }
}