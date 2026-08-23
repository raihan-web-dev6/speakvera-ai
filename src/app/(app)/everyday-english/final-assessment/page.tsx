import {
  Award,
  CheckCircle2,
  MessagesSquare,
  ShieldCheck,
} from "lucide-react";

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

import EverydayFinalAssessmentRunner from "@/components/course/EverydayFinalAssessmentRunner";

export default async function EverydayEnglishFinalAssessmentPage() {
  const session =
    await auth();

  const userId =
    session?.user?.id;

  if (!userId) {
    redirect(
      "/login?callbackUrl=/everyday-english/final-assessment"
    );
  }

  /*
   * Verify all 40 lessons.
   */

  const courseState =
    await getEverydayCourseState(
      userId
    );

  if (
    !courseState.courseCompleted
  ) {
    redirect(
      `/everyday-english/course/${courseState.nextLessonDay}`
    );
  }

  /*
   * Final assessment is part
   * of paid course completion.
   */

  const paidAccess =
  await userHasPaidAccess(
    userId
  );

  if (!paidAccess) {
    redirect(
      "/billing?feature=everyday-english"
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}

        <section className="rounded-3xl bg-slate-950 p-6 text-white sm:p-9">
          <p className="text-sm font-semibold text-blue-400">
            Everyday English
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Final Speaking Assessment
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-slate-300">
            You&apos;ve completed all 40 lessons. Now show what you can do across five real speaking tasks.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <InfoCard
              icon={
                <MessagesSquare
                  size={19}
                />
              }
              title="5 speaking tasks"
              text="Answer naturally"
            />

            <InfoCard
              icon={
                <ShieldCheck
                  size={19}
                />
              }
              title="AI evaluation"
              text="4 skill areas"
            />

            <InfoCard
              icon={
                <Award
                  size={19}
                />
              }
              title="Certificate"
              text="Unlock after passing"
            />
          </div>
        </section>

        {/* Rules */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <CheckCircle2
              size={20}
              className="mt-0.5 shrink-0 text-emerald-600"
            />

            <div>
              <h2 className="font-bold text-slate-950">
                Before you begin
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Use a quiet environment and answer each question with complete sentences. Speak naturally instead of memorizing an answer.
              </p>

              <p className="mt-2 text-xs leading-5 text-slate-400">
                Speakvera provides an internal AI learning estimate. This assessment is not an official CEFR examination.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-7">
          <EverydayFinalAssessmentRunner />
        </div>
      </div>
    </main>
  );
}

function InfoCard({
  icon,
  title,
  text,
}: {
  icon:
    React.ReactNode;

  title: string;

  text: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-900 p-4">
      <div className="text-blue-400">
        {icon}
      </div>

      <p className="mt-3 text-sm font-bold text-white">
        {title}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {text}
      </p>
    </div>
  );
}