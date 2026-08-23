"use client";

import {
  Clock3,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

type Props = {
  seconds: number;

  label: string;

  running?: boolean;

  onComplete?: () => void;
};

export default function CountdownTimer({
  seconds,
  label,
  running = true,
  onComplete,
}: Props) {
  const [
    remaining,
    setRemaining,
  ] = useState(seconds);

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (
      !running ||
      remaining <= 0
    ) {
      return;
    }

    const timer =
      window.setInterval(
        () => {
          setRemaining(
            (previous) => {
              if (
                previous <= 1
              ) {
                window.clearInterval(
                  timer
                );

                onComplete?.();

                return 0;
              }

              return (
                previous - 1
              );
            }
          );
        },

        1000
      );

    return () =>
      window.clearInterval(
        timer
      );
  }, [
    remaining,
    running,
    onComplete,
  ]);

  const minutes =
    Math.floor(
      remaining / 60
    );

  const secs =
    remaining % 60;

  return (
    <div className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Clock3 size={19} />
      </div>

      <div>
        <p className="text-xs font-medium text-slate-500">
          {label}
        </p>

        <p className="text-xl font-bold tabular-nums text-slate-950">
          {String(
            minutes
          ).padStart(
            2,
            "0"
          )}
          :
          {String(
            secs
          ).padStart(
            2,
            "0"
          )}
        </p>
      </div>
    </div>
  );
}