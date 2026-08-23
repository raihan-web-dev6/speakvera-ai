import Link from "next/link";
import { ArrowRight, LucideIcon } from "lucide-react";

type Props = {
  title: string;
  subtitle: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

export default function LearningTrackCard({
  title,
  subtitle,
  description,
  href,
  icon: Icon,
}: Props) {
  return (
    <article className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        <Icon size={23} />
      </div>

      <p className="mt-5 text-xs font-bold uppercase tracking-wider text-blue-600">
        {subtitle}
      </p>

      <h2 className="mt-2 text-xl font-bold text-slate-950">
        {title}
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        {description}
      </p>

      <Link
        href={href}
        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600"
      >
        Continue

        <ArrowRight
          size={16}
          className="transition group-hover:translate-x-1"
        />
      </Link>
    </article>
  );
}