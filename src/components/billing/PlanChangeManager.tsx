"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  ArrowRight,
  Check,
  Crown,
  Loader2,
  Sparkles,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Button,
} from "@/components/ui/button";

import {
  Badge,
} from "@/components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Plan =
  | "PRO"
  | "PREMIUM";

type BillingCycle =
  | "MONTHLY"
  | "YEARLY";

type SubscriptionResponse = {
  subscription: {
    plan:
      | "FREE"
      | "PRO"
      | "PREMIUM";

    storedPlan?:
      | "FREE"
      | "PRO"
      | "PREMIUM";

    status:
      string;

    billingCycle:
      BillingCycle | null;

    cancelAtPeriodEnd:
      boolean;
  };
};

type PreviewData = {
  currentPlan:
    string;

  currentBillingCycle:
    string;

  targetPlan:
    Plan;

  targetBillingCycle:
    BillingCycle;

  prorationBillingMode:
    string;

  status:
    string;

  trialing:
    boolean;

  result: {
    action:
      "charge"
      | "credit";

    amount:
      string;

    currencyCode:
      string;
  } | null;
};

type SelectedPlan = {
  plan:
    Plan;

  billingCycle:
    BillingCycle;
};

const plans = [
  {
    plan:
      "PRO" as const,

    billingCycle:
      "MONTHLY" as const,

    title:
      "Pro Monthly",

    price:
      "$6.99",

    suffix:
      "/month",
  },

  {
    plan:
      "PRO" as const,

    billingCycle:
      "YEARLY" as const,

    title:
      "Pro Yearly",

    price:
      "$69.99",

    suffix:
      "/year",
  },

  {
    plan:
      "PREMIUM" as const,

    billingCycle:
      "MONTHLY" as const,

    title:
      "Premium Monthly",

    price:
      "$12.99",

    suffix:
      "/month",
  },

  {
    plan:
      "PREMIUM" as const,

    billingCycle:
      "YEARLY" as const,

    title:
      "Premium Yearly",

    price:
      "$129.99",

    suffix:
      "/year",
  },
];

function formatMoney(
  amount:
    string,

  currencyCode:
    string
) {
  const number =
    Number(amount) /
    100;

  return new Intl.NumberFormat(
    undefined,
    {
      style:
        "currency",

      currency:
        currencyCode,
    }
  ).format(
    Math.abs(number)
  );
}

export default function PlanChangeManager() {
  const [
    currentPlan,
    setCurrentPlan,
  ] =
    useState<
      | "FREE"
      | "PRO"
      | "PREMIUM"
    >("FREE");

  const [
    currentBillingCycle,
    setCurrentBillingCycle,
  ] =
    useState<BillingCycle | null>(
      null
    );

  const [
    subscriptionStatus,
    setSubscriptionStatus,
  ] =
    useState("");

  const [
    cancelAtPeriodEnd,
    setCancelAtPeriodEnd,
  ] =
    useState(false);

  const [
    pageLoading,
    setPageLoading,
  ] =
    useState(true);

  const [
    selected,
    setSelected,
  ] =
    useState<SelectedPlan | null>(
      null
    );

  const [
    preview,
    setPreview,
  ] =
    useState<PreviewData | null>(
      null
    );

  const [
    previewLoading,
    setPreviewLoading,
  ] =
    useState(false);

  const [
    applying,
    setApplying,
  ] =
    useState(false);

  /*
   * ==========================================
   * LOAD CURRENT SUBSCRIPTION
   * ==========================================
   */

  async function loadSubscription() {
    try {
      setPageLoading(
        true
      );

      const response =
        await fetch(
          "/api/billing/subscription",
          {
            cache:
              "no-store",
          }
        );

      const data =
        (await response.json()) as SubscriptionResponse;

      if (!response.ok) {
        throw new Error(
          "Unable to load subscription."
        );
      }

      setCurrentPlan(
        data.subscription.plan
      );

      setCurrentBillingCycle(
        data.subscription
          .billingCycle
      );

      setSubscriptionStatus(
        data.subscription.status
      );

      setCancelAtPeriodEnd(
        data.subscription
          .cancelAtPeriodEnd
      );
    } catch (error) {
      console.error(
        error
      );

      toast.error(
        "Unable to load your subscription."
      );
    } finally {
      setPageLoading(
        false
      );
    }
  }

  useEffect(() => {
    loadSubscription();
  }, []);

  /*
   * ==========================================
   * PREVIEW CHANGE
   * ==========================================
   */

  async function previewChange(
    target:
      SelectedPlan
  ) {
    try {
      setSelected(
        target
      );

      setPreviewLoading(
        true
      );

      setPreview(
        null
      );

      const response =
        await fetch(
          "/api/billing/change-plan",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                action:
                  "preview",

                targetPlan:
                  target.plan,

                targetBillingCycle:
                  target.billingCycle,
              }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to preview subscription change."
        );
      }

      setPreview(
        data.preview
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to preview change."
      );

      setSelected(
        null
      );
    } finally {
      setPreviewLoading(
        false
      );
    }
  }

  /*
   * ==========================================
   * APPLY CHANGE
   * ==========================================
   */

  async function applyChange() {
    if (!selected) {
      return;
    }

    try {
      setApplying(
        true
      );

      const response =
        await fetch(
          "/api/billing/change-plan",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                action:
                  "apply",

                targetPlan:
                  selected.plan,

                targetBillingCycle:
                  selected.billingCycle,
              }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to change subscription."
        );
      }

      toast.success(
        "Your subscription has been updated."
      );

      setSelected(
        null
      );

      setPreview(
        null
      );

      /*
       * Webhook normally arrives quickly.
       */

      await new Promise(
        (
          resolve
        ) =>
          setTimeout(
            resolve,
            1500
          )
      );

      await loadSubscription();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to change subscription."
      );
    } finally {
      setApplying(
        false
      );
    }
  }

  if (
    pageLoading
  ) {
    return (
      <Card>
        <CardContent className="flex min-h-48 items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  /*
   * Free/canceled users should create a new
   * checkout, not update an old subscription.
   */

  if (
    currentPlan ===
    "FREE"
  ) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            Choose a paid plan
          </CardTitle>

          <CardDescription>
            You currently have
            the Free plan. Start a
            new subscription from
            the pricing page.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Button
            onClick={() => {
              window.location.href =
                "/pricing";
            }}
          >
            View pricing

            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>
                Change plan
              </CardTitle>

              <CardDescription className="mt-1">
                Upgrade, downgrade or
                switch your billing
                cycle without creating
                another subscription.
              </CardDescription>
            </div>

            <Badge variant="secondary">
              {currentPlan}{" "}
              {currentBillingCycle}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          {cancelAtPeriodEnd && (
            <div className="mb-5 rounded-xl border p-4 text-sm">
              Your subscription is
              scheduled for
              cancellation. Remove the
              cancellation first before
              changing plans.
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {plans.map(
              (
                option
              ) => {
                const isCurrent =
                  currentPlan ===
                    option.plan &&
                  currentBillingCycle ===
                    option.billingCycle;

                return (
                  <div
                    key={`${option.plan}-${option.billingCycle}`}
                    className="rounded-xl border p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          {option.plan ===
                          "PREMIUM" ? (
                            <Crown className="h-4 w-4" />
                          ) : (
                            <Sparkles className="h-4 w-4" />
                          )}

                          <p className="font-semibold">
                            {
                              option.title
                            }
                          </p>
                        </div>

                        <div className="mt-3">
                          <span className="text-2xl font-bold">
                            {
                              option.price
                            }
                          </span>

                          <span className="text-sm text-muted-foreground">
                            {
                              option.suffix
                            }
                          </span>
                        </div>
                      </div>

                      {isCurrent && (
                        <Badge>
                          <Check className="mr-1 h-3 w-3" />

                          Current
                        </Badge>
                      )}
                    </div>

                    <Button
                      type="button"
                      className="mt-5 w-full"
                      variant={
                        isCurrent
                          ? "secondary"
                          : "outline"
                      }
                      disabled={
                        isCurrent ||
                        cancelAtPeriodEnd ||
                        previewLoading
                      }
                      onClick={() =>
                        previewChange({
                          plan:
                            option.plan,

                          billingCycle:
                            option.billingCycle,
                        })
                      }
                    >
                      {isCurrent
                        ? "Current plan"
                        : "Choose plan"}
                    </Button>
                  </div>
                );
              }
            )}
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Active subscriptions
            use Paddle proration.
            Trial subscriptions are
            not charged immediately
            when switching plans.
          </p>
        </CardContent>
      </Card>

      <Dialog
        open={
          selected !==
          null
        }
        onOpenChange={(
          open
        ) => {
          if (
            !open &&
            !applying
          ) {
            setSelected(
              null
            );

            setPreview(
              null
            );
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Confirm plan change
            </DialogTitle>

            <DialogDescription>
              Review the Paddle
              billing impact before
              changing your
              subscription.
            </DialogDescription>
          </DialogHeader>

          {previewLoading && (
            <div className="flex min-h-36 items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          )}

          {!previewLoading &&
            preview && (
              <div className="space-y-4">
                <div className="rounded-xl border p-4">
                  <p className="text-sm text-muted-foreground">
                    Change
                  </p>

                  <p className="mt-1 font-semibold">
                    {
                      preview.currentPlan
                    }{" "}
                    {
                      preview.currentBillingCycle
                    }
                    {" → "}
                    {
                      preview.targetPlan
                    }{" "}
                    {
                      preview.targetBillingCycle
                    }
                  </p>
                </div>

                {preview.trialing ? (
                  <div className="rounded-xl border p-4">
                    <p className="font-medium">
                      No immediate
                      charge
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Your trial
                      continues. The
                      selected plan
                      becomes the plan
                      Paddle uses for
                      billing after the
                      trial.
                    </p>
                  </div>
                ) : preview.result ? (
                  <div className="rounded-xl border p-4">
                    <p className="text-sm text-muted-foreground">
                      Proration result
                    </p>

                    <p className="mt-1 text-lg font-semibold">
                      {preview.result
                        .action ===
                      "charge"
                        ? "Charge "
                        : "Credit "}

                      {formatMoney(
                        preview.result
                          .amount,
                        preview.result
                          .currencyCode
                      )}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Paddle calculates
                      this from the
                      unused portion of
                      your current plan
                      and the remaining
                      time on the new
                      plan.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl border p-4 text-sm text-muted-foreground">
                    Paddle reports no
                    immediate prorated
                    charge or credit.
                  </div>
                )}
              </div>
            )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={
                applying
              }
              onClick={() => {
                setSelected(
                  null
                );

                setPreview(
                  null
                );
              }}
            >
              Cancel
            </Button>

            <Button
              type="button"
              disabled={
                !preview ||
                previewLoading ||
                applying
              }
              onClick={
                applyChange
              }
            >
              {applying && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}

              Confirm change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}