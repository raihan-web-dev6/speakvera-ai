import {
  Award,
  CheckCircle2,
  LockKeyhole,
  TrendingUp,
} from "lucide-react";

type Props = {
  result: {
    overallScore: number;

    grammarScore: number;

    vocabularyScore: number;

    communicationScore: number;

    fluencyScore: number;

    pronunciationScore?: number;

    cefrLevel: string;

    passed: boolean;

    certificateEligible: boolean;

    strengths: string[];

    improvements: string[];

    feedback: {
      grammar?: string;

      vocabulary?: string;

      communication?: string;

      summary?: string;
    };
  };
};

export default function AssessmentReport({
  result,
}: Props) {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-slate-950 p-6 text-white sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-full bg-blue-600">
            <span className="text-4xl font-bold">
              {
                result.cefrLevel
              }
            </span>

            <span className="text-xs text-blue-100">
              Estimated Level
            </span>
          </div>

          <div>
            <p className="text-sm font-semibold text-blue-400">
              Speakvera English Speaking Assessment
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              {result.passed
                ? "Assessment passed"
                : "Keep practicing"}
            </h1>

            <p className="mt-3 max-w-xl leading-7 text-slate-300">
              {
                result.feedback.summary
              }
            </p>

            <p className="mt-3 text-xs text-slate-400">
              Speakvera AI estimate only. Pronunciation is not scored in browser-only mode.
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Score
          name="Overall"
          value={
            result.overallScore
          }
        />

        <Score
          name="Grammar"
          value={
            result.grammarScore
          }
        />

        <Score
          name="Vocabulary"
          value={
            result.vocabularyScore
          }
        />

        <Score
          name="Communication"
          value={
            result.communicationScore
          }
        />

        <Score
          name="Delivery"
          value={
            result.fluencyScore
          }
        />
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <CheckCircle2
              className="text-emerald-600"
              size={20}
            />

            <h2 className="font-bold text-slate-950">
              Your strengths
            </h2>
          </div>

          <div className="mt-5 space-y-3">
            {result.strengths.map(
              (
                strength,
                index
              ) => (
                <p
                  key={index}
                  className="text-sm leading-6 text-slate-600"
                >
                  • {strength}
                </p>
              )
            )}
          </div>
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

      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-bold text-slate-950">
          Detailed feedback
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Feedback
            name="Grammar"
            text={
              result.feedback
                .grammar || ""
            }
          />

          <Feedback
            name="Vocabulary"
            text={
              result.feedback
                .vocabulary || ""
            }
          />

          <Feedback
            name="Communication"
            text={
              result.feedback
                .communication ||
              ""
            }
          />
        </div>
      </section>

      <CertificateStatus
        eligible={
          result.certificateEligible
        }
      />
    </div>
  );
}

function Score({
  name,
  value,
}: {
  name: string;

  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
      <p className="text-3xl font-bold text-blue-600">
        {Math.round(
          value
        )}
      </p>

      <p className="mt-2 text-xs font-semibold text-slate-500">
        {name}
      </p>
    </div>
  );
}

function Feedback({
  name,
  text,
}: {
  name: string;

  text: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5">
      <h3 className="font-bold text-slate-950">
        {name}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        {text}
      </p>
    </div>
  );
}

function CertificateStatus({
  eligible,
}: {
  eligible: boolean;
}) {
  if (eligible) {
    return (
      <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
        <div className="flex gap-4">
          <Award
            size={26}
            className="shrink-0 text-emerald-600"
          />

          <div>
            <h2 className="font-bold text-emerald-950">
              Certificate eligible
            </h2>

            <p className="mt-2 text-sm leading-6 text-emerald-700">
              You passed the Speakvera English Speaking Assessment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6">
      <div className="flex gap-4">
        <LockKeyhole
          size={24}
          className="shrink-0 text-slate-400"
        />

        <div>
          <h2 className="font-bold text-slate-950">
            Certificate not unlocked yet
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Continue practicing and retake the assessment when you are ready.
          </p>
        </div>
      </div>
    </section>
  );
}