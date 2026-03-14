import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { MrrByTier } from "@/types";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { useChartTheme } from "@/hooks/useChartTheme";

interface MrrAreaChartProps {
  data: MrrByTier[];
}

function formatCurrency(value: number): string {
  return `$${(value / 1000).toFixed(0)}K`;
}

export function MrrAreaChart({ data }: MrrAreaChartProps) {
  const colors = useChartTheme();

  return (
    <div className="rounded-xl bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 p-6 transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-1.5">
        MRR by Tier
        <InfoTooltip text="Monthly Recurring Revenue broken down by subscription tier (Pro and Enterprise). Shows how much each plan contributes to total revenue." />
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="gradPro" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradEnterprise" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
          <XAxis
            dataKey="month"
            tick={{ fill: colors.tickText, fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: colors.axis }}
          />
          <YAxis
            tickFormatter={formatCurrency}
            tick={{ fill: colors.tickText, fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={55}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: colors.tooltipBg,
              border: `1px solid ${colors.tooltipBorder}`,
              borderRadius: "8px",
              color: colors.tooltipText,
            }}
            formatter={(value, name) => [
              formatCurrency(Number(value)),
              String(name),
            ]}
            labelStyle={{ color: colors.tooltipLabel }}
          />
          <Legend wrapperStyle={{ color: colors.tickText, fontSize: 12 }} />
          <Area
            type="monotone"
            dataKey="pro"
            name="Pro"
            stackId="1"
            stroke="#818cf8"
            fill="url(#gradPro)"
            strokeWidth={2}
            animationDuration={800}
          />
          <Area
            type="monotone"
            dataKey="enterprise"
            name="Enterprise"
            stackId="1"
            stroke="#fbbf24"
            fill="url(#gradEnterprise)"
            strokeWidth={2}
            animationDuration={800}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
