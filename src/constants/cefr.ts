export const CEFR_LEVELS = {
  A1: {
    name: "Beginner",
    minScore: 0,
    maxScore: 29,
  },

  A2: {
    name: "Elementary",
    minScore: 30,
    maxScore: 44,
  },

  B1: {
    name: "Intermediate",
    minScore: 45,
    maxScore: 59,
  },

  B2: {
    name: "Upper Intermediate",
    minScore: 60,
    maxScore: 74,
  },

  C1: {
    name: "Advanced",
    minScore: 75,
    maxScore: 89,
  },

  C2: {
    name: "Proficient",
    minScore: 90,
    maxScore: 100,
  },
} as const;

export type CEFRLevel =
  keyof typeof CEFR_LEVELS;