"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { FormattedAverageMonthlyExpensesResult } from "types";

interface MonthlyExpensesBarChartProps {
  data: FormattedAverageMonthlyExpensesResult[];
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded shadow p-2 border border-slate-200 bg-white">
        <p className="font-semibold text-base">{payload[0].payload.fullName}</p>
        <p className="intro">{payload[0].value.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

export function MonthlyExpensesBarChart({
  data,
  color,
}: MonthlyExpensesBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <XAxis
          dataKey="name"
          stroke="#334155"
          fontSize={11}
          padding={{ left: 4, right: 4 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#334155"
          fontSize={11}
          width={50}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={false} />
        <Bar dataKey="value" fill={color} radius={[3, 3, 3, 3]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
