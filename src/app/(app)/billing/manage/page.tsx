import type {
  Metadata,
} from "next";

import SubscriptionManager from "@/components/billing/SubscriptionManager";

import PlanChangeManager from "@/components/billing/PlanChangeManager";
import BillingHistory from "@/components/billing/BillingHistory";

export const metadata: Metadata = {
  title:
    "Manage Subscription | Speakvera AI",

  description:
    "View and manage your Speakvera AI subscription, billing plan, payment method and cancellation settings.",
};

export default function ManageSubscriptionPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-medium text-muted-foreground">
          Billing
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Manage subscription
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Manage your plan,
          billing cycle, payment
          method and subscription
          status.
        </p>
      </div>

      <div className="space-y-6">
        <SubscriptionManager />

        <PlanChangeManager />
        <BillingHistory />
      </div>
    </main>
  );
}