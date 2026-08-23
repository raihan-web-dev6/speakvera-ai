import { NextResponse } from "next/server";

import { auth } from "@/auth";

import {
  getPaddlePriceId,
} from "@/lib/subscription";

import {
  createBillingSignature,
} from "@/lib/billing-signature";

import type {
  BillingCycle,
  PaidPlan,
} from "@/constants/plans";

export async function POST(
  request: Request
) {
  try {
    const session =
      await auth();

    const userId = (
      session?.user as {
        id?: string;
      }
    )?.id;

    const email =
      session?.user?.email;

    if (
      !userId ||
      !email
    ) {
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
      plan,
      billingCycle,
    }: {
      plan: PaidPlan;

      billingCycle:
        BillingCycle;
    } =
      await request.json();

    if (
      ![
        "PRO",
        "PREMIUM",
      ].includes(plan)
    ) {
      return NextResponse.json(
        {
          message:
            "Invalid plan",
        },

        {
          status: 400,
        }
      );
    }

    if (
      ![
        "MONTHLY",
        "YEARLY",
      ].includes(
        billingCycle
      )
    ) {
      return NextResponse.json(
        {
          message:
            "Invalid billing cycle",
        },

        {
          status: 400,
        }
      );
    }

    const priceId =
      getPaddlePriceId(
        plan,
        billingCycle
      );

    const billingSignature =
      createBillingSignature(
        userId
      );

    return NextResponse.json({
      priceId,

      customer: {
        email,
      },

      customData: {
        userId,

        billingSignature,
      },
    });
  } catch (error) {
    console.error(
      "Checkout config error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Could not prepare checkout",
      },

      {
        status: 500,
      }
    );
  }
}