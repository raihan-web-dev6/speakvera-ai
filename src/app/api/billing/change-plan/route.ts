import {
  NextResponse,
} from "next/server";

import {
  auth,
} from "@/auth";

import connectDb from "@/lib/db";

import {
  getPaddleServer,
} from "@/lib/paddle";

import Subscription from "@/models/subscription.model";

export const runtime =
  "nodejs";

type Plan =
  | "PRO"
  | "PREMIUM";

type BillingCycle =
  | "MONTHLY"
  | "YEARLY";

type ChangeAction =
  | "preview"
  | "apply";

type RequestBody = {
  action:
    ChangeAction;

  targetPlan:
    Plan;

  targetBillingCycle:
    BillingCycle;
};

/*
 * =====================================================
 * PRICE RESOLVER
 * =====================================================
 */

function getPriceId(
  plan: Plan,
  billingCycle: BillingCycle
) {
  if (
    plan === "PRO" &&
    billingCycle === "MONTHLY"
  ) {
    return process.env
      .PADDLE_PRO_MONTHLY_PRICE_ID;
  }

  if (
    plan === "PRO" &&
    billingCycle === "YEARLY"
  ) {
    return process.env
      .PADDLE_PRO_YEARLY_PRICE_ID;
  }

  if (
    plan === "PREMIUM" &&
    billingCycle === "MONTHLY"
  ) {
    return process.env
      .PADDLE_PREMIUM_MONTHLY_PRICE_ID;
  }

  return process.env
    .PADDLE_PREMIUM_YEARLY_PRICE_ID;
}

/*
 * =====================================================
 * VALIDATION
 * =====================================================
 */

function isPlan(
  value: unknown
): value is Plan {
  return (
    value === "PRO" ||
    value === "PREMIUM"
  );
}

function isBillingCycle(
  value: unknown
): value is BillingCycle {
  return (
    value === "MONTHLY" ||
    value === "YEARLY"
  );
}

function isAction(
  value: unknown
): value is ChangeAction {
  return (
    value === "preview" ||
    value === "apply"
  );
}

/*
 * =====================================================
 * POST
 * =====================================================
 */

export async function POST(
  request: Request
) {
  try {
    /*
     * ==========================================
     * AUTH
     * ==========================================
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
     * ==========================================
     * BODY
     * ==========================================
     */

    const body =
      (await request.json()) as Partial<RequestBody>;

    const {
      action,
      targetPlan,
      targetBillingCycle,
    } = body;

    if (
      !isAction(action) ||
      !isPlan(targetPlan) ||
      !isBillingCycle(
        targetBillingCycle
      )
    ) {
      return NextResponse.json(
        {
          message:
            "Invalid plan change request.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ==========================================
     * TARGET PRICE
     * ==========================================
     */

    const targetPriceId =
      getPriceId(
        targetPlan,
        targetBillingCycle
      );

    if (!targetPriceId) {
      return NextResponse.json(
        {
          message:
            "Paddle price is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * ==========================================
     * DATABASE SUBSCRIPTION
     * ==========================================
     */

    await connectDb();

    const subscription =
      await Subscription.findOne({
        userId,
      });

    if (
      !subscription ||
      !subscription
        .paddleSubscriptionId
    ) {
      return NextResponse.json(
        {
          message:
            "You do not have an active Paddle subscription. Start a plan from the pricing page.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Only ACTIVE/TRIALING subscriptions
     * should be changed.
     */

    if (
      subscription.status !==
        "ACTIVE" &&
      subscription.status !==
        "TRIALING"
    ) {
      return NextResponse.json(
        {
          message:
            "This subscription cannot be changed. Start a new subscription instead.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Don't change a subscription that is
     * already scheduled for cancellation.
     *
     * User can remove cancellation first
     * using the Paddle customer portal.
     */

    if (
      subscription.cancelAtPeriodEnd
    ) {
      return NextResponse.json(
        {
          message:
            "Remove the scheduled cancellation before changing your plan.",
        },
        {
          status: 409,
        }
      );
    }

    /*
     * Same plan + billing cycle.
     */

    if (
      subscription.priceId ===
      targetPriceId
    ) {
      return NextResponse.json(
        {
          message:
            "You are already subscribed to this plan.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ==========================================
     * GET LIVE PADDLE SUBSCRIPTION
     * ==========================================
     */

    const paddle =
      getPaddleServer();

    const paddleSubscription =
      await paddle.subscriptions.get(
        subscription
          .paddleSubscriptionId
      );

    /*
     * Paddle doesn't allow normal item
     * changes to past-due subscriptions.
     */

    if (
      paddleSubscription.status ===
      "past_due"
    ) {
      return NextResponse.json(
        {
          message:
            "Your payment is past due. Update your payment method before changing plans.",
        },
        {
          status: 409,
        }
      );
    }

    if (
      paddleSubscription.status !==
        "active" &&
      paddleSubscription.status !==
        "trialing"
    ) {
      return NextResponse.json(
        {
          message:
            "This Paddle subscription cannot currently be changed.",
        },
        {
          status: 409,
        }
      );
    }

    /*
     * ==========================================
     * PRORATION
     * ==========================================
     *
     * Trial:
     * Paddle requires do_not_bill.
     *
     * Active:
     * credit unused old-plan time and
     * charge for remaining new-plan time.
     */

    const prorationBillingMode =
      paddleSubscription.status ===
      "trialing"
        ? ("do_not_bill" as const)
        : ("prorated_immediately" as const);

    /*
     * IMPORTANT:
     *
     * Paddle expects the COMPLETE desired
     * recurring item list.
     *
     * Speakvera currently has one recurring
     * base-plan item, so replacing it with
     * the selected price is correct.
     */

    const updateBody = {
      items: [
        {
          priceId:
            targetPriceId,

          quantity:
            1,
        },
      ],

      prorationBillingMode,

      onPaymentFailure:
        "prevent_change" as const,
    };

    /*
     * ==========================================
     * PREVIEW
     * ==========================================
     */

    if (
      action === "preview"
    ) {
      const preview =
        await paddle.subscriptions.previewUpdate(
          subscription
            .paddleSubscriptionId,
          updateBody
        );

      const result =
        preview.updateSummary
          ?.result;

      return NextResponse.json({
        success:
          true,

        preview: {
          currentPlan:
            subscription.plan,

          currentBillingCycle:
            subscription.billingCycle,

          targetPlan,

          targetBillingCycle,

          prorationBillingMode,

          status:
            paddleSubscription.status,

          result:
            result
              ? {
                  action:
                    result.action,

                  amount:
                    result.amount,

                  currencyCode:
                    result.currencyCode,
                }
              : null,

          trialing:
            paddleSubscription.status ===
            "trialing",
        },
      });
    }

    /*
     * ==========================================
     * APPLY CHANGE
     * ==========================================
     */

    const updated =
      await paddle.subscriptions.update(
        subscription
          .paddleSubscriptionId,
        updateBody
      );

    /*
     * Do NOT manually update MongoDB here.
     *
     * Our Paddle webhook remains the
     * source of truth and will receive
     * subscription.updated.
     */

    return NextResponse.json({
      success:
        true,

      message:
        "Subscription updated successfully.",

      paddleSubscription: {
        id:
          updated.id,

        status:
          updated.status,

        targetPlan,

        targetBillingCycle,
      },
    });
  } catch (error) {
    console.error(
      "Change Paddle plan error:",
      error
    );

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to change subscription.",
      },
      {
        status: 500,
      }
    );
  }
}