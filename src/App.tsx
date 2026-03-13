import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetricCard } from "@/components/cards/MetricCard";
import { RevenueChart } from "@/components/charts/RevenueChart";
import { UserGrowthChart } from "@/components/charts/UserGrowthChart";
import { SubscriptionPie } from "@/components/charts/SubscriptionPie";
import { ChurnTable } from "@/components/charts/ChurnTable";
import { FilterBar } from "@/components/filters/FilterBar";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { FilterProvider } from "@/context/FilterContext";
import { useFilteredData } from "@/hooks/useFilteredData";
import {
  CardSkeleton,
  ChartSkeleton,
  TableSkeleton,
} from "@/components/ui/LoadingSkeleton";
import { DollarSign, Users, TrendingDown, Headphones } from "lucide-react";
import { useState, useEffect } from "react";

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

  const data = useFilteredData();

  const latestRevenue = data.monthlyRevenue[data.monthlyRevenue.length - 1];
  const prevRevenue = data.monthlyRevenue[data.monthlyRevenue.length - 2];

  const latestUsers = data.userSignups[data.userSignups.length - 1];
  const prevUsers = data.userSignups[data.userSignups.length - 2];

  const latestChurn = data.churnData[data.churnData.length - 1];
  const prevChurn = data.churnData[data.churnData.length - 2];

  const latestSupport = data.supportTickets[data.supportTickets.length - 1];
  const prevSupport = data.supportTickets[data.supportTickets.length - 2];

  const hasEnoughData = data.monthlyRevenue.length >= 2;

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
            <TableSkeleton />
          </div>
        </>
      ) : !latestRevenue ? (
        <div className="rounded-xl bg-slate-800 border border-slate-700 p-12 text-center">
          <p className="text-slate-400">
            No data matches the current filters. Try adjusting your selection.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <MetricCard
              title="Total Revenue"
              value={`$${(latestRevenue.revenue / 1000).toFixed(1)}K`}
              change={
                hasEnoughData
                  ? getChange(latestRevenue.revenue, prevRevenue.revenue)
                  : 0
              }
              trend="up"
              icon={<DollarSign className="h-5 w-5" />}
            />
            <MetricCard
              title="Active Users"
              value={latestUsers?.activeUsers.toLocaleString() ?? "—"}
              change={
                hasEnoughData && latestUsers && prevUsers
                  ? getChange(latestUsers.activeUsers, prevUsers.activeUsers)
                  : 0
              }
              trend="up"
              icon={<Users className="h-5 w-5" />}
            />
            <MetricCard
              title="Churn Rate"
              value={latestChurn ? `${latestChurn.churnRate}%` : "—"}
              change={
                hasEnoughData && latestChurn && prevChurn
                  ? getChange(latestChurn.churnRate, prevChurn.churnRate)
                  : 0
              }
              trend="down"
              icon={<TrendingDown className="h-5 w-5" />}
            />
            <MetricCard
              title="Avg Response Time"
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
              icon={<Headphones className="h-5 w-5" />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ErrorBoundary fallbackTitle="Revenue chart failed to load">
              <RevenueChart data={data.monthlyRevenue} />
            </ErrorBoundary>
            <ErrorBoundary fallbackTitle="User growth chart failed to load">
              <UserGrowthChart data={data.userSignups} />
            </ErrorBoundary>
            <ErrorBoundary fallbackTitle="Subscription chart failed to load">
              <SubscriptionPie data={data.subscriptionDistribution} />
            </ErrorBoundary>
            <ErrorBoundary fallbackTitle="Churn table failed to load">
              <ChurnTable data={data.churnData} />
            </ErrorBoundary>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

function App() {
  return (
    <FilterProvider>
      <Dashboard />
    </FilterProvider>
  );
}

export default App;
