export type AppPlan =
  | "FREE"
  | "PRO"
  | "PREMIUM";

export type PlanUsageLimits = {
  speakingSecondsPerDay: number;

  aiRequestsPerDay: number;

  ieltsAttemptsPerDay: number;

  assessmentAttemptsPerDay: number;

  certificates: boolean;

  finalCourseAssessment: boolean;
};

export const USAGE_LIMITS: Record<
  AppPlan,
  PlanUsageLimits
> = {
  FREE: {
    /*
     * 5 minutes/day
     */
    speakingSecondsPerDay:
      5 * 60,

    aiRequestsPerDay:
      15,

    ieltsAttemptsPerDay:
      1,

    assessmentAttemptsPerDay:
      1,

    certificates:
      false,

    finalCourseAssessment:
      false,
  },

  PRO: {
    /*
     * 60 minutes/day
     */
    speakingSecondsPerDay:
      60 * 60,

    aiRequestsPerDay:
      150,

    ieltsAttemptsPerDay:
      10,

    assessmentAttemptsPerDay:
      5,

    certificates:
      true,

    finalCourseAssessment:
      true,
  },

  PREMIUM: {
    /*
     * 180 minutes/day
     */
    speakingSecondsPerDay:
      180 * 60,

    aiRequestsPerDay:
      400,

    ieltsAttemptsPerDay:
      25,

    assessmentAttemptsPerDay:
      15,

    certificates:
      true,

    finalCourseAssessment:
      true,
  },
};