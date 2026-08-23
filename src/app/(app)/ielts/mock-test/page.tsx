import Link from "next/link";

import {
  ArrowLeft,
} from "lucide-react";

import MockTestRunner from "@/components/ielts/MockTestRunner";

export default function IeltsMockTestPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/ielts"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft size={16} />

          IELTS dashboard
        </Link>

        <div className="mt-8">
          <MockTestRunner />
        </div>
      </div>
    </main>
  );
}