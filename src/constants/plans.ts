export const PLANS = {
  FREE: {
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,

    description:
      "Start practicing English with limited daily AI speaking.",

    features: [
      "5 minutes AI speaking per day",
      "First 5 Everyday English lessons",
      "Basic speaking feedback",
      "1 IELTS practice session",
      "Basic progress tracking",
    ],

    certificate: false,
  },

  PRO: {
    name: "Pro",
    monthlyPrice: 6.99,
    yearlyPrice: 69.99,

    description:
      "Full access for serious English learners.",

    features: [
      "Full 40-day English course",
      "More AI speaking time",
      "Full grammar feedback",
      "Full vocabulary feedback",
      "Pronunciation analysis",
      "IELTS speaking practice",
      "IELTS mock tests",
      "Progress history",
      "Speakvera certificates",
    ],

    certificate: true,
  },

  PREMIUM: {
    name: "Premium",
    monthlyPrice: 12.99,
    yearlyPrice: 129.99,

    description:
      "Maximum practice and advanced AI learning.",

    features: [
      "Everything in Pro",
      "Higher AI speaking allowance",
      "Advanced IELTS practice",
      "More mock tests",
      "Advanced speaking assessments",
      "Detailed reports",
      "Priority AI processing",
      "All certificates",
    ],

    certificate: true,
  },
} as const;

export type PlanName =
  keyof typeof PLANS;

export type PaidPlan =
  "PRO" | "PREMIUM";

export type BillingCycle =
  "MONTHLY" | "YEARLY";