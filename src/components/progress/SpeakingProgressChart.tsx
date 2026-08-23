"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartItem = {
  date: string;
  grammar: number;
  vocabulary: number;
  fluency: number;
  pronunciation: number;
};

type Props = {
  data: ChartItem[];
};

export default function SpeakingProgressChart({
  data,
}: Props) {
  if (!data.length) {
    return (
      <div className="flex min-h-72 items-center justify-center rounded-2xl bg-slate-50 text-sm text-slate-500">
        Complete speaking exercises to see your progress chart.
      </div>
    );
  }

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="date"
            fontSize={11}
          />

          <YAxis
            domain={[0, 100]}
            fontSize={11}
          />

          <Tooltip />

          <Legend />

          <Line
            type="monotone"
            dataKey="grammar"
            name="Grammar"
          />

          <Line
            type="monotone"
            dataKey="vocabulary"
            name="Vocabulary"
          />

          <Line
            type="monotone"
            dataKey="fluency"
            name="Fluency"
          />

          <Line
            type="monotone"
            dataKey="pronunciation"
            name="Pronunciation"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}