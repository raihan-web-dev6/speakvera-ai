import { z } from "zod";

export const learningGoalSchema =
  z.enum([
    "EVERYDAY_ENGLISH",
    "IELTS",
    "PRONUNCIATION",
    "FLUENCY",
    "GRAMMAR",
    "VOCABULARY",
    "CONFIDENCE",
  ]);

export const targetLevelSchema =
  z.enum([
    "A1",
    "A2",
    "B1",
    "B2",
    "C1",
    "C2",
  ]);

export const accentSchema =
  z.enum([
    "AMERICAN",
    "BRITISH",
    "AUSTRALIAN",
    "NEUTRAL",
  ]);

export const profileUpdateSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(2)
      .max(60),
  });

export const preferenceSchema =
  z.object({
    goals: z
      .array(
        learningGoalSchema
      )
      .min(1),

    learningTarget:
      targetLevelSchema,

    dailyGoalMinutes: z
      .number()
      .int()
      .min(5)
      .max(120),

    preferredAccent:
      accentSchema,

    nativeLanguage: z
      .string()
      .trim()
      .max(80)
      .optional(),
  });

export type PreferenceInput =
  z.infer<
    typeof preferenceSchema
  >;