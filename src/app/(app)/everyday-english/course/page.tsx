import {
  redirect,
} from "next/navigation";

import {
  auth,
} from "@/auth";

import {
  getEverydayCourseState,
} from "@/lib/everyday-course-progress";

import {
  userHasPaidAccess,
} from "@/lib/subscription";

import CourseContinueCard from "@/components/course/CourseContinueCard";

import SequentialCourseRoadmap from "@/components/course/SequentialCourseRoadmap";

export default async function EverydayEnglishCoursePage() {
  const session =
    await auth();

  const userId =
    session?.user?.id;

  if (!userId) {
    redirect(
      "/login?callbackUrl=/everyday-english/course"
    );
  }

  const [
    state,

    paidAccess,
  ] = await Promise.all([
    getEverydayCourseState(
      userId
    ),

    userHasPaidAccess(
  userId
),
  ]);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <section>
          <p className="font-semibold text-blue-600">
            Everyday English
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            40-Day Speaking Course
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            Build your English step by step with daily grammar, vocabulary, listening, speaking and AI feedback.
          </p>
        </section>

        <div className="mt-8">
          <CourseContinueCard
            nextLessonDay={
              state.nextLessonDay
            }
            completedCount={
              state.completedCount
            }
            progressPercent={
              state.progressPercent
            }
            courseCompleted={
              state.courseCompleted
            }
          />
        </div>

        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-blue-600">
                Course roadmap
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-950">
                Your 40 days
              </h2>
            </div>

            <p className="text-sm font-semibold text-slate-500">
              {
                state.highestCompletedDay
              }
              /40 complete
            </p>
          </div>

          <SequentialCourseRoadmap
            completedDays={
              state.completedDays
            }
            nextLessonDay={
              state.nextLessonDay
            }
            hasPaidAccess={
              Boolean(
                paidAccess
              )
            }
          />
        </section>
      </div>
    </main>
  );
}