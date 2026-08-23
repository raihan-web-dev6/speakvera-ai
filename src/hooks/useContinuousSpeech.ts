"use client";

import {
  useRef,
  useState,
} from "react";

type SpeechAlternative = {
  transcript: string;
  confidence: number;
};

type SpeechResultItem = {
  isFinal: boolean;

  [index: number]:
    SpeechAlternative;
};

type SpeechResultList = {
  length: number;

  [index: number]:
    SpeechResultItem;
};

type SpeechRecognitionEventLike = {
  resultIndex: number;

  results:
    SpeechResultList;
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

export type ContinuousSpeechResult = {
  transcript: string;

  durationSeconds: number;

  wordsPerMinute: number;

  speechConfidence: number;

  /**
   * Browser-derived delivery score.
   *
   * Used as an MVP fluency proxy.
   */
  fluencyScore: number;

  /**
   * Web Speech does not provide
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
    wordsPerMinute >
      160 &&
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

  const fillers =
    transcript.match(
      /\b(um|uh|erm|hmm)\b/gi
    ) || [];

  score -= Math.min(
    fillers.length *
      4,
    20
  );

  return Math.max(
    0,
    Math.min(
      100,
      Math.round(score)
    )
  );
}

export function useContinuousSpeech() {
  const [
    listening,
    setListening,
  ] =
    useState(false);

  const [
    liveTranscript,
    setLiveTranscript,
  ] =
    useState("");

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(null);

  const recognitionRef =
    useRef<
      SpeechRecognitionLike | null
    >(null);

  const finalTranscriptRef =
    useRef("");

  const confidenceRef =
    useRef<number[]>(
      []
    );

  const startedAtRef =
    useRef<number>(
      0
    );

  const shouldContinueRef =
    useRef(false);

  const manualStopRef =
    useRef(false);

  const stopResolverRef =
    useRef<
      | ((
          value:
            ContinuousSpeechResult
        ) => void)
      | null
    >(null);

  function buildResult():
    ContinuousSpeechResult {
    const transcript =
      finalTranscriptRef.current.trim();

    const durationSeconds =
      Math.max(
        1,
        Math.round(
          (
            Date.now() -
            startedAtRef.current
          ) /
            1000
        )
      );

    const words =
      transcript
        .split(/\s+/)
        .filter(Boolean);

    const wordsPerMinute =
      Math.round(
        words.length /
          (
            durationSeconds /
            60
          )
      );

    const confidenceValues =
      confidenceRef.current;

    const averageConfidence =
      confidenceValues.length
        ? confidenceValues.reduce(
            (
              total,
              value
            ) =>
              total +
              value,
            0
          ) /
          confidenceValues.length
        : 0;

    const speechConfidence =
      Math.round(
        averageConfidence *
          100
      );

    const fluencyScore =
      calculateDeliveryScore(
        wordsPerMinute,
        transcript
      );

    return {
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
    };
  }

  const startListening =
    async () => {
      const Recognition =
        getSpeechRecognition();

      if (!Recognition) {
        const message =
          "Speech recognition is not supported in this browser. Please use Chrome or Edge.";

        setError(
          message
        );

        throw new Error(
          message
        );
      }

      setError(null);

      setLiveTranscript(
        ""
      );

      finalTranscriptRef.current =
        "";

      confidenceRef.current =
        [];

      startedAtRef.current =
        Date.now();

      shouldContinueRef.current =
        true;

      manualStopRef.current =
        false;

      const recognition =
        new Recognition();

      recognition.continuous =
        true;

      recognition.interimResults =
        true;

      recognition.lang =
        "en-US";

      recognition.maxAlternatives =
        1;

      recognitionRef.current =
        recognition;

      recognition.onresult =
        (event) => {
          let interim =
            "";

          for (
            let i =
              event.resultIndex;
            i <
            event.results
              .length;
            i++
          ) {
            const result =
              event.results[
                i
              ];

            const best =
              result?.[0];

            if (!best) {
              continue;
            }

            if (
              result.isFinal
            ) {
              finalTranscriptRef.current +=
                ` ${best.transcript}`;

              confidenceRef.current.push(
                best.confidence ||
                  0
              );
            } else {
              interim +=
                ` ${best.transcript}`;
            }
          }

          setLiveTranscript(
            `${finalTranscriptRef.current} ${interim}`.trim()
          );
        };

      recognition.onerror =
        (event) => {
          if (
            event.error ===
              "not-allowed" ||
            event.error ===
              "service-not-allowed" ||
            event.error ===
              "audio-capture"
          ) {
            shouldContinueRef.current =
              false;

            setListening(
              false
            );
          }

          if (
            event.error !==
            "no-speech"
          ) {
            setError(
              `Speech recognition error: ${event.error}`
            );
          }
        };

      recognition.onend =
        () => {
          if (
            manualStopRef.current
          ) {
            setListening(
              false
            );

            const result =
              buildResult();

            stopResolverRef.current?.(
              result
            );

            stopResolverRef.current =
              null;

            return;
          }

          /*
           * Chrome can sometimes end
           * recognition after a pause.
           *
           * Restart while the user is
           * still recording.
           */
          if (
            shouldContinueRef.current
          ) {
            window.setTimeout(
              () => {
                try {
                  recognition.start();
                } catch {
                  setListening(
                    false
                  );
                }
              },
              200
            );
          } else {
            setListening(
              false
            );
          }
        };

      await new Promise<void>(
        (
          resolve,
          reject
        ) => {
          recognition.onstart =
            () => {
              setListening(
                true
              );

              resolve();
            };

          try {
            recognition.start();
          } catch (
            error
          ) {
            reject(
              error
            );
          }
        }
      );
    };

  const stopListening =
    async (): Promise<ContinuousSpeechResult> => {
      const recognition =
        recognitionRef.current;

      if (!recognition) {
        throw new Error(
          "Speech recognition is not running."
        );
      }

      shouldContinueRef.current =
        false;

      manualStopRef.current =
        true;

      return new Promise(
        (resolve) => {
          let resolved =
            false;

          const finish = (
            result:
              ContinuousSpeechResult
          ) => {
            if (resolved) {
              return;
            }

            resolved =
              true;

            recognitionRef.current =
              null;

            setListening(
              false
            );

            resolve(
              result
            );
          };

          stopResolverRef.current =
            finish;

          try {
            recognition.stop();
          } catch {
            finish(
              buildResult()
            );
          }

          /*
           * Fallback in case the
           * browser doesn't fire
           * onend correctly.
           */
          window.setTimeout(
            () => {
              finish(
                buildResult()
              );
            },
            1500
          );
        }
      );
    };

  return {
    startListening,

    stopListening,

    listening,

    liveTranscript,

    error,
  };
}