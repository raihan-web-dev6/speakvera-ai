"use client";

import {
  Loader2,
  Mic,
  RotateCcw,
  Square,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  useContinuousSpeech,
  type ContinuousSpeechResult,
} from "@/hooks/useContinuousSpeech";

import type {
  SpeakingFeedback,
} from "@/schemas/feedback.schema";

import SpeakingFeedbackCard from "@/components/feedback/SpeakingFeedbackCard";

type Props = {
  dayNumber:
    number;

  question:
    string;

  onComplete: (
    score:
      number
  ) => void;
};

export default function LessonSpeakingPractice({
  dayNumber,
  question,
  onComplete,
}: Props) {
  const {
    startListening,

    stopListening,

    listening,

    liveTranscript,

    error:
      speechError,
  } =
    useContinuousSpeech();

  const [
    speechResult,
    setSpeechResult,
  ] =
    useState<ContinuousSpeechResult | null>(
      null
    );

  const [
    feedback,
    setFeedback,
  ] =
    useState<SpeakingFeedback | null>(
      null
    );

  const [
    analyzing,
    setAnalyzing,
  ] =
    useState(
      false
    );

  const [
    error,
    setError,
  ] =
    useState(
      ""
    );

  /*
   * =====================================================
   * START
   * =====================================================
   */

  async function start() {
    try {
      setError(
        ""
      );

      setFeedback(
        null
      );

      setSpeechResult(
        null
      );

      await startListening();
    } catch (error) {
      setError(
        error instanceof
          Error
          ? error.message
          : "Could not start microphone"
      );
    }
  }

  /*
   * =====================================================
   * FINISH
   * =====================================================
   */

  async function finish() {
    if (!listening) {
      return;
    }

    try {
      setAnalyzing(
        true
      );

      setError(
        ""
      );

      const result =
        await stopListening();

      const transcript =
        result.transcript.trim();

      if (!transcript) {
        throw new Error(
          "No speech was detected. Please try again."
        );
      }

      setSpeechResult(
        result
      );

      /*
       * ==========================================
       * STEP 1
       *
       * SERVER AI EVALUATION
       * ==========================================
       *
       * Browser sends raw speaking
       * data only.
       *
       * It does NOT send a score that
       * the server trusts.
       */

      const feedbackResponse =
        await fetch(
          "/api/ai/feedback",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                {
                  courseType:
                    "EVERYDAY_ENGLISH",

                  lessonDay:
                    dayNumber,

                  question,

                  transcript,

                  durationSeconds:
                    result.durationSeconds,

                  /*
                   * Metadata only.
                   *
                   * Not used in overall
                   * trusted score.
                   */

                  speechConfidence:
                    result.speechConfidence,
                }
              ),
          }
        );

      const feedbackData =
        await feedbackResponse.json();

      if (
        !feedbackResponse.ok
      ) {
        throw new Error(
          feedbackData.message ||
            "Could not analyze your answer"
        );
      }

      const nextFeedback =
        feedbackData.feedback as
          SpeakingFeedback;

      const receipt =
        feedbackData.receipt as
          string;

      if (!receipt) {
        throw new Error(
          "The server did not return a verified speaking result."
        );
      }

      /*
       * ==========================================
       * STEP 2
       *
       * SAVE SIGNED RESULT
       * ==========================================
       *
       * Notice that we send ONLY:
       *
       * {
       *   receipt
       * }
       *
       * No score.
       * No feedback.
       * No lesson day.
       * No transcript.
       *
       * All trusted values are inside
       * the HMAC-signed receipt.
       */

      const saveResponse =
        await fetch(
          "/api/speaking/save",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                {
                  receipt,
                }
              ),
          }
        );

      const savedData =
        await saveResponse.json();

      if (
        !saveResponse.ok
      ) {
        throw new Error(
          savedData.message ||
            "Could not save speaking attempt"
        );
      }

      /*
       * Only show the feedback after
       * the trusted attempt has been
       * successfully stored.
       */

      setFeedback(
        nextFeedback
      );

      /*
       * This score came from the
       * server-verified attempt.
       */

      onComplete(
        Number(
          savedData.overallScore
        )
      );
    } catch (error) {
      setError(
        error instanceof
          Error
          ? error.message
          : "Speaking practice failed"
      );
    } finally {
      setAnalyzing(
        false
      );
    }
  }

  /*
   * =====================================================
   * RESET
   * =====================================================
   */

  function reset() {
    setSpeechResult(
      null
    );

    setFeedback(
      null
    );

    setError(
      ""
    );
  }

  /*
   * =====================================================
   * FEEDBACK
   * =====================================================
   */

  if (
    feedback &&
    speechResult
  ) {
    return (
      <SpeakingFeedbackCard
        feedback={
          feedback
        }
        deliveryScore={
          speechResult
            .fluencyScore
        }
        wordsPerMinute={
          speechResult
            .wordsPerMinute
        }
        speechConfidence={
          speechResult
            .speechConfidence
        }
        onSpeakAgain={
          reset
        }
      />
    );
  }

  /*
   * =====================================================
   * RECORDING UI
   * =====================================================
   */

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
        Speaking Practice
      </p>

      <h2 className="mt-3 text-xl font-bold leading-8 text-slate-950">
        {question}
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        Speak naturally for around
        30–60 seconds. Your answer
        will be analyzed for grammar,
        vocabulary and answer
        quality. Delivery information
        is shown separately.
      </p>

      <div className="mt-7 flex justify-center">
        {!listening ? (
          <button
            type="button"
            onClick={
              start
            }
            disabled={
              analyzing
            }
            className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl shadow-blue-600/20 disabled:opacity-50"
          >
            {analyzing ? (
              <Loader2
                size={
                  30
                }
                className="animate-spin"
              />
            ) : (
              <Mic
                size={
                  31
                }
              />
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={
              finish
            }
            className="flex h-24 w-24 items-center justify-center rounded-full bg-red-600 text-white shadow-xl"
          >
            <Square
              size={
                27
              }
              fill="currentColor"
            />
          </button>
        )}
      </div>

      <p className="mt-4 text-center text-sm font-medium text-slate-500">
        {listening
          ? "Recording — tap to finish"
          : analyzing
            ? "Analyzing your English..."
            : "Tap the microphone to begin"}
      </p>

      {liveTranscript && (
        <div className="mt-6 rounded-2xl bg-slate-50 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Live transcript
          </p>

          <p className="mt-2 text-sm leading-7 text-slate-700">
            {
              liveTranscript
            }
          </p>
        </div>
      )}

      {(error ||
        speechError) && (
        <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {error ||
            speechError}
        </div>
      )}

      {speechResult &&
        !feedback &&
        !analyzing && (
          <button
            type="button"
            onClick={
              reset
            }
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600"
          >
            <RotateCcw
              size={
                15
              }
            />

            Try again
          </button>
        )}
    </section>
  );
}