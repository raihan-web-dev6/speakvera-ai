import type {
  Metadata,
} from "next";

import {
  Geist,
  Geist_Mono,
} from "next/font/google";

import "./globals.css";

const geistSans =
  Geist({
    variable:
      "--font-geist-sans",

    subsets: [
      "latin",
    ],
  });

const geistMono =
  Geist_Mono({
    variable:
      "--font-geist-mono",

    subsets: [
      "latin",
    ],
  });

export const metadata: Metadata =
  {
    /*
     * =====================================================
     * BASIC SEO
     * =====================================================
     */

    title: {
      default:
        "Speakvera AI - AI English Speaking Coach",

      template:
        "%s | Speakvera AI",
    },

    description:
      "Practice English speaking with AI, improve fluency, grammar and vocabulary, prepare for IELTS speaking, and build confidence with Speakvera AI.",

    applicationName:
      "Speakvera AI",

    keywords: [
      "AI English speaking",

      "English speaking practice",

      "English speaking course",

      "IELTS speaking practice",

      "AI English coach",

      "English fluency practice",

      "English grammar practice",

      "English vocabulary practice",

      "English speaking assessment",

      "CEFR English assessment",
    ],

    /*
     * =====================================================
     * PWA MANIFEST
     * =====================================================
     *
     * File:
     *
     * public/manifest.webmanifest
     */

    manifest:
      "/manifest.webmanifest",

    /*
     * =====================================================
     * SEARCH ENGINE
     * =====================================================
     */

    robots: {
      index: true,

      follow: true,

      googleBot: {
        index: true,

        follow: true,

        "max-image-preview":
          "large",

        "max-snippet":
          -1,

        "max-video-preview":
          -1,
      },
    },

    /*
     * =====================================================
     * OPEN GRAPH
     * =====================================================
     *
     * We will add the production
     * canonical URL and OG image
     * when deploying.
     */

    openGraph: {
      type:
        "website",

      siteName:
        "Speakvera AI",

      title:
        "Speakvera AI - AI English Speaking Coach",

      description:
        "Practice English speaking with AI, get instant feedback, prepare for IELTS speaking, and build real speaking confidence.",
    },

    /*
     * =====================================================
     * TWITTER / SOCIAL SHARING
     * =====================================================
     */

    twitter: {
      card:
        "summary_large_image",

      title:
        "Speakvera AI - AI English Speaking Coach",

      description:
        "Practice English speaking with AI, get instant feedback, prepare for IELTS speaking, and build real speaking confidence.",
    },

    /*
     * =====================================================
     * OTHER
     * =====================================================
     */

    category:
      "education",
  };

export default function RootLayout({
  children,
}: Readonly<{
  children:
    React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}