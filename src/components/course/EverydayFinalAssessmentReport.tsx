import Link from "next/link";

import {
  Award,
  CheckCircle2,
  RefreshCcw,
  Sparkles,
  TrendingUp,
  XCircle,
} from "lucide-react";

import ClaimCertificateButton from "@/components/certificates/ClaimCertificateButton";

type Props = {
  result: {
    attemptId:
      string;

    grammarScore:
      number;

    vocabularyScore:
      number;

    communicationScore:
      number;

    deliveryScore:
      number;

    overallScore:
      number;

    cefrLevel:
      string;

    passed:
      boolean;

    certificateEligible:
      boolean;

    strengths:
      string[];

    improvements:
      string[];

    summary:
      string;
  };
};

export default function EverydayFinalAssessmentReport({
  result,
}: Props) {
  return (
    <div className="space-y-6">
      {/* MAIN RESULT */}

      <section className="rounded-3xl bg-slate-950 p-7 text-white sm:p-9">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div
            className={`flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-full ${
              result.passed
                ? "bg-emerald-600"
                : "bg-amber-500"
            }`}
          >
            <span className="text-4xl font-bold">
              {
                result.overallScore
              }
            </span>

            <span className="text-xs text-white/80">
              Overall
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              {result.passed ? (
                <CheckCircle2
                  size={19}
                  className="text-emerald-400"
                />
              ) : (
                <XCircle
                  size={19}
                  className="text-amber-400"
                />
              )}

              <p
                className={`text-sm font-semibold ${
                  result.passed
                    ? "text-emerald-400"
                    : "text-amber-400"
                }`}
              >
                {result.passed
                  ? "Assessment passed"
                  : "Not passed yet"}
              </p>
            </div>

            <h1 className="mt-3 text-3xl font-bold">
              {result.passed
                ? "You completed the Everyday English course"
                : "Keep building your speaking skills"}
            </h1>

            <p className="mt-3 max-w-xl leading-7 text-slate-300">
              {
                result.summary
              }
            </p>

            <p className="mt-3 text-xs leading-5 text-slate-400">
              Estimated Speakvera level:{" "}
              <strong className="text-white">
                {
                  result.cefrLevel
                }
              </strong>
              . This is an internal learning estimate and not an official CEFR result.
            </p>
          </div>
        </div>
      </section>

      {/* SCORES */}

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <ScoreCard
          title="Overall"
          score={
            result.overallScore
          }
          highlight
        />

        <ScoreCard
          title="Grammar"
          score={
            result.grammarScore
          }
        />

        <ScoreCard
          title="Vocabulary"
          score={
            result.vocabularyScore
          }
        />

        <ScoreCard
          title="Communication"
          score={
            result.communicationScore
          }
        />

        <ScoreCard
          title="Delivery"
          score={
            result.deliveryScore
          }
        />
      </section>

      {/* FEEDBACK */}

      <section className="grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
          <div className="flex items-center gap-2">
            <Sparkles
              size={20}
              className="text-emerald-600"
            />

            <h2 className="font-bold text-emerald-950">
              Your strengths
            </h2>
          </div>

          <div className="mt-5 space-y-3">
            {result.strengths.length >
            0 ? (
              result.strengths.map(
                (
                  strength,
                  index
                ) => (
                  <p
                    key={
                      index
                    }
                    className="text-sm leading-6 text-emerald-800"
                  >
                    •{" "}
                    {
                      strength
                    }
                  </p>
                )
              )
            ) : (
              <p className="text-sm text-emerald-700">
                Complete feedback will appear here.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-blue-200 bg-blue-50 p-6">
          <div className="flex items-center gap-2">
            <TrendingUp
              size={20}
              className="text-blue-600"
            />

            <h2 className="font-bold text-blue-950">
              Keep improving
            </h2>
          </div>

          <div className="mt-5 space-y-3">
            {result.improvements.length >
            0 ? (
              result.improvements.map(
                (
                  improvement,
                  index
                ) => (
                  <p
                    key={
                      index
                    }
                    className="text-sm leading-6 text-blue-800"
                  >
                    •{" "}
                    {
                      improvement
                    }
                  </p>
                )
              )
            ) : (
              <p className="text-sm text-blue-700">
                Continue practicing to strengthen your speaking.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* CERTIFICATE */}

      {result.certificateEligible ? (
        <section className="rounded-3xl border border-violet-200 bg-violet-50 p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white">
                <Award
                  size={24}
                />
              </div>

              <div>
                <h2 className="text-xl font-bold text-violet-950">
                  Certificate unlocked
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-violet-700">
                  You completed all 40 lessons and passed the final assessment. Your Speakvera Everyday English certificate is ready.
                </p>
              </div>
            </div>

            <ClaimCertificateButton
              type="EVERYDAY_ENGLISH"
              sourceId={
                result.attemptId
              }
            />
          </div>
        </section>
      ) : (
        <section className="rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="font-bold text-slate-950">
            Certificate not unlocked yet
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Pass the final assessment on an eligible paid plan to unlock the course certificate.
          </p>
        </section>
      )}

      {/* ACTIONS */}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/dashboard"
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-600 px-6 font-semibold text-white transition hover:bg-blue-700"
        >
          Go to dashboard
        </Link>

        {!result.passed && (
          <Link
            href="/everyday-english/final-assessment"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <RefreshCcw
              size={17}
            />

            Retake assessment
          </Link>
        )}
      </div>
    </div>
  );
}

function ScoreCard({
  title,
  score,
  highlight = false,
}: {
  title:
    string;

  score:
    number;

  highlight?:
    boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 text-center shadow-sm ${
        highlight
          ? "border-blue-200 bg-blue-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <p
        className={`text-3xl font-bold ${
          highlight
            ? "text-blue-600"
            : "text-slate-950"
        }`}
      >
        {Math.round(
          score
        )}
      </p>

      <p className="mt-2 text-xs font-semibold text-slate-500">
        {title}
      </p>
    </div>
  );
}