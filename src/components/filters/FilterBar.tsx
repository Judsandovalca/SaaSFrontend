import { useFilters } from "@/context/FilterContext";
import { allMonths } from "@/data/mockData";
import { RotateCcw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TIERS = ["Free", "Pro", "Enterprise"] as const;

export function FilterBar() {
  const { filters, setDateRange, setTiers, resetFilters } = useFilters();

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

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-slate-400">From</label>
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
        <label className="text-xs font-medium text-slate-400">To</label>
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

      <div className="h-6 w-px bg-slate-700 hidden sm:block" />

      <div className="flex items-center gap-2">
        {TIERS.map((tier) => {
          const active = filters.selectedTiers.includes(tier);
          return (
            <button
              key={tier}
              onClick={() => toggleTier(tier)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                active
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                  : "bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200"
              }`}
            >
              {tier}
            </button>
          );
        })}
      </div>

      <button
        onClick={resetFilters}
        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 border border-slate-700 px-3 py-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Reset
      </button>
    </div>
  );
}
