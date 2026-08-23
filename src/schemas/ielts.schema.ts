import { z } from "zod";

const bandScore = z
  .number()
  .min(0)
  .max(9)
  .refine(
    (value) =>
      Number.isInteger(value * 2),
    {
      message:
        "Band score must use whole or half bands",
    }
  );

export const ieltsEvaluationSchema =
  z.object({
    fluencyBand: bandScore,

    lexicalBand: bandScore,

    grammarBand: bandScore,

    pronunciationBand: bandScore,

    strengths: z.array(
      z.string()
    ),

    improvements: z.array(
      z.string()
    ),

    fluencyFeedback:
      z.string(),

    vocabularyFeedback:
      z.string(),

    grammarFeedback:
      z.string(),

    pronunciationFeedback:
      z.string(),

    summary: z.string(),
  });

export type IeltsEvaluation =
  z.infer<
    typeof ieltsEvaluationSchema
  >;