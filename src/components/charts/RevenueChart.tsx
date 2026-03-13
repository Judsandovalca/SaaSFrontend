import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { MonthlyRevenue } from "@/types";

interface RevenueChartProps {
  data: MonthlyRevenue[];
}

function formatCurrency(value: number): string {
  return `$${(value / 1000).toFixed(0)}K`;
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="rounded-xl bg-slate-800 border border-slate-700 p-6">
      <h3 className="text-sm font-semibold text-slate-200 mb-4">
        Revenue Trend
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="month"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "#334155" }}
          />
          <YAxis
            tickFormatter={formatCurrency}
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={55}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "#e2e8f0",
            }}
            formatter={(value) => [formatCurrency(Number(value)), "Revenue"]}
            labelStyle={{ color: "#94a3b8" }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#818cf8"
            strokeWidth={2}
            dot={{ fill: "#818cf8", r: 4 }}
            activeDot={{ r: 6, fill: "#6366f1" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
