"use client";

import {
  ArrowRight,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  dayNumber: number;
  score?: number;
};

export default function LessonCompleteButton({
  dayNumber,
  score = 100,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState("");

  const handleComplete = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/course/progress", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          dayNumber,
          score,
          status: "COMPLETED",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not complete lesson"
        );
      }

      setCompleted(true);

      setTimeout(() => {
        if (dayNumber < 40) {
          router.push(
            `/everyday-english/course/${dayNumber + 1}`
          );
        } else {
          router.push(
            "/everyday-english/final-assessment"
          );
        }

        router.refresh();
      }, 700);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        disabled={loading || completed}
        onClick={handleComplete}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading && (
          <Loader2
            size={18}
            className="animate-spin"
          />
        )}

        {completed ? (
          <>
            <CheckCircle2 size={18} />
            Lesson completed
          </>
        ) : (
          <>
            Complete lesson
            <ArrowRight size={18} />
          </>
        )}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}