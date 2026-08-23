"use client";

import Link from "next/link";

import {
  FormEvent,
  useState,
} from "react";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  MessageCircle,
  Mic2,
  Sparkles,
} from "lucide-react";

import {
  signIn,
} from "next-auth/react";

import {
  useRouter,
} from "next/navigation";

export default function RegisterPage() {
  const router =
    useRouter();

  const [
    name,
    setName,
  ] =
    useState("");

  const [
    email,
    setEmail,
  ] =
    useState("");

  const [
    password,
    setPassword,
  ] =
    useState("");

  const [
    showPassword,
    setShowPassword,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  /*
   * ==========================================
   * REGISTER
   * ==========================================
   */

  async function handleSubmit(
    event: FormEvent
  ) {
    event.preventDefault();

    setLoading(true);

    setError("");

    try {
      const response =
        await fetch(
          "/api/auth/register",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                {
                  name,
                  email,
                  password,
                }
              ),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok
      ) {
        setError(
          data.message ??
            "Registration failed."
        );

        return;
      }

      /*
       * Auto-login after
       * credentials registration.
       */

      const loginResult =
        await signIn(
          "credentials",
          {
            email,

            password,

            redirect:
              false,
          }
        );

      if (
        loginResult?.error
      ) {
        router.push(
          "/login"
        );

        return;
      }

      router.push(
        "/onboarding"
      );

      router.refresh();
    } catch {
      setError(
        "Unable to create your account."
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * ==========================================
   * GOOGLE REGISTER
   * ==========================================
   */

  function googleLogin() {
    signIn(
      "google",
      {
        redirectTo:
          "/onboarding",
      }
    );
  }

  return (
    <main className="min-h-screen bg-white lg:grid lg:grid-cols-[1.05fr_0.95fr]">
      {/* ======================================
          LEFT SIDE
      ====================================== */}

      <section className="relative hidden min-h-screen overflow-hidden bg-[#17135f] lg:flex lg:flex-col">
        <div className="absolute -left-24 top-24 h-96 w-96 rounded-full bg-blue-500/20 blur-[100px]" />

        <div className="absolute -bottom-40 right-0 h-[520px] w-[520px] rounded-full bg-indigo-400/20 blur-[120px]" />

        <div className="relative z-10 flex min-h-screen flex-col px-12 py-10 xl:px-16">
          {/* LOGO */}

          <Link
            href="/"
            className="flex w-fit items-center gap-2.5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#17135f]">
              <Mic2
                size={19}
              />
            </span>

            <span className="text-xl font-bold tracking-tight text-white">
              Speakvera
              <span className="text-blue-300">
                {" "}
                AI
              </span>
            </span>
          </Link>

          {/* TEXT */}

          <div className="my-auto max-w-xl py-12">
            <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-blue-300">
              START FOR FREE
            </p>

            <h1 className="mt-5 text-5xl font-semibold leading-[1.04] tracking-[-0.04em] text-white xl:text-6xl [font-family:Georgia,serif]">
              Make speaking
              English part of
              your day.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-indigo-100">
              Create your account,
              discover your level and
              start improving through
              real speaking practice.
            </p>

            <div className="mt-8 space-y-3">
              <DarkBenefit text="Start with 5 free course lessons" />

              <DarkBenefit text="Practice speaking with AI feedback" />

              <DarkBenefit text="Discover your estimated CEFR level" />

              <DarkBenefit text="Upgrade only when you need more" />
            </div>

            <RegisterVisual />
          </div>

          <p className="text-xs text-indigo-300">
            No credit card required
            to create your account.
          </p>
        </div>
      </section>

      {/* ======================================
          RIGHT FORM
      ====================================== */}

      <section className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
        {/* MOBILE HEADER */}

        <div className="absolute left-4 right-4 top-5 flex items-center justify-between lg:hidden">
          <Link
            href="/"
            className="flex items-center gap-2"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#17135f] text-white">
              <Mic2
                size={17}
              />
            </span>

            <span className="font-bold text-[#171342]">
              Speakvera
              <span className="text-blue-600">
                {" "}
                AI
              </span>
            </span>
          </Link>

          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600"
            aria-label="Back home"
          >
            <ArrowLeft
              size={17}
            />
          </Link>
        </div>

        <div className="w-full max-w-[440px] pb-5 pt-20 lg:pt-0">
          {/* BACK */}

          <Link
            href="/"
            className="mb-8 hidden w-fit items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950 lg:flex"
          >
            <ArrowLeft
              size={15}
            />

            Back to home
          </Link>

          {/* HEADING */}

          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-blue-600">
              CREATE ACCOUNT
            </p>

            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.035em] text-[#171342] sm:text-5xl [font-family:Georgia,serif]">
              Start speaking
              confidently.
            </h2>

            <p className="mt-4 leading-7 text-slate-500">
              Create your free
              Speakvera account and
              begin your learning
              journey.
            </p>
          </div>

          {/* GOOGLE */}

          <button
            type="button"
            onClick={
              googleLogin
            }
            disabled={
              loading
            }
            className="mt-7 flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            <GoogleIcon />

            Continue with Google
          </button>

          {/* DIVIDER */}

          <div className="my-5 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />

            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              or use email
            </span>

            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* FORM */}

          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-4"
          >
            {/* NAME */}

            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Full name
              </label>

              <input
                id="name"
                type="text"
                autoComplete="name"
                required
                value={
                  name
                }
                onChange={(
                  event
                ) =>
                  setName(
                    event
                      .target
                      .value
                  )
                }
                placeholder="Your name"
                className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {/* EMAIL */}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={
                  email
                }
                onChange={(
                  event
                ) =>
                  setEmail(
                    event
                      .target
                      .value
                  )
                }
                placeholder="you@example.com"
                className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {/* PASSWORD */}

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={
                    password
                  }
                  onChange={(
                    event
                  ) =>
                    setPassword(
                      event
                        .target
                        .value
                    )
                  }
                  placeholder="At least 8 characters"
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 pr-12 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (
                        value
                      ) =>
                        !value
                    )
                  }
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff
                      size={17}
                    />
                  ) : (
                    <Eye
                      size={17}
                    />
                  )}
                </button>
              </div>

              <p className="mt-2 text-xs text-slate-400">
                Use at least 8 characters.
              </p>
            </div>

            {/* ERROR */}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                {error}
              </div>
            )}

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={
                loading
              }
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 font-semibold text-white shadow-lg shadow-blue-600/15 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                  Creating account...
                </>
              ) : (
                <>
                  Create free account

                  <ArrowRight
                    size={18}
                  />
                </>
              )}
            </button>
          </form>

          {/* LOGIN */}

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an
            account?{" "}

            <Link
              href="/login"
              className="font-bold text-blue-600 transition hover:text-blue-700"
            >
              Log in
            </Link>
          </p>

          <p className="mx-auto mt-5 max-w-sm text-center text-xs leading-5 text-slate-400">
            By creating an account,
            you agree to Speakvera
            AI&apos;s Terms and
            Privacy Policy.
          </p>
        </div>
      </section>
    </main>
  );
}

/*
 * ==========================================
 * REGISTER VISUAL
 * ==========================================
 */

function RegisterVisual() {
  return (
    <div className="mt-10 max-w-lg rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-300">
            Start your journey
          </p>

          <p className="mt-1 font-bold text-white">
            What you can practice
          </p>
        </div>

        <Sparkles className="text-blue-300" />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        <PracticeCard
          icon={Mic2}
          title="Speaking"
          text="AI feedback"
        />

        <PracticeCard
          icon={
            GraduationCap
          }
          title="IELTS"
          text="Parts 1–3"
        />

        <PracticeCard
          icon={
            MessageCircle
          }
          title="Course"
          text="40 days"
        />
      </div>
    </div>
  );
}

function DarkBenefit({
  text,
}: {
  text:
    string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white">
        <Check
          size={12}
          strokeWidth={3}
        />
      </span>

      <p className="text-sm font-medium text-indigo-100">
        {text}
      </p>
    </div>
  );
}

function PracticeCard({
  icon: Icon,
  title,
  text,
}: {
  icon:
    typeof Mic2;

  title:
    string;

  text:
    string;
}) {
  return (
    <div className="rounded-2xl bg-white/10 p-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-blue-200">
        <Icon
          size={15}
        />
      </div>

      <p className="mt-3 text-sm font-bold text-white">
        {title}
      </p>

      <p className="mt-1 text-[10px] text-indigo-300">
        {text}
      </p>
    </div>
  );
}

/*
 * ==========================================
 * GOOGLE LOGO
 * ==========================================
 */

function GoogleIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M21.35 12.21c0-.71-.06-1.4-.18-2.07H12v3.92h5.24a4.48 4.48 0 0 1-1.94 2.94v2.55h3.14c1.84-1.69 2.91-4.18 2.91-7.34Z"
      />

      <path
        fill="#34A853"
        d="M12 21.72c2.62 0 4.82-.87 6.43-2.36l-3.14-2.55c-.87.58-1.98.92-3.29.92-2.53 0-4.68-1.71-5.45-4.01H3.31v2.63A9.72 9.72 0 0 0 12 21.72Z"
      />

      <path
        fill="#FBBC05"
        d="M6.55 13.72A5.84 5.84 0 0 1 6.25 12c0-.6.1-1.18.3-1.72V7.65H3.31A9.72 9.72 0 0 0 2.28 12c0 1.57.38 3.06 1.03 4.35l3.24-2.63Z"
      />

      <path
        fill="#EA4335"
        d="M12 6.27c1.43 0 2.71.49 3.72 1.45l2.79-2.79A9.37 9.37 0 0 0 12 2.28a9.72 9.72 0 0 0-8.69 5.37l3.24 2.63C7.32 7.98 9.47 6.27 12 6.27Z"
      />
    </svg>
  );
}