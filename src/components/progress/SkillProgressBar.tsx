type Props = {
  name: string;
  score: number;
};

export default function SkillProgressBar({
  name,
  score,
}: Props) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">
          {name}
        </span>

        <span className="text-sm font-bold text-slate-950">
          {score}/100
        </span>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-blue-600 transition-all"
          style={{
            width: `${Math.min(score, 100)}%`,
          }}
        />
      </div>
    </div>
  );
}