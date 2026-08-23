"use client";

import {
  Loader2,
  Mic,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  useSpeech,
  type SpeechResult,
} from "@/hooks/useSpeech";

import type {
  SpeakingFeedback,
} from "@/schemas/feedback.schema";

import SpeakingFeedbackCard from "@/components/feedback/SpeakingFeedbackCard";

type Props = {
  question: string;
};

export default function AISpeakingPractice({
  question,
}: Props) {
  const {
    recognizeSpeech,

    listening,

    error:
      speechError,
  } =
    useSpeech();

  const [
    speechResult,
    setSpeechResult,
  ] =
    useState<SpeechResult | null>(
      null
    );

  const [
    feedback,
    setFeedback,
  ] =
    useState<SpeakingFeedback | null>(
      null
    );

  const [
    analyzing,
    setAnalyzing,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  async function startSpeaking() {
    try {
      setError("");

      setFeedback(
        null
      );

      const result =
        await recognizeSpeech();

      setSpeechResult(
        result
      );

      setAnalyzing(
        true
      );

      const response =
        await fetch(
          "/api/ai/feedback",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                question,

                transcript:
                  result.transcript,

                fluencyScore:
                  result.fluencyScore,

                wordsPerMinute:
                  result.wordsPerMinute,

                speechConfidence:
                  result.speechConfidence,
              }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Could not generate feedback"
        );
      }

      setFeedback(
        data.feedback
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Speaking practice failed"
      );
    } finally {
      setAnalyzing(
        false
      );
    }
  }

  function speakAgain() {
    setFeedback(
      null
    );

    setSpeechResult(
      null
    );

    setError("");
  }

  if (
    feedback &&
    speechResult
  ) {
    return (
      <SpeakingFeedbackCard
        feedback={feedback}
        deliveryScore={
          speechResult.fluencyScore
        }
        wordsPerMinute={
          speechResult.wordsPerMinute
        }
        speechConfidence={
          speechResult.speechConfidence
        }
        onSpeakAgain={
          speakAgain
        }
      />
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
      <p className="text-sm font-semibold text-blue-600">
        Speak with AI
      </p>

      <h2 className="mt-3 text-xl font-bold text-slate-950">
        {question}
      </h2>

      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
        Tap the microphone and answer naturally in English.
      </p>

      <button
        type="button"
        onClick={
          startSpeaking
        }
        disabled={
          listening ||
          analyzing
        }
        className="mx-auto mt-7 flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl shadow-blue-600/20 disabled:opacity-60"
      >
        {listening ||
        analyzing ? (
          <Loader2
            size={30}
            className="animate-spin"
          />
        ) : (
          <Mic
            size={32}
          />
        )}
      </button>

      <p className="mt-4 text-sm text-slate-500">
        {listening
          ? "Listening..."
          : analyzing
            ? "Analyzing your answer..."
            : "Tap to start speaking"}
      </p>

      {speechResult
        ?.transcript && (
        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-left">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Transcript
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-700">
            {
              speechResult.transcript
            }
          </p>
        </div>
      )}

      {(error ||
        speechError) && (
        <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {error ||
            speechError}
        </div>
      )}
    </div>
  );
}