import connectDb from "@/lib/db";

import Subscription from "@/models/subscription.model";

export async function getUserAccess(
  userId: string
) {
  await connectDb();

  const subscription =
    await Subscription.findOne({
      userId,
    }).lean();

  if (!subscription) {
    return {
      plan: "FREE" as const,

      status:
        "ACTIVE" as const,

      paidAccess: false,
    };
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

  return {
    plan:
      subscription.plan,

    status:
      subscription.status,

    paidAccess,
  };
}

export async function canAccessEverydayLesson(
  userId: string,
  dayNumber: number
) {
  // First 5 lessons are free.
  if (dayNumber <= 5) {
    return true;
  }

  const access =
    await getUserAccess(
      userId
    );

  return access.paidAccess;
}

export async function canAccessCertificates(
  userId: string
) {
  const access =
    await getUserAccess(
      userId
    );

  return access.paidAccess;
}