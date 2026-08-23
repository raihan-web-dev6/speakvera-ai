"use client";

import {
  BookOpen,
  Loader2,
  MessageCircle,
  Sparkles,
  Trophy,
} from "lucide-react";

import { useEffect, useState } from "react";

import SkillProgressBar from "@/components/progress/SkillProgressBar";
import SpeakingProgressChart from "@/components/progress/SpeakingProgressChart";
import UsageBanner from "@/components/usage/UsageBanner";

type Stats = {
  grammar: number;
  vocabulary: number;
  fluency: number;
  pronunciation: number;
  overall: number;

  speakingAttempts: number;
  completedLessons: number;
  courseProgress: number;
};

type Attempt = {
  _id: string;
  grammarScore: number;
  vocabularyScore: number;
  fluencyScore: number;
  pronunciationScore: number;
  createdAt: string;
};

export default function ProgressPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProgress() {
      try {
        const [
          statsResponse,
          historyResponse,
        ] = await Promise.all([
          fetch("/api/progress/stats", {
            cache: "no-store",
          }),

          fetch(
            "/api/history/speaking?limit=15",
            {
              cache: "no-store",
            }
          ),
        ]);

        if (statsResponse.ok) {
          const statsData =
            await statsResponse.json();

          setStats(statsData);
        }

        if (historyResponse.ok) {
          const historyData =
            await historyResponse.json();

          setAttempts(
            historyData.attempts || []
          );
        }
      } catch (error) {
        console.error(
          "Progress loading error:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadProgress();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2
          size={28}
          className="animate-spin text-blue-600"
        />
      </main>
    );
  }

  const chartData = [...attempts]
    .reverse()
    .map((attempt) => ({
      date: new Date(
        attempt.createdAt
      ).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),

      grammar:
        attempt.grammarScore || 0,

      vocabulary:
        attempt.vocabularyScore || 0,

      fluency:
        attempt.fluencyScore || 0,

      pronunciation:
        attempt.pronunciationScore ||
        0,
    }));

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section>
          <p className="text-sm font-semibold text-blue-600">
            Your Progress
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            See how your English is improving
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Track your speaking scores, course completion and daily practice.
          </p>
        </section>

        <div className="mt-8">
          <UsageBanner />
        </div>

        <section className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <SummaryCard
            title="Overall"
            value={`${stats?.overall || 0}/100`}
            icon={Sparkles}
          />

          <SummaryCard
            title="Speaking attempts"
            value={`${stats?.speakingAttempts || 0}`}
            icon={MessageCircle}
          />

          <SummaryCard
            title="Lessons completed"
            value={`${stats?.completedLessons || 0}/40`}
            icon={BookOpen}
          />

          <SummaryCard
            title="Course progress"
            value={`${stats?.courseProgress || 0}%`}
            icon={Trophy}
          />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-bold text-slate-950">
              Skill scores
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Your average scores across speaking sessions.
            </p>

            <div className="mt-7 space-y-6">
              <SkillProgressBar
                name="Grammar"
                score={stats?.grammar || 0}
              />

              <SkillProgressBar
                name="Vocabulary"
                score={stats?.vocabulary || 0}
              />

              <SkillProgressBar
                name="Fluency"
                score={stats?.fluency || 0}
              />

              <SkillProgressBar
                name="Pronunciation"
                score={
                  stats?.pronunciation || 0
                }
              />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="text-xl font-bold text-slate-950">
              Speaking improvement
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Your recent English speaking scores.
            </p>

            <div className="mt-6">
              <SpeakingProgressChart
                data={chartData}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function SummaryCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: typeof Trophy;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icon size={19} />
      </div>

      <p className="mt-4 text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold text-slate-950">
        {value}
      </p>
    </div>
  );
}