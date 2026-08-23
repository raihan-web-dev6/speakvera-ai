"use client";

import Link from "next/link";

import {
  Crown,
  Loader2,
  LockKeyhole,
} from "lucide-react";

import {
  useSubscription,
  type UserPlan,
} from "@/hooks/useSubscription";

type Props = {
  children: React.ReactNode;

  allowedPlans?: UserPlan[];

  title?: string;

  description?: string;
};

export default function SubscriptionGate({
  children,

  allowedPlans = [
    "PRO",
    "PREMIUM",
  ],

  title =
    "Upgrade to continue",

  description =
    "This feature is available on Speakvera Pro and Premium.",
}: Props) {
  const {
    plan,
    loading,
  } =
    useSubscription();

  if (loading) {
    return (
      <div className="flex min-h-48 items-center justify-center rounded-3xl border border-slate-200 bg-white">
        <Loader2
          size={22}
          className="animate-spin text-blue-600"
        />
      </div>
    );
  }

  if (
    allowedPlans.includes(
      plan
    )
  ) {
    return <>{children}</>;
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        <LockKeyhole
          size={25}
        />
      </div>

      <h2 className="mt-5 text-xl font-bold text-slate-950">
        {title}
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>

      <Link
        href="/billing"
        className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 font-semibold text-white"
      >
        <Crown size={17} />

        View plans
      </Link>
    </div>
  );
}