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

import User from "@/models/user.model";

import PlacementAttempt from "@/models/placementAttempt.model";

import {
  placementEvaluationSchema,
} from "@/schemas/placement.schema";

type ResponseItem = {
  question: string;

  transcript: string;

  fluencyScore:
    number;

  pronunciationScore:
    number;

  accuracyScore?:
    number;

  prosodyScore?:
    number;
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

function determineCEFR(
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
      responses.length <
        4
    ) {
      return NextResponse.json(
        {
          message:
            "Complete the placement test first",
        },
        {
          status: 400,
        }
      );
    }

    const answerText =
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
${response.fluencyScore}/100
`
        )
        .join("\n");

    const prompt = `
You are Speakvera AI evaluating a short English speaking placement test.

This is a Speakvera learning estimate and NOT an official CEFR examination.

Candidate responses:

${answerText}

Evaluate:

Grammar: 0-100
Vocabulary: 0-100
Communication: 0-100

Communication includes:

- relevance
- clarity
- sentence development
- ability to explain ideas
- ability to sustain an answer

Do NOT evaluate pronunciation.

The browser cannot provide a real pronunciation-assessment score.

Return ONLY JSON:

{
  "grammarScore": 65,
  "vocabularyScore": 62,
  "communicationScore": 68,
  "strengths": [
    "..."
  ],
  "improvements": [
    "..."
  ],
  "summary": "..."
}

Judge the complete set of answers.

Do not inflate scores.
`;

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

    if (
      !aiResponse.text
    ) {
      throw new Error(
        "Empty placement evaluation"
      );
    }

    const evaluation =
      placementEvaluationSchema.parse(
        JSON.parse(
          aiResponse.text
        )
      );

    /*
     * Browser-derived delivery score.
     */
    const fluencyScore =
      average(
        responses.map(
          (item) =>
            item.fluencyScore ||
            0
        )
      );

    /*
     * Pronunciation is unavailable
     * in browser-only mode.
     *
     * Keep 0 for old MongoDB schema
     * compatibility, but do NOT use
     * this in scoring.
     */
    const pronunciationScore =
      0;

    const overallScore =
      Math.round(
        (
          evaluation.grammarScore +
          evaluation.vocabularyScore +
          evaluation.communicationScore +
          fluencyScore
        ) /
          4
      );

    const cefrLevel =
      determineCEFR(
        overallScore
      );

    await connectDb();

    const attempt =
      await PlacementAttempt.create(
        {
          userId,

          responses,

          grammarScore:
            evaluation.grammarScore,

          vocabularyScore:
            evaluation.vocabularyScore,

          communicationScore:
            evaluation.communicationScore,

          fluencyScore,

          pronunciationScore,

          overallScore,

          cefrLevel,

          strengths:
            evaluation.strengths,

          improvements:
            evaluation.improvements,

          summary:
            evaluation.summary,
        }
      );

    await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          currentLevel:
            cefrLevel,

          onboardingCompleted:
            true,
        },
      }
    );

    return NextResponse.json({
      message:
        "Placement completed",

      attemptId:
        attempt._id,

      cefrLevel,

      overallScore,

      onboardingCompleted:
        true,
    });
  } catch (error) {
    console.error(
      "Placement evaluation:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Could not evaluate placement test",
      },
      {
        status: 500,
      }
    );
  }
}