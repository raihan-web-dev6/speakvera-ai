import Link from "next/link";
import { ArrowLeft, Mic2 } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white">
          <Mic2 size={25} />
        </div>

        <p className="mt-7 text-sm font-bold uppercase tracking-widest text-blue-600">
          Error 404
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
          Page not found
        </h1>

        <p className="mx-auto mt-4 max-w-md leading-7 text-slate-600">
          The page you are looking for does not exist or may have
          been moved.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 font-semibold text-white transition hover:bg-blue-700"
        >
          <ArrowLeft size={18} />

          Back to home
        </Link>
      </div>
    </main>
  );
}