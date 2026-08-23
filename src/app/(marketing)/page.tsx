
import Link from "next/link";
import HomeStructuredData from "@/components/seo/HomeStructuredData";

import {
  ArrowRight,
  BarChart3,
  BookOpen,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Crown,
  FileCheck2,
  Flame,
  GraduationCap,
  Headphones,
  Languages,
  LineChart,
  MessageCircle,
  Mic2,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  Volume2,
  WandSparkles,
} from "lucide-react";

import type {
  LucideIcon,
} from "lucide-react";

/*
 * =====================================================
 * HOMEPAGE
 * =====================================================
 */

export default function HomePage() {
  return (
    <>
      <HomeStructuredData />

      <main className="overflow-hidden bg-white text-slate-950">
        <Navbar />

        <HeroSection />

        <SimpleFlowSection />

        <EverydayEnglishSection />

        <HowItWorksSection />

        <IELTSSection />

        <AssessmentSection />

        <FeaturesSection />

        <PricingSection />

        <FinalCTA />

        <Footer />
      </main>
    </>
  );
}

/*
 * =====================================================
 * NAVBAR
 * =====================================================
 */

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-18 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#17135f] text-white shadow-sm">
            <Mic2 size={18} />
          </span>

          <span className="text-lg font-bold tracking-tight text-[#171342] sm:text-xl">
            Speakvera
            <span className="text-blue-600">
              {" "}
              AI
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          <a
            href="#how-it-works"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
          >
            How it works
          </a>

          <a
            href="#courses"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
          >
            Courses
          </a>

          <a
            href="#ielts"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
          >
            IELTS
          </a>

          <a
            href="#pricing"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
          >
            Pricing
          </a>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/login"
            className="inline-flex h-10 items-center justify-center rounded-xl px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:px-4"
          >
            Log in
          </Link>

          <Link
            href="/register"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Start free
          </Link>
        </div>
      </nav>
    </header>
  );
}

/*
 * =====================================================
 * HERO
 * =====================================================
 */

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f8faff_0%,#ffffff_75%)]">
      <div className="absolute left-1/2 top-16 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-blue-100/50 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pb-28 sm:pt-28 lg:px-8 lg:pt-32">
        <div className="mx-auto max-w-5xl text-center">
          <SectionLabel>
            AI English Speaking Coach
          </SectionLabel>

          <h1 className="mx-auto mt-5 max-w-5xl text-5xl font-semibold leading-[0.98] tracking-[-0.045em] text-[#161244] sm:text-6xl lg:text-7xl xl:text-[82px] [font-family:Georgia,serif]">
            Speak English.
            <br />

            Get instant{" "}
            <span className="text-blue-600">
              AI feedback.
            </span>
            <br />

            Build real confidence.
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Practice real conversations, follow a structured
            40-day English course, prepare for IELTS Speaking
            and discover your estimated English level.
          </p>

          <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link
              href="/register"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-7 font-semibold text-white shadow-lg shadow-blue-600/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Start learning free

              <ArrowRight size={17} />
            </Link>

            <Link
              href="/english-level-test"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-7 font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
            >
              <Play
                size={16}
                fill="currentColor"
              />

              Take speaking test
            </Link>
          </div>
        </div>

        <HeroProductMockup />
      </div>
    </section>
  );
}

/*
 * =====================================================
 * HERO MOCKUP
 * =====================================================
 */

function HeroProductMockup() {
  return (
    <div className="relative mx-auto mt-16 max-w-5xl sm:mt-20">
      <div className="absolute -inset-5 rounded-[44px] bg-blue-100/60 blur-3xl" />

      <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-3 shadow-[0_35px_100px_rgba(37,55,120,0.16)] sm:rounded-[36px] sm:p-5">
        <div className="overflow-hidden rounded-[22px] border border-slate-200 bg-[#f7f8ff] sm:rounded-[28px]">
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
            </div>

            <div className="hidden rounded-full bg-slate-100 px-4 py-1.5 text-xs font-medium text-slate-500 sm:block">
              speakvera.ai/practice
            </div>

            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Mic2 size={13} />
            </div>
          </div>

          <div className="grid gap-5 p-4 sm:p-7 lg:grid-cols-[0.8fr_1.2fr] lg:p-9">
            <div className="rounded-[24px] bg-[#17135f] p-6 text-white sm:p-8">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
                  DAY 12
                </span>

                <BookOpen size={18} />
              </div>

              <p className="mt-8 text-sm text-blue-200">
                Everyday English
              </p>

              <h2 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl">
                Talk about your daily routine
              </h2>

              <p className="mt-4 text-sm leading-6 text-indigo-100">
                Speak naturally for 30–60 seconds. Your answer
                will be analyzed instantly.
              </p>

              <div className="mt-8 flex justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-[7px] border-white/10 bg-blue-600 shadow-2xl">
                  <Mic2 size={32} />
                </div>
              </div>

              <p className="mt-5 text-center text-xs text-indigo-200">
                Tap to start speaking
              </p>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[24px] border border-slate-200 bg-white p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                      AI Feedback
                    </p>

                    <h3 className="mt-2 text-xl font-bold text-[#171342]">
                      Strong answer
                    </h3>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-lg font-bold text-blue-600">
                    82
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
                  <ScoreBox
                    value="84"
                    label="Grammar"
                  />

                  <ScoreBox
                    value="79"
                    label="Vocabulary"
                  />

                  <ScoreBox
                    value="83"
                    label="Answer"
                  />
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-white p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Your transcript
                </p>

                <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">
                  “I usually start my day early. I have breakfast,
                  check my tasks and then begin my work...”
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <SmallPill>
                    Clear answer
                  </SmallPill>

                  <SmallPill>
                    Good vocabulary
                  </SmallPill>

                  <SmallPill>
                    Natural structure
                  </SmallPill>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
 * =====================================================
 * SIMPLE FLOW
 * =====================================================
 */

function SimpleFlowSection() {
  return (
    <section
      id="how-it-works"
      className="bg-[#eef1ff]"
    >
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="text-center">
          <SectionLabel>
            HOW SIMPLE IT IS
          </SectionLabel>

          <SectionHeading>
            Speak something in.
            <br />
            Get useful feedback out.
          </SectionHeading>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            No complicated setup. Choose a practice mode,
            speak naturally and let Speakvera guide your next
            improvement.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl items-center gap-7 lg:grid-cols-[1fr_120px_1fr]">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
              Speak naturally
            </p>

            <FlowCard
              icon={MessageCircle}
              text="Answer a daily question"
            />

            <FlowCard
              icon={BookOpen}
              text="Practice a course lesson"
            />

            <FlowCard
              icon={GraduationCap}
              text="Try an IELTS question"
            />

            <FlowCard
              icon={Mic2}
              text="Take a speaking assessment"
            />
          </div>

          <div className="flex flex-col items-center">
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-[8px] border-indigo-100 bg-[#18145e] text-white shadow-xl">
              <Sparkles size={28} />

              <div className="absolute -inset-4 -z-10 rounded-full bg-blue-300/30 blur-xl" />
            </div>

            <p className="mt-4 text-center text-xs font-medium leading-5 text-slate-500">
              AI analyzes
              <br />
              your answer
            </p>
          </div>

          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
              Get feedback
            </p>

            <FlowCard
              icon={CheckCircle2}
              text="Grammar feedback"
            />

            <FlowCard
              icon={Languages}
              text="Vocabulary suggestions"
            />

            <FlowCard
              icon={BrainCircuit}
              text="Improved answer"
            />

            <FlowCard
              icon={LineChart}
              text="Progress over time"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/*
 * =====================================================
 * EVERYDAY ENGLISH
 * =====================================================
 */

function EverydayEnglishSection() {
  return (
    <section
      id="courses"
      className="bg-white"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-24 sm:px-6 sm:py-32 lg:grid-cols-2 lg:px-8">
        <div>
          <SectionLabel>
            EVERYDAY ENGLISH
          </SectionLabel>

          <h2 className="mt-4 max-w-xl text-4xl font-semibold leading-[1.03] tracking-[-0.035em] text-[#171342] sm:text-5xl lg:text-6xl [font-family:Georgia,serif]">
            Build your speaking habit in 40 days.
          </h2>

          <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
            Follow a clear daily path instead of wondering what
            to study next. Each lesson combines useful English
            with real speaking practice.
          </p>

          <div className="mt-8 space-y-4">
            <FeatureLine text="40 structured daily lessons" />

            <FeatureLine text="Vocabulary for real-life situations" />

            <FeatureLine text="Simple grammar explanations" />

            <FeatureLine text="Listening and speaking practice" />

            <FeatureLine text="Instant AI feedback after speaking" />
          </div>

          <Link
            href="/register"
            className="mt-9 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-6 font-semibold text-white transition hover:bg-blue-700"
          >
            Start Day 1

            <ArrowRight size={17} />
          </Link>
        </div>

        <CourseVisual />
      </div>
    </section>
  );
}

/*
 * =====================================================
 * COURSE VISUAL
 * =====================================================
 */

function CourseVisual() {
  return (
    <div className="rounded-[34px] bg-[#f2f1ff] p-4 sm:p-8">
      <div className="rounded-[28px] border border-indigo-100 bg-white p-5 shadow-xl shadow-indigo-950/5 sm:p-7">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Everyday English
            </p>

            <h3 className="mt-2 text-2xl font-bold text-[#171342]">
              Your 40-day journey
            </h3>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <BookOpen size={21} />
          </div>
        </div>

        <div className="mt-7">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-700">
              Course progress
            </span>

            <span className="font-bold text-blue-600">
              30%
            </span>
          </div>

          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-[30%] rounded-full bg-blue-600" />
          </div>
        </div>

        <div className="mt-7 space-y-3">
          <LessonRow
            day="Day 10"
            title="Talking about your hobbies"
            status="done"
          />

          <LessonRow
            day="Day 11"
            title="Describing your work"
            status="done"
          />

          <LessonRow
            day="Day 12"
            title="Your daily routine"
            status="current"
          />

          <LessonRow
            day="Day 13"
            title="Making plans"
            status="locked"
          />
        </div>

        <div className="mt-6 rounded-2xl bg-[#17135f] p-5 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <Flame size={18} />
            </div>

            <div>
              <p className="font-semibold">
                Keep your learning streak
              </p>

              <p className="mt-1 text-sm text-indigo-200">
                A little speaking every day adds up.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
 * =====================================================
 * HOW IT WORKS
 * =====================================================
 */

function HowItWorksSection() {
  return (
    <section className="border-y border-slate-100 bg-[#fbfbfe]">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="text-center">
          <SectionLabel>
            HOW IT WORKS
          </SectionLabel>

          <SectionHeading>
            From practice to progress
            <br />
            in three simple steps
          </SectionHeading>

          <p className="mt-5 text-base text-slate-600 sm:text-lg">
            Practice. Get feedback. Improve.
          </p>
        </div>

        <div className="mt-16 space-y-7">
          <StepCard
            number="1"
            label="STEP 1 — SPEAK"
            title="Answer naturally. Don't overthink it."
            description="Choose your lesson or speaking mode, tap the microphone and answer just like you would in a real conversation."
            bullets={[
              "Real-life speaking prompts",
              "Live browser transcription",
              "Simple microphone experience",
              "Works directly in your browser",
            ]}
            visual={<SpeakVisual />}
          />

          <StepCard
            number="2"
            label="STEP 2 — ANALYZE"
            title="AI turns your answer into useful feedback."
            description="Speakvera reviews what can be reliably understood from your transcript and gives practical guidance."
            bullets={[
              "Grammar scoring",
              "Vocabulary scoring",
              "Answer quality analysis",
              "Improved example answer",
            ]}
            visual={<FeedbackVisual />}
            reverse
          />

          <StepCard
            number="3"
            label="STEP 3 — IMPROVE"
            title="See your progress and keep going."
            description="Your practice becomes part of your learning journey, helping you continue from where you left off."
            bullets={[
              "Course progress",
              "Speaking history",
              "English level estimates",
              "Certificates when eligible",
            ]}
            visual={<ProgressVisual />}
          />
        </div>
      </div>
    </section>
  );
}

/*
 * =====================================================
 * IELTS
 * =====================================================
 */

function IELTSSection() {
  return (
    <section
      id="ielts"
      className="bg-white"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-24 sm:px-6 sm:py-32 lg:grid-cols-2 lg:px-8">
        <IELTSVisual />

        <div>
          <SectionLabel>
            IELTS SPEAKING
          </SectionLabel>

          <h2 className="mt-4 max-w-xl text-4xl font-semibold leading-[1.03] tracking-[-0.035em] text-[#171342] sm:text-5xl lg:text-6xl [font-family:Georgia,serif]">
            Practice IELTS without practicing alone.
          </h2>

          <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
            Prepare for IELTS Speaking Parts 1, 2 and 3 with
            realistic prompts, cue cards and AI-generated
            follow-up questions.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <MiniFeature
              icon={MessageCircle}
              title="Part 1"
              text="Short personal questions"
            />

            <MiniFeature
              icon={Clock3}
              title="Part 2"
              text="Cue-card speaking practice"
            />

            <MiniFeature
              icon={BrainCircuit}
              title="Part 3"
              text="Deeper follow-up discussion"
            />

            <MiniFeature
              icon={GraduationCap}
              title="Mock Test"
              text="Complete speaking flow"
            />
          </div>

          <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            Speakvera provides an AI-generated speaking estimate
            for practice. It is not an official IELTS score.
          </div>

          <Link
            href="/register"
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#17135f] px-6 font-semibold text-white transition hover:bg-[#242077]"
          >
            Practice IELTS

            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/*
 * =====================================================
 * ASSESSMENT
 * =====================================================
 */

function AssessmentSection() {
  return (
    <section className="bg-[#eef1ff]">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-24 sm:px-6 sm:py-32 lg:grid-cols-2 lg:px-8">
        <div>
          <SectionLabel>
            SPEAKING ASSESSMENT
          </SectionLabel>

          <h2 className="mt-4 max-w-xl text-4xl font-semibold leading-[1.03] tracking-[-0.035em] text-[#171342] sm:text-5xl lg:text-6xl [font-family:Georgia,serif]">
            Discover where your English stands.
          </h2>

          <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
            Answer adaptive speaking questions and receive an
            estimated Speakvera CEFR level from A1 to C2.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {[
              "A1",
              "A2",
              "B1",
              "B2",
              "C1",
              "C2",
            ].map((level) => (
              <span
                key={level}
                className="flex h-11 min-w-12 items-center justify-center rounded-xl border border-indigo-200 bg-white px-4 text-sm font-bold text-[#17135f]"
              >
                {level}
              </span>
            ))}
          </div>

          <Link
            href="/english-level-test"
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-6 font-semibold text-white transition hover:bg-blue-700"
          >
            Take free speaking test

            <ArrowRight size={17} />
          </Link>
        </div>

        <AssessmentVisual />
      </div>
    </section>
  );
}

/*
 * =====================================================
 * FEATURES
 * =====================================================
 */

function FeaturesSection() {
  const features = [
    {
      icon: Mic2,
      title:
        "Speaking-first learning",
      text:
        "Build confidence by actually speaking instead of only reading lessons.",
    },

    {
      icon: WandSparkles,
      title:
        "Instant AI feedback",
      text:
        "See grammar, vocabulary, answer quality and improved-answer suggestions.",
    },

    {
      icon: BookOpen,
      title:
        "Structured course",
      text:
        "Follow a clear 40-day Everyday English path from lesson to lesson.",
    },

    {
      icon: GraduationCap,
      title:
        "IELTS preparation",
      text:
        "Practice Parts 1, 2 and 3, cue cards and complete mock speaking tests.",
    },

    {
      icon: BarChart3,
      title:
        "Progress tracking",
      text:
        "Keep track of course progress, speaking activity, usage and estimated level.",
    },

    {
      icon: FileCheck2,
      title:
        "Certificates",
      text:
        "Eligible paid learners can claim verifiable Speakvera certificates.",
    },
  ];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel>
            EVERYTHING IN ONE PLACE
          </SectionLabel>

          <SectionHeading>
            Built for people who want
            to actually speak better.
          </SectionHeading>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(
            ({
              icon,
              title,
              text,
            }) => (
              <FeatureCard
                key={title}
                icon={icon}
                title={title}
                text={text}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}

/*
 * =====================================================
 * PRICING
 * =====================================================
 */

function PricingSection() {
  return (
    <section
      id="pricing"
      className="bg-[#fbfbfe]"
    >
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="text-center">
          <SectionLabel>
            SIMPLE PRICING
          </SectionLabel>

          <SectionHeading>
            Start free.
            <br />
            Upgrade when you need more.
          </SectionHeading>
        </div>

        <div className="mx-auto mt-14 grid max-w-6xl gap-5 lg:grid-cols-3">
          <PricingCard
            name="Free"
            price="$0"
            suffix="/ forever"
            description="A simple way to start practicing."
            features={[
              "5 speaking minutes per day",
              "First 5 Everyday English days",
              "Basic AI feedback",
              "Limited IELTS practice",
            ]}
            button="Start free"
            href="/register"
          />

          <PricingCard
            name="Pro"
            price="$6.99"
            suffix="/ month"
            description="For consistent English learners."
            features={[
              "Full 40-day course",
              "60 speaking minutes per day",
              "More AI feedback",
              "IELTS speaking practice",
              "Speaking assessments",
              "Certificates",
            ]}
            button="Start Pro"
            href="/register"
            featured
          />

          <PricingCard
            name="Premium"
            price="$12.99"
            suffix="/ month"
            description="For intensive daily practice."
            features={[
              "Everything in Pro",
              "180 speaking minutes per day",
              "Higher AI limits",
              "More IELTS attempts",
              "More assessment attempts",
              "Certificates",
            ]}
            button="Start Premium"
            href="/register"
            premium
          />
        </div>

        <p className="mt-7 text-center text-sm text-slate-500">
          Monthly and yearly billing options are available.
        </p>
      </div>
    </section>
  );
}

/*
 * =====================================================
 * FINAL CTA
 * =====================================================
 */

function FinalCTA() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-[#17135f] px-6 py-16 text-center text-white sm:rounded-[40px] sm:px-12 sm:py-20">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
          <Mic2 size={25} />
        </div>

        <h2 className="mx-auto mt-7 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-[-0.035em] sm:text-5xl lg:text-6xl [font-family:Georgia,serif]">
          Your next English conversation
          can be better than your last.
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-indigo-100 sm:text-lg">
          Start practicing today and turn English speaking
          into a habit.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/register"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-7 font-semibold text-[#17135f] transition hover:bg-indigo-50"
          >
            Start learning free

            <ArrowRight size={17} />
          </Link>

          <Link
            href="/login"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 px-7 font-semibold text-white transition hover:bg-white/10"
          >
            Log in
          </Link>
        </div>
      </div>
    </section>
  );
}

/*
 * =====================================================
 * FOOTER
 * =====================================================
 */

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="flex items-center gap-2"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#17135f] text-white">
                <Mic2 size={18} />
              </span>

              <span className="text-lg font-bold text-[#171342]">
                Speakvera{" "}
                <span className="text-blue-600">
                  AI
                </span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">
              Practice English. Get instant AI feedback.
              Speak with confidence.
            </p>
          </div>

          <FooterColumn
            title="Learn"
            links={[
              {
                text:
                  "Everyday English",
                href:
                  "/register",
              },
              {
                text:
                  "IELTS Speaking",
                href:
                  "/register",
              },
              {
                text:
                  "Speaking Test",
                href:
                  "/english-level-test",
              },
            ]}
          />

          <FooterColumn
            title="Account"
            links={[
              {
                text:
                  "Create account",
                href:
                  "/register",
              },
              {
                text:
                  "Log in",
                href:
                  "/login",
              },
              {
                text:
                  "Pricing",
                href:
                  "#pricing",
              },
            ]}
          />

          <FooterColumn
            title="Speakvera"
            links={[
              {
                text:
                  "Home",
                href:
                  "/",
              },
              {
                text:
                  "How it works",
                href:
                  "#how-it-works",
              },
              {
                text:
                  "IELTS",
                href:
                  "#ielts",
              },
            ]}
          />
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 Speakvera AI. All rights reserved.
          </p>

          <p>
            AI-generated language estimates are for learning
            guidance only.
          </p>
        </div>
      </div>
    </footer>
  );
}

/*
 * =====================================================
 * REUSABLE SECTION UI
 * =====================================================
 */

function SectionLabel({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-blue-600">
      {children}
    </p>
  );
}

function SectionHeading({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <h2 className="mx-auto mt-4 max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.035em] text-[#171342] sm:text-5xl lg:text-6xl [font-family:Georgia,serif]">
      {children}
    </h2>
  );
}

function ScoreBox({
  value,
  label,
}: {
  value:
    string;

  label:
    string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 text-center sm:p-4">
      <p className="text-lg font-bold text-[#171342] sm:text-xl">
        {value}
      </p>

      <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
        {label}
      </p>
    </div>
  );
}

function SmallPill({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
      {children}
    </span>
  );
}

function FlowCard({
  icon: Icon,
  text,
}: {
  icon:
    LucideIcon;

  text:
    string;
}) {
  return (
    <div className="mb-3 flex min-h-14 items-center gap-3 rounded-xl border border-indigo-100 bg-white px-4 shadow-sm">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-[#17135f]">
        <Icon size={15} />
      </div>

      <p className="text-sm font-medium text-[#171342]">
        {text}
      </p>
    </div>
  );
}

function FeatureLine({
  text,
}: {
  text:
    string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
        <Check size={12} strokeWidth={3} />
      </span>

      <p className="text-sm leading-6 text-slate-700 sm:text-base">
        {text}
      </p>
    </div>
  );
}

/*
 * =====================================================
 * LESSON ROW
 * =====================================================
 */

function LessonRow({
  day,
  title,
  status,
}: {
  day:
    string;

  title:
    string;

  status:
    "done"
    | "current"
    | "locked";
}) {
  return (
    <div
      className={`flex items-center gap-4 rounded-2xl border p-4 ${
        status ===
        "current"
          ? "border-blue-200 bg-blue-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          status ===
          "done"
            ? "bg-emerald-50 text-emerald-600"
            : status ===
                "current"
              ? "bg-blue-600 text-white"
              : "bg-slate-100 text-slate-400"
        }`}
      >
        {status ===
        "done" ? (
          <Check
            size={17}
          />
        ) : (
          <BookOpen
            size={17}
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-slate-400">
          {day}
        </p>

        <p className="mt-1 truncate text-sm font-semibold text-[#171342]">
          {title}
        </p>
      </div>

      {status ===
        "current" && (
        <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
          Continue
        </span>
      )}
    </div>
  );
}

/*
 * =====================================================
 * STEP CARD
 * =====================================================
 */

function StepCard({
  number,
  label,
  title,
  description,
  bullets,
  visual,
  reverse = false,
}: {
  number:
    string;

  label:
    string;

  title:
    string;

  description:
    string;

  bullets:
    string[];

  visual:
    React.ReactNode;

  reverse?:
    boolean;
}) {
  return (
    <div className="relative mx-auto max-w-6xl">
      <div className="absolute -left-3 top-5 z-10 hidden h-14 w-14 items-center justify-center rounded-full bg-[#17135f] text-lg font-bold text-white lg:flex">
        {number}
      </div>

      <div className="grid overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(25,20,90,0.06)] lg:grid-cols-2">
        <div
          className={`p-7 sm:p-10 lg:p-12 ${
            reverse
              ? "lg:order-2"
              : ""
          }`}
        >
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
            {label}
          </p>

          <h3 className="mt-4 text-3xl font-semibold leading-tight text-[#171342] [font-family:Georgia,serif]">
            {title}
          </h3>

          <p className="mt-4 leading-7 text-slate-600">
            {description}
          </p>

          <div className="mt-6 space-y-3">
            {bullets.map(
              (
                bullet
              ) => (
                <FeatureLine
                  key={
                    bullet
                  }
                  text={
                    bullet
                  }
                />
              )
            )}
          </div>
        </div>

        <div
          className={`border-t border-slate-200 bg-[#f2f4ff] p-6 sm:p-9 lg:border-t-0 ${
            reverse
              ? "lg:order-1 lg:border-r"
              : "lg:border-l"
          }`}
        >
          <div className="flex h-full min-h-[340px] items-center justify-center">
            {visual}
          </div>
        </div>
      </div>
    </div>
  );
}

/*
 * =====================================================
 * STEP VISUALS
 * =====================================================
 */

function SpeakVisual() {
  return (
    <div className="w-full max-w-sm rounded-[26px] border border-indigo-100 bg-white p-6 shadow-lg">
      <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
        Speaking prompt
      </p>

      <h4 className="mt-3 text-xl font-bold leading-7 text-[#171342]">
        What do you usually do on weekends?
      </h4>

      <div className="my-8 flex justify-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl shadow-blue-600/20">
          <Mic2 size={32} />
        </div>
      </div>

      <div className="rounded-2xl bg-slate-50 p-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />

          <span className="text-xs font-semibold text-slate-500">
            Listening...
          </span>
        </div>

        <p className="mt-3 text-sm leading-6 text-slate-700">
          On weekends I usually spend time with my family...
        </p>
      </div>
    </div>
  );
}

function FeedbackVisual() {
  return (
    <div className="w-full max-w-sm rounded-[26px] border border-indigo-100 bg-white p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Your feedback
          </p>

          <h4 className="mt-2 text-xl font-bold text-[#171342]">
            Nice work
          </h4>
        </div>

        <Sparkles className="text-blue-600" />
      </div>

      <div className="mt-6 space-y-3">
        <FeedbackRow
          label="Grammar"
          value={84}
        />

        <FeedbackRow
          label="Vocabulary"
          value={79}
        />

        <FeedbackRow
          label="Answer quality"
          value={83}
        />
      </div>

      <div className="mt-6 rounded-2xl bg-blue-50 p-4">
        <p className="text-xs font-bold text-blue-600">
          TRY THIS
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-700">
          Add one more detail to make your answer sound more
          natural and complete.
        </p>
      </div>
    </div>
  );
}

function ProgressVisual() {
  return (
    <div className="w-full max-w-sm rounded-[26px] border border-indigo-100 bg-white p-6 shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Your progress
          </p>

          <h4 className="mt-2 text-xl font-bold text-[#171342]">
            Keep moving forward
          </h4>
        </div>

        <Trophy className="text-amber-500" />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <DashboardMini
          value="B1"
          label="Current level"
        />

        <DashboardMini
          value="12"
          label="Lessons done"
        />

        <DashboardMini
          value="6 days"
          label="Current streak"
        />

        <DashboardMini
          value="82"
          label="Avg. score"
        />
      </div>
    </div>
  );
}

/*
 * =====================================================
 * IELTS VISUAL
 * =====================================================
 */

function IELTSVisual() {
  return (
    <div className="rounded-[34px] bg-[#f2f1ff] p-4 sm:p-8">
      <div className="rounded-[28px] border border-indigo-100 bg-white p-6 shadow-xl shadow-indigo-950/5 sm:p-8">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-[#17135f] px-3 py-1.5 text-xs font-bold text-white">
            IELTS PART 2
          </span>

          <GraduationCap className="text-blue-600" />
        </div>

        <p className="mt-7 text-xs font-bold uppercase tracking-wider text-slate-400">
          Cue card
        </p>

        <h3 className="mt-3 text-2xl font-bold leading-8 text-[#171342]">
          Describe a place you would like to visit in the
          future.
        </h3>

        <div className="mt-6 rounded-2xl bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-700">
            You should say:
          </p>

          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>• where the place is</li>
            <li>• why you want to visit it</li>
            <li>• who you would go with</li>
            <li>• how you would feel there</li>
          </ul>
        </div>

        <div className="mt-6 flex items-center justify-between rounded-2xl bg-blue-600 p-4 text-white">
          <div className="flex items-center gap-3">
            <Clock3 size={20} />

            <div>
              <p className="text-xs text-blue-100">
                Speaking time
              </p>

              <p className="font-bold">
                02:00
              </p>
            </div>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-blue-600">
            <Mic2 size={20} />
          </div>
        </div>
      </div>
    </div>
  );
}

/*
 * =====================================================
 * ASSESSMENT VISUAL
 * =====================================================
 */

function AssessmentVisual() {
  return (
    <div className="rounded-[34px] bg-white/60 p-3 sm:p-6">
      <div className="rounded-[28px] border border-indigo-100 bg-white p-6 shadow-xl shadow-indigo-950/5 sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Speaking Assessment
            </p>

            <h3 className="mt-2 text-2xl font-bold text-[#171342]">
              Your estimated level
            </h3>
          </div>

          <Target className="text-blue-600" />
        </div>

        <div className="mt-8 flex justify-center">
          <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full border-[12px] border-blue-100 bg-blue-600 text-white shadow-lg">
            <span className="text-4xl font-bold">
              B1
            </span>

            <span className="mt-1 text-xs text-blue-100">
              Intermediate
            </span>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <FeedbackRow
            label="Grammar"
            value={72}
          />

          <FeedbackRow
            label="Vocabulary"
            value={76}
          />

          <FeedbackRow
            label="Communication"
            value={79}
          />
        </div>

        <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2
              className="mt-0.5 shrink-0 text-emerald-600"
              size={18}
            />

            <p className="text-sm leading-6 text-emerald-900">
              You can communicate clearly in many everyday
              situations. Keep practicing longer answers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
 * =====================================================
 * SMALL VISUAL COMPONENTS
 * =====================================================
 */

function FeedbackRow({
  label,
  value,
}: {
  label:
    string;

  value:
    number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-600">
          {label}
        </span>

        <span className="font-bold text-[#171342]">
          {value}/100
        </span>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-blue-600"
          style={{
            width:
              `${value}%`,
          }}
        />
      </div>
    </div>
  );
}

function DashboardMini({
  value,
  label,
}: {
  value:
    string;

  label:
    string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xl font-bold text-[#171342]">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {label}
      </p>
    </div>
  );
}

/*
 * =====================================================
 * MINI FEATURE
 * =====================================================
 */

function MiniFeature({
  icon: Icon,
  title,
  text,
}: {
  icon:
    LucideIcon;

  title:
    string;

  text:
    string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icon size={17} />
      </div>

      <h3 className="mt-3 font-bold text-[#171342]">
        {title}
      </h3>

      <p className="mt-1 text-sm leading-5 text-slate-500">
        {text}
      </p>
    </div>
  );
}

/*
 * =====================================================
 * FEATURE CARD
 * =====================================================
 */

function FeatureCard({
  icon: Icon,
  title,
  text,
}: {
  icon:
    LucideIcon;

  title:
    string;

  text:
    string;
}) {
  return (
    <article className="group rounded-[26px] border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-950/5 sm:p-7">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0f2ff] text-[#17135f] transition group-hover:bg-[#17135f] group-hover:text-white">
        <Icon size={21} />
      </div>

      <h3 className="mt-5 text-xl font-bold text-[#171342]">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-slate-600">
        {text}
      </p>
    </article>
  );
}

/*
 * =====================================================
 * PRICING CARD
 * =====================================================
 */

function PricingCard({
  name,
  price,
  suffix,
  description,
  features,
  button,
  href,
  featured = false,
  premium = false,
}: {
  name:
    string;

  price:
    string;

  suffix:
    string;

  description:
    string;

  features:
    string[];

  button:
    string;

  href:
    string;

  featured?:
    boolean;

  premium?:
    boolean;
}) {
  return (
    <article
      className={`relative rounded-[30px] border p-6 sm:p-8 ${
        featured
          ? "border-[#17135f] bg-[#17135f] text-white shadow-2xl shadow-indigo-950/15"
          : "border-slate-200 bg-white"
      }`}
    >
      {featured && (
        <span className="absolute right-6 top-6 rounded-full bg-blue-500 px-3 py-1 text-xs font-bold text-white">
          Popular
        </span>
      )}

      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${
          featured
            ? "bg-white/10"
            : premium
              ? "bg-amber-50 text-amber-600"
              : "bg-blue-50 text-blue-600"
        }`}
      >
        {premium ? (
          <Crown size={19} />
        ) : featured ? (
          <Sparkles size={19} />
        ) : (
          <ShieldCheck size={19} />
        )}
      </div>

      <h3 className="mt-5 text-xl font-bold">
        {name}
      </h3>

      <p
        className={`mt-2 text-sm ${
          featured
            ? "text-indigo-200"
            : "text-slate-500"
        }`}
      >
        {description}
      </p>

      <div className="mt-7 flex items-end gap-1">
        <span className="text-4xl font-bold tracking-tight">
          {price}
        </span>

        <span
          className={`pb-1 text-sm ${
            featured
              ? "text-indigo-200"
              : "text-slate-500"
          }`}
        >
          {suffix}
        </span>
      </div>

      <div className="mt-7 space-y-3">
        {features.map(
          (
            feature
          ) => (
            <div
              key={
                feature
              }
              className="flex items-start gap-3"
            >
              <Check
                size={16}
                className={`mt-0.5 shrink-0 ${
                  featured
                    ? "text-blue-300"
                    : "text-blue-600"
                }`}
              />

              <span
                className={`text-sm leading-6 ${
                  featured
                    ? "text-indigo-100"
                    : "text-slate-600"
                }`}
              >
                {feature}
              </span>
            </div>
          )
        )}
      </div>

      <Link
        href={href}
        className={`mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full font-semibold transition ${
          featured
            ? "bg-white text-[#17135f] hover:bg-indigo-50"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {button}

        <ArrowRight size={16} />
      </Link>
    </article>
  );
}

/*
 * =====================================================
 * FOOTER COLUMN
 * =====================================================
 */

function FooterColumn({
  title,
  links,
}: {
  title:
    string;

  links: {
    text:
      string;

    href:
      string;
  }[];
}) {
  return (
    <div>
      <p className="text-sm font-bold text-[#171342]">
        {title}
      </p>

      <div className="mt-4 space-y-3">
        {links.map(
          (
            link
          ) => (
            <Link
              key={
                link.text
              }
              href={
                link.href
              }
              className="flex items-center gap-1 text-sm text-slate-500 transition hover:text-blue-600"
            >
              {
                link.text
              }

              <ChevronRight
                size={
                  12
                }
              />
            </Link>
          )
        )}
      </div>
    </div>
  );
}