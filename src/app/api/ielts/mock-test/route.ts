import {
  NextResponse,
} from "next/server";

import {
  auth,
} from "@/auth";

import connectDb from "@/lib/db";

import IeltsAttempt from "@/models/ieltsAttempt.model";

import {
  consumeIeltsAttempt,
  consumeSpeakingSeconds,
} from "@/lib/usage";

import {
  usageLimitResponse,
} from "@/lib/usage-response";

/*
 * This matches the fields accepted
 * by the IeltsAttempt Mongo model.
 */

type IeltsStoredResponse = {
  part?:
    | 1
    | 2
    | 3;

  question?: string;

  transcript?: string;

  pronunciationScore?:
    number;

  fluencyScore?:
    number;
};

/*
 * durationSeconds is needed by
 * our API for usage calculation,
 * but it does not need to be
 * stored in the existing IELTS
 * response schema.
 */

type IeltsResponse =
  IeltsStoredResponse & {
    durationSeconds?:
      number;
  };

type IeltsEvaluation = {
  fluencyBand:
    number;

  lexicalBand:
    number;

  grammarBand:
    number;

  pronunciationBand:
    number;

  overallBand:
    number;

  strengths:
    string[];

  improvements:
    string[];

  fluencyFeedback:
    string;

  vocabularyFeedback:
    string;

  grammarFeedback:
    string;

  pronunciationFeedback:
    string;

  summary:
    string;
};

function calculateBillableSeconds(
  responses:
    IeltsResponse[]
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

      const wordCount =
        transcript
          .split(/\s+/)
          .filter(Boolean)
          .length;

      /*
       * Around 180 WPM maximum
       * accepted server-side.
       *
       * 180 WPM ≈ 3 words/sec.
       */

      const minimumFromWords =
        wordCount > 0
          ? Math.ceil(
              wordCount /
                3
            )
          : 0;

      const reportedDuration =
        Math.max(
          0,

          Number(
            response.durationSeconds ??
              0
          )
        );

      return (
        total +
        Math.max(
          minimumFromWords,
          reportedDuration
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

    const body =
      await request.json();

    const responses =
      body.responses as
        | IeltsResponse[]
        | undefined;

    const evaluation =
      body.evaluation as
        | IeltsEvaluation
        | undefined;

    if (
      !Array.isArray(
        responses
      ) ||
      responses.length ===
        0 ||
      !evaluation
    ) {
      return NextResponse.json(
        {
          message:
            "Missing IELTS test data",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Validate IELTS part
     * before writing to MongoDB.
     */

    const invalidPart =
      responses.some(
        (response) =>
          response.part !==
            undefined &&
          response.part !==
            1 &&
          response.part !==
            2 &&
          response.part !==
            3
      );

    if (invalidPart) {
      return NextResponse.json(
        {
          message:
            "Invalid IELTS part",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Consume one IELTS
     * completed-test attempt.
     */

    await consumeIeltsAttempt(
      userId
    );

    /*
     * Consume speaking usage.
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

    /*
     * Strip durationSeconds before
     * saving because the existing
     * IeltsAttempt response schema
     * does not contain that field.
     */

    const storedResponses:
      IeltsStoredResponse[] =
      responses.map(
        (response) => ({
          part:
            response.part,

          question:
            response.question,

          transcript:
            response.transcript,

          pronunciationScore:
            0,

          fluencyScore:
            response.fluencyScore,
        })
      );

    await connectDb();

    const attempt =
      await IeltsAttempt.create(
        {
          userId,

          responses:
            storedResponses,

          fluencyBand:
            Number(
              evaluation.fluencyBand
            ),

          lexicalBand:
            Number(
              evaluation.lexicalBand
            ),

          grammarBand:
            Number(
              evaluation.grammarBand
            ),

          /*
           * Browser-only speech
           * cannot score this.
           */

          pronunciationBand:
            0,

          overallBand:
            Number(
              evaluation.overallBand
            ),

          strengths:
            evaluation.strengths ||
            [],

          improvements:
            evaluation.improvements ||
            [],

          feedback: {
            fluency:
              evaluation.fluencyFeedback ||
              "",

            vocabulary:
              evaluation.vocabularyFeedback ||
              "",

            grammar:
              evaluation.grammarFeedback ||
              "",

            pronunciation:
              evaluation.pronunciationFeedback ||
              "Pronunciation was not scored.",

            summary:
              evaluation.summary ||
              "",
          },

          completedAt:
            new Date(),
        }
      );

    /*
     * Once the create() overload
     * resolves correctly,
     * attempt is a real Mongoose
     * document and _id is valid.
     */

    const attemptId =
      attempt._id.toString();

    return NextResponse.json(
      {
        message:
          "IELTS mock test saved",

        attemptId,

        speakingSeconds,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    const usageResponse =
      usageLimitResponse(
        error
      );

    if (usageResponse) {
      return usageResponse;
    }

    console.error(
      "Save IELTS test:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Could not save IELTS mock test",
      },
      {
        status: 500,
      }
    );
  }
}