"use client";

import {
  Headphones,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  useTextToSpeech,
} from "@/hooks/useTextToSpeech";

type Props = {
  title: string;

  text: string;

  question: string;
};

export default function ListeningPractice({
  title,
  text,
  question,
}: Props) {
  const {
    speak,
    stop,
    speaking,
    supported,
  } =
    useTextToSpeech();

  const [
    revealText,
    setRevealText,
  ] =
    useState(false);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Headphones
            size={21}
          />
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Listening
          </p>

          <h2 className="font-bold text-slate-950">
            {title}
          </h2>
        </div>
      </div>

      <p className="mt-6 text-sm leading-6 text-slate-500">
        Listen carefully before revealing the transcript.
      </p>

      {!supported && (
        <div className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-700">
          Text-to-speech is not supported in this browser.
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        {!speaking ? (
          <button
            type="button"
            onClick={() =>
              speak(text)
            }
            disabled={
              !supported
            }
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white disabled:opacity-50"
          >
            <Play
              size={17}
            />

            Play audio
          </button>
        ) : (
          <button
            type="button"
            onClick={stop}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-semibold text-white"
          >
            <Pause
              size={17}
            />

            Stop
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            stop();

            window.setTimeout(
              () =>
                speak(
                  text
                ),
              100
            );
          }}
          disabled={
            !supported
          }
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 disabled:opacity-50"
        >
          <RotateCcw
            size={16}
          />

          Replay
        </button>
      </div>

      <div className="mt-6 rounded-2xl bg-slate-50 p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Listening question
        </p>

        <p className="mt-2 font-semibold text-slate-900">
          {question}
        </p>
      </div>

      <button
        type="button"
        onClick={() =>
          setRevealText(
            (previous) =>
              !previous
          )
        }
        className="mt-5 text-sm font-semibold text-blue-600"
      >
        {revealText
          ? "Hide transcript"
          : "Show transcript"}
      </button>

      {revealText && (
        <div className="mt-4 rounded-2xl border border-slate-200 p-5">
          <p className="text-sm leading-7 text-slate-600">
            {text}
          </p>
        </div>
      )}
    </section>
  );
}