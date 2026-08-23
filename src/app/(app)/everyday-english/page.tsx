import Link from "next/link";

import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  MessageCircle,
  Mic2,
  Trophy,
} from "lucide-react";

export default function EverydayEnglishPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
              <BookOpen size={16} />

              40-Day English Speaking Course
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Build stronger English speaking skills in 40 days.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Learn grammar, vocabulary, pronunciation and real-life
              conversation through structured lessons and AI speaking
              practice.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/everyday-english/course"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                View 40-day course

                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Feature
            icon={Clock}
            title="45 minutes"
            description="Focused daily learning"
          />

          <Feature
            icon={Mic2}
            title="AI Speaking"
            description="Practice using your voice"
          />

          <Feature
            icon={MessageCircle}
            title="Instant Feedback"
            description="Grammar and speaking corrections"
          />

          <Feature
            icon={Trophy}
            title="Certificate"
            description="Available after course completion"
          />
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
            <p className="text-sm font-semibold text-blue-600">
              Daily structure
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-950">
              What happens every day?
            </h2>

            <div className="mt-7 space-y-5">
              <CourseItem
                time="5 min"
                title="Learn today's concept"
              />

              <CourseItem
                time="10 min"
                title="Grammar and vocabulary"
              />

              <CourseItem
                time="5 min"
                title="Listening and pronunciation"
              />

              <CourseItem
                time="15 min"
                title="AI speaking conversation"
              />

              <CourseItem
                time="5 min"
                title="Corrections and Speak Again"
              />

              <CourseItem
                time="5 min"
                title="Quiz and progress"
              />
            </div>
          </div>

          <div className="rounded-3xl bg-slate-950 p-6 text-white sm:p-8">
            <p className="text-sm font-semibold text-blue-400">
              Speakvera method
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Learn → Speak → Correct → Speak again
            </h2>

            <p className="mt-4 leading-7 text-slate-300">
              Speakvera doesn&apos;t only show you your mistakes.
              You practice the improved answer again so your English
              improves through active speaking.
            </p>

            <div className="mt-7 space-y-4">
              {[
                "Structured daily lessons",
                "Real-world conversations",
                "Personalized AI feedback",
                "Progress tracking",
                "Fluency practice",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2
                    size={18}
                    className="text-blue-400"
                  />

                  <span className="text-sm text-slate-200">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Feature({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Clock;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <Icon
        size={22}
        className="text-blue-600"
      />

      <p className="mt-4 font-bold text-slate-950">
        {title}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}

function CourseItem({
  time,
  title,
}: {
  time: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-16 rounded-lg bg-blue-50 px-2 py-2 text-center text-xs font-bold text-blue-600">
        {time}
      </div>

      <p className="font-medium text-slate-700">
        {title}
      </p>
    </div>
  );
}