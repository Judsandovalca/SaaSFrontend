import { useState, useEffect, useRef, type ReactNode } from "react";
import { ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendUpIcon, TrendDownIcon } from "@/components/icons";
import { InfoTooltip } from "@/components/ui/InfoTooltip";

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  trend: "up" | "down";
  icon: ReactNode;
  sparklineData?: number[];
  tooltip?: string;
}

function useCountUp(target: string, duration = 600): string {
  const [display, setDisplay] = useState(target);
  const prevRef = useRef(target);

  useEffect(() => {
    if (prevRef.current === target) return;
    prevRef.current = target;

    const numericMatch = target.match(/([\d,.]+)/);
    if (!numericMatch) {
      setDisplay(target);
      return;
    }

    const matchedStr = numericMatch[1];
    const endVal = parseFloat(matchedStr.replace(/,/g, ""));
    const startVal = 0;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = startVal + (endVal - startVal) * eased;

      const formatted = target.includes(",")
        ? Math.round(current).toLocaleString()
        : target.includes(".")
          ? current.toFixed(1)
          : Math.round(current).toString();

      setDisplay(target.replace(matchedStr, formatted));

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }, [target, duration]);

  return display;
}

export function MetricCard({
  title,
  value,
  change,
  trend,
  icon,
  sparklineData,
  tooltip,
}: MetricCardProps) {
  const isPositiveTrend =
    (trend === "up" && change >= 0) || (trend === "down" && change < 0);

  const animatedValue = useCountUp(value);

  const sparkData = sparklineData?.map((v, i) => ({ i, v }));

  return (
    <div className="rounded-xl bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 p-6 flex flex-col gap-2 transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          {title}
          {tooltip && <InfoTooltip text={tooltip} />}
        </span>
        <span className="text-slate-400 dark:text-slate-500">{icon}</span>
      </div>

      <div className="flex items-end justify-between gap-4">
        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{animatedValue}</p>
        {sparkData && sparkData.length > 1 && (
          <div className="w-20 h-8 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparkData}>
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke={isPositiveTrend ? "#34d399" : "#fb7185"}
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        {change >= 0 ? (
          <TrendUpIcon
            className={isPositiveTrend ? "text-emerald-400" : "text-rose-400"}
            width={16}
            height={16}
            aria-label="Increasing trend"
          />
        ) : (
          <TrendDownIcon
            className={isPositiveTrend ? "text-emerald-400" : "text-rose-400"}
            width={16}
            height={16}
            aria-label="Decreasing trend"
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
