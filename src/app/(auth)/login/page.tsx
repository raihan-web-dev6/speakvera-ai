"use client";

import Link from "next/link";

import {
  FormEvent,
  useState,
} from "react";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Mic2,
  Sparkles,
  Star,
} from "lucide-react";

import {
  signIn,
} from "next-auth/react";

import {
  useRouter,
} from "next/navigation";

export default function LoginPage() {
  const router =
    useRouter();

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
    loading,
    setLoading,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  /*
   * ==========================================
   * EMAIL LOGIN
   * ==========================================
   */

  async function handleLogin(
    event: FormEvent
  ) {
    event.preventDefault();

    setLoading(true);

    setError("");

    try {
      const result =
        await signIn(
          "credentials",
          {
            email,
            password,
            redirect: false,
          }
        );

      if (
        result?.error
      ) {
        setError(
          "Incorrect email or password."
        );

        return;
      }

      router.push(
        "/dashboard"
      );

      router.refresh();
    } catch {
      setError(
        "Unable to log in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * ==========================================
   * GOOGLE LOGIN
   * ==========================================
   */

  function googleLogin() {
    signIn(
      "google",
      {
        redirectTo:
          "/dashboard",
      }
    );
  }

  return (
    <main className="min-h-screen bg-white lg:grid lg:grid-cols-[1.05fr_0.95fr]">
      {/* ======================================
          LEFT VISUAL SIDE
      ====================================== */}

      <section className="relative hidden min-h-screen overflow-hidden bg-[#eef1ff] lg:flex lg:flex-col">
        <div className="absolute -left-32 top-28 h-96 w-96 rounded-full bg-blue-300/20 blur-[90px]" />

        <div className="absolute -bottom-40 right-0 h-[500px] w-[500px] rounded-full bg-indigo-300/20 blur-[110px]" />

        <div className="relative z-10 flex h-full min-h-screen flex-col px-12 py-10 xl:px-16">
          {/* LOGO */}

          <Link
            href="/"
            className="flex w-fit items-center gap-2.5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#17135f] text-white shadow-sm">
              <Mic2
                size={19}
              />
            </span>

            <span className="text-xl font-bold tracking-tight text-[#171342]">
              Speakvera
              <span className="text-blue-600">
                {" "}
                AI
              </span>
            </span>
          </Link>

          {/* CONTENT */}

          <div className="my-auto max-w-xl py-12">
            <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-blue-600">
              Welcome back
            </p>

            <h1 className="mt-5 text-5xl font-semibold leading-[1.04] tracking-[-0.04em] text-[#171342] xl:text-6xl [font-family:Georgia,serif]">
              Keep building
              the confidence
              to speak.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-slate-600">
              Continue your course,
              practice speaking and
              see how your English
              improves over time.
            </p>

            <div className="mt-8 space-y-3">
              <Benefit
                text="Continue your 40-day English course"
              />

              <Benefit
                text="Get instant AI speaking feedback"
              />

              <Benefit
                text="Practice IELTS Speaking"
              />

              <Benefit
                text="Track your English progress"
              />
            </div>

            <LoginVisual />
          </div>

          <p className="text-xs leading-5 text-slate-500">
            Practice English.
            Get instant AI feedback.
            Speak with confidence.
          </p>
        </div>
      </section>

      {/* ======================================
          RIGHT FORM SIDE
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

        <div className="w-full max-w-[440px] pt-20 lg:pt-0">
          {/* BACK */}

          <Link
            href="/"
            className="mb-9 hidden w-fit items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950 lg:flex"
          >
            <ArrowLeft
              size={15}
            />

            Back to home
          </Link>

          {/* TITLE */}

          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-blue-600">
              LOG IN
            </p>

            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.035em] text-[#171342] sm:text-5xl [font-family:Georgia,serif]">
              Welcome back.
            </h2>

            <p className="mt-4 leading-7 text-slate-500">
              Continue your English
              speaking journey from
              where you left off.
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
            className="mt-8 flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            <GoogleIcon />

            Continue with Google
          </button>

          {/* DIVIDER */}

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />

            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              or continue with email
            </span>

            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* FORM */}

          <form
            onSubmit={
              handleLogin
            }
            className="space-y-5"
          >
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
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

               /* <Link
                  href="/forgot-password"
                  className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="current-password"
                  required
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
                  placeholder="Enter your password"
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
            </div>

            {/* ERROR */}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                {error}
              </div>
            )}

            {/* SUBMIT */}

            <button
              disabled={
                loading
              }
              type="submit"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 font-semibold text-white shadow-lg shadow-blue-600/15 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                  Logging in...
                </>
              ) : (
                <>
                  Log in

                  <ArrowRight
                    size={18}
                  />
                </>
              )}
            </button>
          </form>

          {/* REGISTER */}

          <p className="mt-7 text-center text-sm text-slate-500">
            New to Speakvera?{" "}

            <Link
              href="/register"
              className="font-bold text-blue-600 transition hover:text-blue-700"
            >
              Create free account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

/*
 * ==========================================
 * LEFT VISUAL
 * ==========================================
 */

function LoginVisual() {
  return (
    <div className="mt-10 max-w-lg rounded-[28px] border border-indigo-100 bg-white p-5 shadow-xl shadow-indigo-950/5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Your progress
          </p>

          <p className="mt-1 font-bold text-[#171342]">
            Everyday English
          </p>
        </div>

        <BookOpen
          size={20}
          className="text-blue-600"
        />
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-slate-500">
            Course
          </span>

          <span className="font-bold text-blue-600">
            45%
          </span>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full w-[45%] rounded-full bg-blue-600" />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        <MiniStat
          value="B1"
          label="Level"
          icon={Star}
        />

        <MiniStat
          value="7"
          label="Streak"
          icon={Sparkles}
        />

        <MiniStat
          value="82"
          label="Score"
          icon={CheckCircle2}
        />
      </div>
    </div>
  );
}

function Benefit({
  text,
}: {
  text:
    string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
        <CheckCircle2
          size={12}
        />
      </span>

      <p className="text-sm font-medium text-slate-700">
        {text}
      </p>
    </div>
  );
}

function MiniStat({
  value,
  label,
  icon: Icon,
}: {
  value:
    string;

  label:
    string;

  icon:
    typeof Star;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <Icon
        size={14}
        className="text-blue-600"
      />

      <p className="mt-2 font-bold text-[#171342]">
        {value}
      </p>

      <p className="mt-0.5 text-[10px] text-slate-500">
        {label}
      </p>
    </div>
  );
}

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