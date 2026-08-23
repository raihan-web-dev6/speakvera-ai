"use client";

import {
  Loader2,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  useSession,
} from "next-auth/react";

import IeltsAnswerRecorder from "@/components/ielts/IeltsAnswerRecorder";

import PlacementProgress from "@/components/placement/PlacementProgress";

import type {
  ContinuousSpeechResult,
} from "@/hooks/useContinuousSpeech";

type Question = {
  question: string;

  targetLevel: string;
};

type ResponseItem = {
  question: string;

  transcript: string;

  fluencyScore: number;

  pronunciationScore: number;

  accuracyScore: number;

  prosodyScore: number;
};

const TOTAL_QUESTIONS =
  5;

export default function PlacementTestRunner() {
  const router =
    useRouter();

  const {
    update,
  } =
    useSession();

  const [
    questions,
    setQuestions,
  ] =
    useState<Question[]>(
      []
    );

  const [
    responses,
    setResponses,
  ] =
    useState<ResponseItem[]>(
      []
    );

  const [
    currentIndex,
    setCurrentIndex,
  ] =
    useState(0);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    generating,
    setGenerating,
  ] =
    useState(false);

  const [
    evaluating,
    setEvaluating,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  useEffect(() => {
    async function start() {
      try {
        const response =
          await fetch(
            "/api/placement/start",
            {
              cache:
                "no-store",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Could not start placement test"
          );
        }

        setQuestions(
          data.questions
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Could not start placement test"
        );
      } finally {
        setLoading(false);
      }
    }

    start();
  }, []);

  async function handleAnswer(
    speech:
      ContinuousSpeechResult
  ) {
    const currentQuestion =
      questions[
        currentIndex
      ];

    if (!currentQuestion) {
      return;
    }

    const responseItem: ResponseItem =
      {
        question:
          currentQuestion.question,

        transcript:
          speech.transcript,

        fluencyScore:
          speech.fluencyScore,

        pronunciationScore:
          speech.pronunciationScore,

        accuracyScore:
          speech.accuracyScore,

        prosodyScore:
          speech.prosodyScore,
      };

    const nextResponses = [
      ...responses,

      responseItem,
    ];

    setResponses(
      nextResponses
    );

    if (
      nextResponses.length >=
      TOTAL_QUESTIONS
    ) {
      await finish(
        nextResponses
      );

      return;
    }

    if (
      currentIndex + 1 <
      questions.length
    ) {
      setCurrentIndex(
        (previous) =>
          previous + 1
      );

      return;
    }

    await createNextQuestion(
      nextResponses
    );
  }

  async function createNextQuestion(
    currentResponses:
      ResponseItem[]
  ) {
    try {
      setGenerating(true);

      const response =
        await fetch(
          "/api/placement/next-question",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                responses:
                  currentResponses,

                questionNumber:
                  currentResponses.length +
                  1,
              }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Could not create next question"
        );
      }

      setQuestions(
        (previous) => [
          ...previous,

          {
            question:
              data.question,

            targetLevel:
              data.targetLevel,
          },
        ]
      );

      setCurrentIndex(
        (previous) =>
          previous + 1
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not generate question"
      );
    } finally {
      setGenerating(false);
    }
  }

  async function finish(
    finalResponses:
      ResponseItem[]
  ) {
    try {
      setEvaluating(true);

      const response =
        await fetch(
          "/api/placement/evaluate",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                responses:
                  finalResponses,
              }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Could not evaluate test"
        );
      }

      // Update Auth.js JWT so proxy
      // immediately knows onboarding is complete.
      await update({
        onboardingCompleted:
          true,

        currentLevel:
          data.cefrLevel,
      });

      router.push(
        `/placement-test/result?attemptId=${data.attemptId}`
      );

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Placement test failed"
      );
    } finally {
      setEvaluating(false);
    }
  }

  if (loading) {
    return (
      <Loading
        text="Preparing your placement test..."
      />
    );
  }

  if (generating) {
    return (
      <Loading
        text="Choosing your next question..."
      />
    );
  }

  if (evaluating) {
    return (
      <Loading
        text="Analyzing your English level..."
      />
    );
  }

  const currentQuestion =
    questions[
      currentIndex
    ];

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PlacementProgress
        current={
          responses.length +
          1
        }
        total={
          TOTAL_QUESTIONS
        }
      />

      <div className="mt-7">
        <IeltsAnswerRecorder
          key={
            currentQuestion.question
          }
          question={
            currentQuestion.question
          }
          maxSeconds={75}
          onComplete={
            handleAnswer
          }
        />
      </div>

      <p className="mt-4 text-center text-xs text-slate-400">
        Question difficulty adapts based on your speaking performance.
      </p>

      {error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}

function Loading({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex min-h-[450px] flex-col items-center justify-center text-center">
      <Loader2
        size={38}
        className="animate-spin text-blue-600"
      />

      <p className="mt-5 font-semibold text-slate-700">
        {text}
      </p>
    </div>
  );
}