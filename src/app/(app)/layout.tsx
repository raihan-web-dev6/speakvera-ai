import type {
  Metadata,
} from "next";

import {
  auth,
} from "@/auth";

import AppShell from "@/components/layout/AppShell";

/*
 * =====================================================
 * SEO
 * =====================================================
 *
 * Everything inside the authenticated app should stay
 * out of search engines.
 */

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,

    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

/*
 * =====================================================
 * APP LAYOUT
 * =====================================================
 */

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session =
    await auth();

  return (
    <AppShell
      user={{
        name:
          session?.user?.name,

        email:
          session?.user?.email,

        image:
          session?.user?.image,
      }}
    >
      {children}
    </AppShell>
  );
}