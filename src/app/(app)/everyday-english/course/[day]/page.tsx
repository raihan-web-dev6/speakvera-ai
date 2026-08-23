import Link from "next/link";

import {
  ArrowLeft,
} from "lucide-react";

import {
  notFound,
  redirect,
} from "next/navigation";

import {
  auth,
} from "@/auth";

import {
  canAccessEverydayLesson,
} from "@/lib/feature-access";

import {
  canAccessSequentialLesson,
  getEverydayCourseState,
} from "@/lib/everyday-course-progress";

import {
  getEverydayLessonContent,
} from "@/data/everyday-course/lesson-content";

import DailyLessonExperience from "@/components/course/DailyLessonExperience";

type Props = {
  params: Promise<{
    day: string;
  }>;
};

export default async function LessonPage({
  params,
}: Props) {
  const {
    day,
  } = await params;

  const dayNumber =
    Number(day);

  /*
   * Validate day.
   */
  if (
    !Number.isInteger(
      dayNumber
    ) ||
    dayNumber < 1 ||
    dayNumber > 40
  ) {
    notFound();
  }

  const lessonContent =
    getEverydayLessonContent(
      dayNumber
    );

  if (!lessonContent) {
    notFound();
  }

  /*
   * Authentication.
   */
  const session =
    await auth();

  const userId =
    session?.user?.id;

  if (!userId) {
    redirect(
      `/login?callbackUrl=/everyday-english/course/${dayNumber}`
    );
  }

  /*
   * CHECK 1
   *
   * Subscription access.
   *
   * Free:
   * Day 1-5
   *
   * Paid:
   * Day 1-40
   */
  const subscriptionAccess =
    await canAccessEverydayLesson(
      userId,
      dayNumber
    );

  if (
    !subscriptionAccess
  ) {
    redirect(
      "/billing?feature=everyday-english"
    );
  }

  /*
   * CHECK 2
   *
   * Sequential course access.
   */
  const sequentialAccess =
    await canAccessSequentialLesson(
      userId,
      dayNumber
    );

  if (
    !sequentialAccess
  ) {
    const state =
      await getEverydayCourseState(
        userId
      );

    redirect(
      `/everyday-english/course/${state.nextLessonDay}`
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/everyday-english/course"
          className="mb-7 inline-flex min-h-11 items-center gap-2 rounded-xl px-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
        >
          <ArrowLeft
            size={17}
          />

          Back to course
        </Link>

        <DailyLessonExperience
          lesson={
            lessonContent
          }
        />
      </div>
    </main>
  );
}