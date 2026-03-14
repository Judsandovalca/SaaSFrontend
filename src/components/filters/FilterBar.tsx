import { useFilters } from "@/context/FilterContext";
import { allMonths } from "@/data/mockData";
import { RotateCcw, X, GitCompareArrows } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TIERS = ["Free", "Pro", "Enterprise"] as const;

const DEFAULT_START = allMonths[0];
const DEFAULT_END = allMonths[allMonths.length - 1];

export function FilterBar() {
  const { filters, setDateRange, setTiers, toggleCompare, resetFilters } = useFilters();

  const handleStartChange = (value: string) => {
    const startIdx = allMonths.indexOf(value);
    const endIdx = allMonths.indexOf(filters.endMonth);
    if (startIdx > endIdx) {
      setDateRange(value, value);
    } else {
      setDateRange(value, filters.endMonth);
    }
  };

  const handleEndChange = (value: string) => {
    const startIdx = allMonths.indexOf(filters.startMonth);
    const endIdx = allMonths.indexOf(value);
    if (endIdx < startIdx) {
      setDateRange(value, value);
    } else {
      setDateRange(filters.startMonth, value);
    }
  };

  const toggleTier = (tier: (typeof TIERS)[number]) => {
    const current = filters.selectedTiers;
    if (current.includes(tier)) {
      if (current.length === 1) return;
      setTiers(current.filter((t) => t !== tier));
    } else {
      setTiers([...current, tier]);
    }
  };

  const isDefault =
    filters.startMonth === DEFAULT_START &&
    filters.endMonth === DEFAULT_END &&
    filters.selectedTiers.length === TIERS.length &&
    !filters.compareMode;

  const activeChips: string[] = [];
  if (filters.startMonth !== DEFAULT_START || filters.endMonth !== DEFAULT_END) {
    activeChips.push(`${filters.startMonth} – ${filters.endMonth}`);
  }
  const missingTiers = TIERS.filter((t) => !filters.selectedTiers.includes(t));
  if (missingTiers.length > 0) {
    activeChips.push(filters.selectedTiers.join(", "));
  }
  if (filters.compareMode) {
    activeChips.push("Comparing to previous period");
  }

  return (
    <div className="mb-6 space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400">From</label>
          <Select value={filters.startMonth} onValueChange={handleStartChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {allMonths.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400">To</label>
          <Select value={filters.endMonth} onValueChange={handleEndChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {allMonths.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

        <div className="flex items-center gap-2">
          {TIERS.map((tier) => {
            const active = filters.selectedTiers.includes(tier);
            return (
              <button
                key={tier}
                onClick={() => toggleTier(tier)}
                aria-pressed={active}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                  active
                    ? "bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/40"
                    : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                {tier}
              </button>
            );
          })}
        </div>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

        <button
          onClick={toggleCompare}
          aria-pressed={filters.compareMode}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
            filters.compareMode
              ? "bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/40"
              : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <GitCompareArrows className="h-3.5 w-3.5" aria-hidden="true" />
          Compare
        </button>

        <button
          onClick={resetFilters}
          aria-label="Reset all filters"
          className="inline-flex items-center gap-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Reset
        </button>
      </div>

      {!isDefault && activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500">Active filters:</span>
          {activeChips.map((chip) => (
            <span
              key={chip}
              className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 text-xs text-indigo-600 dark:text-indigo-300"
            >
              {chip}
              <button
                onClick={resetFilters}
                aria-label={`Remove filter: ${chip}`}
                className="hover:text-indigo-100 cursor-pointer"
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
