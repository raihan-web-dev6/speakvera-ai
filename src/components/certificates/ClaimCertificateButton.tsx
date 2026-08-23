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

type CertificateType =
  | "EVERYDAY_ENGLISH"
  | "SPEAKING_ASSESSMENT";

type Props = {
  type:
    CertificateType;

  sourceId:
    string;

  label?: string;
};

export default function ClaimCertificateButton({
  type,
  sourceId,
  label = "Get certificate",
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

  async function handleClaim() {
    if (loading) {
      return;
    }

    try {
      setLoading(
        true
      );

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

      if (
        !data.certificateId
      ) {
        throw new Error(
          "Certificate ID was not returned"
        );
      }

      /*
       * Works for both:
       *
       * - newly generated certificate
       * - already existing certificate
       */

      router.push(
        `/certificates/${data.certificateId}`
      );

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not generate certificate"
      );
    } finally {
      setLoading(
        false
      );
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={
          handleClaim
        }
        disabled={
          loading
        }
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2
              size={18}
              className="animate-spin"
            />

            Generating...
          </>
        ) : (
          <>
            <Award
              size={18}
            />

            {label}
          </>
        )}
      </button>

      {error && (
        <p className="mt-3 max-w-md text-sm leading-6 text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}