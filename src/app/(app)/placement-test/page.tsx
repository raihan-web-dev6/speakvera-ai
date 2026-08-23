import {
  Mic2,
} from "lucide-react";

import PlacementTestRunner from "@/components/placement/PlacementTestRunner";

export default function PlacementTestPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Mic2 size={21} />
          </div>

          <p className="mt-5 text-sm font-semibold text-blue-600">
            Step 2 of 2
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Find your starting level
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            Answer five short speaking questions. Speakvera will estimate the best starting level for your learning journey.
          </p>
        </section>

        <PlacementTestRunner />
      </div>
    </main>
  );
}