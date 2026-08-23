import Link from "next/link";

import {
  ArrowRight,
  Clock,
  GraduationCap,
  MessageCircle,
  Mic2,
  Trophy,
} from "lucide-react";

export default function IeltsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
              <GraduationCap
                size={17}
              />

              IELTS Speaking Preparation
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Practice IELTS Speaking with AI.
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Practice all three IELTS Speaking parts, receive detailed AI feedback and track your estimated band score.
            </p>

            <Link
              href="/ielts/mock-test"
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 font-semibold text-white"
            >
              Start mock test

              <ArrowRight
                size={18}
              />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          <PartCard
            part="Part 1"
            title="Introduction & Interview"
            description="Answer questions about familiar topics such as your hometown, studies, interests and daily life."
            href="/ielts/practice/part-1"
            icon={MessageCircle}
          />

          <PartCard
            part="Part 2"
            title="Long Turn"
            description="Prepare for one minute, then speak for up to two minutes using an IELTS-style cue card."
            href="/ielts/practice/part-2"
            icon={Mic2}
          />

          <PartCard
            part="Part 3"
            title="Discussion"
            description="Answer deeper questions and discuss more abstract ideas connected to Part 2 topics."
            href="/ielts/practice/part-3"
            icon={Trophy}
          />
        </div>

        <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="flex gap-3">
            <Clock
              className="mt-1 shrink-0 text-blue-600"
              size={21}
            />

            <div>
              <h2 className="font-bold text-slate-950">
                Full IELTS-style speaking practice
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                Speakvera follows the three-part IELTS Speaking structure and provides AI-estimated practice feedback. Official IELTS Speaking lasts 11–14 minutes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function PartCard({
  part,
  title,
  description,
  href,
  icon: Icon,
}: {
  part: string;

  title: string;

  description: string;

  href: string;

  icon: typeof Mic2;
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        <Icon size={22} />
      </div>

      <p className="mt-5 text-xs font-bold uppercase tracking-wider text-blue-600">
        {part}
      </p>

      <h2 className="mt-2 text-xl font-bold text-slate-950">
        {title}
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        {description}
      </p>

      <Link
        href={href}
        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600"
      >
        Practice

        <ArrowRight
          size={16}
        />
      </Link>
    </article>
  );
}