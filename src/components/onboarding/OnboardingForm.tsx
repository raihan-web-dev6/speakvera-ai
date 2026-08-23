"use client";

import {
  ArrowRight,
  Check,
  Loader2,
  Target,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

type Goal =
  | "EVERYDAY_ENGLISH"
  | "IELTS"
  | "PRONUNCIATION"
  | "FLUENCY"
  | "GRAMMAR"
  | "VOCABULARY"
  | "CONFIDENCE";

const goals: {
  value: Goal;

  title: string;

  description: string;
}[] = [
  {
    value:
      "EVERYDAY_ENGLISH",

    title:
      "Everyday English",

    description:
      "Speak naturally in daily situations.",
  },

  {
    value: "IELTS",

    title:
      "IELTS Speaking",

    description:
      "Prepare for IELTS speaking.",
  },

  {
    value:
      "PRONUNCIATION",

    title:
      "Pronunciation",

    description:
      "Speak more clearly.",
  },

  {
    value: "FLUENCY",

    title: "Fluency",

    description:
      "Reduce pauses and speak smoothly.",
  },

  {
    value: "GRAMMAR",

    title: "Grammar",

    description:
      "Use English more accurately.",
  },

  {
    value:
      "VOCABULARY",

    title:
      "Vocabulary",

    description:
      "Learn stronger words and phrases.",
  },

  {
    value:
      "CONFIDENCE",

    title:
      "Confidence",

    description:
      "Become more comfortable speaking.",
  },
];

export default function OnboardingForm() {
  const router =
    useRouter();

  const [
    selectedGoals,
    setSelectedGoals,
  ] =
    useState<Goal[]>([
      "EVERYDAY_ENGLISH",
    ]);

  const [
    learningTarget,
    setLearningTarget,
  ] =
    useState("B2");

  const [
    dailyGoalMinutes,
    setDailyGoalMinutes,
  ] =
    useState(20);

  const [
    preferredAccent,
    setPreferredAccent,
  ] =
    useState("NEUTRAL");

  const [
    nativeLanguage,
    setNativeLanguage,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  function toggleGoal(
    goal: Goal
  ) {
    setSelectedGoals(
      (previous) => {
        if (
          previous.includes(
            goal
          )
        ) {
          if (
            previous.length ===
            1
          ) {
            return previous;
          }

          return previous.filter(
            (item) =>
              item !== goal
          );
        }

        return [
          ...previous,
          goal,
        ];
      }
    );
  }

  async function handleSubmit() {
    try {
      setLoading(true);

      setError("");

      const response =
        await fetch(
          "/api/onboarding/preferences",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                goals:
                  selectedGoals,

                learningTarget,

                dailyGoalMinutes,

                preferredAccent,

                nativeLanguage:
                  nativeLanguage ||
                  undefined,
              }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Could not save preferences"
        );
      }

      router.push(
        "/placement-test"
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <section>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <Target
            size={23}
          />
        </div>

        <p className="mt-6 text-sm font-semibold text-blue-600">
          Step 1 of 2
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Personalize your learning
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-slate-600">
          Tell Speakvera what you want to improve. We&apos;ll use this to personalize your practice.
        </p>
      </section>

      <section className="mt-9">
        <h2 className="font-bold text-slate-950">
          What do you want to improve?
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Choose one or more goals.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {goals.map(
            (goal) => {
              const selected =
                selectedGoals.includes(
                  goal.value
                );

              return (
                <button
                  key={
                    goal.value
                  }
                  type="button"
                  onClick={() =>
                    toggleGoal(
                      goal.value
                    )
                  }
                  className={`relative rounded-2xl border p-5 text-left transition ${
                    selected
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  {selected && (
                    <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
                      <Check
                        size={14}
                      />
                    </div>
                  )}

                  <h3 className="font-bold text-slate-950">
                    {
                      goal.title
                    }
                  </h3>

                  <p className="mt-2 pr-5 text-sm leading-6 text-slate-500">
                    {
                      goal.description
                    }
                  </p>
                </button>
              );
            }
          )}
        </div>
      </section>

      <section className="mt-9 grid gap-5 md:grid-cols-2">
        <Field
          label="Target English level"
        >
          <select
            value={
              learningTarget
            }
            onChange={(
              event
            ) =>
              setLearningTarget(
                event.target
                  .value
              )
            }
            className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 outline-none focus:border-blue-500"
          >
            <option value="A1">
              A1 — Beginner
            </option>

            <option value="A2">
              A2 — Elementary
            </option>

            <option value="B1">
              B1 — Intermediate
            </option>

            <option value="B2">
              B2 — Upper Intermediate
            </option>

            <option value="C1">
              C1 — Advanced
            </option>

            <option value="C2">
              C2 — Proficient
            </option>
          </select>
        </Field>

        <Field label="Daily practice goal">
          <select
            value={
              dailyGoalMinutes
            }
            onChange={(
              event
            ) =>
              setDailyGoalMinutes(
                Number(
                  event.target
                    .value
                )
              )
            }
            className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 outline-none focus:border-blue-500"
          >
            <option value={10}>
              10 minutes
            </option>

            <option value={20}>
              20 minutes
            </option>

            <option value={30}>
              30 minutes
            </option>

            <option value={45}>
              45 minutes
            </option>

            <option value={60}>
              60 minutes
            </option>
          </select>
        </Field>

        <Field label="Preferred English accent">
          <select
            value={
              preferredAccent
            }
            onChange={(
              event
            ) =>
              setPreferredAccent(
                event.target
                  .value
              )
            }
            className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 outline-none focus:border-blue-500"
          >
            <option value="NEUTRAL">
              Neutral
            </option>

            <option value="AMERICAN">
              American English
            </option>

            <option value="BRITISH">
              British English
            </option>

            <option value="AUSTRALIAN">
              Australian English
            </option>
          </select>
        </Field>

        <Field label="Native language (optional)">
          <input
            value={
              nativeLanguage
            }
            onChange={(
              event
            ) =>
              setNativeLanguage(
                event.target
                  .value
              )
            }
            placeholder="e.g. Urdu"
            className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 outline-none focus:border-blue-500"
          />
        </Field>
      </section>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={
            handleSubmit
          }
          disabled={loading}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? (
            <Loader2
              size={18}
              className="animate-spin"
            />
          ) : (
            <>
              Continue to placement test

              <ArrowRight
                size={18}
              />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;

  children:
    React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      {children}
    </div>
  );
}