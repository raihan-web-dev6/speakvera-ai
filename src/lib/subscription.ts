import type {
  BillingCycle,
  PaidPlan,
} from "@/constants/plans";

import connectDb from "@/lib/db";

import Subscription from "@/models/subscription.model";

/*
 * =========================================================
 * PADDLE PRICE ID
 * =========================================================
 *
 * Converts:
 *
 * PRO + MONTHLY
 *
 * into:
 *
 * PADDLE_PRO_MONTHLY_PRICE_ID
 */

export function getPaddlePriceId(
  plan: PaidPlan,
  billingCycle: BillingCycle
) {
  const prices = {
    PRO: {
      MONTHLY:
        process.env
          .PADDLE_PRO_MONTHLY_PRICE_ID,

      YEARLY:
        process.env
          .PADDLE_PRO_YEARLY_PRICE_ID,
    },

    PREMIUM: {
      MONTHLY:
        process.env
          .PADDLE_PREMIUM_MONTHLY_PRICE_ID,

      YEARLY:
        process.env
          .PADDLE_PREMIUM_YEARLY_PRICE_ID,
    },
  };

  const priceId =
    prices[plan][billingCycle];

  if (!priceId) {
    throw new Error(
      `Missing Paddle price for ${plan} ${billingCycle}`
    );
  }

  return priceId;
}

/*
 * =========================================================
 * RESOLVE PLAN FROM PADDLE PRICE
 * =========================================================
 *
 * Used mainly by Paddle webhook.
 *
 * Example:
 *
 * pri_xxxxx
 *
 * becomes:
 *
 * {
 *   plan: "PRO",
 *   billingCycle: "MONTHLY"
 * }
 */

export function resolvePlanFromPriceId(
  priceId: string
): {
  plan: PaidPlan;
  billingCycle: BillingCycle;
} | null {
  const map = [
    {
      price:
        process.env
          .PADDLE_PRO_MONTHLY_PRICE_ID,

      plan: "PRO" as const,

      billingCycle:
        "MONTHLY" as const,
    },

    {
      price:
        process.env
          .PADDLE_PRO_YEARLY_PRICE_ID,

      plan: "PRO" as const,

      billingCycle:
        "YEARLY" as const,
    },

    {
      price:
        process.env
          .PADDLE_PREMIUM_MONTHLY_PRICE_ID,

      plan: "PREMIUM" as const,

      billingCycle:
        "MONTHLY" as const,
    },

    {
      price:
        process.env
          .PADDLE_PREMIUM_YEARLY_PRICE_ID,

      plan: "PREMIUM" as const,

      billingCycle:
        "YEARLY" as const,
    },
  ];

  const result =
    map.find(
      (item) =>
        item.price === priceId
    );

  if (!result) {
    return null;
  }

  return {
    plan: result.plan,

    billingCycle:
      result.billingCycle,
  };
}

/*
 * =========================================================
 * CHECK SUBSCRIPTION OBJECT
 * =========================================================
 *
 * Use this when you ALREADY have a subscription.
 *
 * Example:
 *
 * hasPaidAccess(subscription)
 */

export function hasPaidAccess(
  subscription:
    | {
        plan?: string;

        status?: string;
      }
    | null
    | undefined
): boolean {
  if (!subscription) {
    return false;
  }

  const paidPlan =
    subscription.plan ===
      "PRO" ||
    subscription.plan ===
      "PREMIUM";

  const activeStatus = [
    "ACTIVE",
    "TRIALING",
  ].includes(
    subscription.status ||
      ""
  );

  return (
    paidPlan &&
    activeStatus
  );
}

/*
 * =========================================================
 * CHECK PAID ACCESS FROM USER ID
 * =========================================================
 *
 * Use this in server pages/API routes when you only
 * have:
 *
 * userId
 *
 * Example:
 *
 * const paidAccess =
 *   await userHasPaidAccess(userId);
 */

export async function userHasPaidAccess(
  userId: string
): Promise<boolean> {
  await connectDb();

  const subscription =
    await Subscription.findOne({
      userId,
    }).select(
      "plan status"
    );

  if (!subscription) {
    return false;
  }

  return hasPaidAccess({
    plan:
      subscription.plan,

    status:
      subscription.status,
  });
}