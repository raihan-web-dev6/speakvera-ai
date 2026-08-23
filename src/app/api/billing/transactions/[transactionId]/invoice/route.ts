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

type RouteContext = {
  params:
    Promise<{
      transactionId:
        string;
    }>;
};

export async function GET(
  request: Request,
  context: RouteContext
) {
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

    const {
      transactionId,
    } =
      await context.params;

    if (
      !transactionId ||
      !transactionId.startsWith(
        "txn_"
      )
    ) {
      return NextResponse.json(
        {
          message:
            "Invalid transaction.",
        },
        {
          status: 400,
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
      return NextResponse.json(
        {
          message:
            "Billing customer not found.",
        },
        {
          status: 404,
        }
      );
    }

    const paddle =
      getPaddleServer();

    /*
     * =========================================
     * VERIFY TRANSACTION OWNERSHIP
     * =========================================
     */

    const transaction =
      await paddle.transactions.get(
        transactionId
      );

    if (
      transaction.customerId !==
      subscription
        .paddleCustomerId
    ) {
      return NextResponse.json(
        {
          message:
            "Transaction not found.",
        },
        {
          status: 404,
        }
      );
    }

    const total =
      transaction.details
        ?.totals
        ?.total ??
      "0";

    if (
      transaction.status !==
        "completed" ||
      Number(total) <= 0
    ) {
      return NextResponse.json(
        {
          message:
            "Invoice is not available for this transaction.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * =========================================
     * GET TEMPORARY PADDLE INVOICE URL
     * =========================================
     */

    const invoice =
      await paddle.transactions.getInvoicePDF(
        transactionId,
        {
          disposition:
            "inline",
        }
      );

    if (!invoice.url) {
      return NextResponse.json(
        {
          message:
            "Invoice is unavailable.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * Redirect user to Paddle's
     * temporary PDF URL.
     */

    return NextResponse.redirect(
      invoice.url
    );
  } catch (error) {
    console.error(
      "Paddle invoice error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Unable to open invoice.",
      },
      {
        status: 500,
      }
    );
  }
}