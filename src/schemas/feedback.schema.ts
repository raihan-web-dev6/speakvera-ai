import { z } from "zod";

export const speakingFeedbackSchema =
  z.object({
    grammarScore: z
      .number()
      .min(0)
      .max(100),

    vocabularyScore: z
      .number()
      .min(0)
      .max(100),

    answerQualityScore: z
      .number()
      .min(0)
      .max(100),

    grammarMistakes: z.array(
      z.object({
        original: z.string(),
        corrected: z.string(),
        explanation: z.string(),
      })
    ),

    vocabularySuggestions: z.array(
      z.object({
        original: z.string(),
        better: z.string(),
        reason: z.string(),
      })
    ),

    improvedAnswer: z.string(),

    strengths: z.array(z.string()),

    improvements: z.array(z.string()),

    shortFeedback: z.string(),
  });

export type SpeakingFeedback =
  z.infer<
    typeof speakingFeedbackSchema
  >;