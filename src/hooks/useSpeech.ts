"use client";

import {
  useState,
} from "react";

type SpeechRecognitionAlternativeLike = {
  transcript: string;
  confidence: number;
};

type SpeechRecognitionResultLike = {
  isFinal: boolean;
  length: number;

  [index: number]:
    SpeechRecognitionAlternativeLike;
};

type SpeechRecognitionResultListLike = {
  length: number;

  [index: number]:
    SpeechRecognitionResultLike;
};

type SpeechRecognitionEventLike = {
  resultIndex: number;

  results:
    SpeechRecognitionResultListLike;
};

type SpeechRecognitionErrorEventLike = {
  error: string;
  message?: string;
};

type SpeechRecognitionLike = {
  continuous: boolean;

  interimResults: boolean;

  lang: string;

  maxAlternatives: number;

  onstart:
    | (() => void)
    | null;

  onresult:
    | ((
        event:
          SpeechRecognitionEventLike
      ) => void)
    | null;

  onerror:
    | ((
        event:
          SpeechRecognitionErrorEventLike
      ) => void)
    | null;

  onend:
    | (() => void)
    | null;

  start(): void;

  stop(): void;

  abort(): void;
};

type SpeechRecognitionConstructor =
  new () =>
    SpeechRecognitionLike;

export type SpeechResult = {
  transcript: string;

  durationSeconds: number;

  wordsPerMinute: number;

  speechConfidence: number;

  /**
   * Browser-derived delivery score.
   *
   * This is NOT an official
   * pronunciation or CEFR score.
   */
  fluencyScore: number;

  /**
   * Legacy values kept so older
   * Speakvera code does not crash.
   *
   * Web Speech API does not provide
   * pronunciation assessment.
   */
  pronunciationScore: number;

  accuracyScore: number;

  prosodyScore: number;
};

function getSpeechRecognition() {
  if (
    typeof window ===
    "undefined"
  ) {
    return null;
  }

  const speechWindow =
    window as typeof window & {
      SpeechRecognition?:
        SpeechRecognitionConstructor;

      webkitSpeechRecognition?:
        SpeechRecognitionConstructor;
    };

  return (
    speechWindow.SpeechRecognition ||
    speechWindow.webkitSpeechRecognition ||
    null
  );
}

function calculateDeliveryScore(
  wordsPerMinute: number,
  transcript: string
) {
  let score = 50;

  if (
    wordsPerMinute >= 90 &&
    wordsPerMinute <= 160
  ) {
    score = 90;
  } else if (
    wordsPerMinute >= 70 &&
    wordsPerMinute < 90
  ) {
    score = 78;
  } else if (
    wordsPerMinute > 160 &&
    wordsPerMinute <= 185
  ) {
    score = 78;
  } else if (
    wordsPerMinute >= 50 &&
    wordsPerMinute < 70
  ) {
    score = 65;
  } else if (
    wordsPerMinute >
      185 &&
    wordsPerMinute <= 210
  ) {
    score = 65;
  }

  const fillerMatches =
    transcript.match(
      /\b(um|uh|erm|hmm)\b/gi
    ) || [];

  score -= Math.min(
    fillerMatches.length *
      4,
    20
  );

  const wordCount =
    transcript
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .length;

  if (wordCount >= 15) {
    score += 5;
  }

  return Math.max(
    0,
    Math.min(
      100,
      Math.round(score)
    )
  );
}

export function useSpeech() {
  const [
    listening,
    setListening,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(null);

  const recognizeSpeech =
    async (): Promise<SpeechResult> => {
      const Recognition =
        getSpeechRecognition();

      if (!Recognition) {
        throw new Error(
          "Speech recognition is not supported in this browser. Please use Chrome or Edge."
        );
      }

      setError(null);

      return new Promise(
        (
          resolve,
          reject
        ) => {
          const recognition =
            new Recognition();

          recognition.continuous =
            false;

          recognition.interimResults =
            false;

          recognition.lang =
            "en-US";

          recognition.maxAlternatives =
            1;

          let transcript =
            "";

          let confidence =
            0;

          const startedAt =
            Date.now();

          recognition.onstart =
            () => {
              setListening(
                true
              );
            };

          recognition.onresult =
            (event) => {
              const result =
                event.results[
                  event.resultIndex
                ];

              if (!result) {
                return;
              }

              const best =
                result[0];

              transcript =
                best?.transcript?.trim() ||
                "";

              confidence =
                best?.confidence ||
                0;
            };

          recognition.onerror =
            (event) => {
              setListening(
                false
              );

              let message =
                `Speech recognition error: ${event.error}`;

              if (
                event.error ===
                "not-allowed"
              ) {
                message =
                  "Microphone permission was denied.";
              }

              if (
                event.error ===
                "no-speech"
              ) {
                message =
                  "No speech was detected. Please try again.";
              }

              setError(
                message
              );

              reject(
                new Error(
                  message
                )
              );
            };

          recognition.onend =
            () => {
              setListening(
                false
              );

              if (
                !transcript
              ) {
                return;
              }

              const durationSeconds =
                Math.max(
                  1,
                  Math.round(
                    (
                      Date.now() -
                      startedAt
                    ) /
                      1000
                  )
                );

              const wordCount =
                transcript
                  .split(
                    /\s+/
                  )
                  .filter(
                    Boolean
                  ).length;

              const wordsPerMinute =
                Math.round(
                  wordCount /
                    (
                      durationSeconds /
                      60
                    )
                );

              const speechConfidence =
                Math.round(
                  confidence *
                    100
                );

              const fluencyScore =
                calculateDeliveryScore(
                  wordsPerMinute,
                  transcript
                );

              resolve({
                transcript,

                durationSeconds,

                wordsPerMinute,

                speechConfidence,

                fluencyScore,

                pronunciationScore:
                  0,

                accuracyScore:
                  speechConfidence,

                prosodyScore:
                  0,
              });
            };

          try {
            recognition.start();
          } catch {
            const message =
              "Could not start speech recognition.";

            setError(
              message
            );

            reject(
              new Error(
                message
              )
            );
          }
        }
      );
    };

  return {
    recognizeSpeech,

    listening,

    error,
  };
}