import type {
  Metadata,
} from "next";

import {
  getSiteUrl,
} from "@/lib/site-url";

const siteUrl =
  getSiteUrl();

export const metadata: Metadata = {
  metadataBase:
    new URL(siteUrl),

  title: {
    default:
      "Speakvera AI — AI English Speaking Coach",

    template:
      "%s | Speakvera AI",
  },

  description:
    "Practice English speaking with AI feedback. Follow a structured 40-day Everyday English course, prepare for IELTS Speaking, take speaking assessments and build real confidence.",

  applicationName:
    "Speakvera AI",

  authors: [
    {
      name:
        "Speakvera AI",
    },
  ],

  creator:
    "Speakvera AI",

  publisher:
    "Speakvera AI",

  keywords: [
    "AI English speaking coach",
    "English speaking practice",
    "practice English online",
    "AI English tutor",
    "IELTS speaking practice",
    "IELTS speaking AI",
    "English speaking assessment",
    "CEFR English test",
    "English conversation practice",
    "English fluency practice",
    "learn English speaking",
    "Everyday English course",
  ],

  alternates: {
    canonical:
      "/",
  },

  openGraph: {
    type:
      "website",

    locale:
      "en_US",

    url:
      siteUrl,

    siteName:
      "Speakvera AI",

    title:
      "Speakvera AI — Speak English with AI Feedback",

    description:
      "Practice English speaking, get instant AI feedback, prepare for IELTS and follow a structured 40-day learning course.",

    images: [
      {
        url:
          "/opengraph-image",

        width:
          1200,

        height:
          630,

        alt:
          "Speakvera AI English Speaking Coach",
      },
    ],
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "Speakvera AI — AI English Speaking Coach",

    description:
      "Practice English speaking and get instant AI-powered feedback.",

    images: [
      "/opengraph-image",
    ],
  },

  robots: {
    index:
      true,

    follow:
      true,

    googleBot: {
      index:
        true,

      follow:
        true,

      "max-image-preview":
        "large",

      "max-snippet":
        -1,

      "max-video-preview":
        -1,
    },
  },

  category:
    "education",
};

export default function MarketingLayout({
  children,
}: Readonly<{
  children:
    React.ReactNode;
}>) {
  return children;
}