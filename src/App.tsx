import { lazy, Suspense, useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetricCard } from "@/components/cards/MetricCard";
import { FilterBar } from "@/components/filters/FilterBar";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { FilterProvider } from "@/context/FilterContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { useFilteredData } from "@/hooks/useFilteredData";
import {
  CardSkeleton,
  ChartSkeleton,
  TableSkeleton,
} from "@/components/ui/LoadingSkeleton";
import { DollarSign, Users, TrendingDown, Headphones } from "lucide-react";

const RevenueChart = lazy(() =>
  import("@/components/charts/RevenueChart").then((m) => ({
    default: m.RevenueChart,
  }))
);
const UserGrowthChart = lazy(() =>
  import("@/components/charts/UserGrowthChart").then((m) => ({
    default: m.UserGrowthChart,
  }))
);
const SubscriptionPie = lazy(() =>
  import("@/components/charts/SubscriptionPie").then((m) => ({
    default: m.SubscriptionPie,
  }))
);
const ChurnTable = lazy(() =>
  import("@/components/charts/ChurnTable").then((m) => ({
    default: m.ChurnTable,
  }))
);
const MrrAreaChart = lazy(() =>
  import("@/components/charts/MrrAreaChart").then((m) => ({
    default: m.MrrAreaChart,
  }))
);

function getChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

function Dashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const { current: data, previous, compareMode } = useFilteredData();

  const latestRevenue = data.monthlyRevenue[data.monthlyRevenue.length - 1];
  const prevRevenue = data.monthlyRevenue[data.monthlyRevenue.length - 2];

  const latestUsers = data.userSignups[data.userSignups.length - 1];
  const prevUsers = data.userSignups[data.userSignups.length - 2];

  const latestChurn = data.churnData[data.churnData.length - 1];
  const prevChurn = data.churnData[data.churnData.length - 2];

  const latestSupport = data.supportTickets[data.supportTickets.length - 1];
  const prevSupport = data.supportTickets[data.supportTickets.length - 2];

  const hasEnoughData = data.monthlyRevenue.length >= 2;

  // Sparkline data arrays for each metric card
  const revenueSparkline = data.monthlyRevenue.map((d) => d.revenue);
  const usersSparkline = data.userSignups.map((d) => d.activeUsers);
  const churnSparkline = data.churnData.map((d) => d.churnRate);
  const supportSparkline = data.supportTickets.map((d) => d.avgResponseHours);

  return (
    <DashboardLayout>
      <FilterBar />

      {loading ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartSkeleton />
            <ChartSkeleton />
            <ChartSkeleton />
            <ChartSkeleton />
            <TableSkeleton />
          </div>
        </>
      ) : !latestRevenue ? (
        <div className="flex flex-col items-center justify-center rounded-xl bg-slate-800 border border-slate-700 p-12 text-center gap-3 dark:bg-slate-800 dark:border-slate-700">
          <svg
            className="h-12 w-12 text-slate-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3v18h18M7 16l4-8 4 5 4-7"
            />
          </svg>
          <p className="text-slate-400">
            No data matches the current filters. Try adjusting your selection.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <MetricCard
              title="Total Revenue"
              tooltip="Total Monthly Recurring Revenue (MRR) — the sum of all subscription payments received this month."
              value={`$${(latestRevenue.revenue / 1000).toFixed(1)}K`}
              change={
                hasEnoughData
                  ? getChange(latestRevenue.revenue, prevRevenue.revenue)
                  : 0
              }
              trend="up"
              icon={<DollarSign className="h-5 w-5" aria-hidden="true" />}
              sparklineData={revenueSparkline}
            />
            <MetricCard
              title="Active Users"
              tooltip="Total number of users with an active account (Free, Pro, or Enterprise) at the end of this month."
              value={latestUsers?.activeUsers.toLocaleString() ?? "—"}
              change={
                hasEnoughData && latestUsers && prevUsers
                  ? getChange(latestUsers.activeUsers, prevUsers.activeUsers)
                  : 0
              }
              trend="up"
              icon={<Users className="h-5 w-5" aria-hidden="true" />}
              sparklineData={usersSparkline}
            />
            <MetricCard
              title="Churn Rate"
              tooltip="Percentage of active customers who cancelled their subscription this month. Lower is better — under 5% is considered healthy for SaaS."
              value={latestChurn ? `${latestChurn.churnRate}%` : "—"}
              change={
                hasEnoughData && latestChurn && prevChurn
                  ? getChange(latestChurn.churnRate, prevChurn.churnRate)
                  : 0
              }
              trend="down"
              icon={<TrendingDown className="h-5 w-5" aria-hidden="true" />}
              sparklineData={churnSparkline}
            />
            <MetricCard
              title="Avg Response Time"
              tooltip="Average time (in hours) for the support team to respond to a customer ticket this month. Lower is better."
              value={
                latestSupport ? `${latestSupport.avgResponseHours}h` : "—"
              }
              change={
                hasEnoughData && latestSupport && prevSupport
                  ? getChange(
                      latestSupport.avgResponseHours,
                      prevSupport.avgResponseHours
                    )
                  : 0
              }
              trend="down"
              icon={<Headphones className="h-5 w-5" aria-hidden="true" />}
              sparklineData={supportSparkline}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ErrorBoundary fallbackTitle="Revenue chart failed to load">
              <Suspense fallback={<ChartSkeleton />}>
                <RevenueChart
                  data={data.monthlyRevenue}
                  previousData={compareMode && previous ? previous.monthlyRevenue : undefined}
                />
              </Suspense>
            </ErrorBoundary>
            <ErrorBoundary fallbackTitle="User growth chart failed to load">
              <Suspense fallback={<ChartSkeleton />}>
                <UserGrowthChart data={data.userSignups} />
              </Suspense>
            </ErrorBoundary>
            <ErrorBoundary fallbackTitle="MRR chart failed to load">
              <Suspense fallback={<ChartSkeleton />}>
                <MrrAreaChart data={data.mrrByTier} />
              </Suspense>
            </ErrorBoundary>
            <ErrorBoundary fallbackTitle="Subscription chart failed to load">
              <Suspense fallback={<ChartSkeleton />}>
                <SubscriptionPie data={data.subscriptionDistribution} />
              </Suspense>
            </ErrorBoundary>
            <ErrorBoundary fallbackTitle="Churn table failed to load">
              <Suspense fallback={<TableSkeleton />}>
                <ChurnTable data={data.churnData} />
              </Suspense>
            </ErrorBoundary>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

function App() {
  return (
    <ThemeProvider>
      <FilterProvider>
        <Dashboard />
      </FilterProvider>
    </ThemeProvider>
  );
}

export default App;
