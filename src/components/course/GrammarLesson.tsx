import {
  BookMarked,
  CheckCircle2,
} from "lucide-react";

import type {
  LessonGrammar,
} from "@/types/lesson";

type Props = {
  grammar:
    LessonGrammar;
};

export default function GrammarLesson({
  grammar,
}: Props) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <BookMarked
            size={21}
          />
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Grammar
          </p>

          <h2 className="font-bold text-slate-950">
            {
              grammar.title
            }
          </h2>
        </div>
      </div>

      <p className="mt-6 leading-7 text-slate-600">
        {
          grammar.explanation
        }
      </p>

      <div className="mt-6 space-y-3">
        {grammar.examples.map(
          (
            example,
            index
          ) => (
            <div
              key={
                index
              }
              className="flex gap-3 rounded-xl bg-slate-50 p-4"
            >
              <CheckCircle2
                size={18}
                className="mt-0.5 shrink-0 text-emerald-600"
              />

              <p className="text-sm text-slate-700">
                {
                  example
                }
              </p>
            </div>
          )
        )}
      </div>
    </section>
  );
}