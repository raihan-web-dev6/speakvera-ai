"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("SPEAKVERA_ERROR:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <AlertTriangle size={30} />
        </div>

        <h1 className="mt-6 text-3xl font-bold text-slate-950">
          Something went wrong
        </h1>

        <p className="mt-3 leading-7 text-slate-600">
          Speakvera encountered an unexpected error.
          Please try again.
        </p>

        <button
          type="button"
          onClick={reset}
          className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 font-semibold text-white transition hover:bg-blue-700"
        >
          <RefreshCw size={18} />

          Try again
        </button>
      </div>
    </main>
  );
}