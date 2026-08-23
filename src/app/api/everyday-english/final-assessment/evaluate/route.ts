import {
  NextResponse,
} from "next/server";

import {
  z,
} from "zod";

import {
  auth,
} from "@/auth";

import connectDb from "@/lib/db";

import {
  gemini,
} from "@/lib/gemini";

import {
  getEverydayCourseState,
} from "@/lib/everyday-course-progress";

import {
  canUseFinalCourseAssessment,
  consumeSpeakingSeconds,
} from "@/lib/usage";

import {
  runWithAiUsage,
} from "@/lib/ai-usage";

import {
  usageLimitResponse,
} from "@/lib/usage-response";

import EverydayFinalAssessment from "@/models/everydayFinalAssessment.model";

import User from "@/models/user.model";

const answerSchema =
  z.object({
    questionId:
      z.string().min(1),

    question:
      z.string().min(1),

    transcript:
      z.string().min(5),

    durationSeconds:
      z.number().min(0),

    deliveryScore:
      z
        .number()
        .min(0)
        .max(100),

    wordsPerMinute:
      z.number().min(0),

    speechConfidence:
      z
        .number()
        .min(0)
        .max(100),
  });

const bodySchema =
  z.object({
    answers:
      z
        .array(
          answerSchema
        )
        .length(5),
  });

const aiResultSchema =
  z.object({
    grammarScore:
      z
        .number()
        .min(0)
        .max(100),

    vocabularyScore:
      z
        .number()
        .min(0)
        .max(100),

    communicationScore:
      z
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

function average(
  values: number[]
) {
  if (
    values.length === 0
  ) {
    return 0;
  }

  return Math.round(
    values.reduce(
      (
        total,
        value
      ) =>
        total +
        value,
      0
    ) /
      values.length
  );
}

function determineCEFR(
  score: number
):
  | "A1"
  | "A2"
  | "B1"
  | "B2"
  | "C1"
  | "C2" {
  if (score >= 90) {
    return "C2";
  }

  if (score >= 75) {
    return "C1";
  }

  if (score >= 60) {
    return "B2";
  }

  if (score >= 45) {
    return "B1";
  }

  if (score >= 30) {
    return "A2";
  }

  return "A1";
}

function calculateBillableSeconds(
  answers:
    z.infer<
      typeof answerSchema
    >[]
) {
  return answers.reduce(
    (
      total,
      answer
    ) => {
      const words =
        answer.transcript
          .trim()
          .split(/\s+/)
          .filter(Boolean)
          .length;

      const minimumFromWords =
        Math.ceil(
          words / 3
        );

      return (
        total +
        Math.max(
          answer.durationSeconds,
          minimumFromWords
        )
      );
    },
    0
  );
}

export async function POST(
  request: Request
) {
  try {
    /*
     * Authentication
     */

    const session =
      await auth();

    const userId =
      session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        {
          message:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    /*
     * Must complete all
     * 40 lessons.
     */

    const courseState =
      await getEverydayCourseState(
        userId
      );

    if (
      !courseState.courseCompleted
    ) {
      return NextResponse.json(
        {
          message:
            "Complete all 40 lessons before taking the final assessment.",

          nextLessonDay:
            courseState.nextLessonDay,
        },
        {
          status: 403,
        }
      );
    }

    /*
     * Paid feature.
     */

    const finalAssessmentAccess =
      await canUseFinalCourseAssessment(
        userId
      );

    if (
      !finalAssessmentAccess
    ) {
      return NextResponse.json(
        {
          message:
            "A paid plan is required for the final course assessment.",
        },
        {
          status: 403,
        }
      );
    }

    const rawBody =
      await request.json();

    const parsedBody =
      bodySchema.safeParse(
        rawBody
      );

    if (
      !parsedBody.success
    ) {
      return NextResponse.json(
        {
          message:
            "Invalid assessment answers",

          errors:
            parsedBody.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const {
      answers,
    } =
      parsedBody.data;

    const weakAnswer =
      answers.find(
        (answer) =>
          answer.transcript
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .length < 5
      );

    if (weakAnswer) {
      return NextResponse.json(
        {
          message:
            "Each final assessment answer must contain at least five words.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Consume speaking allowance.
     */

    const speakingSeconds =
      calculateBillableSeconds(
        answers
      );

    if (
      speakingSeconds >
      0
    ) {
      await consumeSpeakingSeconds(
        userId,
        speakingSeconds
      );
    }

    const formattedAnswers =
      answers
        .map(
          (
            answer,
            index
          ) => `
QUESTION ${index + 1}

${answer.question}

LEARNER ANSWER:

${answer.transcript}

Browser-derived delivery score:
${answer.deliveryScore}/100

Speaking pace:
${answer.wordsPerMinute} words per minute
`
        )
        .join(
          "\n-----------------------------\n"
        );

    const prompt = `
You are Speakvera AI evaluating the final assessment of a 40-day Everyday English speaking course.

This is a learning assessment and NOT an official CEFR examination.

The learner completed five spoken tasks covering:

- personal communication
- past experiences
- opinions
- real-life problem solving
- future plans

ANSWERS:

${formattedAnswers}

Evaluate the COMPLETE performance.

Score from 0 to 100:

1. Grammar
2. Vocabulary
3. Communication

Communication includes:

- relevance
- clarity
- ability to develop ideas
- use of reasons and examples
- sentence connection
- ability to sustain an answer
- effectiveness in real-life communication

IMPORTANT:

Do NOT score pronunciation.

Browser speech recognition does not provide a reliable pronunciation assessment.

Do not penalize small transcription mistakes that may clearly have been caused by automatic speech recognition.

Return ONLY valid JSON:

{
  "grammarScore": 72,

  "vocabularyScore": 74,

  "communicationScore": 76,

  "strengths": [
    "..."
  ],

  "improvements": [
    "..."
  ],

  "summary": "..."
}

Be realistic.

Do not inflate scores.

Give useful learning feedback.
`;

    const aiResult =
      await runWithAiUsage(
        userId,

        async () => {
          const aiResponse =
            await gemini.models.generateContent(
              {
                model:
                  "gemini-3.6-flash",

                contents:
                  prompt,

                config: {
                  responseMimeType:
                    "application/json",

                  temperature:
                    0.15,
                },
              }
            );

          if (
            !aiResponse.text
          ) {
            throw new Error(
              "Empty Gemini response"
            );
          }

          return aiResultSchema.parse(
            JSON.parse(
              aiResponse.text
            )
          );
        }
      );

    const deliveryScore =
      average(
        answers.map(
          (answer) =>
            answer.deliveryScore
        )
      );

    /*
     * Grammar        25%
     * Vocabulary     25%
     * Communication  25%
     * Delivery       25%
     */

    const overallScore =
      Math.round(
        (
          aiResult.grammarScore +
          aiResult.vocabularyScore +
          aiResult.communicationScore +
          deliveryScore
        ) /
          4
      );

    const cefrLevel =
      determineCEFR(
        overallScore
      );

    const passed =
      overallScore >= 70 &&
      aiResult.grammarScore >=
        60 &&
      aiResult.communicationScore >=
        60;

    const certificateEligible =
      passed &&
      finalAssessmentAccess;

    await connectDb();

    const attempt =
      await EverydayFinalAssessment.create(
        {
          userId,

          answers,

          grammarScore:
            aiResult.grammarScore,

          vocabularyScore:
            aiResult.vocabularyScore,

          communicationScore:
            aiResult.communicationScore,

          deliveryScore,

          overallScore,

          cefrLevel,

          passed,

          certificateEligible,

          strengths:
            aiResult.strengths,

          improvements:
            aiResult.improvements,

          summary:
            aiResult.summary,

          completedAt:
            new Date(),
        }
      );

    /*
     * Keep the user's latest
     * estimated level updated.
     */

    await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          currentLevel:
            cefrLevel,
        },
      }
    );

    return NextResponse.json({
      message:
        "Final assessment completed",

      attemptId:
        attempt._id.toString(),

      overallScore,

      cefrLevel,

      passed,

      certificateEligible,

      speakingSeconds,
    });
  } catch (error) {
    const usageResponse =
      usageLimitResponse(
        error
      );

    if (usageResponse) {
      return usageResponse;
    }

    console.error(
      "Everyday final assessment:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Could not evaluate final assessment",
      },
      {
        status: 500,
      }
    );
  }
}