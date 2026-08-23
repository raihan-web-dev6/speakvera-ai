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

    await connectDb();

    const subscription =
      await Subscription.findOne({
        userId,
      })
        .select(
          "paddleCustomerId"
        )
        .lean();

    if (
      !subscription
        ?.paddleCustomerId
    ) {
      return NextResponse.json({
        transactions: [],
      });
    }

    const paddle =
      getPaddleServer();

    /*
     * Paddle list operations return
     * a collection/iterator.
     */

    const collection =
      paddle.transactions.list({
        customerId: [
          subscription
            .paddleCustomerId,
        ],

        perPage:
          30,
      });

    const page =
      await collection.next();

    /*
     * Hide draft/ready checkout
     * transactions from customer
     * billing history.
     */

    const visibleStatuses =
      new Set([
        "completed",
        "paid",
        "past_due",
        "canceled",
        "billed",
      ]);

    const transactions =
      page
        .filter((transaction) =>
          visibleStatuses.has(
            transaction.status
          )
        )
        .map(
          (
            transaction
          ) => {
            const total =
              transaction.details
                ?.totals
                ?.total ??
              "0";

            return {
              id:
                transaction.id,

              status:
                transaction.status,

              origin:
                transaction.origin,

              currencyCode:
                transaction
                  .currencyCode,

              total,

              createdAt:
                transaction
                  .createdAt,

              billedAt:
                transaction
                  .billedAt ??
                null,

              subscriptionId:
                transaction
                  .subscriptionId ??
                null,

              /*
               * Paddle only provides
               * invoice PDFs for
               * supported billed/
               * completed transactions.
               *
               * Our invoice endpoint
               * performs the final
               * validation.
               */

              canDownloadInvoice:
                transaction.status ===
                  "completed" &&
                Number(total) >
                  0,
            };
          }
        )
        .sort(
          (
            a,
            b
          ) =>
            new Date(
              b.createdAt
            ).getTime() -
            new Date(
              a.createdAt
            ).getTime()
        );

    return NextResponse.json({
      transactions,
    });
  } catch (error) {
    console.error(
      "Billing transaction history error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Unable to load payment history.",
      },
      {
        status: 500,
      }
    );
  }
}