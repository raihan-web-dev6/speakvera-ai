"use client";

import Link from "next/link";

import {
  Crown,
} from "lucide-react";

import {
  usePathname,
} from "next/navigation";

import {
  useSubscription,
} from "@/hooks/useSubscription";

type Props = {
  user: {
    name?: string | null;

    email?: string | null;

    image?: string | null;
  };
};

function getPageTitle(
  pathname: string
) {
  if (
    pathname.startsWith(
      "/everyday-english"
    )
  ) {
    return "Everyday English";
  }

  if (
    pathname.startsWith(
      "/ielts"
    )
  ) {
    return "IELTS Speaking";
  }

  if (
    pathname.startsWith(
      "/speaking-assessment"
    )
  ) {
    return "Speaking Assessment";
  }

  if (
    pathname.startsWith(
      "/progress"
    )
  ) {
    return "Progress";
  }

  if (
    pathname.startsWith(
      "/history"
    )
  ) {
    return "History";
  }

  if (
    pathname.startsWith(
      "/certificates"
    )
  ) {
    return "Certificates";
  }

  if (
    pathname.startsWith(
      "/billing"
    )
  ) {
    return "Billing";
  }

  if (
    pathname.startsWith(
      "/profile"
    )
  ) {
    return "Profile";
  }

  if (
    pathname.startsWith(
      "/settings"
    )
  ) {
    return "Settings";
  }

  return "Dashboard";
}

export default function AppHeader({
  user,
}: Props) {
  const pathname =
    usePathname();

  const {
    plan,
  } =
    useSubscription();

  const firstLetter =
    (
      user.name ||
      user.email ||
      "S"
    )
      .charAt(0)
      .toUpperCase();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-bold text-white lg:hidden"
          >
            S
          </Link>

          <div>
            <h1 className="font-bold text-slate-950">
              {getPageTitle(
                pathname
              )}
            </h1>

            <p className="hidden text-xs text-slate-400 sm:block">
              Speak. Improve. Grow.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/billing"
            className={`hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold sm:flex ${
              plan ===
              "FREE"
                ? "bg-amber-50 text-amber-700"
                : "bg-blue-50 text-blue-700"
            }`}
          >
            <Crown size={14} />

            {plan}
          </Link>

          <Link
            href="/profile"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-900 font-semibold text-white">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={
                    user.image
                  }
                  alt={
                    user.name ||
                    "Profile"
                  }
                  className="h-full w-full object-cover"
                />
              ) : (
                firstLetter
              )}
            </div>

            <div className="hidden text-left md:block">
              <p className="max-w-40 truncate text-sm font-semibold text-slate-900">
                {user.name ||
                  "Learner"}
              </p>

              <p className="max-w-40 truncate text-xs text-slate-400">
                {user.email}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}