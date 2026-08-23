import {
  Award,
  ChevronRight,
} from "lucide-react";

import Link from "next/link";

import {
  redirect,
} from "next/navigation";

import {
  auth,
} from "@/auth";

import connectDb from "@/lib/db";

import Certificate from "@/models/certificate.model";

export default async function CertificatesPage() {
  const session =
    await auth();

  const userId =
    session?.user?.id;

  if (!userId) {
    redirect(
      "/login?callbackUrl=/certificates"
    );
  }

  await connectDb();

  const certificates =
    await Certificate.find({
      userId,
    })
      .sort({
        issuedAt: -1,
      })
      .lean();

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <section>
          <p className="font-semibold text-blue-600">
            Achievements
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            My Certificates
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            View and verify certificates earned through Speakvera courses and speaking assessments.
          </p>
        </section>

        {certificates.length ===
        0 ? (
          <section className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Award
                size={26}
              />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-950">
              No certificates yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Complete an eligible course or speaking assessment and pass its requirements to unlock your first certificate.
            </p>

            <Link
              href="/dashboard"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-600 px-5 font-semibold text-white"
            >
              Continue learning
            </Link>
          </section>
        ) : (
          <section className="mt-10 grid gap-4 md:grid-cols-2">
            {certificates.map(
              (
                certificate
              ) => (
                <Link
                  key={
                    certificate._id.toString()
                  }
                  href={`/certificates/${certificate._id.toString()}`}
                  className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                      <Award
                        size={22}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                            {
                              certificate.type
                            }
                          </p>

                          <h2 className="mt-2 font-bold leading-6 text-slate-950">
                            {
                              certificate.title
                            }
                          </h2>
                        </div>

                        <ChevronRight
                          size={19}
                          className="shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600"
                        />
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {certificate.cefrLevel && (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            Level{" "}
                            {
                              certificate.cefrLevel
                            }
                          </span>
                        )}

                        {typeof certificate.score ===
                          "number" && (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            Score{" "}
                            {Math.round(
                              certificate.score
                            )}
                            /100
                          </span>
                        )}

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            certificate.status ===
                            "VALID"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {
                            certificate.status
                          }
                        </span>
                      </div>

                      <p className="mt-4 text-xs text-slate-400">
                        Issued{" "}
                        {new Date(
                          certificate.issuedAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            )}
          </section>
        )}
      </div>
    </main>
  );
}