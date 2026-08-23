import type {
  MetadataRoute,
} from "next";

import {
  getSiteUrl,
} from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const siteUrl =
    getSiteUrl();

  return {
    rules: [
      {
        userAgent:
          "*",

        allow: [
          "/",
          "/english-level-test",
          "/login",
          "/register",
          "/verify/certificate/",
        ],

        disallow: [
          "/api/",
          "/dashboard/",
          "/onboarding/",
          "/profile/",
          "/settings/",
          "/billing/",
          "/everyday-english/",
          "/ielts/",
          "/speaking-assessment/",
          "/certificates/",
        ],
      },
    ],

    sitemap:
      `${siteUrl}/sitemap.xml`,

    host:
      siteUrl,
  };
}