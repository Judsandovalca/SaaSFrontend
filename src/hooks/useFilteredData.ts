import { useMemo } from "react";
import { useFilters } from "@/context/FilterContext";
import {
  monthlyRevenue,
  userSignups,
  subscriptionDistribution,
  churnData,
  supportTickets,
  allMonths,
} from "@/data/mockData";
import type { DashboardData } from "@/types";

function filterByMonthRange<T extends { month: string }>(
  data: T[],
  startMonth: string,
  endMonth: string
): T[] {
  const startIdx = allMonths.indexOf(startMonth);
  const endIdx = allMonths.indexOf(endMonth);
  if (startIdx === -1 || endIdx === -1) return data;

  return data.filter((item) => {
    const idx = allMonths.indexOf(item.month);
    return idx >= startIdx && idx <= endIdx;
  });
}

export function useFilteredData(): DashboardData {
  const { filters } = useFilters();

  return useMemo(() => {
    const { startMonth, endMonth, selectedTiers } = filters;

    const filteredRevenue = filterByMonthRange(monthlyRevenue, startMonth, endMonth);
    const filteredSignups = filterByMonthRange(userSignups, startMonth, endMonth);
    const filteredChurn = filterByMonthRange(churnData, startMonth, endMonth);
    const filteredTickets = filterByMonthRange(supportTickets, startMonth, endMonth);

    const filteredSubscription = subscriptionDistribution.filter((s) =>
      selectedTiers.includes(s.tier)
    );

    return {
      monthlyRevenue: filteredRevenue,
      userSignups: filteredSignups,
      subscriptionDistribution: filteredSubscription,
      churnData: filteredChurn,
      supportTickets: filteredTickets,
    };
  }, [filters]);
}
