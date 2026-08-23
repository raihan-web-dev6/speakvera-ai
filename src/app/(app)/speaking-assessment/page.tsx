import Link from "next/link";

import {
  ArrowRight,
  Award,
  Brain,
  Mic2,
  Sparkles,
} from "lucide-react";

export default function SpeakingAssessmentPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
              <Mic2 size={17} />

              AI English Speaking Assessment
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Discover your English speaking level.
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Answer adaptive speaking questions and receive detailed feedback on grammar, vocabulary, fluency, pronunciation and communication.
            </p>

            <Link
              href="/speaking-assessment/test"
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 font-semibold text-white"
            >
              Start assessment

              <ArrowRight
                size={18}
              />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          <Feature
            icon={Brain}
            title="Adaptive questions"
            text="Question difficulty changes based on your previous answers."
          />

          <Feature
            icon={Sparkles}
            title="Detailed feedback"
            text="Measure grammar, vocabulary, fluency, pronunciation and communication."
          />

          <Feature
            icon={Award}
            title="Certificate eligibility"
            text="Passing users can unlock a Speakvera English Speaking Assessment certificate."
          />
        </div>

        <div className="mt-10 rounded-3xl bg-slate-950 p-6 text-white sm:p-8">
          <p className="text-sm font-semibold text-blue-400">
            Assessment structure
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Six spoken questions
          </h2>

          <p className="mt-3 max-w-2xl leading-7 text-slate-300">
            The assessment begins with everyday English and gradually adjusts difficulty based on how well you communicate.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <MiniCard
              title="Beginning"
              text="Personal and everyday topics"
            />

            <MiniCard
              title="Developing"
              text="Explanation and opinion questions"
            />

            <MiniCard
              title="Advanced"
              text="Abstract discussion when appropriate"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function Feature({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Brain;

  title: string;

  text: string;
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        <Icon size={22} />
      </div>

      <h2 className="mt-5 text-xl font-bold text-slate-950">
        {title}
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        {text}
      </p>
    </article>
  );
}

function MiniCard({
  title,
  text,
}: {
  title: string;

  text: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-900 p-5">
      <p className="font-bold">
        {title}
      </p>

      <p className="mt-2 text-sm text-slate-400">
        {text}
      </p>
    </div>
  );
}