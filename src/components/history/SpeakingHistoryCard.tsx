import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  Mic2,
} from "lucide-react";

type Props = {
  attempt: {
    _id: string;

    courseType:
      | "EVERYDAY_ENGLISH"
      | "IELTS"
      | "ASSESSMENT";

    lessonDay?: number;

    question: string;
    transcript: string;

    overallScore: number;
    grammarScore: number;
    vocabularyScore: number;
    fluencyScore: number;
    pronunciationScore: number;

    createdAt: string;
  };
};

export default function SpeakingHistoryCard({
  attempt,
}: Props) {
  const Icon =
    attempt.courseType === "IELTS"
      ? GraduationCap
      : attempt.courseType ===
          "ASSESSMENT"
        ? Mic2
        : BookOpen;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <div className="flex gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Icon size={20} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-bold text-slate-950">
                {attempt.courseType ===
                "EVERYDAY_ENGLISH"
                  ? `Everyday English${
                      attempt.lessonDay
                        ? ` · Day ${attempt.lessonDay}`
                        : ""
                    }`
                  : attempt.courseType ===
                      "IELTS"
                    ? "IELTS Speaking"
                    : "Speaking Assessment"}
              </h2>
            </div>

            <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
              <CalendarDays size={13} />

              {new Date(
                attempt.createdAt
              ).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-blue-50 px-4 py-2 text-center">
          <p className="text-xl font-bold text-blue-700">
            {attempt.overallScore}
          </p>

          <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-500">
            Overall
          </p>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Question
        </p>

        <p className="mt-2 font-medium text-slate-800">
          {attempt.question}
        </p>
      </div>

      <div className="mt-4">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Your answer
        </p>

        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
          {attempt.transcript}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Score
          label="Grammar"
          value={attempt.grammarScore}
        />

        <Score
          label="Vocabulary"
          value={attempt.vocabularyScore}
        />

        <Score
          label="Fluency"
          value={attempt.fluencyScore}
        />

        <Score
          label="Pronunciation"
          value={attempt.pronunciationScore}
        />
      </div>
    </article>
  );
}

function Score({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 text-center">
      <p className="font-bold text-slate-950">
        {Math.round(value || 0)}
      </p>

      <p className="mt-1 text-[10px] text-slate-500">
        {label}
      </p>
    </div>
  );
}