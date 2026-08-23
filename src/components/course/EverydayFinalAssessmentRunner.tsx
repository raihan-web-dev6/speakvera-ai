"use client";

import {
  CheckCircle2,
  Loader2,
  Mic,
  ShieldCheck,
  Square,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import {
  useState,
} from "react";

import {
  everydayFinalQuestions,
} from "@/data/everyday-course/final-assessment";

import {
  useContinuousSpeech,
} from "@/hooks/useContinuousSpeech";

type SavedAnswer = {
  questionId: string;

  question: string;

  transcript: string;

  durationSeconds: number;

  deliveryScore: number;

  wordsPerMinute: number;

  speechConfidence: number;
};

export default function EverydayFinalAssessmentRunner() {
  const router =
    useRouter();

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
    currentIndex,
    setCurrentIndex,
  ] =
    useState(0);

  const [
    answers,
    setAnswers,
  ] =
    useState<
      SavedAnswer[]
    >([]);

  const [
    processing,
    setProcessing,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const question =
    everydayFinalQuestions[
      currentIndex
    ];

  const progress =
    Math.round(
      (answers.length /
        everydayFinalQuestions.length) *
        100
    );

  async function startAnswer() {
    try {
      setError("");

      await startListening();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not start microphone"
      );
    }
  }

  async function stopAnswer() {
    if (
      !listening ||
      processing
    ) {
      return;
    }

    try {
      setProcessing(
        true
      );

      setError("");

      const result =
        await stopListening();

      const transcript =
        result.transcript.trim();

      const words =
        transcript
          .split(/\s+/)
          .filter(Boolean);

      if (
        words.length < 5
      ) {
        throw new Error(
          "Your answer was too short. Please speak at least one complete sentence and try again."
        );
      }

      const answer:
        SavedAnswer = {
        questionId:
          question.id,

        question:
          question.question,

        transcript,

        durationSeconds:
          result.durationSeconds,

        deliveryScore:
          result.fluencyScore,

        wordsPerMinute:
          result.wordsPerMinute,

        speechConfidence:
          result.speechConfidence,
      };

      const nextAnswers =
        [
          ...answers,
          answer,
        ];

      setAnswers(
        nextAnswers
      );

      /*
       * Final question:
       * send all 5 answers.
       */

      if (
        currentIndex ===
        everydayFinalQuestions.length -
          1
      ) {
        await submitAssessment(
          nextAnswers
        );

        return;
      }

      /*
       * Move to next question.
       */

      setCurrentIndex(
        (previous) =>
          previous + 1
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not save answer"
      );
    } finally {
      setProcessing(
        false
      );
    }
  }

  async function submitAssessment(
    finalAnswers:
      SavedAnswer[]
  ) {
    const response =
      await fetch(
        "/api/everyday-english/final-assessment/evaluate",
        {
          method:
            "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              answers:
                finalAnswers,
            }),
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Could not evaluate final assessment"
      );
    }

    router.push(
      `/everyday-english/final-assessment/result/${data.attemptId}`
    );

    router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* Progress */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Final Assessment
            </p>

            <p className="mt-1 font-semibold text-slate-950">
              Question{" "}
              {currentIndex +
                1}{" "}
              of{" "}
              {
                everydayFinalQuestions.length
              }
            </p>
          </div>

          <span className="text-sm font-bold text-slate-500">
            {
              answers.length
            }
            /5 answered
          </span>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-300"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </section>

      {/* Question */}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <ShieldCheck
              size={21}
            />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Task{" "}
              {currentIndex +
                1}
            </p>

            <h2 className="font-bold text-slate-950">
              {
                question.title
              }
            </h2>
          </div>
        </div>

        <h3 className="mt-7 text-xl font-bold leading-8 text-slate-950 sm:text-2xl">
          {
            question.question
          }
        </h3>

        <div className="mt-5 rounded-2xl bg-slate-50 p-4">
          <p className="text-sm leading-6 text-slate-600">
            <strong>
              Tip:
            </strong>{" "}
            {question.tip}
          </p>
        </div>

        {/* Microphone */}

        <div className="mt-8 flex justify-center">
          {!listening ? (
            <button
              type="button"
              onClick={
                startAnswer
              }
              disabled={
                processing
              }
              className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-50"
            >
              {processing ? (
                <Loader2
                  size={30}
                  className="animate-spin"
                />
              ) : (
                <Mic
                  size={32}
                />
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={
                stopAnswer
              }
              disabled={
                processing
              }
              className="flex h-24 w-24 items-center justify-center rounded-full bg-red-600 text-white shadow-xl"
            >
              {processing ? (
                <Loader2
                  size={29}
                  className="animate-spin"
                />
              ) : (
                <Square
                  size={27}
                  fill="currentColor"
                />
              )}
            </button>
          )}
        </div>

        <p className="mt-4 text-center text-sm font-medium text-slate-500">
          {listening
            ? "Recording — tap the red button when finished"
            : processing
              ? currentIndex ===
                everydayFinalQuestions.length -
                  1
                ? "Evaluating your final assessment..."
                : "Saving your answer..."
              : "Tap the microphone and start speaking"}
        </p>

        {/* Live transcript */}

        {liveTranscript &&
          listening && (
            <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Live transcript
              </p>

              <p className="mt-3 text-sm leading-7 text-slate-700">
                {
                  liveTranscript
                }
              </p>
            </div>
          )}

        {(error ||
          speechError) && (
          <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {error ||
              speechError}
          </div>
        )}
      </section>

      {/* Completed answers */}

      {answers.length >
        0 && (
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex items-center gap-2">
            <CheckCircle2
              size={19}
              className="text-emerald-600"
            />

            <p className="font-semibold text-emerald-900">
              {
                answers.length
              }{" "}
              of 5 answers completed
            </p>
          </div>

          <p className="mt-2 text-sm text-emerald-700">
            Completed answers are saved for this assessment session.
          </p>
        </section>
      )}
    </div>
  );
}