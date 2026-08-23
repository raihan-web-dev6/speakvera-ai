"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Crown,
  ExternalLink,
  Loader2,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  format,
} from "date-fns";

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
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

type SubscriptionData = {
  plan:
    | "FREE"
    | "PRO"
    | "PREMIUM";

  storedPlan?:
    | "FREE"
    | "PRO"
    | "PREMIUM";

  status:
    | "FREE"
    | "ACTIVE"
    | "TRIALING"
    | "PAST_DUE"
    | "PAUSED"
    | "CANCELED";

  billingCycle:
    | "MONTHLY"
    | "YEARLY"
    | null;

  currentPeriodStart:
    string | null;

  currentPeriodEnd:
    string | null;

  trialStart:
    string | null;

  trialEnd:
    string | null;

  cancelAtPeriodEnd:
    boolean;

  paddleSubscriptionId?:
    string | null;

  managementUrls: {
    cancel:
      string | null;

    updatePaymentMethod:
      string | null;
  };
};

type ApiResponse = {
  subscription:
    SubscriptionData;
};

function formatDate(
  value: string | null
) {
  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "—";
  }

  return format(
    date,
    "MMM d, yyyy"
  );
}

function getStatusLabel(
  status:
    SubscriptionData["status"]
) {
  switch (status) {
    case "ACTIVE":
      return "Active";

    case "TRIALING":
      return "Free trial";

    case "PAST_DUE":
      return "Payment due";

    case "PAUSED":
      return "Paused";

    case "CANCELED":
      return "Canceled";

    default:
      return "Free";
  }
}

function getPlanDescription(
  plan:
    SubscriptionData["plan"]
) {
  switch (plan) {
    case "PREMIUM":
      return "Maximum speaking time, AI usage, IELTS practice, assessments and certificates.";

    case "PRO":
      return "Full course access, higher AI limits, IELTS practice, assessments and certificates.";

    default:
      return "Start with free speaking practice and upgrade whenever you need more.";
  }
}

export default function SubscriptionManager() {
  const [
    subscription,
    setSubscription,
  ] =
    useState<SubscriptionData | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  const loadSubscription =
    useCallback(
      async () => {
        try {
          setLoading(true);

          setError("");

          const response =
            await fetch(
              "/api/billing/subscription",
              {
                method:
                  "GET",

                cache:
                  "no-store",
              }
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.message ||
                "Unable to load billing information."
            );
          }

          setSubscription(
            (
              data as ApiResponse
            ).subscription
          );
        } catch (error) {
          setError(
            error instanceof Error
              ? error.message
              : "Unable to load billing information."
          );
        } finally {
          setLoading(false);
        }
      },
      []
    );

  useEffect(() => {
    loadSubscription();
  }, [loadSubscription]);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex min-h-56 items-center justify-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />

            Loading subscription...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (
    error ||
    !subscription
  ) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />

        <AlertTitle>
          Billing unavailable
        </AlertTitle>

        <AlertDescription className="space-y-3">
          <p>
            {error ||
              "Unable to load your subscription."}
          </p>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={
              loadSubscription
            }
          >
            <RefreshCcw className="mr-2 h-4 w-4" />

            Try again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const isPaid =
    subscription.plan !==
    "FREE";

  const isTrialing =
    subscription.status ===
    "TRIALING";

  const isActive =
    subscription.status ===
    "ACTIVE";

  const isPastDue =
    subscription.status ===
    "PAST_DUE";

  const isCanceled =
    subscription.status ===
    "CANCELED";

  return (
    <div className="space-y-6">
      {subscription.cancelAtPeriodEnd &&
        subscription.currentPeriodEnd && (
          <Alert>
            <Clock3 className="h-4 w-4" />

            <AlertTitle>
              Cancellation scheduled
            </AlertTitle>

            <AlertDescription>
              Your{" "}
              {subscription.storedPlan ||
                subscription.plan}{" "}
              subscription remains active
              until{" "}
              <strong>
                {formatDate(
                  subscription.currentPeriodEnd
                )}
              </strong>
              . After that, your account
              will return to the Free plan.
            </AlertDescription>
          </Alert>
        )}

      {isPastDue && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />

          <AlertTitle>
            Payment needs attention
          </AlertTitle>

          <AlertDescription>
            Paddle could not successfully
            collect your latest payment.
            Update your payment method to
            restore paid access.
          </AlertDescription>
        </Alert>
      )}

      {isCanceled && (
        <Alert>
          <AlertCircle className="h-4 w-4" />

          <AlertTitle>
            Subscription canceled
          </AlertTitle>

          <AlertDescription>
            Your previous subscription is
            no longer active. Your account
            is currently using the Free
            plan.
          </AlertDescription>
        </Alert>
      )}

      <Card className="overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {subscription.plan ===
                "PREMIUM" ? (
                  <Crown className="h-5 w-5" />
                ) : subscription.plan ===
                  "PRO" ? (
                  <Sparkles className="h-5 w-5" />
                ) : (
                  <ShieldCheck className="h-5 w-5" />
                )}

                <CardTitle>
                  {subscription.plan ===
                  "FREE"
                    ? "Speakvera Free"
                    : `Speakvera ${subscription.plan}`}
                </CardTitle>
              </div>

              <CardDescription className="max-w-2xl">
                {getPlanDescription(
                  subscription.plan
                )}
              </CardDescription>
            </div>

            <Badge
              variant={
                isPaid
                  ? "default"
                  : "secondary"
              }
              className="w-fit"
            >
              {getStatusLabel(
                subscription.status
              )}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border p-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                <CreditCard className="h-4 w-4" />

                Billing cycle
              </div>

              <p className="font-semibold">
                {subscription.billingCycle
                  ? subscription.billingCycle ===
                    "MONTHLY"
                    ? "Monthly"
                    : "Yearly"
                  : "Free"}
              </p>
            </div>

            <div className="rounded-xl border p-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4" />

                {isTrialing
                  ? "Trial ends"
                  : subscription.cancelAtPeriodEnd
                    ? "Access ends"
                    : "Next renewal"}
              </div>

              <p className="font-semibold">
                {isTrialing
                  ? formatDate(
                      subscription.trialEnd
                    )
                  : formatDate(
                      subscription.currentPeriodEnd
                    )}
              </p>
            </div>

            <div className="rounded-xl border p-4 sm:col-span-2 lg:col-span-1">
              <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4" />

                Access
              </div>

              <p className="font-semibold">
                {isPaid
                  ? "Paid features enabled"
                  : "Free limits"}
              </p>
            </div>
          </div>

          {isTrialing && (
            <div className="rounded-xl border p-4">
              <p className="font-medium">
                Your free trial is active
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                You currently have full{" "}
                {subscription.plan} access.
                Your first paid billing
                period begins after the
                trial unless you cancel.
              </p>
            </div>
          )}

          {isActive && (
            <div className="rounded-xl border p-4">
              <p className="font-medium">
                Subscription active
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Your paid Speakvera
                benefits are active.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {!isPaid && (
              <Button
                type="button"
                onClick={() => {
                  window.location.href =
                    "/pricing";
                }}
              >
                <Sparkles className="mr-2 h-4 w-4" />

                View plans
              </Button>
            )}

            {isPaid &&
              subscription
                .managementUrls
                .updatePaymentMethod && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    window.location.href =
                      subscription
                        .managementUrls
                        .updatePaymentMethod!;
                  }}
                >
                  <CreditCard className="mr-2 h-4 w-4" />

                  Update payment method

                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              )}

            {isPaid &&
              !subscription.cancelAtPeriodEnd &&
              subscription
                .managementUrls
                .cancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    window.location.href =
                      subscription
                        .managementUrls
                        .cancel!;
                  }}
                >
                  Cancel subscription

                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              )}

            <Button
              type="button"
              variant="ghost"
              onClick={
                loadSubscription
              }
            >
              <RefreshCcw className="mr-2 h-4 w-4" />

              Refresh billing
            </Button>
          </div>

          {isPaid &&
            !subscription
              .managementUrls
              .updatePaymentMethod &&
            !subscription
              .managementUrls
              .cancel && (
              <p className="text-sm text-muted-foreground">
                Subscription management
                links are temporarily
                unavailable. Refresh the
                page and try again.
              </p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}