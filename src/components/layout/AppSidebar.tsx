"use client";

import Link from "next/link";

import {
  Award,
  BarChart3,
  BookOpen,
  Crown,
  GraduationCap,
  History,
  LayoutDashboard,
  LogOut,
  Mic2,
  Settings,
  User,
} from "lucide-react";

import {
  usePathname,
} from "next/navigation";

import {
  signOut,
} from "next-auth/react";

import {
  useSubscription,
} from "@/hooks/useSubscription";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon:
      LayoutDashboard,
  },

  {
    name: "Everyday English",
    href:
      "/everyday-english",
    icon: BookOpen,
  },

  {
    name: "IELTS",
    href: "/ielts",
    icon:
      GraduationCap,
  },

  {
    name: "Assessment",
    href:
      "/speaking-assessment",
    icon: Mic2,
  },

  {
    name: "Progress",
    href: "/progress",
    icon: BarChart3,
  },

  {
    name: "History",
    href: "/history",
    icon: History,
  },

  {
    name: "Certificates",
    href:
      "/certificates",
    icon: Award,
  },
];

export default function AppSidebar() {
  const pathname =
    usePathname();

  const {
    plan,
  } =
    useSubscription();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <div className="flex h-20 items-center border-b border-slate-100 px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
            S
          </div>

          <div>
            <p className="font-bold text-slate-950">
              Speakvera AI
            </p>

            <p className="text-xs text-slate-400">
              English Coach
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-5">
        <div className="space-y-1">
          {navigation.map(
            ({
              name,
              href,
              icon: Icon,
            }) => {
              const active =
                pathname ===
                  href ||
                pathname.startsWith(
                  `${href}/`
                );

              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  }`}
                >
                  <Icon
                    size={19}
                  />

                  {name}
                </Link>
              );
            }
          )}
        </div>

        <div className="my-5 border-t border-slate-100" />

        <div className="space-y-1">
          <Link
            href="/profile"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <User size={19} />

            Profile
          </Link>

          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <Settings
              size={19}
            />

            Settings
          </Link>
        </div>
      </nav>

      <div className="border-t border-slate-100 p-4">
        {plan ===
          "FREE" && (
          <Link
            href="/billing"
            className="mb-3 flex items-center gap-3 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white"
          >
            <Crown
              size={18}
              className="text-amber-400"
            />

            Upgrade to Pro
          </Link>
        )}

        <button
          type="button"
          onClick={() =>
            signOut({
              callbackUrl:
                "/login",
            })
          }
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={18} />

          Sign out
        </button>
      </div>
    </aside>
  );
}