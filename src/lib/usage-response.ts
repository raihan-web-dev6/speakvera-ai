import {
  NextResponse,
} from "next/server";

import {
  UsageLimitError,
} from "@/lib/usage";

export function usageLimitResponse(
  error: unknown
) {
  if (
    !(
      error instanceof
      UsageLimitError
    )
  ) {
    return null;
  }

  return NextResponse.json(
    {
      message:
        error.message,

      code:
        error.code,

      plan:
        error.plan,

      limit:
        error.limit,

      used:
        error.used,

      upgradeRequired:
        error.plan ===
        "FREE",
    },

    {
      status: 429,
    }
  );
}