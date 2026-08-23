import Link from "next/link";

import {
  CheckCircle2,
  Clock,
  Lock,
  Play,
} from "lucide-react";

import { everydayEnglishRoadmap } from "@/data/everyday-course/roadmap";

export default function CourseRoadmap() {
  const modules = Array.from(
    new Set(
      everydayEnglishRoadmap.map(
        (lesson) => lesson.module
      )
    )
  );

  return (
    <div className="space-y-10">
      {modules.map((module) => {
        const lessons =
          everydayEnglishRoadmap.filter(
            (lesson) => lesson.module === module
          );

        return (
          <section key={module}>
            <h2 className="text-xl font-bold text-slate-950">
              {module}
            </h2>

            <div className="mt-4 space-y-3">
              {lessons.map((lesson) => (
                <LessonCard
                  key={lesson.day}
                  lesson={lesson}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function LessonCard({
  lesson,
}: {
  lesson: (typeof everydayEnglishRoadmap)[number];
}) {
  const locked = !lesson.isFree;

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-600">
        {lesson.day}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-bold text-slate-950">
            {lesson.title}
          </h3>

          {lesson.isFree && (
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-600">
              FREE
            </span>
          )}
        </div>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {lesson.description}
        </p>

        <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
          <Clock size={13} />
          {lesson.duration} minutes
        </div>
      </div>

      {locked ? (
        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-500"
        >
          <Lock size={15} />
          Pro
        </button>
      ) : (
        <Link
          href={`/everyday-english/course/${lesson.day}`}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white"
        >
          <Play size={15} />
          Start
        </Link>
      )}
    </article>
  );
}