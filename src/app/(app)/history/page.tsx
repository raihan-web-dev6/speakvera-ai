"use client";

import {
  Loader2,
  MessageCircle,
} from "lucide-react";

import { useEffect, useState } from "react";

import SpeakingHistoryCard from "@/components/history/SpeakingHistoryCard";

type Attempt = {
  _id: string;

  courseType:
    | "EVERYDAY_ENGLISH"
    | "IELTS"
    | "ASSESSMENT";

  lessonDay?: number;

  question: string;
  transcript: string;

  overallScore: number;
  grammarScore: number;
  vocabularyScore: number;
  fluencyScore: number;
  pronunciationScore: number;

  createdAt: string;
};

export default function HistoryPage() {
  const [attempts, setAttempts] =
    useState<Attempt[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadHistory() {
      try {
        const response = await fetch(
          "/api/history/speaking?limit=50",
          {
            cache: "no-store",
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Could not load history"
          );
        }

        setAttempts(
          data.attempts || []
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

    loadHistory();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <section>
          <p className="text-sm font-semibold text-blue-600">
            Practice History
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Your speaking journey
          </h1>

          <p className="mt-3 text-slate-600">
            Review your previous answers and see how your English is improving.
          </p>
        </section>

        {loading && (
          <div className="flex min-h-72 items-center justify-center">
            <Loader2
              size={26}
              className="animate-spin text-blue-600"
            />
          </div>
        )}

        {error && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          attempts.length === 0 && (
            <div className="mt-10 flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <MessageCircle size={24} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-950">
                No speaking history yet
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Complete your first AI speaking exercise and it will appear here.
              </p>

              <a
                href="/everyday-english/course/1"
                className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
              >
                Start speaking
              </a>
            </div>
          )}

        {attempts.length > 0 && (
          <div className="mt-8 space-y-4">
            {attempts.map(
              (attempt) => (
                <SpeakingHistoryCard
                  key={attempt._id}
                  attempt={attempt}
                />
              )
            )}
          </div>
        )}
      </div>
    </main>
  );
}