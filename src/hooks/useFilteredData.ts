import { useMemo } from "react";
import { useFilters } from "@/context/FilterContext";
import {
  monthlyRevenue,
  userSignups,
  subscriptionDistribution,
  churnData,
  supportTickets,
  mrrByTier,
  allMonths,
} from "@/data/mockData";
import type { DashboardData, MonthlyRevenue, MrrByTier } from "@/types";

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

type TierName = "Free" | "Pro" | "Enterprise";

function filterRevenueByTiers(
  data: MonthlyRevenue[],
  tiers: TierName[]
): MonthlyRevenue[] {
  return data.map((row) => {
    const freeRevenue = tiers.includes("Free") ? row.freeRevenue : 0;
    const proRevenue = tiers.includes("Pro") ? row.proRevenue : 0;
    const enterpriseRevenue = tiers.includes("Enterprise") ? row.enterpriseRevenue : 0;
    const revenue = freeRevenue + proRevenue + enterpriseRevenue;
    return {
      ...row,
      freeRevenue,
      proRevenue,
      enterpriseRevenue,
      revenue,
      mrr: revenue,
      arr: revenue * 12,
    };
  });
}

function filterMrrByTiers(data: MrrByTier[], tiers: TierName[]): MrrByTier[] {
  return data.map((row) => {
    const free = tiers.includes("Free") ? row.free : 0;
    const pro = tiers.includes("Pro") ? row.pro : 0;
    const enterprise = tiers.includes("Enterprise") ? row.enterprise : 0;
    return { ...row, free, pro, enterprise, total: free + pro + enterprise };
  });
}

/**
 * Given a selected range [startMonth, endMonth], compute the "previous period"
 * of the same length immediately before startMonth.
 */
function getPreviousPeriodRange(startMonth: string, endMonth: string) {
  const startIdx = allMonths.indexOf(startMonth);
  const endIdx = allMonths.indexOf(endMonth);
  const length = endIdx - startIdx + 1;
  const prevStart = Math.max(0, startIdx - length);
  const prevEnd = startIdx - 1;
  if (prevEnd < 0) return null;
  return { start: allMonths[prevStart], end: allMonths[prevEnd] };
}

export interface FilteredDataResult {
  current: DashboardData;
  previous: DashboardData | null;
  compareMode: boolean;
}

export function useFilteredData(): FilteredDataResult {
  const { filters } = useFilters();

  return useMemo(() => {
    const { startMonth, endMonth, selectedTiers, compareMode } = filters;

    const filteredRevenue = filterRevenueByTiers(
      filterByMonthRange(monthlyRevenue, startMonth, endMonth),
      selectedTiers
    );
    const filteredSignups = filterByMonthRange(userSignups, startMonth, endMonth);
    const filteredChurn = filterByMonthRange(churnData, startMonth, endMonth);
    const filteredTickets = filterByMonthRange(supportTickets, startMonth, endMonth);
    const filteredSubscription = subscriptionDistribution.filter((s) =>
      selectedTiers.includes(s.tier)
    );
    const filteredMrr = filterMrrByTiers(
      filterByMonthRange(mrrByTier, startMonth, endMonth),
      selectedTiers
    );

    const current: DashboardData = {
      monthlyRevenue: filteredRevenue,
      userSignups: filteredSignups,
      subscriptionDistribution: filteredSubscription,
      churnData: filteredChurn,
      supportTickets: filteredTickets,
      mrrByTier: filteredMrr,
    };

    let previous: DashboardData | null = null;
    if (compareMode) {
      const prevRange = getPreviousPeriodRange(startMonth, endMonth);
      if (prevRange) {
        const prevRevenue = filterRevenueByTiers(
          filterByMonthRange(monthlyRevenue, prevRange.start, prevRange.end),
          selectedTiers
        );
        const prevSignups = filterByMonthRange(userSignups, prevRange.start, prevRange.end);
        const prevChurn = filterByMonthRange(churnData, prevRange.start, prevRange.end);
        const prevTickets = filterByMonthRange(supportTickets, prevRange.start, prevRange.end);
        const prevMrr = filterMrrByTiers(
          filterByMonthRange(mrrByTier, prevRange.start, prevRange.end),
          selectedTiers
        );
        previous = {
          monthlyRevenue: prevRevenue,
          userSignups: prevSignups,
          subscriptionDistribution: filteredSubscription,
          churnData: prevChurn,
          supportTickets: prevTickets,
          mrrByTier: prevMrr,
        };
      }
    }

    return { current, previous, compareMode };
  }, [filters]);
}
