import {
  NextResponse,
} from "next/server";

import { auth } from "@/auth";

import connectDb from "@/lib/db";

import Subscription from "@/models/subscription.model";

export async function GET() {
  try {
    const session =
      await auth();

    const userId = (
      session?.user as {
        id?: string;
      }
    )?.id;

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
      }).lean();

    if (!subscription) {
      return NextResponse.json({
        plan: "FREE",

        status: "ACTIVE",

        paidAccess:
          false,
      });
    }

    const paidAccess =
      subscription.plan !==
        "FREE" &&
      [
        "ACTIVE",
        "TRIALING",
      ].includes(
        subscription.status
      );

    return NextResponse.json({
      subscription,

      plan:
        subscription.plan,

      status:
        subscription.status,

      paidAccess,
    });
  } catch (error) {
    console.error(
      "Billing status:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Could not load subscription",
      },

      {
        status: 500,
      }
    );
  }
}