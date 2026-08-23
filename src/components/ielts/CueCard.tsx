import {
  ListChecks,
} from "lucide-react";

type Props = {
  prompt: string;

  points: string[];
};

export default function CueCard({
  prompt,
  points,
}: Props) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
        <ListChecks
          size={18}
        />

        IELTS Speaking Part 2
      </div>

      <h2 className="mt-5 text-2xl font-bold leading-9 text-slate-950">
        {prompt}
      </h2>

      <p className="mt-6 text-sm font-semibold text-slate-600">
        You should say:
      </p>

      <ul className="mt-4 space-y-3">
        {points.map(
          (point) => (
            <li
              key={point}
              className="flex gap-3 text-slate-700"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />

              <span>
                {point}
              </span>
            </li>
          )
        )}
      </ul>
    </article>
  );
}