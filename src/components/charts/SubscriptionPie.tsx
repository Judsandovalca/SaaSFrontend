import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import type { SubscriptionTier } from "@/types";
import { InfoTooltip } from "@/components/ui/InfoTooltip";

interface SubscriptionPieProps {
  data: SubscriptionTier[];
}

const COLORS: Record<string, string> = {
  Free: "#818cf8",
  Pro: "#34d399",
  Enterprise: "#fbbf24",
};

export function SubscriptionPie({ data }: SubscriptionPieProps) {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="rounded-xl bg-slate-800 border border-slate-700 p-6 transition-all duration-200 hover:border-slate-600">
      <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-1.5">
        Subscription Breakdown
        <InfoTooltip text="Distribution of active users across subscription tiers: Free (no cost), Pro ($35/mo), and Enterprise ($120/mo)." />
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="tier"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={4}
            strokeWidth={0}
            animationDuration={800}
          >
            {data.map((entry) => (
              <Cell key={entry.tier} fill={COLORS[entry.tier]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "#e2e8f0",
            }}
            formatter={(value, name) => [
              `${Number(value).toLocaleString()} users`,
              String(name),
            ]}
          />
          <Legend
            wrapperStyle={{ color: "#94a3b8", fontSize: 12 }}
            formatter={(value: string) => {
              const tier = data.find((d) => d.tier === value);
              const pct = total > 0 && tier ? Math.round((tier.count / total) * 100) : 0;
              return `${value} (${pct}%)`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
