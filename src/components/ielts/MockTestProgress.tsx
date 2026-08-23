type Props = {
  part: 1 | 2 | 3;

  current: number;
  total: number;
};

export default function MockTestProgress({
  part,
  current,
  total,
}: Props) {
  const percentage =
    Math.min(
      100,
      Math.round(
        (current / total) *
          100
      )
    );

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
            IELTS Speaking
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-700">
            Part {part}
          </p>
        </div>

        <p className="text-sm font-medium text-slate-500">
          {current}/{total}
        </p>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-500"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}