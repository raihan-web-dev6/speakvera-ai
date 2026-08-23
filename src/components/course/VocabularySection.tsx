import {
  BookOpenText,
} from "lucide-react";

import type {
  LessonVocabulary,
} from "@/types/lesson";

type Props = {
  vocabulary:
    LessonVocabulary[];
};

export default function VocabularySection({
  vocabulary,
}: Props) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
          <BookOpenText
            size={21}
          />
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-violet-600">
            Vocabulary
          </p>

          <h2 className="font-bold text-slate-950">
            Words for today
          </h2>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {vocabulary.map(
          (item) => (
            <article
              key={
                item.word
              }
              className="rounded-2xl bg-slate-50 p-5"
            >
              <h3 className="text-lg font-bold text-blue-600">
                {item.word}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {
                  item.meaning
                }
              </p>

              <div className="mt-4 border-t border-slate-200 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Example
                </p>

                <p className="mt-2 text-sm italic leading-6 text-slate-700">
                  &ldquo;
                  {
                    item.example
                  }
                  &rdquo;
                </p>
              </div>
            </article>
          )
        )}
      </div>
    </section>
  );
}