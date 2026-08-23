import Link from "next/link";

import {
  ArrowRight,
  CheckCircle2,
  Play,
} from "lucide-react";

type Props = {
  nextLessonDay:
    number;

  completedCount:
    number;

  progressPercent:
    number;

  courseCompleted:
    boolean;
};

export default function CourseContinueCard({
  nextLessonDay,

  completedCount,

  progressPercent,

  courseCompleted,
}: Props) {
  if (
    courseCompleted
  ) {
    return (
      <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white">
            <CheckCircle2
              size={23}
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-emerald-700">
              40 / 40 lessons
            </p>

            <h2 className="mt-1 text-2xl font-bold text-emerald-950">
              Everyday English completed
            </h2>

            <p className="mt-2 text-sm leading-6 text-emerald-700">
              You have completed all forty daily lessons. Your final assessment is the next stage.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl bg-slate-950 p-6 text-white sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl">
          <p className="text-sm font-semibold text-blue-400">
            Continue learning
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Day{" "}
            {
              nextLessonDay
            }{" "}
            is ready
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-300">
            You&apos;ve completed{" "}
            {
              completedCount
            }{" "}
            of 40 lessons.
          </p>

          <div className="mt-5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>
                Course progress
              </span>

              <span>
                {
                  progressPercent
                }
                %
              </span>
            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-blue-500 transition-all"
                style={{
                  width: `${progressPercent}%`,
                }}
              />
            </div>
          </div>
        </div>

        <Link
          href={`/everyday-english/course/${nextLessonDay}`}
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 font-semibold text-white transition hover:bg-blue-500"
        >
          <Play
            size={17}
            fill="currentColor"
          />

          Continue Day{" "}
          {
            nextLessonDay
          }

          <ArrowRight
            size={17}
          />
        </Link>
      </div>
    </section>
  );
}