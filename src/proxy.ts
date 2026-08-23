import {
  NextResponse,
} from "next/server";

import type {
  NextRequest,
} from "next/server";

import {
  getToken,
} from "next-auth/jwt";

export async function proxy(
  request: NextRequest
) {
  const {
    pathname,
  } = request.nextUrl;

  /*
   * =====================================================
   * AUTH.JS
   * =====================================================
   */

  if (
    pathname.startsWith(
      "/api/auth"
    )
  ) {
    return NextResponse.next();
  }

  /*
   * =====================================================
   * PADDLE WEBHOOK
   * =====================================================
   */

  if (
    pathname ===
    "/api/webhooks/paddle"
  ) {
    return NextResponse.next();
  }

  /*
   * =====================================================
   * STATIC / NEXT.JS FILES
   * =====================================================
   */

  if (
    pathname.startsWith(
      "/_next"
    ) ||
    pathname.startsWith(
      "/favicon"
    ) ||
    pathname ===
      "/manifest.webmanifest" ||
    pathname ===
      "/robots.txt" ||
    pathname ===
      "/sitemap.xml"
  ) {
    return NextResponse.next();
  }

  /*
   * =====================================================
   * PUBLIC ROUTES
   * =====================================================
   */

  const publicRoutes = [
    "/",

    "/login",

    "/register",

    "/forgot-password",

    "/pricing",

    "/about",

    "/contact",

    "/features",

    "/privacy",

    "/terms",

    "/english-speaking-practice",

    "/english-speaking-course",

    "/english-level-test",

    "/english-pronunciation-practice",

    "/english-grammar-practice",

    "/english-conversation-practice",

    "/ielts-speaking-practice",

    "/ielts-speaking-part-1",

    "/ielts-speaking-part-2",

    "/ielts-speaking-part-3",
  ];

  /*
   * =====================================================
   * PUBLIC CERTIFICATE VERIFICATION
   * =====================================================
   */

  const isCertificateVerification =
    pathname.startsWith(
      "/verify/certificate/"
    );

  if (
    publicRoutes.includes(
      pathname
    ) ||
    isCertificateVerification
  ) {
    return NextResponse.next();
  }

  /*
   * =====================================================
   * AUTH.JS PRODUCTION COOKIE
   * =====================================================
   *
   * Local:
   * authjs.session-token
   *
   * Production HTTPS:
   * __Secure-authjs.session-token
   */

  const isProduction =
    process.env.NODE_ENV ===
    "production";

  const cookieName =
    isProduction
      ? "__Secure-authjs.session-token"
      : "authjs.session-token";

  /*
   * =====================================================
   * AUTH TOKEN
   * =====================================================
   */

  const token =
    await getToken({
      req:
        request,

      secret:
        process.env
          .AUTH_SECRET,

      secureCookie:
        isProduction,

      cookieName,

      salt:
        cookieName,
    });

  /*
   * =====================================================
   * PROTECTED API ROUTES
   * =====================================================
   */

  if (
    pathname.startsWith(
      "/api/"
    )
  ) {
    if (!token) {
      return NextResponse.json(
        {
          message:
            "Unauthorized",
        },
        {
          status:
            401,
        }
      );
    }

    return NextResponse.next();
  }

  /*
   * =====================================================
   * PROTECTED APP PAGES
   * =====================================================
   */

  if (!token) {
    const loginUrl =
      new URL(
        "/login",
        request.url
      );

    loginUrl.searchParams.set(
      "callbackUrl",
      pathname
    );

    return NextResponse.redirect(
      loginUrl
    );
  }

  /*
   * =====================================================
   * ONBOARDING
   * =====================================================
   */

  const onboardingAllowed =
    pathname ===
      "/onboarding" ||
    pathname ===
      "/placement-test" ||
    pathname.startsWith(
      "/placement-test/"
    );

  /*
   * User has NOT finished onboarding.
   */

  if (
    token.onboardingCompleted !==
      true &&
    !onboardingAllowed
  ) {
    return NextResponse.redirect(
      new URL(
        "/onboarding",
        request.url
      )
    );
  }

  /*
   * User already completed onboarding.
   */

  if (
    token.onboardingCompleted ===
      true &&
    pathname ===
      "/onboarding"
  ) {
    return NextResponse.redirect(
      new URL(
        "/dashboard",
        request.url
      )
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};