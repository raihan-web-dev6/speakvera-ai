import {
  Award,
  CheckCircle2,
  Download,
  ShieldCheck,
} from "lucide-react";

type Props = {
  certificateId:
    string;

  certificateCode:
    string;

  title:
    string;

  recipientName:
    string;

  cefrLevel?:
    string;

  score?:
    number;

  issuedAt:
    string;

  status:
    string;

  qrDataUrl:
    string;

  verificationUrl:
    string;
};

export default function CertificateDisplay({
  certificateId,
  certificateCode,
  title,
  recipientName,
  cefrLevel,
  score,
  issuedAt,
  status,
  qrDataUrl,
  verificationUrl,
}: Props) {
  const valid =
    status ===
    "VALID";

  return (
    <div className="space-y-6">
      {/* CERTIFICATE */}

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
        <div className="h-2 bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600" />

        <div className="relative px-6 py-10 text-center sm:px-12 sm:py-14">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <Award
              size={32}
            />
          </div>

          <p className="mt-6 text-sm font-bold uppercase tracking-[0.3em] text-blue-600">
            Speakvera AI
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Certificate of Completion
          </h1>

          <p className="mt-6 text-sm text-slate-500">
            This certificate is presented to
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
            {
              recipientName
            }
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600">
            for successfully completing
          </p>

          <h3 className="mx-auto mt-2 max-w-2xl text-xl font-bold text-blue-700 sm:text-2xl">
            {title}
          </h3>

          {(cefrLevel ||
            typeof score ===
              "number") && (
            <div className="mx-auto mt-8 flex max-w-lg flex-wrap justify-center gap-3">
              {cefrLevel && (
                <div className="rounded-2xl bg-slate-50 px-5 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Estimated level
                  </p>

                  <p className="mt-1 text-xl font-bold text-slate-950">
                    {
                      cefrLevel
                    }
                  </p>
                </div>
              )}

              {typeof score ===
                "number" && (
                <div className="rounded-2xl bg-slate-50 px-5 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Final score
                  </p>

                  <p className="mt-1 text-xl font-bold text-slate-950">
                    {Math.round(
                      score
                    )}
                    /100
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mx-auto mt-10 h-px max-w-2xl bg-slate-200" />

          <div className="mx-auto mt-8 grid max-w-2xl gap-6 sm:grid-cols-3 sm:items-center">
            <div className="text-center sm:text-left">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Issued
              </p>

              <p className="mt-2 text-sm font-bold text-slate-900">
                {issuedAt}
              </p>
            </div>

            <div className="flex justify-center">
              <img
                src={
                  qrDataUrl
                }
                alt="Certificate verification QR code"
                className="h-28 w-28 rounded-xl border border-slate-200 bg-white p-1"
              />
            </div>

            <div className="text-center sm:text-right">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Certificate ID
              </p>

              <p className="mt-2 break-all text-sm font-bold text-slate-900">
                {
                  certificateCode
                }
              </p>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2">
            {valid ? (
              <>
                <CheckCircle2
                  size={17}
                  className="text-emerald-600"
                />

                <span className="text-sm font-semibold text-emerald-700">
                  Valid certificate
                </span>
              </>
            ) : (
              <>
                <ShieldCheck
                  size={17}
                  className="text-red-600"
                />

                <span className="text-sm font-semibold text-red-700">
                  Certificate is not valid
                </span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ACTIONS */}

      <section className="flex flex-col gap-3 sm:flex-row">
        <a
          href={`/api/certificates/${certificateId}/pdf`}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 font-semibold text-white transition hover:bg-blue-700"
        >
          <Download
            size={18}
          />

          Download PDF
        </a>

        <a
          href={
            verificationUrl
          }
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <ShieldCheck
            size={18}
          />

          Verify certificate
        </a>
      </section>

      <p className="text-xs leading-5 text-slate-400">
        Speakvera certificates document completion of Speakvera learning programs and assessments. They are not official CEFR or IELTS qualifications.
      </p>
    </div>
  );
}