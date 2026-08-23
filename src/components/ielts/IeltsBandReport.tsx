import {
  Award,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

type Props = {
  evaluation: {
    overallBand: number;

    fluencyBand: number;

    lexicalBand: number;

    grammarBand: number;

    pronunciationBand: number;

    strengths: string[];

    improvements: string[];

    summary: string;

    fluencyFeedback:
      string;

    vocabularyFeedback:
      string;

    grammarFeedback:
      string;

    pronunciationFeedback:
      string;
  };
};

export default function IeltsBandReport({
  evaluation,
}: Props) {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-slate-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold text-blue-400">
          Speakvera IELTS Practice
        </p>

        <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-full bg-blue-600">
            <span className="text-4xl font-bold">
              {
                evaluation.overallBand
              }
            </span>

            <span className="text-xs text-blue-100">
              Estimate
            </span>
          </div>

          <div>
            <h1 className="text-2xl font-bold">
              Partial IELTS Speaking Estimate
            </h1>

            <p className="mt-3 max-w-xl leading-7 text-slate-300">
              {
                evaluation.summary
              }
            </p>

            <p className="mt-3 text-xs leading-5 text-slate-400">
              Speakvera currently estimates fluency/coherence, lexical resource, and grammar. Pronunciation is not scored in browser-only mode, so this is not a complete or official IELTS band result.
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <BandCard
          title="Fluency"
          score={
            evaluation.fluencyBand
          }
        />

        <BandCard
          title="Vocabulary"
          score={
            evaluation.lexicalBand
          }
        />

        <BandCard
          title="Grammar"
          score={
            evaluation.grammarBand
          }
        />

        <UnavailableBand />
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <CheckCircle2
              className="text-emerald-600"
              size={20}
            />

            <h2 className="font-bold text-slate-950">
              Strengths
            </h2>
          </div>

          <ul className="mt-5 space-y-3">
            {evaluation.strengths.map(
              (
                strength,
                index
              ) => (
                <li
                  key={index}
                  className="text-sm leading-6 text-slate-600"
                >
                  • {strength}
                </li>
              )
            )}
          </ul>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <TrendingUp
              className="text-blue-600"
              size={20}
            />

            <h2 className="font-bold text-slate-950">
              Improve next
            </h2>
          </div>

          <ul className="mt-5 space-y-3">
            {evaluation.improvements.map(
              (
                improvement,
                index
              ) => (
                <li
                  key={index}
                  className="text-sm leading-6 text-slate-600"
                >
                  •{" "}
                  {
                    improvement
                  }
                </li>
              )
            )}
          </ul>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-2">
          <Award
            size={20}
            className="text-blue-600"
          />

          <h2 className="font-bold text-slate-950">
            Detailed feedback
          </h2>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Feedback
            title="Fluency & Coherence"
            text={
              evaluation.fluencyFeedback
            }
          />

          <Feedback
            title="Lexical Resource"
            text={
              evaluation.vocabularyFeedback
            }
          />

          <Feedback
            title="Grammar"
            text={
              evaluation.grammarFeedback
            }
          />

          <Feedback
            title="Pronunciation"
            text={
              evaluation.pronunciationFeedback
            }
          />
        </div>
      </section>
    </div>
  );
}

function BandCard({
  title,
  score,
}: {
  title: string;
  score: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
      <p className="text-3xl font-bold text-blue-600">
        {score}
      </p>

      <p className="mt-2 text-xs font-semibold text-slate-500">
        {title}
      </p>
    </div>
  );
}

function UnavailableBand() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
      <p className="text-lg font-bold text-slate-400">
        —
      </p>

      <p className="mt-2 text-xs font-semibold text-slate-500">
        Pronunciation
      </p>

      <p className="mt-1 text-[10px] text-slate-400">
        Not scored
      </p>
    </div>
  );
}

function Feedback({
  title,
  text,
}: {
  title: string;

  text: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5">
      <h3 className="font-semibold text-slate-950">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        {text}
      </p>
    </div>
  );
}