"use client";

import Link from "next/link";

import {
  BarChart3,
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  Mic2,
} from "lucide-react";

import {
  usePathname,
} from "next/navigation";

const items = [
  {
    name: "Home",
    href: "/dashboard",
    icon:
      LayoutDashboard,
  },

  {
    name: "Course",
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
    name: "Speak",
    href:
      "/speaking-assessment",
    icon: Mic2,
  },

  {
    name: "Progress",
    href: "/progress",
    icon: BarChart3,
  },
];

export default function MobileBottomNav() {
  const pathname =
    usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white lg:hidden">
      <div className="grid grid-cols-5">
        {items.map(
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
                className={`flex min-h-16 flex-col items-center justify-center gap-1 text-[10px] font-medium ${
                  active
                    ? "text-blue-600"
                    : "text-slate-400"
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
    </nav>
  );
}