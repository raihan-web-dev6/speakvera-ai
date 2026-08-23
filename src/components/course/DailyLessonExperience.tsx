"use client";

import {
  Award,
  CheckCircle2,
  Loader2,
  LockKeyhole,
  Target,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import {
  useMemo,
  useState,
} from "react";

import type {
  EverydayLessonContent,
} from "@/types/lesson";

import GrammarLesson from "@/components/course/GrammarLesson";

import VocabularySection from "@/components/course/VocabularySection";

import ListeningPractice from "@/components/course/ListeningPractice";

import LessonSpeakingPractice from "@/components/course/LessonSpeakingPractice";

import LessonQuiz from "@/components/course/LessonQuiz";

type Props = {
  lesson:
    EverydayLessonContent;
};

export default function DailyLessonExperience({
  lesson,
}: Props) {
  const router =
    useRouter();

  const [
    speakingScore,
    setSpeakingScore,
  ] =
    useState<
      number | null
    >(null);

  const [
    quizScore,
    setQuizScore,
  ] =
    useState<
      number | null
    >(null);

  const [
    completing,
    setCompleting,
  ] =
    useState(false);

  const [
    completed,
    setCompleted,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const ready =
    speakingScore !== null &&
    quizScore !== null;

  /*
   * Lesson score:
   *
   * Speaking = 60%
   * Quiz     = 40%
   *
   * Speaking gets more weight
   * because Speakvera is primarily
   * a speaking-learning product.
   */
  const finalScore =
    useMemo(() => {
      if (
        speakingScore ===
          null ||
        quizScore ===
          null
      ) {
        return null;
      }

      return Math.round(
        speakingScore *
          0.6 +
          quizScore *
            0.4
      );
    }, [
      speakingScore,
      quizScore,
    ]);

  async function completeLesson() {
    if (
      finalScore ===
        null ||
      completing
    ) {
      return;
    }

    try {
      setCompleting(
        true
      );

      setError("");

      const response =
        await fetch(
          "/api/course/progress",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                dayNumber:
                  lesson.day,

                score:
                  finalScore,

                status:
                  "COMPLETED",
              }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Could not complete lesson"
        );
      }

      setCompleted(
        true
      );

      window.setTimeout(
        () => {
          if (
            lesson.day >=
            40
          ) {
            router.push(
              "/everyday-english/final-assessment"
            );
          } else {
            router.push(
              `/everyday-english/course/${lesson.day + 1}`
            );
          }

          router.refresh();
        },
        900
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not complete lesson"
      );
    } finally {
      setCompleting(
        false
      );
    }
  }

  return (
    <div className="space-y-7">
      {/* Lesson introduction */}

      <section className="rounded-3xl bg-slate-950 p-6 text-white sm:p-8">
        <div className="flex items-center gap-2 text-sm font-semibold text-blue-400">
          <Target
            size={17}
          />

          Day {lesson.day}
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          {lesson.title}
        </h1>

        <p className="mt-4 max-w-2xl leading-7 text-slate-300">
          {
            lesson.objective
          }
        </p>
      </section>

      {/* Grammar */}

      <GrammarLesson
        grammar={
          lesson.grammar
        }
      />

      {/* Vocabulary */}

      <VocabularySection
        vocabulary={
          lesson.vocabulary
        }
      />

      {/* Listening */}

      <ListeningPractice
        title={
          lesson.listening
            .title
        }
        text={
          lesson.listening
            .text
        }
        question={
          lesson.listening
            .question
        }
      />

      {/* Speaking */}

      <LessonSpeakingPractice
        dayNumber={
          lesson.day
        }
        question={
          lesson.speakingPrompt
        }
        onComplete={(
          score
        ) => {
          setSpeakingScore(
            score
          );
        }}
      />

      {speakingScore !==
        null && (
        <CompletedItem
          title="Speaking practice completed"
          score={
            speakingScore
          }
        />
      )}

      {/* Quiz */}

      <LessonQuiz
        questions={
          lesson.quiz
        }
        onComplete={(
          score
        ) => {
          setQuizScore(
            score
          );
        }}
      />

      {quizScore !==
        null && (
        <CompletedItem
          title="Knowledge check completed"
          score={
            quizScore
          }
        />
      )}

      {/* Final completion */}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
              ready
                ? "bg-emerald-50 text-emerald-600"
                : "bg-slate-100 text-slate-400"
            }`}
          >
            {ready ? (
              <Award
                size={23}
              />
            ) : (
              <LockKeyhole
                size={21}
              />
            )}
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-950">
              Complete Day{" "}
              {lesson.day}
            </h2>

            {!ready ? (
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Finish both the speaking practice and knowledge check to complete this lesson.
              </p>
            ) : (
              <>
                <p className="mt-2 text-sm text-slate-500">
                  You&apos;re ready to finish today&apos;s lesson.
                </p>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  <ScoreBox
                    title="Speaking"
                    score={
                      speakingScore!
                    }
                  />

                  <ScoreBox
                    title="Quiz"
                    score={
                      quizScore!
                    }
                  />

                  <ScoreBox
                    title="Lesson"
                    score={
                      finalScore!
                    }
                    strong
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="button"
          disabled={
            !ready ||
            completing ||
            completed
          }
          onClick={
            completeLesson
          }
          className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
        >
          {completing ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />

              Saving lesson...
            </>
          ) : completed ? (
            <>
              <CheckCircle2
                size={18}
              />

              Lesson completed
            </>
          ) : (
            <>
              <CheckCircle2
                size={18}
              />

              Complete Day{" "}
              {lesson.day}
            </>
          )}
        </button>
      </section>
    </div>
  );
}

function CompletedItem({
  title,
  score,
}: {
  title: string;

  score: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
      <div className="flex items-center gap-2">
        <CheckCircle2
          size={18}
          className="text-emerald-600"
        />

        <p className="text-sm font-semibold text-emerald-800">
          {title}
        </p>
      </div>

      <span className="font-bold text-emerald-700">
        {score}%
      </span>
    </div>
  );
}

function ScoreBox({
  title,
  score,
  strong = false,
}: {
  title: string;

  score: number;

  strong?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-4 text-center ${
        strong
          ? "bg-blue-50"
          : "bg-slate-50"
      }`}
    >
      <p
        className={`text-xl font-bold ${
          strong
            ? "text-blue-600"
            : "text-slate-950"
        }`}
      >
        {score}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {title}
      </p>
    </div>
  );
}