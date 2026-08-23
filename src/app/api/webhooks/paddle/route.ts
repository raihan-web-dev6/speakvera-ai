import {
  NextResponse,
} from "next/server";

import connectDb from "@/lib/db";

import {
  getPaddleServer,
} from "@/lib/paddle";

import {
  resolvePlanFromPriceId,
} from "@/lib/subscription";

import {
  verifyBillingSignature,
} from "@/lib/billing-signature";

import Subscription from "@/models/subscription.model";

export const runtime =
  "nodejs";

type PaddleWebhook = {
  event_id:
    string;

  event_type:
    string;

  occurred_at:
    string;

  notification_id?:
    string;

  data: {
    id:
      string;

    status:
      string;

    customer_id?:
      string;

    transaction_id?:
      string;

    custom_data?:
      {
        userId?:
          string;

        billingSignature?:
          string;
      } | null;

    items?: {
      price?: {
        id?:
          string;
      };
    }[];

    current_billing_period?:
      {
        starts_at?:
          string;

        ends_at?:
          string;
      } | null;

    scheduled_change?:
      {
        action?:
          string;

        effective_at?:
          string;
      } | null;

    next_billed_at?:
      string | null;
  };
};

/*
 * =====================================================
 * PADDLE → SPEAKVERA STATUS
 * =====================================================
 */

function mapStatus(
  status: string
):
  | "ACTIVE"
  | "TRIALING"
  | "PAST_DUE"
  | "PAUSED"
  | "CANCELED" {
  switch (
    status.toLowerCase()
  ) {
    case "trialing":
      return "TRIALING";

    case "past_due":
      return "PAST_DUE";

    case "paused":
      return "PAUSED";

    case "canceled":
      return "CANCELED";

    case "active":
    default:
      return "ACTIVE";
  }
}

/*
 * =====================================================
 * WEBHOOK
 * =====================================================
 */

export async function POST(
  request: Request
) {
  /*
   * IMPORTANT:
   *
   * Paddle signature verification
   * requires the untouched raw body.
   */

  const rawBody =
    await request.text();

  const signature =
    request.headers.get(
      "paddle-signature"
    );

  const webhookSecret =
    process.env
      .PADDLE_WEBHOOK_SECRET;

  /*
   * Missing webhook credentials.
   */

  if (
    !signature ||
    !webhookSecret
  ) {
    console.error(
      "Paddle webhook: missing signature or webhook secret"
    );

    return new NextResponse(
      "Missing webhook credentials",
      {
        status:
          400,
      }
    );
  }

  try {
    /*
     * =================================================
     * VERIFY PADDLE SIGNATURE
     * =================================================
     */

    const paddle =
      getPaddleServer();

    /*
     * Paddle's SDK verifies:
     *
     * - signature
     * - timestamp
     * - webhook body
     *
     * Do this BEFORE JSON.parse().
     */

    await paddle.webhooks.unmarshal(
      rawBody,
      webhookSecret,
      signature
    );

    /*
     * Signature is valid.
     * Now the raw body is safe
     * to parse.
     */

    const payload =
      JSON.parse(
        rawBody
      ) as PaddleWebhook;

    console.log(
      "PADDLE EVENT:",
      payload.event_type,
      payload.event_id
    );

    /*
     * =================================================
     * IGNORE NON-SUBSCRIPTION EVENTS
     * =================================================
     *
     * You may subscribe Paddle to:
     *
     * transaction.completed
     * transaction.payment_failed
     * etc.
     *
     * Those should still receive
     * HTTP 200 so Paddle knows we
     * accepted the webhook.
     */

    if (
      !payload.event_type.startsWith(
        "subscription."
      )
    ) {
      return NextResponse.json({
        received:
          true,

        ignored:
          payload.event_type,
      });
    }

    const data =
      payload.data;

    /*
     * =================================================
     * GET SPEAKVERA USER IDENTITY
     * =================================================
     *
     * Checkout custom_data:
     *
     * {
     *   userId,
     *   billingSignature
     * }
     *
     * Paddle copies transaction
     * custom_data to the generated
     * subscription.
     */

    const userId =
      data.custom_data
        ?.userId;

    const billingSignature =
      data.custom_data
        ?.billingSignature;

    if (
      !userId ||
      !billingSignature
    ) {
      console.error(
        "Paddle webhook missing custom_data identity",
        {
          event:
            payload.event_type,

          subscriptionId:
            data.id,
        }
      );

      return new NextResponse(
        "Missing subscription identity",
        {
          status:
            400,
        }
      );
    }

    /*
     * =================================================
     * VERIFY OUR OWN USER SIGNATURE
     * =================================================
     *
     * Prevent somebody from simply
     * putting another Speakvera
     * user's ID in Paddle custom
     * data.
     */

    const validIdentity =
      verifyBillingSignature(
        userId,
        billingSignature
      );

    if (
      !validIdentity
    ) {
      console.error(
        "Invalid Speakvera billing signature",
        {
          userId,

          subscriptionId:
            data.id,
        }
      );

      return new NextResponse(
        "Invalid billing identity",
        {
          status:
            400,
        }
      );
    }

    /*
     * =================================================
     * PRICE
     * =================================================
     */

    const priceId =
      data.items?.[0]
        ?.price?.id;

    if (!priceId) {
      console.error(
        "Paddle subscription has no price",
        data.id
      );

      return new NextResponse(
        "Missing Paddle price",
        {
          status:
            400,
        }
      );
    }

    /*
     * Paddle price ID →
     *
     * PRO / PREMIUM
     * MONTHLY / YEARLY
     */

    const resolved =
      resolvePlanFromPriceId(
        priceId
      );

    if (!resolved) {
      console.error(
        "Unknown Paddle price:",
        priceId
      );

      return new NextResponse(
        "Unknown Paddle price",
        {
          status:
            400,
        }
      );
    }

    /*
     * =================================================
     * DATABASE
     * =================================================
     */

    await connectDb();

    const eventAt =
      new Date(
        payload.occurred_at
      );

    const existing =
      await Subscription.findOne({
        userId,
      });

    /*
     * =================================================
     * DUPLICATE EVENT
     * =================================================
     *
     * Paddle may retry a webhook
     * if it doesn't get a successful
     * response quickly.
     */

    if (
      existing
        ?.lastPaddleEventId ===
      payload.event_id
    ) {
      return NextResponse.json({
        received:
          true,

        ignored:
          "duplicate event",
      });
    }

    /*
     * =================================================
     * OUT-OF-ORDER EVENT
     * =================================================
     *
     * Paddle webhooks may arrive
     * in a different order.
     *
     * Don't let an older event
     * overwrite a newer state.
     */

    if (
      existing?.lastEventAt &&
      existing.lastEventAt >
        eventAt
    ) {
      return NextResponse.json({
        received:
          true,

        ignored:
          "older event",
      });
    }

    /*
     * =================================================
     * STATUS
     * =================================================
     */

    const status =
      mapStatus(
        data.status
      );

    /*
     * =================================================
     * DATABASE UPDATE
     * =================================================
     */

    const update: Record<
      string,
      unknown
    > = {
      userId,

      plan:
        resolved.plan,

      billingCycle:
        resolved.billingCycle,

      status,

      paddleSubscriptionId:
        data.id,

      paddleCustomerId:
        data.customer_id,

      priceId,

      /*
       * Paddle creates a scheduled
       * change when cancellation is
       * requested for the end of the
       * billing period.
       */

      cancelAtPeriodEnd:
        data.scheduled_change
          ?.action ===
        "cancel",

      lastPaddleEventId:
        payload.event_id,

      lastEventAt:
        eventAt,
    };

    /*
     * =================================================
     * BILLING PERIOD
     * =================================================
     */

    const period =
      data.current_billing_period;

    if (
      period?.starts_at
    ) {
      update.currentPeriodStart =
        new Date(
          period.starts_at
        );
    }

    if (
      period?.ends_at
    ) {
      update.currentPeriodEnd =
        new Date(
          period.ends_at
        );
    }

    /*
     * =================================================
     * TRIAL
     * =================================================
     */

    if (
      status ===
      "TRIALING"
    ) {
      if (
        period?.starts_at
      ) {
        update.trialStart =
          new Date(
            period.starts_at
          );
      }

      if (
        period?.ends_at
      ) {
        update.trialEnd =
          new Date(
            period.ends_at
          );
      }
    }

    /*
     * =================================================
     * UPSERT
     * =================================================
     *
     * First webhook:
     * creates subscription.
     *
     * Later webhook:
     * updates existing record.
     */

    const subscription =
      await Subscription.findOneAndUpdate(
        {
          userId,
        },

        {
          $set:
            update,
        },

        {
          upsert:
            true,

          new:
            true,

          setDefaultsOnInsert:
            true,
        }
      );

    console.log(
      "PADDLE SUBSCRIPTION SYNCED:",
      {
        userId,

        paddleSubscriptionId:
          data.id,

        plan:
          resolved.plan,

        billingCycle:
          resolved.billingCycle,

        status:
          subscription.status,
      }
    );

    /*
     * Paddle expects a successful
     * HTTP response.
     */

    return NextResponse.json({
      received:
        true,

      event:
        payload.event_type,

      plan:
        resolved.plan,

      status:
        subscription.status,
    });
  } catch (error) {
    /*
     * Signature failure,
     * invalid payload,
     * database failure, etc.
     */

    console.error(
      "Paddle webhook error:",
      error
    );

    return new NextResponse(
      "Invalid webhook",
      {
        status:
          400,
      }
    );
  }
}