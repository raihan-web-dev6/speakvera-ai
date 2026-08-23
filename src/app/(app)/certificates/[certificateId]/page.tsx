import mongoose from "mongoose";

import QRCode from "qrcode";

import {
  ArrowLeft,
} from "lucide-react";

import Link from "next/link";

import {
  notFound,
  redirect,
} from "next/navigation";

import {
  auth,
} from "@/auth";

import connectDb from "@/lib/db";

import Certificate from "@/models/certificate.model";

import CertificateDisplay from "@/components/certificates/CertificateDisplay";

type Props = {
  params: Promise<{
    certificateId:
      string;
  }>;
};

export default async function CertificatePage({
  params,
}: Props) {
  const {
    certificateId,
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
      certificateId
    )
  ) {
    notFound();
  }

  await connectDb();

  /*
   * IMPORTANT:
   *
   * userId prevents one logged-in
   * learner from viewing another
   * learner's private certificate
   * using its MongoDB ID.
   */

  const certificate =
    await Certificate.findOne({
      _id:
        certificateId,

      userId,
    });

  if (!certificate) {
    notFound();
  }

  const appUrl =
    (
      process.env
        .NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000"
    ).replace(
      /\/$/,
      ""
    );

  const verificationUrl =
    `${appUrl}/verify/certificate/${certificate.certificateCode}`;

  const qrDataUrl =
    await QRCode.toDataURL(
      verificationUrl,
      {
        width: 250,

        margin: 1,
      }
    );

  const issuedDate =
    new Date(
      certificate.issuedAt
    ).toLocaleDateString(
      "en-US",
      {
        year:
          "numeric",

        month:
          "long",

        day:
          "numeric",
      }
    );

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/certificates"
          className="mb-7 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
        >
          <ArrowLeft
            size={17}
          />

          My certificates
        </Link>

        <CertificateDisplay
          certificateId={
            certificate._id.toString()
          }
          certificateCode={
            certificate.certificateCode
          }
          title={
            certificate.title
          }
          recipientName={
            certificate.recipientName
          }
          cefrLevel={
            certificate.cefrLevel
          }
          score={
            certificate.score
          }
          issuedAt={
            issuedDate
          }
          status={
            certificate.status
          }
          qrDataUrl={
            qrDataUrl
          }
          verificationUrl={
            verificationUrl
          }
        />
      </div>
    </main>
  );
}