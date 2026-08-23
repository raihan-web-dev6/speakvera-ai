"use client";

import Link from "next/link";

import {
  ArrowRight,
  BookOpen,
  Crown,
  Flame,
  Loader2,
  MessageCircle,
  Mic2,
  Settings2,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import StatCard from "@/components/dashboard/StatCard";

import UsageBanner from "@/components/usage/UsageBanner";

type DashboardData = {
  currentLevel:
    string;

  assessmentScore:
    number | null;

  streak:
    number;

  xp:
    number;

  completedLessons:
    number;

  totalLessons:
    number;

  courseProgress:
    number;

  nextLessonDay:
    number;

  courseCompleted:
    boolean;

  speakingAttempts:
    number;

  totalSpeakingMinutes:
    number;

  averageSpeakingScore:
    number;

  plan:
    | "FREE"
    | "PRO"
    | "PREMIUM";

  user: {
    name:
      string;
  };
};

export default function DashboardOverview() {
  const [
    data,
    setData,
  ] =
    useState<DashboardData | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(
          true
        );

        setError(
          ""
        );

        const response =
          await fetch(
            "/api/dashboard/summary",
            {
              cache:
                "no-store",
            }
          );

        const result =
          await response.json();

        if (
          !response.ok
        ) {
          throw new Error(
            result.message ||
              "Could not load dashboard."
          );
        }

        setData(
          result
        );
      } catch (error) {
        console.error(
          "Dashboard error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Could not load dashboard."
        );
      } finally {
        setLoading(
          false
        );
      }
    }

    load();
  }, []);

  /*
   * ==========================================
   * LOADING
   * ==========================================
   */

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2
            size={30}
            className="animate-spin text-blue-600"
          />

          <p className="text-sm text-slate-500">
            Loading your progress...
          </p>
        </div>
      </div>
    );
  }

  /*
   * ==========================================
   * ERROR
   * ==========================================
   */

  if (
    !data ||
    error
  ) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-xl font-bold text-slate-950">
          Could not load your dashboard
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          {error ||
            "Please refresh and try again."}
        </p>

        <button
          type="button"
          onClick={() =>
            window.location.reload()
          }
          className="mt-5 min-h-11 rounded-xl bg-blue-600 px-5 font-semibold text-white"
        >
          Try again
        </button>
      </div>
    );
  }

  const levelDescription =
    data.currentLevel ===
    "—"
      ? "Complete your speaking assessment"
      : data.assessmentScore !==
          null
        ? `${data.assessmentScore}/100 assessment score`
        : "Estimated English level";

  const courseHref =
    data.courseCompleted
      ? "/everyday-english/final-assessment"
      : `/everyday-english/course/${data.nextLessonDay}`;

  const courseAction =
    data.courseCompleted
      ? "Take final assessment"
      : `Continue Day ${data.nextLessonDay}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* ==========================================
          HEADER
      ========================================== */}

      <section className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            Welcome back
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            {data.user.name}
          </h1>

          <p className="mt-3 max-w-xl text-slate-600">
            Keep practicing and build your English confidence every day.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <PlanBadge
            plan={
              data.plan
            }
          />

          {data.plan !==
            "FREE" && (
            <Link
              href="/billing/manage"
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <Settings2
                size={16}
              />

              Manage plan
            </Link>
          )}
        </div>
      </section>

      {/* ==========================================
          MAIN STATS
      ========================================== */}

      <section className="mt-8 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          title="Current level"
          value={
            data.currentLevel
          }
          description={
            levelDescription
          }
          icon={Star}
        />

        <StatCard
          title="Learning streak"
          value={`${data.streak} ${
            data.streak ===
            1
              ? "day"
              : "days"
          }`}
          description="Keep your streak going"
          icon={Flame}
        />

        <StatCard
          title="XP earned"
          value={`${data.xp}`}
          description="Speakvera learning XP"
          icon={Trophy}
        />

        <StatCard
          title="Course progress"
          value={`${data.courseProgress}%`}
          description={`${data.completedLessons}/${data.totalLessons} lessons`}
          icon={BookOpen}
        />
      </section>

      {/* ==========================================
          COURSE PROGRESS
      ========================================== */}

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen
                size={19}
                className="text-blue-600"
              />

              <p className="font-bold text-slate-950">
                Everyday English
              </p>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              {data.courseCompleted
                ? "You completed all 40 lessons. Your final assessment is ready."
                : `${data.completedLessons} of ${data.totalLessons} lessons completed.`}
            </p>
          </div>

          <p className="text-sm font-bold text-blue-600">
            {data.courseProgress}%
          </p>
        </div>

        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-500"
            style={{
              width: `${Math.min(
                Math.max(
                  data.courseProgress,
                  0
                ),
                100
              )}%`,
            }}
          />
        </div>

        <Link
          href={
            courseHref
          }
          className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          {courseAction}

          <ArrowRight
            size={16}
          />
        </Link>
      </section>

      {/* ==========================================
          DAILY USAGE
      ========================================== */}

      <div className="mt-6">
        <UsageBanner />
      </div>

      {/* ==========================================
          QUICK ACTIONS
      ========================================== */}

      <section className="mt-8">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-950">
            Continue learning
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Choose what you want to practice next.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <QuickAction
            title="Everyday English"
            description={
              data.courseCompleted
                ? "Take your final course assessment"
                : `Continue with Day ${data.nextLessonDay}`
            }
            href={
              courseHref
            }
            icon={BookOpen}
          />

          <QuickAction
            title="IELTS Speaking"
            description="Practice Parts 1, 2 and 3 with AI feedback"
            href="/ielts"
            icon={
              MessageCircle
            }
          />

          <QuickAction
            title="Speaking Assessment"
            description={
              data.currentLevel ===
              "—"
                ? "Discover your estimated English level"
                : `Current estimated level: ${data.currentLevel}`
            }
            href="/speaking-assessment"
            icon={Mic2}
          />
        </div>
      </section>

      {/* ==========================================
          SPEAKING STATS
      ========================================== */}

      <section className="mt-8">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-950">
            Speaking activity
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your progress across Speakvera speaking practice.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <MiniStat
            value={`${data.speakingAttempts}`}
            label="Speaking attempts"
          />

          <MiniStat
            value={`${data.totalSpeakingMinutes} min`}
            label="Total speaking"
          />

          <MiniStat
            value={
              data.speakingAttempts >
              0
                ? `${data.averageSpeakingScore}/100`
                : "—"
            }
            label="Average speaking score"
          />
        </div>
      </section>

      {/* ==========================================
          FREE UPGRADE
      ========================================== */}

      {data.plan ===
        "FREE" && (
        <section className="mt-8 overflow-hidden rounded-3xl bg-slate-950 p-6 text-white sm:p-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-blue-400">
              <Sparkles
                size={17}
              />

              <p className="text-sm font-semibold">
                Speakvera Pro
              </p>
            </div>

            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              Unlock the complete learning experience
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-slate-300">
              Access the full 40-day course, more AI speaking practice, IELTS preparation, assessments and certificates.
            </p>

            <Link
              href="/pricing"
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 font-semibold transition hover:bg-blue-500"
            >
              View plans

              <ArrowRight
                size={17}
              />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

/*
 * =====================================================
 * PLAN BADGE
 * =====================================================
 */

function PlanBadge({
  plan,
}: {
  plan:
    | "FREE"
    | "PRO"
    | "PREMIUM";
}) {
  if (
    plan ===
    "PREMIUM"
  ) {
    return (
      <div className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-amber-50 px-4 text-sm font-bold text-amber-700">
        <Crown
          size={16}
        />

        Premium
      </div>
    );
  }

  if (
    plan ===
    "PRO"
  ) {
    return (
      <div className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-blue-50 px-4 text-sm font-bold text-blue-700">
        <Sparkles
          size={16}
        />

        Pro
      </div>
    );
  }

  return (
    <div className="inline-flex min-h-10 items-center rounded-xl bg-slate-100 px-4 text-sm font-semibold text-slate-600">
      Free plan
    </div>
  );
}

/*
 * =====================================================
 * QUICK ACTION
 * =====================================================
 */

function QuickAction({
  title,
  description,
  href,
  icon: Icon,
}: {
  title:
    string;

  description:
    string;

  href:
    string;

  icon:
    typeof BookOpen;
}) {
  return (
    <Link
      href={
        href
      }
      className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        <Icon
          size={22}
        />
      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-950">
        {title}
      </h3>

      <p className="mt-2 min-h-10 text-sm leading-5 text-slate-500">
        {description}
      </p>

      <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-600">
        Open

        <ArrowRight
          size={15}
          className="transition group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
}

/*
 * =====================================================
 * MINI STAT
 * =====================================================
 */

function MiniStat({
  value,
  label,
}: {
  value:
    string;

  label:
    string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-2xl font-bold text-slate-950 sm:text-3xl">
        {value}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        {label}
      </p>
    </div>
  );
}