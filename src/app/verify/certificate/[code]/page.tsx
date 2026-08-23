import {
  Award,
  CheckCircle2,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import connectDb from "@/lib/db";

import Certificate from "@/models/certificate.model";

type Props = {
  params: Promise<{
    code:
      string;
  }>;
};

export default async function VerifyCertificatePage({
  params,
}: Props) {
  const {
    code,
  } = await params;

  await connectDb();

  /*
   * Public lookup only by
   * certificate code.
   *
   * We do NOT expose userId.
   */

  const certificate =
    await Certificate.findOne({
      certificateCode:
        code,
    }).lean();

  const valid =
    certificate?.status ===
    "VALID";

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white">
            <Award
              size={27}
            />
          </div>

          <p className="mt-4 font-bold text-white">
            Speakvera AI
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Certificate Verification
          </p>
        </div>

        {!certificate ? (
          <section className="rounded-3xl bg-white p-7 text-center shadow-xl sm:p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              <XCircle
                size={28}
              />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-slate-950">
              Certificate not found
            </h1>

            <p className="mt-3 leading-7 text-slate-500">
              We could not find a Speakvera certificate with this verification code.
            </p>

            <p className="mt-5 rounded-xl bg-slate-50 p-3 font-mono text-sm text-slate-600">
              {code}
            </p>
          </section>
        ) : (
          <section className="overflow-hidden rounded-3xl bg-white shadow-xl">
            <div
              className={`h-2 ${
                valid
                  ? "bg-emerald-500"
                  : "bg-red-500"
              }`}
            />

            <div className="p-7 sm:p-10">
              <div className="text-center">
                <div
                  className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
                    valid
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {valid ? (
                    <CheckCircle2
                      size={29}
                    />
                  ) : (
                    <XCircle
                      size={29}
                    />
                  )}
                </div>

                <h1 className="mt-5 text-2xl font-bold text-slate-950">
                  {valid
                    ? "Valid Speakvera Certificate"
                    : "Certificate is not valid"}
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                  Verification code{" "}
                  <strong>
                    {
                      certificate.certificateCode
                    }
                  </strong>
                </p>
              </div>

              <div className="mt-8 divide-y divide-slate-100 rounded-2xl border border-slate-200">
                <VerificationRow
                  label="Recipient"
                  value={
                    certificate.recipientName
                  }
                />

                <VerificationRow
                  label="Certificate"
                  value={
                    certificate.title
                  }
                />

                {certificate.cefrLevel && (
                  <VerificationRow
                    label="Estimated level"
                    value={
                      certificate.cefrLevel
                    }
                  />
                )}

                {typeof certificate.score ===
                  "number" && (
                  <VerificationRow
                    label="Score"
                    value={`${Math.round(
                      certificate.score
                    )}/100`}
                  />
                )}

                <VerificationRow
                  label="Issued"
                  value={new Date(
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
                  )}
                />

                <VerificationRow
                  label="Status"
                  value={
                    certificate.status
                  }
                />
              </div>

              <div className="mt-7 flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                <ShieldCheck
                  size={20}
                  className="mt-0.5 shrink-0 text-blue-600"
                />

                <p className="text-xs leading-5 text-slate-500">
                  This page verifies that the certificate was issued by Speakvera. Speakvera certificates are learning-program credentials and are not official CEFR or IELTS qualifications.
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function VerificationRow({
  label,
  value,
}: {
  label:
    string;

  value:
    string;
}) {
  return (
    <div className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="text-sm font-bold text-slate-900 sm:text-right">
        {value}
      </p>
    </div>
  );
}