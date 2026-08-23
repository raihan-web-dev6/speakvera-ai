import { z } from "zod";

export const assessmentEvaluationSchema = z.object({
  grammarScore: z.number().min(0).max(100),

  vocabularyScore: z.number().min(0).max(100),

  communicationScore: z.number().min(0).max(100),

  grammarFeedback: z.string(),

  vocabularyFeedback: z.string(),

  communicationFeedback: z.string(),

  strengths: z.array(z.string()),

  improvements: z.array(z.string()),

  summary: z.string(),
});

export type AssessmentEvaluation = z.infer<
  typeof assessmentEvaluationSchema
>;