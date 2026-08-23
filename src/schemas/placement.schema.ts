import { z } from "zod";

export const placementEvaluationSchema =
  z.object({
    grammarScore: z
      .number()
      .min(0)
      .max(100),

    vocabularyScore: z
      .number()
      .min(0)
      .max(100),

    communicationScore: z
      .number()
      .min(0)
      .max(100),

    strengths:
      z.array(
        z.string()
      ),

    improvements:
      z.array(
        z.string()
      ),

    summary:
      z.string(),
  });

export type PlacementEvaluation =
  z.infer<
    typeof placementEvaluationSchema
  >;