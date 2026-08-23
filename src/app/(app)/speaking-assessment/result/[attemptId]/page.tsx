import Link from "next/link";

import {
  ArrowLeft,
  RotateCcw,
} from "lucide-react";

import {
  notFound,
  redirect,
} from "next/navigation";

import { auth } from "@/auth";

import AssessmentReport from "@/components/assessment/AssessmentReport";

import connectDb from "@/lib/db";

import AssessmentAttempt from "@/models/assessmentAttempt.model";

type Props = {
  params: Promise<{
    attemptId: string;
  }>;
};

export default async function AssessmentResultPage({
  params,
}: Props) {
  const session =
    await auth();

  const userId = (
    session?.user as {
      id?: string;
    }
  )?.id;

  if (!userId) {
    redirect("/login");
  }

  const {
    attemptId,
  } = await params;

  await connectDb();

  const attempt =
    await AssessmentAttempt.findOne({
      _id: attemptId,

      userId,
    }).lean();

  if (!attempt) {
    notFound();
  }

  const result = {
    overallScore:
      attempt.overallScore,

    grammarScore:
      attempt.grammarScore,

    vocabularyScore:
      attempt.vocabularyScore,

    communicationScore:
      attempt.communicationScore,

    fluencyScore:
      attempt.fluencyScore,

    pronunciationScore:
      attempt.pronunciationScore,

    cefrLevel:
      attempt.cefrLevel,

    passed:
      attempt.passed,

    certificateEligible:
      attempt.certificateEligible,

    strengths:
      attempt.strengths || [],

    improvements:
      attempt.improvements ||
      [],

    feedback: {
      grammar:
        attempt.feedback
          ?.grammar || "",

      vocabulary:
        attempt.feedback
          ?.vocabulary || "",

      communication:
        attempt.feedback
          ?.communication ||
        "",

      summary:
        attempt.feedback
          ?.summary || "",
    },
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/speaking-assessment"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft size={16} />

          Speaking assessment
        </Link>

        <div className="mt-8">
          <AssessmentReport
            result={result}
          />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/speaking-assessment/test"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 font-semibold text-white"
          >
            <RotateCcw size={17} />

            Retake assessment
          </Link>

          {result.certificateEligible && (
            <Link
              href="/certificates"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 font-semibold text-slate-700"
            >
              View certificates
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}