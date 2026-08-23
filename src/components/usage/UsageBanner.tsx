"use client";

import Link from "next/link";

import {
  Clock3,
  Loader2,
  Sparkles,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

type UsageResponse = {
  plan:
    | "FREE"
    | "PRO"
    | "PREMIUM";

  usage: {
    speakingSeconds:
      number;

    aiRequests:
      number;

    ieltsAttempts:
      number;

    assessmentAttempts:
      number;
  };

  limits: {
    speakingSecondsPerDay:
      number;

    aiRequestsPerDay:
      number;

    ieltsAttemptsPerDay:
      number;

    assessmentAttemptsPerDay:
      number;

    certificates:
      boolean;

    finalCourseAssessment:
      boolean;
  };

  remaining: {
    speakingSeconds:
      number;

    aiRequests:
      number;

    ieltsAttempts:
      number;

    assessmentAttempts:
      number;
  };

  speakingMinutes: {
    used: number;

    limit: number;

    remaining: number;
  };
};

export default function UsageBanner() {
  const [
    data,
    setData,
  ] =
    useState<UsageResponse | null>(
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
    let mounted =
      true;

    async function loadUsage() {
      try {
        const response =
          await fetch(
            "/api/user/usage",
            {
              cache:
                "no-store",
            }
          );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Could not load usage"
          );
        }

        if (mounted) {
          setData(
            result
          );
        }
      } catch (error) {
        if (mounted) {
          setError(
            error instanceof Error
              ? error.message
              : "Could not load usage"
          );
        }
      } finally {
        if (mounted) {
          setLoading(
            false
          );
        }
      }
    }

    loadUsage();

    return () => {
      mounted =
        false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-24 items-center justify-center rounded-2xl border border-slate-200 bg-white">
        <Loader2
          size={20}
          className="animate-spin text-blue-600"
        />
      </div>
    );
  }

  if (
    error ||
    !data
  ) {
    return null;
  }

  const {
    used,
    limit,
    remaining,
  } =
    data.speakingMinutes;

  const percentage =
    limit > 0
      ? Math.min(
          100,
          Math.round(
            (used /
              limit) *
              100
          )
        )
      : 0;

  const limitReached =
    data.remaining
      .speakingSeconds <=
    0;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Clock3
              size={18}
              className="text-blue-600"
            />

            <p className="font-bold text-slate-950">
              Daily speaking usage
            </p>

            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700">
              {
                data.plan
              }
            </span>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            {used} of{" "}
            {limit} speaking minutes used today
          </p>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{
                width: `${percentage}%`,
              }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
            <span>
              {remaining} min remaining
            </span>

            <span>
              {
                percentage
              }
              %
            </span>
          </div>
        </div>

        {data.plan ===
          "FREE" && (
          <Link
            href="/billing"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white"
          >
            <Sparkles
              size={16}
            />

            {limitReached
              ? "Upgrade to continue"
              : "Upgrade"}
          </Link>
        )}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 border-t border-slate-100 pt-5">
        <UsageStat
          title="AI"
          value={`${data.usage.aiRequests}/${data.limits.aiRequestsPerDay}`}
        />

        <UsageStat
          title="IELTS"
          value={`${data.usage.ieltsAttempts}/${data.limits.ieltsAttemptsPerDay}`}
        />

        <UsageStat
          title="Assessments"
          value={`${data.usage.assessmentAttempts}/${data.limits.assessmentAttemptsPerDay}`}
        />
      </div>
    </section>
  );
}

function UsageStat({
  title,
  value,
}: {
  title: string;

  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 text-center">
      <p className="font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-[11px] text-slate-500">
        {title}
      </p>
    </div>
  );
}