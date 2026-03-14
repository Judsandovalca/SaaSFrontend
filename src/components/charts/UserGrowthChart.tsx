import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { UserSignup } from "@/types";
import { InfoTooltip } from "@/components/ui/InfoTooltip";

interface UserGrowthChartProps {
  data: UserSignup[];
}

export function UserGrowthChart({ data }: UserGrowthChartProps) {
  return (
    <div className="rounded-xl bg-slate-800 border border-slate-700 p-6 transition-all duration-200 hover:border-slate-600">
      <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-1.5">
        User Growth
        <InfoTooltip text="New signups vs churned users per month. Signups are new registrations; churned are users who cancelled their subscription." />
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="month"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "#334155" }}
          />
          <YAxis
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={45}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "#e2e8f0",
            }}
            labelStyle={{ color: "#94a3b8" }}
            cursor={{ fill: "rgba(99, 102, 241, 0.15)" }}
          />
          <Legend
            wrapperStyle={{ color: "#94a3b8", fontSize: 12 }}
          />
          <Bar
            dataKey="signups"
            name="Signups"
            fill="#818cf8"
            radius={[4, 4, 0, 0]}
            animationDuration={800}
          />
          <Bar
            dataKey="churnedUsers"
            name="Churned"
            fill="#fb7185"
            radius={[4, 4, 0, 0]}
            animationDuration={800}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
