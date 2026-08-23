"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

type LessonProgress = {
  _id: string;
  dayNumber: number;

  status:
    | "AVAILABLE"
    | "IN_PROGRESS"
    | "COMPLETED";

  score?: number;
};

type CourseProgress = {
  progress: LessonProgress[];
  completed: number;
  totalDays: number;
  progressPercent: number;
};

export function useCourseProgress() {
  const [data, setData] =
    useState<CourseProgress | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const loadProgress =
    useCallback(async () => {
      try {
        setLoading(true);

        const response = await fetch(
          "/api/course/progress",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          return;
        }

        const result =
          await response.json();

        setData(result);
      } catch (error) {
        console.error(
          "Course progress error:",
          error
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  return {
    ...data,
    loading,
    refresh: loadProgress,
  };
}