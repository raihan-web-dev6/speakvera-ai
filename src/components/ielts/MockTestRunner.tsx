"use client";

import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  Mic2,
} from "lucide-react";

import { useRouter } from "next/navigation";

import {
  useEffect,
  useState,
} from "react";

import CountdownTimer from "@/components/ielts/CountdownTimer";
import CueCard from "@/components/ielts/CueCard";
import IeltsAnswerRecorder from "@/components/ielts/IeltsAnswerRecorder";
import MockTestProgress from "@/components/ielts/MockTestProgress";

import {
  ContinuousSpeechResult,
} from "@/hooks/useContinuousSpeech";

type Phase =
  | "loading"
  | "intro"
  | "part1"
  | "part2-prep"
  | "part2"
  | "part3"
  | "evaluating";

type Part1Data = {
  topic: string;
  questions: string[];
};

type CueCardData = {
  id: string;
  title: string;
  prompt: string;
  points: string[];
};

type IeltsResponse = {
  part: 1 | 2 | 3;

  question: string;

  transcript: string;

  pronunciationScore: number;

  fluencyScore: number;
};

export default function MockTestRunner() {
  const router = useRouter();

  const [phase, setPhase] =
    useState<Phase>(
      "loading"
    );

  const [
    part1,
    setPart1,
  ] =
    useState<Part1Data | null>(
      null
    );

  const [
    cueCard,
    setCueCard,
  ] =
    useState<CueCardData | null>(
      null
    );

  const [
    part1Index,
    setPart1Index,
  ] =
    useState(0);

  const [
    part3Questions,
    setPart3Questions,
  ] =
    useState<string[]>([]);

  const [
    part3Index,
    setPart3Index,
  ] =
    useState(0);

  const [
    responses,
    setResponses,
  ] =
    useState<IeltsResponse[]>(
      []
    );

  const [
    error,
    setError,
  ] =
    useState("");

  useEffect(() => {
    async function prepareTest() {
      try {
        const [
          part1Response,
          part2Response,
        ] =
          await Promise.all([
            fetch(
              "/api/ielts/questions?part=1",
              {
                cache:
                  "no-store",
              }
            ),

            fetch(
              "/api/ielts/questions?part=2",
              {
                cache:
                  "no-store",
              }
            ),
          ]);

        if (
          !part1Response.ok ||
          !part2Response.ok
        ) {
          throw new Error(
            "Could not prepare IELTS test"
          );
        }

        const part1Data =
          await part1Response.json();

        const part2Data =
          await part2Response.json();

        setPart1({
          topic:
            part1Data.topic,

          questions:
            part1Data.questions,
        });

        setCueCard(
          part2Data.cueCard
        );

        setPhase("intro");
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Could not prepare test"
        );
      }
    }

    prepareTest();
  }, []);

  const makeResponse = (
    part: 1 | 2 | 3,

    question: string,

    result: ContinuousSpeechResult
  ): IeltsResponse => ({
    part,

    question,

    transcript:
      result.transcript,

    pronunciationScore:
      result.pronunciationScore,

    fluencyScore:
      result.fluencyScore,
  });

  const handlePart1Answer =
    async (
      result: ContinuousSpeechResult
    ) => {
      if (!part1) {
        return;
      }

      const question =
        part1.questions[
          part1Index
        ];

      const response =
        makeResponse(
          1,
          question,
          result
        );

      setResponses(
        (previous) => [
          ...previous,
          response,
        ]
      );

      if (
        part1Index <
        part1.questions.length -
          1
      ) {
        setPart1Index(
          (previous) =>
            previous + 1
        );
      } else {
        setPhase(
          "part2-prep"
        );
      }
    };

  const handlePart2Answer =
    async (
      result: ContinuousSpeechResult
    ) => {
      if (!cueCard) {
        return;
      }

      const response =
        makeResponse(
          2,
          cueCard.prompt,
          result
        );

      const nextResponses = [
        ...responses,
        response,
      ];

      setResponses(
        nextResponses
      );

      try {
        const followUpResponse =
          await fetch(
            "/api/ielts/follow-up",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  cueCardTopic:
                    cueCard.prompt,

                  previousAnswer:
                    result.transcript,

                  previousQuestions:
                    [],
                }),
            }
          );

        const data =
          await followUpResponse.json();

        if (
          !followUpResponse.ok
        ) {
          throw new Error(
            data.message ||
              "Could not create Part 3"
          );
        }

        setPart3Questions(
          data.questions
        );

        setPart3Index(0);

        setPhase(
          "part3"
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Could not create Part 3"
        );
      }
    };

  const handlePart3Answer =
    async (
      result: ContinuousSpeechResult
    ) => {
      const question =
        part3Questions[
          part3Index
        ];

      const response =
        makeResponse(
          3,
          question,
          result
        );

      const nextResponses = [
        ...responses,
        response,
      ];

      setResponses(
        nextResponses
      );

      if (
        part3Index <
        part3Questions.length -
          1
      ) {
        setPart3Index(
          (previous) =>
            previous + 1
        );

        return;
      }

      await finishTest(
        nextResponses
      );
    };

  const finishTest =
    async (
      finalResponses:
        IeltsResponse[]
    ) => {
      try {
        setPhase(
          "evaluating"
        );

        const evaluationResponse =
          await fetch(
            "/api/ielts/evaluate",
            {
              method: "POST",

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

        const evaluationData =
          await evaluationResponse.json();

        if (
          !evaluationResponse.ok
        ) {
          throw new Error(
            evaluationData.message ||
              "Could not evaluate IELTS test"
          );
        }

        const saveResponse =
          await fetch(
            "/api/ielts/mock-test",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  responses:
                    finalResponses,

                  evaluation:
                    evaluationData.evaluation,
                }),
            }
          );

        const saveData =
          await saveResponse.json();

        if (
          !saveResponse.ok
        ) {
          throw new Error(
            saveData.message ||
              "Could not save IELTS test"
          );
        }

        router.push(
          `/ielts/results/${saveData.attemptId}`
        );

        router.refresh();
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Could not complete test"
        );
      }
    };

  if (
    phase === "loading"
  ) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <Loader2
          size={30}
          className="animate-spin text-blue-600"
        />
      </div>
    );
  }

  if (
    phase === "intro"
  ) {
    return (
      <section className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <Mic2 size={26} />
        </div>

        <p className="mt-6 text-sm font-bold uppercase tracking-wider text-blue-600">
          IELTS Speaking Mock Test
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Ready to begin?
        </h1>

        <p className="mt-4 leading-7 text-slate-600">
          Complete all three parts in one session. Speak naturally and avoid reading prepared answers.
        </p>

        <div className="mt-8 space-y-4">
          <Step
            number="1"
            title="Part 1"
            description="Questions about familiar topics."
          />

          <Step
            number="2"
            title="Part 2"
            description="1 minute preparation and up to 2 minutes speaking."
          />

          <Step
            number="3"
            title="Part 3"
            description="A deeper discussion related to your Part 2 topic."
          />
        </div>

        <div className="mt-8 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-800">
          Speakvera provides an AI-estimated practice band. It is not an official IELTS result.
        </div>

        <button
          type="button"
          onClick={() =>
            setPhase(
              "part1"
            )
          }
          className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 font-semibold text-white"
        >
          Start Part 1

          <ArrowRight
            size={18}
          />
        </button>
      </section>
    );
  }

  if (
    phase === "part1" &&
    part1
  ) {
    return (
      <div className="mx-auto max-w-3xl">
        <MockTestProgress
          part={1}
          current={
            part1Index + 1
          }
          total={
            part1.questions
              .length
          }
        />

        <div className="mt-7 rounded-xl bg-blue-50 px-4 py-3">
          <p className="text-sm font-semibold text-blue-700">
            Topic:{" "}
            {part1.topic}
          </p>
        </div>

        <div className="mt-5">
          <IeltsAnswerRecorder
            key={
              part1.questions[
                part1Index
              ]
            }
            question={
              part1.questions[
                part1Index
              ]
            }
            maxSeconds={60}
            onComplete={
              handlePart1Answer
            }
          />
        </div>

        {error && (
          <ErrorMessage
            message={error}
          />
        )}
      </div>
    );
  }

  if (
    phase ===
      "part2-prep" &&
    cueCard
  ) {
    return (
      <div className="mx-auto max-w-3xl">
        <MockTestProgress
          part={2}
          current={1}
          total={2}
        />

        <div className="mt-7">
          <CueCard
            prompt={
              cueCard.prompt
            }
            points={
              cueCard.points
            }
          />
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-5 rounded-3xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-bold text-slate-950">
              Preparation time
            </p>

            <p className="mt-1 text-sm text-slate-500">
              You have one minute to prepare.
            </p>
          </div>

          <CountdownTimer
            seconds={60}
            label="Preparation"
            onComplete={() =>
              setPhase(
                "part2"
              )
            }
          />
        </div>

        <button
          type="button"
          onClick={() =>
            setPhase(
              "part2"
            )
          }
          className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
        >
          I&apos;m ready
        </button>
      </div>
    );
  }

  if (
    phase === "part2" &&
    cueCard
  ) {
    return (
      <div className="mx-auto max-w-3xl">
        <MockTestProgress
          part={2}
          current={2}
          total={2}
        />

        <div className="mt-7">
          <CueCard
            prompt={
              cueCard.prompt
            }
            points={
              cueCard.points
            }
          />
        </div>

        <div className="mt-5">
          <IeltsAnswerRecorder
            question={
              cueCard.prompt
            }
            maxSeconds={120}
            onComplete={
              handlePart2Answer
            }
          />
        </div>

        {error && (
          <ErrorMessage
            message={error}
          />
        )}
      </div>
    );
  }

  if (
    phase === "part3"
  ) {
    return (
      <div className="mx-auto max-w-3xl">
        <MockTestProgress
          part={3}
          current={
            part3Index + 1
          }
          total={
            part3Questions.length
          }
        />

        <div className="mt-7">
          <IeltsAnswerRecorder
            key={
              part3Questions[
                part3Index
              ]
            }
            question={
              part3Questions[
                part3Index
              ]
            }
            maxSeconds={90}
            onComplete={
              handlePart3Answer
            }
          />
        </div>

        {error && (
          <ErrorMessage
            message={error}
          />
        )}
      </div>
    );
  }

  if (
    phase === "evaluating"
  ) {
    return (
      <div className="mx-auto flex min-h-[500px] max-w-3xl flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-8 text-center">
        <Loader2
          size={40}
          className="animate-spin text-blue-600"
        />

        <h2 className="mt-6 text-2xl font-bold text-slate-950">
          Evaluating your IELTS speaking
        </h2>

        <p className="mt-3 max-w-md leading-7 text-slate-500">
          Speakvera is analyzing fluency, vocabulary, grammar and pronunciation.
        </p>

        {error && (
          <ErrorMessage
            message={error}
          />
        )}
      </div>
    );
  }

  return null;
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
        {number}
      </div>

      <div>
        <p className="font-bold text-slate-950">
          {title}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function ErrorMessage({
  message,
}: {
  message: string;
}) {
  return (
    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {message}
    </div>
  );
}