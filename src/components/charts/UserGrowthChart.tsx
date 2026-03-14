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
import { useChartTheme } from "@/hooks/useChartTheme";

interface UserGrowthChartProps {
  data: UserSignup[];
}

export function UserGrowthChart({ data }: UserGrowthChartProps) {
  const colors = useChartTheme();

  return (
    <div className="rounded-xl bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 p-6 transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-1.5">
        User Growth
        <InfoTooltip text="New signups vs churned users per month. Signups are new registrations; churned are users who cancelled their subscription." />
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
          <XAxis
            dataKey="month"
            tick={{ fill: colors.tickText, fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: colors.axis }}
          />
          <YAxis
            tick={{ fill: colors.tickText, fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={45}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: colors.tooltipBg,
              border: `1px solid ${colors.tooltipBorder}`,
              borderRadius: "8px",
              color: colors.tooltipText,
            }}
            labelStyle={{ color: colors.tooltipLabel }}
            cursor={{ fill: "rgba(99, 102, 241, 0.1)" }}
          />
          <Legend wrapperStyle={{ color: colors.tickText, fontSize: 12 }} />
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
