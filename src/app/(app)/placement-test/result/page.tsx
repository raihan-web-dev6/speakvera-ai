import {
  notFound,
  redirect,
} from "next/navigation";

import { auth } from "@/auth";

import connectDb from "@/lib/db";

import PlacementAttempt from "@/models/placementAttempt.model";

import PlacementResultCard from "@/components/placement/PlacementResultCard";

type Props = {
  searchParams: Promise<{
    attemptId?: string;
  }>;
};

export default async function PlacementResultPage({
  searchParams,
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
  } =
    await searchParams;

  if (!attemptId) {
    notFound();
  }

  await connectDb();

  const attempt =
    await PlacementAttempt.findOne(
      {
        _id: attemptId,

        userId,
      }
    ).lean();

  if (!attempt) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <PlacementResultCard
          result={{
            cefrLevel:
              attempt.cefrLevel,

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

            strengths:
              attempt.strengths ||
              [],

            improvements:
              attempt.improvements ||
              [],

            summary:
              attempt.summary,
          }}
        />
      </div>
    </main>
  );
}