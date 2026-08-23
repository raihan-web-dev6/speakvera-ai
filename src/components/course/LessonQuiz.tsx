"use client";

import {
  CheckCircle2,
  CircleHelp,
  RotateCcw,
  XCircle,
} from "lucide-react";

import {
  useState,
} from "react";

import type {
  LessonQuizQuestion,
} from "@/types/lesson";

type Props = {
  questions:
    LessonQuizQuestion[];

  onComplete: (
    score: number
  ) => void;
};

export default function LessonQuiz({
  questions,
  onComplete,
}: Props) {
  const [
    currentIndex,
    setCurrentIndex,
  ] =
    useState(0);

  const [
    selected,
    setSelected,
  ] =
    useState<
      number | null
    >(null);

  const [
    correctAnswers,
    setCorrectAnswers,
  ] =
    useState(0);

  const [
    finished,
    setFinished,
  ] =
    useState(false);

  const question =
    questions[
      currentIndex
    ];

  function choose(
    optionIndex: number
  ) {
    if (
      selected !== null
    ) {
      return;
    }

    setSelected(
      optionIndex
    );
  }

  function next() {
    if (
      selected === null
    ) {
      return;
    }

    const isCorrect =
      selected ===
      question.answerIndex;

    const nextCorrect =
      correctAnswers +
      (isCorrect
        ? 1
        : 0);

    if (
      currentIndex ===
      questions.length -
        1
    ) {
      const score =
        Math.round(
          (nextCorrect /
            questions.length) *
            100
        );

      setCorrectAnswers(
        nextCorrect
      );

      setFinished(
        true
      );

      onComplete(
        score
      );

      return;
    }

    setCorrectAnswers(
      nextCorrect
    );

    setCurrentIndex(
      (previous) =>
        previous + 1
    );

    setSelected(
      null
    );
  }

  function restart() {
    setCurrentIndex(0);

    setSelected(
      null
    );

    setCorrectAnswers(
      0
    );

    setFinished(
      false
    );
  }

  if (finished) {
    const score =
      Math.round(
        (correctAnswers /
          questions.length) *
          100
      );

    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
        <CheckCircle2
          size={42}
          className="mx-auto text-emerald-600"
        />

        <p className="mt-5 text-sm font-semibold text-blue-600">
          Quiz complete
        </p>

        <h2 className="mt-2 text-3xl font-bold text-slate-950">
          {score}%
        </h2>

        <p className="mt-3 text-sm text-slate-500">
          You answered{" "}
          {
            correctAnswers
          }{" "}
          of{" "}
          {
            questions.length
          }{" "}
          questions correctly.
        </p>

        <button
          type="button"
          onClick={
            restart
          }
          className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700"
        >
          <RotateCcw
            size={16}
          />

          Try again
        </button>
      </section>
    );
  }

  const isCorrect =
    selected ===
    question.answerIndex;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
          <CircleHelp
            size={21}
          />
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Knowledge Check
          </p>

          <p className="text-sm text-slate-500">
            Question{" "}
            {currentIndex +
              1}{" "}
            of{" "}
            {
              questions.length
            }
          </p>
        </div>
      </div>

      <h2 className="mt-6 text-xl font-bold leading-8 text-slate-950">
        {
          question.question
        }
      </h2>

      <div className="mt-6 space-y-3">
        {question.options.map(
          (
            option,
            index
          ) => {
            let className =
              "border-slate-200 bg-white hover:border-blue-300";

            if (
              selected !==
              null
            ) {
              if (
                index ===
                question.answerIndex
              ) {
                className =
                  "border-emerald-500 bg-emerald-50";
              } else if (
                index ===
                selected
              ) {
                className =
                  "border-red-500 bg-red-50";
              }
            }

            return (
              <button
                key={
                  index
                }
                type="button"
                onClick={() =>
                  choose(
                    index
                  )
                }
                className={`flex w-full items-center justify-between rounded-xl border p-4 text-left text-sm font-medium text-slate-700 transition ${className}`}
              >
                <span>
                  {option}
                </span>

                {selected !==
                  null &&
                  index ===
                    question.answerIndex && (
                    <CheckCircle2
                      size={
                        18
                      }
                      className="text-emerald-600"
                    />
                  )}

                {selected !==
                  null &&
                  index ===
                    selected &&
                  index !==
                    question.answerIndex && (
                    <XCircle
                      size={
                        18
                      }
                      className="text-red-600"
                    />
                  )}
              </button>
            );
          }
        )}
      </div>

      {selected !==
        null && (
        <div
          className={`mt-5 rounded-xl p-4 text-sm ${
            isCorrect
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          <p className="font-semibold">
            {isCorrect
              ? "Correct!"
              : "Not quite."}
          </p>

          <p className="mt-1 leading-6">
            {
              question.explanation
            }
          </p>
        </div>
      )}

      <button
        type="button"
        disabled={
          selected === null
        }
        onClick={next}
        className="mt-6 min-h-11 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        {currentIndex ===
        questions.length -
          1
          ? "Finish quiz"
          : "Next question"}
      </button>
    </section>
  );
}