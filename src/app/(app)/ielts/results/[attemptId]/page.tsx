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

import IeltsBandReport from "@/components/ielts/IeltsBandReport";

import connectDb from "@/lib/db";

import IeltsAttempt from "@/models/ieltsAttempt.model";

type Props = {
  params: Promise<{
    attemptId: string;
  }>;
};

export default async function IeltsResultPage({
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
    await IeltsAttempt.findOne({
      _id: attemptId,

      userId,
    }).lean();

  if (!attempt) {
    notFound();
  }

  const evaluation = {
    overallBand:
      attempt.overallBand,

    fluencyBand:
      attempt.fluencyBand,

    lexicalBand:
      attempt.lexicalBand,

    grammarBand:
      attempt.grammarBand,

    pronunciationBand:
      attempt.pronunciationBand,

    strengths:
      attempt.strengths || [],

    improvements:
      attempt.improvements ||
      [],

    summary:
      attempt.feedback
        ?.summary || "",

    fluencyFeedback:
      attempt.feedback
        ?.fluency || "",

    vocabularyFeedback:
      attempt.feedback
        ?.vocabulary || "",

    grammarFeedback:
      attempt.feedback
        ?.grammar || "",

    pronunciationFeedback:
      attempt.feedback
        ?.pronunciation ||
      "",
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/ielts"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft size={16} />

          IELTS dashboard
        </Link>

        <div className="mt-8">
          <IeltsBandReport
            evaluation={
              evaluation
            }
          />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/ielts/mock-test"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 font-semibold text-white"
          >
            <RotateCcw
              size={17}
            />

            Take another mock test
          </Link>

          <Link
            href="/progress"
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 font-semibold text-slate-700"
          >
            View progress
          </Link>
        </div>
      </div>
    </main>
  );
}