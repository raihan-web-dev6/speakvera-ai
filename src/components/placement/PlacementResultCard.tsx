import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import Link from "next/link";

type Props = {
  result: {
    cefrLevel: string;

    overallScore: number;

    grammarScore: number;

    vocabularyScore: number;

    communicationScore: number;

    fluencyScore: number;

    pronunciationScore?: number;

    strengths: string[];

    improvements: string[];

    summary: string;
  };
};

export default function PlacementResultCard({
  result,
}: Props) {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-slate-950 p-7 text-white sm:p-10">
        <p className="text-sm font-semibold text-blue-400">
          Your starting level
        </p>

        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-full bg-blue-600">
            <span className="text-4xl font-bold">
              {
                result.cefrLevel
              }
            </span>

            <span className="text-xs text-blue-100">
              Estimated
            </span>
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              Your Speakvera journey is ready
            </h1>

            <p className="mt-3 max-w-xl leading-7 text-slate-300">
              {
                result.summary
              }
            </p>

            <p className="mt-3 text-xs text-slate-400">
              This is a Speakvera AI placement estimate, not an official CEFR certification. Pronunciation is not scored in browser-only mode.
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <Score
          name="Overall"
          score={
            result.overallScore
          }
        />

        <Score
          name="Grammar"
          score={
            result.grammarScore
          }
        />

        <Score
          name="Vocabulary"
          score={
            result.vocabularyScore
          }
        />

        <Score
          name="Communication"
          score={
            result.communicationScore
          }
        />

        <Score
          name="Delivery"
          score={
            result.fluencyScore
          }
        />
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <CheckCircle2
              size={20}
              className="text-emerald-600"
            />

            <h2 className="font-bold text-slate-950">
              Strengths
            </h2>
          </div>

          <div className="mt-5 space-y-3">
            {result.strengths.map(
              (
                item,
                index
              ) => (
                <p
                  key={index}
                  className="text-sm leading-6 text-slate-600"
                >
                  • {item}
                </p>
              )
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <TrendingUp
              size={20}
              className="text-blue-600"
            />

            <h2 className="font-bold text-slate-950">
              Focus next
            </h2>
          </div>

          <div className="mt-5 space-y-3">
            {result.improvements.map(
              (
                item,
                index
              ) => (
                <p
                  key={index}
                  className="text-sm leading-6 text-slate-600"
                >
                  • {item}
                </p>
              )
            )}
          </div>
        </div>
      </section>

      <Link
        href="/dashboard"
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 font-semibold text-white"
      >
        Go to my dashboard

        <ArrowRight
          size={18}
        />
      </Link>
    </div>
  );
}

function Score({
  name,
  score,
}: {
  name: string;

  score: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center">
      <Sparkles
        size={17}
        className="mx-auto text-blue-600"
      />

      <p className="mt-3 text-2xl font-bold text-slate-950">
        {Math.round(
          score
        )}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {name}
      </p>
    </div>
  );
}