import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Brush,
} from "recharts";
import type { MonthlyRevenue } from "@/types";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { useChartTheme } from "@/hooks/useChartTheme";

interface RevenueChartProps {
  data: MonthlyRevenue[];
}

function formatCurrency(value: number): string {
  return `$${(value / 1000).toFixed(0)}K`;
}

export function RevenueChart({ data }: RevenueChartProps) {
  const colors = useChartTheme();

  const avgRevenue =
    data.length > 0
      ? data.reduce((sum, d) => sum + d.revenue, 0) / data.length
      : 0;

  return (
    <div className="rounded-xl bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 p-6 transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-1.5">
        Revenue Trend
        <InfoTooltip text="Monthly Recurring Revenue (MRR) over time. Shows total income from all paying subscribers each month." />
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
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
            formatter={(value) => [formatCurrency(Number(value)), "Revenue"]}
            labelStyle={{ color: colors.tooltipLabel }}
          />
          {avgRevenue > 0 && (
            <ReferenceLine
              y={avgRevenue}
              stroke="#6366f1"
              strokeDasharray="6 4"
              strokeOpacity={0.5}
              label={{
                value: `Avg ${formatCurrency(avgRevenue)}`,
                position: "right",
                fill: colors.tickText,
                fontSize: 11,
              }}
            />
          )}
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#818cf8"
            strokeWidth={2}
            dot={{ fill: "#818cf8", r: 4 }}
            activeDot={{ r: 6, fill: "#6366f1" }}
            animationDuration={800}
          />
          <Brush
            dataKey="month"
            height={28}
            stroke={colors.brushStroke}
            fill={colors.brushFill}
            travellerWidth={10}
            tickFormatter={(v: string) => v.replace(" 20", " '")}
          >
            <LineChart data={data}>
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#475569"
                strokeWidth={1}
                dot={false}
              />
            </LineChart>
          </Brush>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
