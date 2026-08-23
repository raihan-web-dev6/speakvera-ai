"use client";

import {
  Crown,
  Loader2,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  getPaddleClient,
} from "@/lib/paddle-client";

import type {
  BillingCycle,
  PaidPlan,
} from "@/constants/plans";

type Props = {
  plan: PaidPlan;

  billingCycle:
    BillingCycle;

  label?: string;
};

export default function PaddleCheckoutButton({
  plan,
  billingCycle,
  label = "Start 7-day trial",
}: Props) {
  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const openCheckout =
    async () => {
      try {
        setLoading(true);

        setError("");

        const response =
          await fetch(
            "/api/billing/checkout",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  plan,

                  billingCycle,
                }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Could not open checkout"
          );
        }

        const paddle =
          await getPaddleClient();

        if (!paddle) {
          throw new Error(
            "Paddle could not initialize"
          );
        }

        paddle.Checkout.open({
          items: [
            {
              priceId:
                data.priceId,

              quantity: 1,
            },
          ],

          customer: {
            email:
              data.customer.email,
          },

          customData:
            data.customData,

          settings: {
            displayMode:
              "overlay",

            theme:
              "light",
          },
        });
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Checkout failed"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div>
      <button
        type="button"
        onClick={
          openCheckout
        }
        disabled={
          loading
        }
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? (
          <Loader2
            size={17}
            className="animate-spin"
          />
        ) : (
          <Crown size={17} />
        )}

        {label}
      </button>

      {error && (
        <p className="mt-2 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}