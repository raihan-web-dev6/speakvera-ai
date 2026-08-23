import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Gauge,
  Mic2,
  Sparkles,
  Target,
} from "lucide-react";

export const metadata: Metadata = {
  title:
    "Free English Speaking Level Test | Speakvera AI",

  description:
    "Take a free AI-powered English speaking level test and get an estimated CEFR level from A1 to C2 with feedback on grammar, vocabulary and communication.",

  alternates: {
    canonical:
      "/english-level-test",
  },

  openGraph: {
    title:
      "Free English Speaking Level Test | Speakvera AI",

    description:
      "Answer spoken English questions and receive an AI-generated estimated CEFR level from A1 to C2.",

    url:
      "/english-level-test",

    type:
      "website",
  },
};

export default function EnglishLevelTestPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      {/* =====================================
          NAVBAR
      ===================================== */}

      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2.5"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#17135f] text-white">
              <Mic2 size={18} />
            </span>

            <span className="text-lg font-bold text-[#171342] sm:text-xl">
              Speakvera
              <span className="text-blue-600">
                {" "}
                AI
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-3 py-2 text-sm font-semibold text-slate-700"
            >
              Log in
            </Link>

            <Link
              href="/register"
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white"
            >
              Start free
            </Link>
          </div>
        </nav>
      </header>

      {/* =====================================
          HERO
      ===================================== */}

      <section className="bg-[linear-gradient(180deg,#f3f5ff_0%,#ffffff_100%)]">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-blue-600">
              FREE ENGLISH SPEAKING TEST
            </p>

            <h1 className="mt-5 text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-[#171342] sm:text-6xl [font-family:Georgia,serif]">
              Discover your
              English speaking
              level.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Answer spoken English questions and receive
              an AI-generated estimated CEFR level from A1
              to C2, together with practical feedback.
            </p>

            <div className="mt-8 space-y-3">
              <Benefit text="Adaptive speaking questions" />

              <Benefit text="Estimated CEFR level from A1 to C2" />

              <Benefit text="Grammar and vocabulary feedback" />

              <Benefit text="Communication score and improvement tips" />
            </div>

            <Link
              href="/register"
              className="mt-9 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-7 font-semibold text-white shadow-lg shadow-blue-600/15 transition hover:bg-blue-700"
            >
              Start free speaking test

              <ArrowRight size={17} />
            </Link>

            <p className="mt-4 text-xs leading-5 text-slate-500">
              Free account required. Your result is an
              AI-generated learning estimate, not an official
              language qualification.
            </p>
          </div>

          <AssessmentPreview />
        </div>
      </section>

      {/* =====================================
          HOW IT WORKS
      ===================================== */}

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-blue-600">
              HOW IT WORKS
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.035em] text-[#171342] sm:text-5xl [font-family:Georgia,serif]">
              Speak. Get analyzed.
              See where you stand.
            </h2>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            <Step
              number="1"
              icon={Mic2}
              title="Answer aloud"
              text="Speak naturally in response to English questions."
            />

            <Step
              number="2"
              icon={BrainCircuit}
              title="AI analyzes"
              text="Your transcript is evaluated for grammar, vocabulary and communication."
            />

            <Step
              number="3"
              icon={Target}
              title="Get your level"
              text="Receive an estimated Speakvera CEFR level and practical feedback."
            />
          </div>
        </div>
      </section>

      {/* =====================================
          CEFR
      ===================================== */}

      <section className="bg-[#eef1ff]">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-blue-600">
              CEFR LEVEL ESTIMATE
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.035em] text-[#171342] sm:text-5xl [font-family:Georgia,serif]">
              From beginner to advanced.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-600">
              Speakvera uses your answers to estimate where your
              current English speaking ability may fit on the
              CEFR scale.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <Level
              level="A1"
              name="Beginner"
            />

            <Level
              level="A2"
              name="Elementary"
            />

            <Level
              level="B1"
              name="Intermediate"
            />

            <Level
              level="B2"
              name="Upper Intermediate"
            />

            <Level
              level="C1"
              name="Advanced"
            />

            <Level
              level="C2"
              name="Proficient"
            />
          </div>
        </div>
      </section>

      {/* =====================================
          CTA
      ===================================== */}

      <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[36px] bg-[#17135f] px-6 py-14 text-center text-white sm:px-12 sm:py-20">
          <Sparkles
            className="mx-auto text-blue-300"
            size={30}
          />

          <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.035em] sm:text-5xl [font-family:Georgia,serif]">
            Find your starting point.
            Then start improving.
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-indigo-200">
            Create your free Speakvera account and begin your
            speaking assessment.
          </p>

          <Link
            href="/register"
            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-7 font-semibold text-[#17135f]"
          >
            Take the free test

            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}

/*
 * =====================================================
 * ASSESSMENT PREVIEW
 * =====================================================
 */

function AssessmentPreview() {
  return (
    <div className="rounded-[34px] bg-[#e9edff] p-4 sm:p-7">
      <div className="rounded-[28px] border border-indigo-100 bg-white p-6 shadow-xl shadow-indigo-950/5 sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Sample result
            </p>

            <h2 className="mt-2 text-xl font-bold text-[#171342]">
              Your estimated level
            </h2>
          </div>

          <Gauge className="text-blue-600" />
        </div>

        <div className="mt-8 flex justify-center">
          <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full border-[12px] border-blue-100 bg-blue-600 text-white">
            <span className="text-4xl font-bold">
              B1
            </span>

            <span className="mt-1 text-xs text-blue-100">
              Intermediate
            </span>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <Score
            name="Grammar"
            value={72}
          />

          <Score
            name="Vocabulary"
            value={76}
          />

          <Score
            name="Communication"
            value={79}
          />
        </div>

        <div className="mt-6 rounded-2xl bg-emerald-50 p-4">
          <div className="flex gap-3">
            <CheckCircle2
              size={18}
              className="mt-0.5 shrink-0 text-emerald-600"
            />

            <p className="text-sm leading-6 text-emerald-900">
              You can communicate clearly in many everyday
              situations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
 * =====================================================
 * SMALL COMPONENTS
 * =====================================================
 */

function Benefit({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle2
        size={19}
        className="shrink-0 text-blue-600"
      />

      <span className="text-sm font-medium text-slate-700 sm:text-base">
        {text}
      </span>
    </div>
  );
}

function Step({
  number,
  icon: Icon,
  title,
  text,
}: {
  number: string;

  icon: typeof Mic2;

  title: string;

  text: string;
}) {
  return (
    <article className="rounded-[26px] border border-slate-200 p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <Icon size={21} />
        </div>

        <span className="text-sm font-bold text-slate-300">
          {number}
        </span>
      </div>

      <h3 className="mt-6 text-xl font-bold text-[#171342]">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-slate-600">
        {text}
      </p>
    </article>
  );
}

function Level({
  level,
  name,
}: {
  level: string;

  name: string;
}) {
  return (
    <div className="rounded-2xl border border-indigo-100 bg-white p-5 text-center shadow-sm">
      <p className="text-2xl font-bold text-blue-600">
        {level}
      </p>

      <p className="mt-2 text-xs font-medium leading-4 text-slate-500">
        {name}
      </p>
    </div>
  );
}

function Score({
  name,
  value,
}: {
  name: string;

  value: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-600">
          {name}
        </span>

        <span className="font-bold text-[#171342]">
          {value}/100
        </span>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-blue-600"
          style={{
            width: `${value}%`,
          }}
        />
      </div>
    </div>
  );
}