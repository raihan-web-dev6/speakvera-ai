"use client";

import {
  Award,
  Loader2,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import {
  useState,
} from "react";

type Props = {
  type:
    | "EVERYDAY_ENGLISH"
    | "SPEAKING_ASSESSMENT";

  sourceId?: string;
};

export default function CertificateClaimButton({
  type,
  sourceId,
}: Props) {
  const router =
    useRouter();

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

  async function claim() {
    try {
      setLoading(true);

      setError("");

      const response =
        await fetch(
          "/api/certificates/generate",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                type,

                sourceId,
              }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Could not generate certificate"
        );
      }

      router.push(
        `/certificates/${data.certificateId}`
      );

      router.refresh();
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
    <div>
      <button
        onClick={claim}
        disabled={loading}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {loading ? (
          <Loader2
            size={17}
            className="animate-spin"
          />
        ) : (
          <Award size={17} />
        )}

        Claim certificate
      </button>

      {error && (
        <p className="mt-2 max-w-sm text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}