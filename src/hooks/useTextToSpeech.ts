"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

type SpeakOptions = {
  rate?: number;

  pitch?: number;

  lang?: string;
};

export function useTextToSpeech() {
  const [
    speaking,
    setSpeaking,
  ] = useState(false);

  const [
    supported,
    setSupported,
  ] = useState(false);

  useEffect(() => {
    setSupported(
      typeof window !==
        "undefined" &&
        "speechSynthesis" in
          window
    );
  }, []);

  const stop =
    useCallback(() => {
      if (
        typeof window ===
        "undefined"
      ) {
        return;
      }

      window.speechSynthesis.cancel();

      setSpeaking(false);
    }, []);

  const speak =
    useCallback(
      (
        text: string,

        options: SpeakOptions =
          {}
      ) => {
        if (
          typeof window ===
            "undefined" ||
          !(
            "speechSynthesis" in
            window
          )
        ) {
          return;
        }

        window.speechSynthesis.cancel();

        const utterance =
          new SpeechSynthesisUtterance(
            text
          );

        utterance.lang =
          options.lang ||
          "en-US";

        utterance.rate =
          options.rate ??
          0.9;

        utterance.pitch =
          options.pitch ??
          1;

        utterance.onstart =
          () => {
            setSpeaking(
              true
            );
          };

        utterance.onend =
          () => {
            setSpeaking(
              false
            );
          };

        utterance.onerror =
          () => {
            setSpeaking(
              false
            );
          };

        window.speechSynthesis.speak(
          utterance
        );
      },
      []
    );

  return {
    speak,

    stop,

    speaking,

    supported,
  };
}