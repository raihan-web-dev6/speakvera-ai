import {
  NextResponse,
} from "next/server";

import {
  auth,
} from "@/auth";

import connectDb from "@/lib/db";

import SpeakingAttempt from "@/models/speakingAttempt.model";

import {
  consumeSpeakingSeconds,
  UsageLimitError,
} from "@/lib/usage";

import {
  SpeakingReceiptError,
  verifySpeakingReceipt,
} from "@/lib/speaking-receipt";

export const runtime =
  "nodejs";

export async function POST(
  request:
    Request
) {
  let pendingAttemptId:
    string | null =
    null;

  try {
    /*
     * ==========================================
     * AUTH
     * ==========================================
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
          status:
            401,
        }
      );
    }

    /*
     * ==========================================
     * BODY
     * ==========================================
     *
     * IMPORTANT:
     *
     * Receipt is the ONLY thing we
     * accept from the browser.
     */

    const body =
      await request.json();

    const receipt =
      typeof body.receipt ===
        "string"
        ? body.receipt
        : "";

    if (!receipt) {
      return NextResponse.json(
        {
          message:
            "Missing signed speaking receipt",
        },
        {
          status:
            400,
        }
      );
    }

    /*
     * ==========================================
     * VERIFY SERVER SIGNATURE
     * ==========================================
     */

    const payload =
      verifySpeakingReceipt(
        receipt
      );

    /*
     * Receipt belongs only to the
     * user for whom it was generated.
     */

    if (
      payload.userId !==
      userId
    ) {
      return NextResponse.json(
        {
          message:
            "This speaking result does not belong to your account.",
        },
        {
          status:
            403,
        }
      );
    }

    await connectDb();

    /*
     * ==========================================
     * REPLAY PROTECTION
     * ==========================================
     *
     * If browser retries the exact
     * same request, don't charge
     * speaking usage twice.
     */

    const existing =
      await SpeakingAttempt.findOne(
        {
          receiptId:
            payload.receiptId,
        }
      );

    if (
      existing
        ?.serverVerified
    ) {
      return NextResponse.json(
        {
          message:
            "Speaking attempt already saved",

          attemptId:
            existing._id,

          overallScore:
            existing.overallScore,

          durationSeconds:
            existing.durationSeconds,
        },
        {
          status:
            200,
        }
      );
    }

    /*
     * An unfinished attempt should
     * normally never remain.
     *
     * If one exists from a crashed
     * request, remove it after a
     * short safety period.
     */

    if (
      existing &&
      !existing.serverVerified
    ) {
      const age =
        Date.now() -
        new Date(
          existing.createdAt
        ).getTime();

      if (
        age <
        120_000
      ) {
        return NextResponse.json(
          {
            message:
              "This speaking attempt is still being processed. Please wait a moment.",
          },
          {
            status:
              409,
          }
        );
      }

      await SpeakingAttempt.deleteOne(
        {
          _id:
            existing._id,

          serverVerified:
            false,
        }
      );
    }

    /*
     * ==========================================
     * CREATE PENDING TRUSTED ATTEMPT
     * ==========================================
     *
     * Everything comes from the
     * signed receipt.
     *
     * NOTHING comes from editable
     * browser score fields.
     */

    const attempt =
      await SpeakingAttempt.create(
        {
          userId,

          courseType:
            payload.courseType,

          lessonDay:
            payload.lessonDay,

          question:
            payload.question,

          transcript:
            payload.transcript,

          improvedAnswer:
            payload.feedback
              .improvedAnswer ||
            "",

          grammarScore:
            payload.grammarScore,

          vocabularyScore:
            payload.vocabularyScore,

          answerQualityScore:
            payload.answerQualityScore,

          deliveryScore:
            payload.deliveryScore,

          fluencyScore:
            payload.deliveryScore,

          /*
           * Recognition confidence is
           * stored only as metadata.
           *
           * It is NOT part of the
           * trusted overall score.
           */

          speechConfidence:
            payload.speechConfidence,

          wordsPerMinute:
            payload.wordsPerMinute,

          pronunciationScore:
            0,

          overallScore:
            payload.overallScore,

          feedback: {
            grammarMistakes:
              payload.feedback
                .grammarMistakes ||
              [],

            vocabularySuggestions:
              payload.feedback
                .vocabularySuggestions ||
              [],

            strengths:
              payload.feedback
                .strengths ||
              [],

            improvements:
              payload.feedback
                .improvements ||
              [],

            shortFeedback:
              payload.feedback
                .shortFeedback ||
              "",
          },

          durationSeconds:
            payload.billableDuration,

          receiptId:
            payload.receiptId,

          /*
           * Becomes true only after
           * usage allowance succeeds.
           */

          serverVerified:
            false,

          scoreSource:
            "SERVER_AI",

          scoreVersion:
            "speaking-v1",
        }
      );

    pendingAttemptId =
      String(
        attempt._id
      );

    /*
     * ==========================================
     * SPEAKING USAGE
     * ==========================================
     */

    try {
      await consumeSpeakingSeconds(
        userId,
        payload.billableDuration
      );
    } catch (
      error
    ) {
      /*
       * No quota =
       * do not leave a valid attempt.
       */

      await SpeakingAttempt.deleteOne(
        {
          _id:
            attempt._id,

          serverVerified:
            false,
        }
      );

      pendingAttemptId =
        null;

      throw error;
    }

    /*
     * ==========================================
     * FINALIZE
     * ==========================================
     */

    const verifiedAttempt =
      await SpeakingAttempt.findByIdAndUpdate(
        attempt._id,

        {
          $set: {
            serverVerified:
              true,
          },
        },

        {
          returnDocument:
            "after",
        }
      );

    if (
      !verifiedAttempt
    ) {
      throw new Error(
        "Could not finalize speaking attempt"
      );
    }

    pendingAttemptId =
      null;

    return NextResponse.json(
      {
        message:
          "Speaking attempt saved",

        attemptId:
          verifiedAttempt._id,

        overallScore:
          verifiedAttempt.overallScore,

        durationSeconds:
          verifiedAttempt.durationSeconds,

        serverVerified:
          true,
      },
      {
        status:
          201,
      }
    );
  } catch (error) {
    /*
     * Clean an unfinished record
     * after unexpected errors.
     */

    if (
      pendingAttemptId
    ) {
      try {
        await SpeakingAttempt.deleteOne(
          {
            _id:
              pendingAttemptId,

            serverVerified:
              false,
          }
        );
      } catch (
        cleanupError
      ) {
        console.error(
          "Speaking cleanup:",
          cleanupError
        );
      }
    }

    /*
     * ==========================================
     * INVALID / TAMPERED RECEIPT
     * ==========================================
     */

    if (
      error instanceof
      SpeakingReceiptError
    ) {
      return NextResponse.json(
        {
          message:
            error.message,
        },
        {
          status:
            400,
        }
      );
    }

    /*
     * ==========================================
     * USAGE LIMIT
     * ==========================================
     */

    if (
      error instanceof
      UsageLimitError
    ) {
      return NextResponse.json(
        {
          message:
            error.message,

          code:
            error.code,

          plan:
            error.plan,

          limit:
            error.limit,

          used:
            error.used,
        },
        {
          status:
            429,
        }
      );
    }

    /*
     * Duplicate receipt race.
     */

    if (
      typeof error ===
        "object" &&
      error !== null &&
      "code" in
        error &&
      (
        error as {
          code?:
            number;
        }
      ).code ===
        11000
    ) {
      return NextResponse.json(
        {
          message:
            "This speaking result has already been submitted.",
        },
        {
          status:
            409,
        }
      );
    }

    console.error(
      "Save speaking attempt:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Could not save speaking attempt",
      },
      {
        status:
          500,
      }
    );
  }
}