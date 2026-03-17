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

const darkColors: ChartColors = {
  grid: "#475569",
  axis: "#475569",
  tickText: "#cbd5e1",
  tooltipBg: "#1e293b",
  tooltipBorder: "#334155",
  tooltipText: "#e2e8f0",
  tooltipLabel: "#94a3b8",
  brushStroke: "#334155",
  brushFill: "#1e293b",
};

export function useChartTheme(): ChartColors {
  return darkColors;
}
