import type { ReactNode } from "react";
import { TrendUpIcon, TrendDownIcon } from "@/components/icons";

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  trend: "up" | "down";
  icon: ReactNode;
}

export function MetricCard({ title, value, change, trend, icon }: MetricCardProps) {
  const isPositiveTrend =
    (trend === "up" && change >= 0) || (trend === "down" && change < 0);

  return (
    <div className="rounded-xl bg-slate-800 border border-slate-700 p-6 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-400">{title}</span>
        <span className="text-slate-500">{icon}</span>
      </div>
      <p className="text-2xl font-bold text-slate-100">{value}</p>
      <div className="flex items-center gap-1">
        {change >= 0 ? (
          <TrendUpIcon
            className={isPositiveTrend ? "text-emerald-400" : "text-rose-400"}
            width={16}
            height={16}
          />
        ) : (
          <TrendDownIcon
            className={isPositiveTrend ? "text-emerald-400" : "text-rose-400"}
            width={16}
            height={16}
          />
        )}
        <span
          className={`text-sm font-medium ${
            isPositiveTrend ? "text-emerald-400" : "text-rose-400"
          }`}
        >
          {Math.abs(change).toFixed(1)}%
        </span>
        <span className="text-xs text-slate-500">vs last month</span>
      </div>
    </div>
  );
}
