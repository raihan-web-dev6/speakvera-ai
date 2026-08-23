import {
  Check,
  Crown,
} from "lucide-react";

import {
  redirect,
} from "next/navigation";

import { auth } from "@/auth";

import connectDb from "@/lib/db";

import Subscription from "@/models/subscription.model";

import {
  PLANS,
} from "@/constants/plans";

import PaddleCheckoutButton from "@/components/pricing/PaddleCheckoutButton";

export default async function BillingPage() {
  const session =
    await auth();

  const userId = (
    session?.user as {
      id?: string;
    }
  )?.id;

  if (!userId) {
    redirect("/login");
  }

  await connectDb();

  const subscription =
    await Subscription.findOne({
      userId,
    }).lean();

  const currentPlan =
    subscription?.plan ||
    "FREE";

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="text-center">
          <p className="text-sm font-semibold text-blue-600">
            Speakvera Plans
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
            Learn more. Speak more.
          </h1>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            Start free and upgrade when you want the complete Speakvera learning experience.
          </p>

          <div className="mx-auto mt-5 inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            Current plan:{" "}
            {currentPlan}
          </div>
        </section>

        <section className="mt-12 grid gap-5 lg:grid-cols-3">
          <PlanCard
            name="Free"
            price="$0"
            subtitle="Forever"
            features={
              PLANS.FREE.features
            }
            current={
              currentPlan ===
              "FREE"
            }
          />

          <PlanCard
            name="Pro"
            price="$6.99"
            subtitle="/ month"
            features={
              PLANS.PRO.features
            }
            popular
            current={
              currentPlan ===
              "PRO"
            }
          >
            <PaddleCheckoutButton
              plan="PRO"
              billingCycle="MONTHLY"
            />
          </PlanCard>

          <PlanCard
            name="Premium"
            price="$12.99"
            subtitle="/ month"
            features={
              PLANS.PREMIUM
                .features
            }
            current={
              currentPlan ===
              "PREMIUM"
            }
          >
            <PaddleCheckoutButton
              plan="PREMIUM"
              billingCycle="MONTHLY"
            />
          </PlanCard>
        </section>

        {subscription?.status ===
          "TRIALING" && (
          <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-5">
            <p className="font-semibold text-blue-900">
              Your Pro trial is active.
            </p>

            {subscription.trialEnd && (
              <p className="mt-1 text-sm text-blue-700">
                Trial ends{" "}
                {new Date(
                  subscription.trialEnd
                ).toLocaleDateString()}
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

function PlanCard({
  name,
  price,
  subtitle,
  features,
  popular,
  current,
  children,
}: {
  name: string;

  price: string;

  subtitle: string;

  features:
    readonly string[];

  popular?: boolean;

  current?: boolean;

  children?: React.ReactNode;
}) {
  return (
    <article
      className={`relative rounded-3xl border bg-white p-6 shadow-sm ${
        popular
          ? "border-blue-500"
          : "border-slate-200"
      }`}
    >
      {popular && (
        <div className="absolute -top-3 left-6 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
          Most popular
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-950">
          {name}
        </h2>

        {name !==
          "Free" && (
          <Crown
            className="text-blue-600"
            size={21}
          />
        )}
      </div>

      <div className="mt-5">
        <span className="text-4xl font-bold text-slate-950">
          {price}
        </span>

        <span className="text-sm text-slate-500">
          {subtitle}
        </span>
      </div>

      <ul className="mt-7 space-y-3">
        {features.map(
          (feature) => (
            <li
              key={feature}
              className="flex gap-3 text-sm text-slate-600"
            >
              <Check
                size={16}
                className="mt-0.5 shrink-0 text-emerald-600"
              />

              {feature}
            </li>
          )
        )}
      </ul>

      <div className="mt-7">
        {current ? (
          <div className="flex min-h-11 items-center justify-center rounded-xl bg-slate-100 font-semibold text-slate-600">
            Current plan
          </div>
        ) : (
          children
        )}
      </div>
    </article>
  );
}