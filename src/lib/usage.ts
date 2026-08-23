import connectDb from "@/lib/db";

import Subscription from "@/models/subscription.model";

import DailyUsage from "@/models/dailyUsage.model";

import {
  USAGE_LIMITS,
  type AppPlan,
} from "@/constants/usage-limits";

type UsageCounter =
  | "aiRequests"
  | "ieltsAttempts"
  | "assessmentAttempts";

export class UsageLimitError
  extends Error {
  status = 429;

  code:
    | "SPEAKING_LIMIT"
    | "AI_LIMIT"
    | "IELTS_LIMIT"
    | "ASSESSMENT_LIMIT";

  plan: AppPlan;

  limit: number;

  used: number;

  constructor({
    message,
    code,
    plan,
    limit,
    used,
  }: {
    message: string;

    code:
      | "SPEAKING_LIMIT"
      | "AI_LIMIT"
      | "IELTS_LIMIT"
      | "ASSESSMENT_LIMIT";

    plan: AppPlan;

    limit: number;

    used: number;
  }) {
    super(message);

    this.name =
      "UsageLimitError";

    this.code =
      code;

    this.plan =
      plan;

    this.limit =
      limit;

    this.used =
      used;
  }
}

/*
 * =====================================================
 * DAY KEY
 * =====================================================
 *
 * Later we can change this to
 * the user's timezone.
 */

export function getUsageDayKey() {
  return new Date()
    .toISOString()
    .slice(0, 10);
}

/*
 * =====================================================
 * USER PLAN
 * =====================================================
 */

export async function getUserPlan(
  userId: string
): Promise<AppPlan> {
  await connectDb();

  const subscription =
    await Subscription.findOne({
      userId,

      plan: {
        $in: [
          "PRO",
          "PREMIUM",
        ],
      },

      status: {
        $in: [
          "ACTIVE",
          "TRIALING",
        ],
      },
    })
      .select(
        "plan status"
      )
      .sort({
        updatedAt: -1,
      })
      .lean();

  if (
    subscription?.plan ===
    "PREMIUM"
  ) {
    return "PREMIUM";
  }

  if (
    subscription?.plan ===
    "PRO"
  ) {
    return "PRO";
  }

  return "FREE";
}

/*
 * =====================================================
 * ENSURE TODAY'S USAGE DOCUMENT
 * =====================================================
 */

async function ensureDailyUsage(
  userId: string
) {
  await connectDb();

  const dayKey =
    getUsageDayKey();

  return DailyUsage.findOneAndUpdate(
    {
      userId,

      dayKey,
    },

    {
      $setOnInsert: {
        userId,

        dayKey,

        speakingSeconds:
          0,

        aiRequests:
          0,

        ieltsAttempts:
          0,

        assessmentAttempts:
          0,
      },
    },

    {
      upsert: true,

      new: true,

      setDefaultsOnInsert:
        true,
    }
  );
}

/*
 * =====================================================
 * COMPLETE USAGE SNAPSHOT
 * =====================================================
 */

export async function getUsageSnapshot(
  userId: string
) {
  const [
    plan,
    usage,
  ] =
    await Promise.all([
      getUserPlan(
        userId
      ),

      ensureDailyUsage(
        userId
      ),
    ]);

  const limits =
    USAGE_LIMITS[plan];

  const speakingSeconds =
    Number(
      usage.speakingSeconds ??
        0
    );

  const aiRequests =
    Number(
      usage.aiRequests ??
        0
    );

  const ieltsAttempts =
    Number(
      usage.ieltsAttempts ??
        0
    );

  const assessmentAttempts =
    Number(
      usage.assessmentAttempts ??
        0
    );

  return {
    plan,

    dayKey:
      usage.dayKey,

    usage: {
      speakingSeconds,

      aiRequests,

      ieltsAttempts,

      assessmentAttempts,
    },

    limits,

    remaining: {
      speakingSeconds:
        Math.max(
          0,

          limits.speakingSecondsPerDay -
            speakingSeconds
        ),

      aiRequests:
        Math.max(
          0,

          limits.aiRequestsPerDay -
            aiRequests
        ),

      ieltsAttempts:
        Math.max(
          0,

          limits.ieltsAttemptsPerDay -
            ieltsAttempts
        ),

      assessmentAttempts:
        Math.max(
          0,

          limits.assessmentAttemptsPerDay -
            assessmentAttempts
        ),
    },
  };
}

/*
 * =====================================================
 * ATOMIC COUNTER CONSUMPTION
 * =====================================================
 */

async function consumeCounter({
  userId,
  counter,
  amount,
  limit,
}: {
  userId: string;

  counter:
    UsageCounter;

  amount: number;

  limit: number;
}) {
  const usage =
    await ensureDailyUsage(
      userId
    );

  /*
   * Example:
   *
   * AI limit = 15
   *
   * require:
   *
   * aiRequests <= 14
   *
   * before adding 1.
   */

  const maximumBeforeIncrement =
    limit - amount;

  if (
    maximumBeforeIncrement <
    0
  ) {
    return false;
  }

  const result =
    await DailyUsage.updateOne(
      {
        _id:
          usage._id,

        [counter]: {
          $lte:
            maximumBeforeIncrement,
        },
      },

      {
        $inc: {
          [counter]:
            amount,
        },
      }
    );

  return (
    result.modifiedCount ===
    1
  );
}

/*
 * =====================================================
 * AI REQUEST
 * =====================================================
 */

export async function consumeAiRequest(
  userId: string,
  amount = 1
) {
  const snapshot =
    await getUsageSnapshot(
      userId
    );

  const limit =
    snapshot.limits
      .aiRequestsPerDay;

  const allowed =
    await consumeCounter({
      userId,

      counter:
        "aiRequests",

      amount,

      limit,
    });

  if (!allowed) {
    throw new UsageLimitError(
      {
        code:
          "AI_LIMIT",

        message:
          "You have reached today's AI usage limit.",

        plan:
          snapshot.plan,

        limit,

        used:
          snapshot.usage
            .aiRequests,
      }
    );
  }
}

/*
 * Refund if the Gemini request
 * itself fails.
 */

export async function refundAiRequest(
  userId: string,
  amount = 1
) {
  const usage =
    await ensureDailyUsage(
      userId
    );

  const current =
    Number(
      usage.aiRequests ??
        0
    );

  if (current <= 0) {
    return;
  }

  await DailyUsage.updateOne(
    {
      _id:
        usage._id,
    },

    {
      $inc: {
        aiRequests:
          -Math.min(
            amount,
            current
          ),
      },
    }
  );
}

/*
 * =====================================================
 * SPEAKING TIME
 * =====================================================
 */

export async function consumeSpeakingSeconds(
  userId: string,
  seconds: number
) {
  const amount =
    Math.max(
      1,
      Math.ceil(
        seconds
      )
    );

  const snapshot =
    await getUsageSnapshot(
      userId
    );

  const limit =
    snapshot.limits
      .speakingSecondsPerDay;

  const usage =
    await ensureDailyUsage(
      userId
    );

  const maximumBeforeIncrement =
    limit - amount;

  if (
    maximumBeforeIncrement <
    0
  ) {
    throw new UsageLimitError(
      {
        code:
          "SPEAKING_LIMIT",

        message:
          "You have reached today's speaking practice limit.",

        plan:
          snapshot.plan,

        limit,

        used:
          snapshot.usage
            .speakingSeconds,
      }
    );
  }

  const result =
    await DailyUsage.updateOne(
      {
        _id:
          usage._id,

        speakingSeconds: {
          $lte:
            maximumBeforeIncrement,
        },
      },

      {
        $inc: {
          speakingSeconds:
            amount,
        },
      }
    );

  if (
    result.modifiedCount !==
    1
  ) {
    throw new UsageLimitError(
      {
        code:
          "SPEAKING_LIMIT",

        message:
          "You have reached today's speaking practice limit.",

        plan:
          snapshot.plan,

        limit,

        used:
          snapshot.usage
            .speakingSeconds,
      }
    );
  }
}

/*
 * =====================================================
 * IELTS ATTEMPT
 * =====================================================
 */

export async function consumeIeltsAttempt(
  userId: string
) {
  const snapshot =
    await getUsageSnapshot(
      userId
    );

  const limit =
    snapshot.limits
      .ieltsAttemptsPerDay;

  const allowed =
    await consumeCounter({
      userId,

      counter:
        "ieltsAttempts",

      amount: 1,

      limit,
    });

  if (!allowed) {
    throw new UsageLimitError(
      {
        code:
          "IELTS_LIMIT",

        message:
          "You have reached today's IELTS practice limit.",

        plan:
          snapshot.plan,

        limit,

        used:
          snapshot.usage
            .ieltsAttempts,
      }
    );
  }
}

/*
 * =====================================================
 * GENERAL ASSESSMENT ATTEMPT
 * =====================================================
 */

export async function consumeAssessmentAttempt(
  userId: string
) {
  const snapshot =
    await getUsageSnapshot(
      userId
    );

  const limit =
    snapshot.limits
      .assessmentAttemptsPerDay;

  const allowed =
    await consumeCounter({
      userId,

      counter:
        "assessmentAttempts",

      amount: 1,

      limit,
    });

  if (!allowed) {
    throw new UsageLimitError(
      {
        code:
          "ASSESSMENT_LIMIT",

        message:
          "You have reached today's assessment limit.",

        plan:
          snapshot.plan,

        limit,

        used:
          snapshot.usage
            .assessmentAttempts,
      }
    );
  }
}

/*
 * =====================================================
 * PAID FEATURE HELPERS
 * =====================================================
 */

export async function canUseCertificates(
  userId: string
) {
  const plan =
    await getUserPlan(
      userId
    );

  return (
    USAGE_LIMITS[
      plan
    ].certificates
  );
}

export async function canUseFinalCourseAssessment(
  userId: string
) {
  const plan =
    await getUserPlan(
      userId
    );

  return (
    USAGE_LIMITS[
      plan
    ]
      .finalCourseAssessment
  );
}