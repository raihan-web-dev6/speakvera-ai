"use client";

import { SessionProvider } from "next-auth/react";

import AppHeader from "@/components/layout/AppHeader";
import AppSidebar from "@/components/layout/AppSidebar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

type Props = {
  children: React.ReactNode;

  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

export default function AppShell({
  children,
  user,
}: Props) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-slate-50">
        <AppSidebar />

        <div className="lg:pl-72">
          <AppHeader user={user} />

          <div className="min-h-[calc(100vh-4rem)] pb-20 lg:min-h-[calc(100vh-5rem)] lg:pb-0">
            {children}
          </div>
        </div>

        <MobileBottomNav />
      </div>
    </SessionProvider>
  );
}