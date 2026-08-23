"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

export type UserPlan =
  | "FREE"
  | "PRO"
  | "PREMIUM";

type SubscriptionData = {
  plan: UserPlan;

  status:
    | "ACTIVE"
    | "TRIALING"
    | "PAST_DUE"
    | "PAUSED"
    | "CANCELED";

  paidAccess: boolean;

  subscription?: {
    currentPeriodEnd?: string;

    trialEnd?: string;

    cancelAtPeriodEnd?: boolean;
  };
};

export function useSubscription() {
  const [data, setData] =
    useState<SubscriptionData | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const loadSubscription =
    useCallback(async () => {
      try {
        setLoading(true);

        const response = await fetch(
          "/api/billing/status",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          return;
        }

        const result =
          await response.json();

        setData(result);
      } catch (error) {
        console.error(
          "Subscription error:",
          error
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadSubscription();
  }, [loadSubscription]);

  return {
    plan:
      data?.plan || "FREE",

    status:
      data?.status || "ACTIVE",

    paidAccess:
      data?.paidAccess || false,

    subscription:
      data?.subscription,

    loading,

    refresh:
      loadSubscription,
  };
}