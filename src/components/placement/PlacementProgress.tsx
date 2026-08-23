type Props = {
  current: number;

  total: number;
};

export default function PlacementProgress({
  current,
  total,
}: Props) {
  const percentage =
    Math.round(
      (current / total) *
        100
    );

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Placement Test
          </p>

          <p className="mt-1 text-sm font-medium text-slate-600">
            Question {current} of{" "}
            {total}
          </p>
        </div>

        <p className="font-bold text-slate-900">
          {percentage}%
        </p>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-blue-600 transition-all"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}