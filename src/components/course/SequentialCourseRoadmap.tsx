import Link from "next/link";

import {
  Check,
  ChevronRight,
  LockKeyhole,
  Play,
} from "lucide-react";

import {
  everydayEnglishRoadmap,
} from "@/data/everyday-course/roadmap";

type Props = {
  completedDays:
    number[];

  nextLessonDay:
    number;

  hasPaidAccess:
    boolean;
};

export default function SequentialCourseRoadmap({
  completedDays,

  nextLessonDay,

  hasPaidAccess,
}: Props) {
  const completedSet =
    new Set(
      completedDays
    );

  return (
    <div className="space-y-3">
      {everydayEnglishRoadmap.map(
        (lesson) => {
          const completed =
            completedSet.has(
              lesson.day
            );

          const current =
            !completed &&
            lesson.day ===
              nextLessonDay;

          /*
           * Subscription lock:
           *
           * Day 1-5 free.
           */
          const paidLocked =
            lesson.day >
              5 &&
            !hasPaidAccess;

          /*
           * Sequential lock.
           */
          const sequenceLocked =
            !completed &&
            !current;

          const locked =
            paidLocked ||
            sequenceLocked;

          const status =
            completed
              ? "Completed"
              : current
                ? "Current"
                : paidLocked
                  ? "Pro"
                  : "Locked";

          const content = (
            <div
              className={`group rounded-2xl border p-4 transition sm:p-5 ${
                completed
                  ? "border-emerald-200 bg-emerald-50/50"
                  : current
                    ? "border-blue-300 bg-blue-50 shadow-sm"
                    : "border-slate-200 bg-white"
              } ${
                locked
                  ? "opacity-70"
                  : "hover:border-blue-300 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center gap-4">
                <LessonIcon
                  completed={
                    completed
                  }
                  current={
                    current
                  }
                  locked={
                    locked
                  }
                />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Day{" "}
                      {
                        lesson.day
                      }
                    </p>

                    <StatusBadge
                      status={
                        status
                      }
                    />
                  </div>

                  <h3 className="mt-1 font-bold text-slate-950">
                    {
                      lesson.title
                    }
                  </h3>

                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
                    {
                      lesson.description
                    }
                  </p>
                </div>

                {!locked && (
                  <ChevronRight
                    size={19}
                    className="shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600"
                  />
                )}
              </div>
            </div>
          );

          /*
           * Completed and current
           * lessons are clickable.
           */
          if (!locked) {
            return (
              <Link
                key={
                  lesson.day
                }
                href={`/everyday-english/course/${lesson.day}`}
              >
                {content}
              </Link>
            );
          }

          /*
           * Paid locked lesson.
           */
          if (
            paidLocked &&
            !sequenceLocked
          ) {
            return (
              <Link
                key={
                  lesson.day
                }
                href="/billing?feature=everyday-english"
              >
                {content}
              </Link>
            );
          }

          return (
            <div
              key={
                lesson.day
              }
            >
              {content}
            </div>
          );
        }
      )}
    </div>
  );
}

function LessonIcon({
  completed,
  current,
  locked,
}: {
  completed: boolean;

  current: boolean;

  locked: boolean;
}) {
  if (completed) {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
        <Check
          size={19}
        />
      </div>
    );
  }

  if (current) {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
        <Play
          size={18}
          fill="currentColor"
        />
      </div>
    );
  }

  if (locked) {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <LockKeyhole
          size={18}
        />
      </div>
    );
  }

  return null;
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  let classes =
    "bg-slate-100 text-slate-500";

  if (
    status ===
    "Completed"
  ) {
    classes =
      "bg-emerald-100 text-emerald-700";
  }

  if (
    status ===
    "Current"
  ) {
    classes =
      "bg-blue-100 text-blue-700";
  }

  if (
    status === "Pro"
  ) {
    classes =
      "bg-violet-100 text-violet-700";
  }

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${classes}`}
    >
      {status}
    </span>
  );
}