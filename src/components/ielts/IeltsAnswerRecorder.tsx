"use client";

import {
  Loader2,
  Mic,
  Square,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  ContinuousSpeechResult,
  useContinuousSpeech,
} from "@/hooks/useContinuousSpeech";

type Props = {
  question: string;

  maxSeconds?: number;

  onComplete: (
    result: ContinuousSpeechResult
  ) => Promise<void> | void;
};

export default function IeltsAnswerRecorder({
  question,
  maxSeconds = 60,
  onComplete,
}: Props) {
  const {
    startListening,
    stopListening,

    listening,
    liveTranscript,
    error,
  } = useContinuousSpeech();

  const [remaining, setRemaining] =
    useState(maxSeconds);

  const [submitting, setSubmitting] =
    useState(false);

  useEffect(() => {
    setRemaining(maxSeconds);
  }, [
    question,
    maxSeconds,
  ]);

  useEffect(() => {
    if (!listening) {
      return;
    }

    const timer =
      window.setInterval(
        () => {
          setRemaining(
            (previous) => {
              if (previous <= 1) {
                window.clearInterval(
                  timer
                );

                handleStop();

                return 0;
              }

              return previous - 1;
            }
          );
        },
        1000
      );

    return () => {
      window.clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening]);

  const handleStart = async () => {
    setRemaining(maxSeconds);

    await startListening();
  };

  const handleStop = async () => {
    if (!listening) {
      return;
    }

    try {
      setSubmitting(true);

      const result =
        await stopListening();

      if (!result.transcript) {
        return;
      }

      await onComplete(result);
    } catch (error) {
      console.error(
        "IELTS recording error:",
        error
      );
    } finally {
      setSubmitting(false);
    }
  };

  const minutes =
    Math.floor(
      remaining / 60
    );

  const seconds =
    remaining % 60;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
        Examiner
      </p>

      <h2 className="mt-3 text-xl font-bold leading-8 text-slate-950 sm:text-2xl">
        {question}
      </h2>

      {listening && (
        <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-center">
          <p className="text-sm font-semibold text-red-600">
            Recording
          </p>

          <p className="mt-1 text-xl font-bold tabular-nums text-red-700">
            {String(
              minutes
            ).padStart(
              2,
              "0"
            )}
            :
            {String(
              seconds
            ).padStart(
              2,
              "0"
            )}
          </p>
        </div>
      )}

      <div className="mt-7 flex justify-center">
        {!listening ? (
          <button
            type="button"
            disabled={submitting}
            onClick={handleStart}
            className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl shadow-blue-600/20 transition hover:scale-105 disabled:opacity-60"
          >
            {submitting ? (
              <Loader2
                size={30}
                className="animate-spin"
              />
            ) : (
              <Mic size={32} />
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleStop}
            className="flex h-24 w-24 items-center justify-center rounded-full bg-red-600 text-white shadow-xl"
          >
            <Square
              size={28}
              fill="currentColor"
            />
          </button>
        )}
      </div>

      <p className="mt-4 text-center text-sm text-slate-500">
        {listening
          ? "Speak naturally, then tap stop"
          : "Tap the microphone when you're ready"}
      </p>

      {liveTranscript && (
        <div className="mt-6 rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Live transcript
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-700">
            {liveTranscript}
          </p>
        </div>
      )}

      {error && (
        <p className="mt-4 text-center text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}