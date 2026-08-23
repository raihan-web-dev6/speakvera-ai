import {
  NextResponse,
} from "next/server";

import {
  auth,
} from "@/auth";

import connectDb from "@/lib/db";

import {
  gemini,
} from "@/lib/gemini";

import AssessmentAttempt from "@/models/assessmentAttempt.model";

import {
  assessmentEvaluationSchema,
} from "@/schemas/assessment.schema";

import {
  consumeAssessmentAttempt,
  consumeSpeakingSeconds,
} from "@/lib/usage";

import {
  runWithAiUsage,
} from "@/lib/ai-usage";

import {
  usageLimitResponse,
} from "@/lib/usage-response";

type AssessmentResponse = {
  question: string;

  transcript: string;

  pronunciationScore?: number;

  fluencyScore: number;

  durationSeconds?: number;

  accuracyScore?: number;

  prosodyScore?: number;
};

function average(
  values: number[]
) {
  if (!values.length) {
    return 0;
  }

  return Math.round(
    values.reduce(
      (
        total,
        value
      ) =>
        total +
        value,
      0
    ) /
      values.length
  );
}

function getCefrLevel(
  score: number
):
  | "A1"
  | "A2"
  | "B1"
  | "B2"
  | "C1"
  | "C2" {
  if (score >= 90) {
    return "C2";
  }

  if (score >= 75) {
    return "C1";
  }

  if (score >= 60) {
    return "B2";
  }

  if (score >= 45) {
    return "B1";
  }

  if (score >= 30) {
    return "A2";
  }

  return "A1";
}

function calculateBillableSeconds(
  responses:
    AssessmentResponse[]
) {
  return responses.reduce(
    (
      total,
      response
    ) => {
      const transcript =
        String(
          response.transcript ||
            ""
        ).trim();

      const words =
        transcript
          .split(/\s+/)
          .filter(Boolean)
          .length;

      const minimumFromWords =
        words > 0
          ? Math.ceil(
              words / 3
            )
          : 0;

      const reported =
        Math.max(
          0,

          Number(
            response.durationSeconds ||
              0
          )
        );

      return (
        total +
        Math.max(
          minimumFromWords,
          reported
        )
      );
    },
    0
  );
}

export async function POST(
  request: Request
) {
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

    const {
      responses,
    }: {
      responses:
        AssessmentResponse[];
    } =
      await request.json();

    if (
      !Array.isArray(
        responses
      ) ||
      responses.length < 4
    ) {
      return NextResponse.json(
        {
          message:
            "Not enough assessment responses",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Count one assessment.
     *
     * We deliberately do this here,
     * not in /assessment/start.
     */

    await consumeAssessmentAttempt(
      userId
    );

    /*
     * Count speaking time.
     */

    const speakingSeconds =
      calculateBillableSeconds(
        responses
      );

    if (
      speakingSeconds >
      0
    ) {
      await consumeSpeakingSeconds(
        userId,
        speakingSeconds
      );
    }

    const answers =
      responses
        .map(
          (
            response,
            index
          ) => `
Question ${index + 1}

${response.question}

Answer:

${response.transcript}

Browser delivery score:

${response.fluencyScore}/100
`
        )
        .join("\n");

    const prompt = `
You are Speakvera AI evaluating an English speaking assessment.

This is NOT an official CEFR examination.

Candidate responses:

${answers}

Score:

Grammar: 0-100
Vocabulary: 0-100
Communication: 0-100

Communication means:

- relevance
- ability to explain ideas
- sentence development
- clarity of meaning
- ability to maintain an answer

Do NOT evaluate pronunciation.

Return ONLY JSON:

{
  "grammarScore": 70,

  "vocabularyScore": 72,

  "communicationScore": 75,

  "grammarFeedback": "...",

  "vocabularyFeedback": "...",

  "communicationFeedback": "...",

  "strengths": [
    "..."
  ],

  "improvements": [
    "..."
  ],

  "summary": "..."
}

Be realistic.

Do not inflate scores.
`;

    const aiEvaluation =
      await runWithAiUsage(
        userId,

        async () => {
          const aiResponse =
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

          if (!aiResponse.text) {
            throw new Error(
              "Empty evaluation"
            );
          }

          return assessmentEvaluationSchema.parse(
            JSON.parse(
              aiResponse.text
            )
          );
        }
      );

    const fluencyScore =
      average(
        responses.map(
          (response) =>
            response.fluencyScore ||
            0
        )
      );

    /*
     * Browser-only mode.
     */

    const pronunciationScore =
      0;

    const overallScore =
      Math.round(
        (
          aiEvaluation.grammarScore +
          aiEvaluation.vocabularyScore +
          aiEvaluation.communicationScore +
          fluencyScore
        ) /
          4
      );

    const cefrLevel =
      getCefrLevel(
        overallScore
      );

    const passed =
      overallScore >= 70 &&
      aiEvaluation.grammarScore >=
        60 &&
      aiEvaluation.communicationScore >=
        60;

    /*
     * Means the assessment passed.
     *
     * Paid access is still checked
     * server-side when actually
     * generating the certificate.
     */

    const certificateEligible =
      passed;

    await connectDb();

    const attempt =
      await AssessmentAttempt.create(
        {
          userId,

          responses,

          grammarScore:
            aiEvaluation.grammarScore,

          vocabularyScore:
            aiEvaluation.vocabularyScore,

          communicationScore:
            aiEvaluation.communicationScore,

          fluencyScore,

          pronunciationScore,

          overallScore,

          cefrLevel,

          passed,

          certificateEligible,

          strengths:
            aiEvaluation.strengths,

          improvements:
            aiEvaluation.improvements,

          feedback: {
            grammar:
              aiEvaluation.grammarFeedback,

            vocabulary:
              aiEvaluation.vocabularyFeedback,

            communication:
              aiEvaluation.communicationFeedback,

            summary:
              aiEvaluation.summary,
          },

          completedAt:
            new Date(),
        }
      );

    return NextResponse.json({
      message:
        "Assessment completed",

      attemptId:
        attempt._id,

      overallScore,

      cefrLevel,

      passed,

      certificateEligible,

      speakingSeconds,
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
      "Assessment evaluation:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Could not evaluate assessment",
      },
      {
        status: 500,
      }
    );
  }
}