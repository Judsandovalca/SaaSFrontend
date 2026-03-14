import { useTheme } from "@/context/ThemeContext";

export interface ChartColors {
  grid: string;
  axis: string;
  tickText: string;
  tooltipBg: string;
  tooltipBorder: string;
  tooltipText: string;
  tooltipLabel: string;
  brushStroke: string;
  brushFill: string;
}

export function useChartTheme(): ChartColors {
  const { theme } = useTheme();

  if (theme === "dark") {
    return {
      grid: "#334155",
      axis: "#334155",
      tickText: "#94a3b8",
      tooltipBg: "#1e293b",
      tooltipBorder: "#334155",
      tooltipText: "#e2e8f0",
      tooltipLabel: "#94a3b8",
      brushStroke: "#334155",
      brushFill: "#1e293b",
    };
  }

  return {
    grid: "#e2e8f0",
    axis: "#e2e8f0",
    tickText: "#64748b",
    tooltipBg: "#ffffff",
    tooltipBorder: "#e2e8f0",
    tooltipText: "#1e293b",
    tooltipLabel: "#64748b",
    brushStroke: "#cbd5e1",
    brushFill: "#f8fafc",
  };
}
