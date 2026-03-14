import { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend,
  Brush,
} from "recharts";
import type { MonthlyRevenue } from "@/types";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { useChartTheme } from "@/hooks/useChartTheme";

interface RevenueChartProps {
  data: MonthlyRevenue[];
  previousData?: MonthlyRevenue[];
}

function formatCurrency(value: number): string {
  return `$${(value / 1000).toFixed(0)}K`;
}

export function RevenueChart({ data, previousData }: RevenueChartProps) {
  const colors = useChartTheme();

  const avgRevenue =
    data.length > 0
      ? data.reduce((sum, d) => sum + d.revenue, 0) / data.length
      : 0;

  const mergedData = useMemo(() => {
    if (!previousData || previousData.length === 0) return data;
    return data.map((d, i) => ({
      ...d,
      prevRevenue: previousData[i]?.revenue ?? null,
    }));
  }, [data, previousData]);

  const showComparison = previousData && previousData.length > 0;

  return (
    <div className="rounded-xl bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 p-6 transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-1.5">
        Revenue Trend
        <InfoTooltip text="Monthly Recurring Revenue (MRR) over time. Shows total income from all paying subscribers each month." />
      </h3>
      <ResponsiveContainer width="100%" height={showComparison ? 320 : 280}>
        <LineChart data={mergedData}>
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
            formatter={(value, name) => {
              if (value === null || value === undefined) return ["-", name];
              const label = name === "prevRevenue" ? "Previous Period" : "Revenue";
              return [formatCurrency(Number(value)), label];
            }}
            labelStyle={{ color: colors.tooltipLabel }}
          />
          {showComparison && (
            <Legend wrapperStyle={{ color: colors.tickText, fontSize: 12 }} />
          )}
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
            name="Current Period"
            stroke="#818cf8"
            strokeWidth={2}
            dot={{ fill: "#818cf8", r: 4 }}
            activeDot={{ r: 6, fill: "#6366f1" }}
            animationDuration={800}
          />
          {showComparison && (
            <Line
              type="monotone"
              dataKey="prevRevenue"
              name="Previous Period"
              stroke="#818cf8"
              strokeWidth={1.5}
              strokeDasharray="6 3"
              strokeOpacity={0.4}
              dot={{ fill: "#818cf8", r: 2, fillOpacity: 0.4 }}
              animationDuration={800}
              connectNulls={false}
            />
          )}
          <Brush
            dataKey="month"
            height={24}
            stroke={colors.brushStroke}
            fill={colors.brushFill}
            travellerWidth={8}
            tickFormatter={(v: string) => v.replace(" 20", " '")}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
