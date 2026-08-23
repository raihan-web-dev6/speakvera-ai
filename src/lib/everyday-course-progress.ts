import connectDb from "@/lib/db";

import LessonProgress from "@/models/lessonProgress.model";

export type EverydayCourseState = {
  completedDays: number[];

  highestCompletedDay: number;

  nextLessonDay: number;

  courseCompleted: boolean;

  completedCount: number;

  progressPercent: number;
};

export async function getEverydayCourseState(
  userId: string
): Promise<EverydayCourseState> {
  await connectDb();

  const progress =
    await LessonProgress.find({
      userId,

      status: "COMPLETED",
    })
      .select({
        dayNumber: 1,
      })
      .lean();

  /*
   * Remove duplicates and invalid
   * lesson numbers.
   */
  const completedDays = [
    ...new Set(
      progress
        .map(
          (item) =>
            Number(
              item.dayNumber
            )
        )
        .filter(
          (day) =>
            Number.isInteger(
              day
            ) &&
            day >= 1 &&
            day <= 40
        )
    ),
  ].sort(
    (a, b) =>
      a - b
  );

  const completedSet =
    new Set(
      completedDays
    );

  /*
   * IMPORTANT:
   *
   * We check contiguous progress.
   *
   * Example:
   *
   * completed:
   * 1,2,3,5
   *
   * highestCompletedDay = 3
   *
   * Day 4 is therefore the
   * next unlocked lesson.
   */
  let highestCompletedDay =
    0;

  for (
    let day = 1;
    day <= 40;
    day++
  ) {
    if (
      completedSet.has(
        day
      )
    ) {
      highestCompletedDay =
        day;
    } else {
      break;
    }
  }

  const courseCompleted =
    highestCompletedDay >=
    40;

  const nextLessonDay =
    courseCompleted
      ? 40
      : highestCompletedDay +
        1;

  const completedCount =
    completedDays.length;

  const progressPercent =
    Math.min(
      100,
      Math.round(
        (highestCompletedDay /
          40) *
          100
      )
    );

  return {
    completedDays,

    highestCompletedDay,

    nextLessonDay,

    courseCompleted,

    completedCount,

    progressPercent,
  };
}

export async function canAccessSequentialLesson(
  userId: string,

  dayNumber: number
) {
  /*
   * Day 1 is always the
   * starting lesson.
   */
  if (dayNumber === 1) {
    return true;
  }

  const state =
    await getEverydayCourseState(
      userId
    );

  /*
   * Users may revisit any
   * lesson they completed.
   */
  if (
    state.completedDays.includes(
      dayNumber
    )
  ) {
    return true;
  }

  /*
   * Only the lesson immediately
   * after the contiguous completed
   * lessons is unlocked.
   */
  return (
    dayNumber ===
    state.nextLessonDay
  );
}