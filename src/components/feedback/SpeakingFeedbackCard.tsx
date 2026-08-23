"use client";

import {
  RotateCcw,
  Sparkles,
} from "lucide-react";

import type {
  SpeakingFeedback,
} from "@/schemas/feedback.schema";

type Props = {
  feedback:
    SpeakingFeedback;

  deliveryScore:
    number;

  wordsPerMinute:
    number;

  speechConfidence:
    number;

  onSpeakAgain:
    () => void;
};

export default function SpeakingFeedbackCard({
  feedback,

  deliveryScore,

  wordsPerMinute,

  speechConfidence,

  onSpeakAgain,
}: Props) {
  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-2">
          <Sparkles
            size={20}
            className="text-blue-600"
          />

          <h2 className="text-xl font-bold text-slate-950">
            AI Feedback
          </h2>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Score
            title="Grammar"
            value={
              feedback.grammarScore
            }
          />

          <Score
            title="Vocabulary"
            value={
              feedback.vocabularyScore
            }
          />

          <Score
            title="Answer Quality"
            value={
              feedback.answerQualityScore
            }
          />

          <Score
            title="Delivery"
            value={
              deliveryScore
            }
          />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Info
            title="Speaking pace"
            value={`${wordsPerMinute} WPM`}
          />

          <Info
            title="Recognition confidence"
            value={`${speechConfidence}%`}
          />
        </div>

        <p className="mt-4 text-xs leading-5 text-slate-400">
          Delivery and recognition confidence are browser-derived practice metrics. Speakvera is not measuring pronunciation in browser-only mode.
        </p>
      </section>

      {feedback
        .grammarMistakes
        .length >
        0 && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="font-bold text-slate-950">
            Grammar corrections
          </h2>

          <div className="mt-5 space-y-4">
            {feedback.grammarMistakes.map(
              (
                mistake,
                index
              ) => (
                <div
                  key={
                    index
                  }
                  className="rounded-2xl bg-slate-50 p-4"
                >
                  <p className="text-sm text-red-600 line-through">
                    {
                      mistake.original
                    }
                  </p>

                  <p className="mt-2 text-sm font-medium text-emerald-700">
                    {
                      mistake.corrected
                    }
                  </p>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    {
                      mistake.explanation
                    }
                  </p>
                </div>
              )
            )}
          </div>
        </section>
      )}

      {feedback
        .vocabularySuggestions
        .length >
        0 && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="font-bold text-slate-950">
            Vocabulary suggestions
          </h2>

          <div className="mt-5 space-y-4">
            {feedback.vocabularySuggestions.map(
              (
                item,
                index
              ) => (
                <div
                  key={
                    index
                  }
                  className="rounded-2xl bg-slate-50 p-4"
                >
                  <p className="text-sm text-slate-500">
                    {
                      item.original
                    }
                  </p>

                  <p className="mt-2 font-semibold text-blue-600">
                    {
                      item.better
                    }
                  </p>

                  <p className="mt-2 text-xs text-slate-500">
                    {
                      item.reason
                    }
                  </p>
                </div>
              )
            )}
          </div>
        </section>
      )}

      <section className="rounded-3xl border border-blue-100 bg-blue-50 p-6">
        <h2 className="font-bold text-slate-950">
          Stronger answer
        </h2>

        <p className="mt-3 leading-7 text-slate-700">
          {
            feedback.improvedAnswer
          }
        </p>
      </section>

      <button
        type="button"
        onClick={
          onSpeakAgain
        }
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 font-semibold text-white"
      >
        <RotateCcw
          size={17}
        />

        Speak again
      </button>
    </div>
  );
}

function Score({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 text-center">
      <p className="text-2xl font-bold text-blue-600">
        {Math.round(
          value
        )}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {title}
      </p>
    </div>
  );
}

function Info({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs text-slate-400">
        {title}
      </p>

      <p className="mt-1 font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}