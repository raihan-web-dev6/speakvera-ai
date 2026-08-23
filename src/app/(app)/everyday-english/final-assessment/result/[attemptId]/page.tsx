import mongoose from "mongoose";

import {
  notFound,
  redirect,
} from "next/navigation";

import {
  auth,
} from "@/auth";

import connectDb from "@/lib/db";

import EverydayFinalAssessment from "@/models/everydayFinalAssessment.model";

import EverydayFinalAssessmentReport from "@/components/course/EverydayFinalAssessmentReport";

type Props = {
  params: Promise<{
    attemptId:
      string;
  }>;
};

export default async function EverydayFinalAssessmentResultPage({
  params,
}: Props) {
  const {
    attemptId,
  } = await params;

  const session =
    await auth();

  const userId =
    session?.user?.id;

  if (!userId) {
    redirect(
      "/login"
    );
  }

  if (
    !mongoose.Types.ObjectId.isValid(
      attemptId
    )
  ) {
    notFound();
  }

  await connectDb();

  /*
   * userId in query prevents users
   * from viewing another person's
   * assessment by guessing IDs.
   */
  const assessment =
    await EverydayFinalAssessment.findOne(
      {
        _id:
          attemptId,

        userId,
      }
    )
      .select({
        grammarScore: 1,

        vocabularyScore: 1,

        communicationScore: 1,

        deliveryScore: 1,

        overallScore: 1,

        cefrLevel: 1,

        passed: 1,

        certificateEligible:
          1,

        strengths: 1,

        improvements: 1,

        summary: 1,
      })
      .lean();

  if (!assessment) {
    notFound();
  }

  const result = {
    attemptId,

    grammarScore:
      assessment.grammarScore,

    vocabularyScore:
      assessment.vocabularyScore,

    communicationScore:
      assessment.communicationScore,

    deliveryScore:
      assessment.deliveryScore,

    overallScore:
      assessment.overallScore,

    cefrLevel:
      assessment.cefrLevel,

    passed:
      assessment.passed,

    certificateEligible:
      assessment.certificateEligible,

    strengths:
      assessment.strengths,

    improvements:
      assessment.improvements,

    summary:
      assessment.summary,
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <EverydayFinalAssessmentReport
          result={
            result
          }
        />
      </div>
    </main>
  );
}