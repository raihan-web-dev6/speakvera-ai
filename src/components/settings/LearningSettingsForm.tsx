"use client";

import {
  Check,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

type Goal =
  | "EVERYDAY_ENGLISH"
  | "IELTS"
  | "PRONUNCIATION"
  | "FLUENCY"
  | "GRAMMAR"
  | "VOCABULARY"
  | "CONFIDENCE";

const goalOptions: {
  value: Goal;

  label: string;
}[] = [
  {
    value:
      "EVERYDAY_ENGLISH",

    label:
      "Everyday English",
  },

  {
    value: "IELTS",

    label:
      "IELTS Speaking",
  },

  {
    value:
      "PRONUNCIATION",

    label:
      "Pronunciation",
  },

  {
    value: "FLUENCY",

    label: "Fluency",
  },

  {
    value: "GRAMMAR",

    label: "Grammar",
  },

  {
    value:
      "VOCABULARY",

    label:
      "Vocabulary",
  },

  {
    value:
      "CONFIDENCE",

    label:
      "Confidence",
  },
];

export default function LearningSettingsForm() {
  const [
    goals,
    setGoals,
  ] =
    useState<Goal[]>([]);

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
    useState(true);

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    success,
    setSuccess,
  ] =
    useState("");

  const [
    error,
    setError,
  ] =
    useState("");

  useEffect(() => {
    async function load() {
      try {
        const response =
          await fetch(
            "/api/user/settings",
            {
              cache:
                "no-store",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message
          );
        }

        const preference =
          data.preference;

        setGoals(
          preference.goals ||
            []
        );

        setLearningTarget(
          preference.learningTarget ||
            "B2"
        );

        setDailyGoalMinutes(
          preference.dailyGoalMinutes ||
            20
        );

        setPreferredAccent(
          preference.preferredAccent ||
            "NEUTRAL"
        );

        setNativeLanguage(
          preference.nativeLanguage ||
            ""
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Could not load settings"
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  function toggleGoal(
    goal: Goal
  ) {
    setGoals(
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

  async function save() {
    try {
      setSaving(true);

      setSuccess("");

      setError("");

      const response =
        await fetch(
          "/api/user/settings",
          {
            method:
              "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                goals,

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
            "Could not update settings"
        );
      }

      setSuccess(
        "Learning settings updated."
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not save settings"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-72 items-center justify-center">
        <Loader2
          className="animate-spin text-blue-600"
        />
      </div>
    );
  }

  return (
    <section className="max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
      <h2 className="text-xl font-bold text-slate-950">
        Learning preferences
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        Speakvera will use these settings to personalize lessons and practice.
      </p>

      <div className="mt-7">
        <p className="text-sm font-semibold text-slate-700">
          Learning goals
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {goalOptions.map(
            (goal) => {
              const selected =
                goals.includes(
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
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${
                    selected
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 text-slate-600"
                  }`}
                >
                  {selected && (
                    <Check
                      size={14}
                    />
                  )}

                  {
                    goal.label
                  }
                </button>
              );
            }
          )}
        </div>
      </div>

      <div className="mt-7 grid gap-5 md:grid-cols-2">
        <Field label="Learning target">
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
            className="min-h-12 w-full rounded-xl border border-slate-200 px-4"
          >
            {[
              "A1",
              "A2",
              "B1",
              "B2",
              "C1",
              "C2",
            ].map(
              (level) => (
                <option
                  key={
                    level
                  }
                  value={
                    level
                  }
                >
                  {level}
                </option>
              )
            )}
          </select>
        </Field>

        <Field label="Daily goal">
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
            className="min-h-12 w-full rounded-xl border border-slate-200 px-4"
          >
            {[
              10,
              20,
              30,
              45,
              60,
            ].map(
              (minutes) => (
                <option
                  key={
                    minutes
                  }
                  value={
                    minutes
                  }
                >
                  {minutes} minutes
                </option>
              )
            )}
          </select>
        </Field>

        <Field label="Preferred accent">
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
            className="min-h-12 w-full rounded-xl border border-slate-200 px-4"
          >
            <option value="NEUTRAL">
              Neutral
            </option>

            <option value="AMERICAN">
              American
            </option>

            <option value="BRITISH">
              British
            </option>

            <option value="AUSTRALIAN">
              Australian
            </option>
          </select>
        </Field>

        <Field label="Native language">
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
            className="min-h-12 w-full rounded-xl border border-slate-200 px-4"
          />
        </Field>
      </div>

      {success && (
        <div className="mt-6 flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">
          <CheckCircle2
            size={17}
          />

          {success}
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={save}
        disabled={
          saving
        }
        className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 font-semibold text-white disabled:opacity-60"
      >
        {saving && (
          <Loader2
            size={17}
            className="animate-spin"
          />
        )}

        Save settings
      </button>
    </section>
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