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

import AssessmentProgress from "@/components/assessment/AssessmentProgress";

import IeltsAnswerRecorder from "@/components/ielts/IeltsAnswerRecorder";

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

  pronunciationScore: number;

  fluencyScore: number;

  accuracyScore: number;

  prosodyScore: number;
};

const TOTAL_QUESTIONS = 6;

export default function AssessmentRunner() {
  const router =
    useRouter();

  const [
    questions,
    setQuestions,
  ] =
    useState<Question[]>([]);

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
  ] = useState(0);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    preparingQuestion,
    setPreparingQuestion,
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
    async function startAssessment() {
      try {
        const response =
          await fetch(
            "/api/assessment/start",
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
              "Could not start assessment"
          );
        }

        setQuestions(
          data.questions
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Could not start assessment"
        );
      } finally {
        setLoading(false);
      }
    }

    startAssessment();
  }, []);

  const handleAnswer =
    async (
      speech:
        ContinuousSpeechResult
    ) => {
      const currentQuestion =
        questions[
          currentIndex
        ];

      const newResponse: ResponseItem =
        {
          question:
            currentQuestion.question,

          transcript:
            speech.transcript,

          pronunciationScore:
            speech.pronunciationScore,

          fluencyScore:
            speech.fluencyScore,

          accuracyScore:
            speech.accuracyScore,

          prosodyScore:
            speech.prosodyScore,
        };

      const nextResponses = [
        ...responses,
        newResponse,
      ];

      setResponses(
        nextResponses
      );

      // All six questions completed.
      if (
        nextResponses.length >=
        TOTAL_QUESTIONS
      ) {
        await finishAssessment(
          nextResponses
        );

        return;
      }

      // We already have another starter question.
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

      await generateAdaptiveQuestion(
        nextResponses
      );
    };

  const generateAdaptiveQuestion =
    async (
      currentResponses:
        ResponseItem[]
    ) => {
      try {
        setPreparingQuestion(
          true
        );

        const response =
          await fetch(
            "/api/assessment/next-question",
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

                  currentQuestionNumber:
                    currentResponses.length,
                }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Could not generate next question"
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
        setPreparingQuestion(
          false
        );
      }
    };

  const finishAssessment =
    async (
      finalResponses:
        ResponseItem[]
    ) => {
      try {
        setEvaluating(true);

        const response =
          await fetch(
            "/api/assessment/evaluate",
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
              "Could not evaluate assessment"
          );
        }

        router.push(
          `/speaking-assessment/result/${data.attemptId}`
        );

        router.refresh();
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Assessment failed"
        );
      } finally {
        setEvaluating(false);
      }
    };

  if (loading) {
    return (
      <LoadingScreen text="Preparing your assessment..." />
    );
  }

  if (
    evaluating
  ) {
    return (
      <LoadingScreen text="Analyzing your English speaking level..." />
    );
  }

  if (
    preparingQuestion
  ) {
    return (
      <LoadingScreen text="Preparing your next adaptive question..." />
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
      <AssessmentProgress
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
          maxSeconds={90}
          onComplete={
            handleAnswer
          }
        />
      </div>

      <div className="mt-4 rounded-xl bg-slate-100 px-4 py-3">
        <p className="text-xs text-slate-500">
          Difficulty adapts automatically based on your previous answers.
        </p>
      </div>

      {error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}

function LoadingScreen({
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