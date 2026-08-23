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

export async function GET() {
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
     * DATABASE
     * ==========================================
     */

    await connectDb();

    const subscription =
      await Subscription.findOne({
        userId,
      }).lean();

    /*
     * ==========================================
     * NO SUBSCRIPTION
     * ==========================================
     */

    if (!subscription) {
      return NextResponse.json({
        subscription: {
          plan:
            "FREE",

          status:
            "FREE",

          billingCycle:
            null,

          currentPeriodStart:
            null,

          currentPeriodEnd:
            null,

          trialStart:
            null,

          trialEnd:
            null,

          cancelAtPeriodEnd:
            false,

          managementUrls: {
            cancel:
              null,

            updatePaymentMethod:
              null,
          },
        },
      });
    }

    /*
     * ==========================================
     * ACCESS STATUS
     * ==========================================
     */

    const hasPaidAccess =
      subscription.status ===
        "ACTIVE" ||
      subscription.status ===
        "TRIALING";

    /*
     * A canceled / paused / past-due
     * historical record may still contain
     * plan: PRO/PREMIUM.
     *
     * For application access, treat it as FREE.
     */

    const effectivePlan =
      hasPaidAccess
        ? subscription.plan
        : "FREE";

    let cancelUrl:
      | string
      | null = null;

    let updatePaymentUrl:
      | string
      | null = null;

    /*
     * ==========================================
     * FRESH PADDLE MANAGEMENT LINKS
     * ==========================================
     *
     * Never store these links because Paddle
     * uses temporary customer portal tokens.
     */

    if (
      subscription
        .paddleSubscriptionId &&
      hasPaidAccess
    ) {
      try {
        const paddle =
          getPaddleServer();

        const paddleSubscription =
          await paddle.subscriptions.get(
            subscription
              .paddleSubscriptionId
          );

        cancelUrl =
          paddleSubscription
            .managementUrls
            ?.cancel ??
          null;

        updatePaymentUrl =
          paddleSubscription
            .managementUrls
            ?.updatePaymentMethod ??
          null;
      } catch (error) {
        /*
         * Don't fail the entire billing page
         * if Paddle management links cannot
         * temporarily be fetched.
         */

        console.error(
          "Unable to fetch Paddle management URLs:",
          error
        );
      }
    }

    /*
     * ==========================================
     * RESPONSE
     * ==========================================
     */

    return NextResponse.json({
      subscription: {
        plan:
          effectivePlan,

        storedPlan:
          subscription.plan,

        status:
          subscription.status,

        billingCycle:
          subscription.billingCycle ??
          null,

        currentPeriodStart:
          subscription.currentPeriodStart ??
          null,

        currentPeriodEnd:
          subscription.currentPeriodEnd ??
          null,

        trialStart:
          subscription.trialStart ??
          null,

        trialEnd:
          subscription.trialEnd ??
          null,

        cancelAtPeriodEnd:
          subscription.cancelAtPeriodEnd ??
          false,

        paddleSubscriptionId:
          subscription.paddleSubscriptionId ??
          null,

        managementUrls: {
          cancel:
            cancelUrl,

          updatePaymentMethod:
            updatePaymentUrl,
        },
      },
    });
  } catch (error) {
    console.error(
      "Get billing subscription error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Unable to load subscription",
      },
      {
        status: 500,
      }
    );
  }
}