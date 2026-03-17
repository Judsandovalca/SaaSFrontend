# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Vite dev server
- `npm run build` — Type-check with `tsc -b` then build with Vite
- `npm run lint` — Run ESLint (flat config, TS/TSX files only)
- `npm run preview` — Preview production build

No test framework is configured.

## Architecture

Single-page SaaS metrics dashboard — React 19, TypeScript, Vite 8, Tailwind CSS 4, Recharts.

**Path alias:** `@/` maps to `src/` (configured in both `vite.config.ts` and `tsconfig.app.json`).

**Data flow:**
1. `src/data/mockData.ts` generates all dashboard data programmatically using a seeded RNG and interconnected SaaS growth model (users → revenue → churn). There is no API; all data is deterministic from seed 42.
2. `FilterContext` (useReducer) manages date-range and tier filters, persisted to URL query params (`?from=...&to=...&tiers=...`).
3. `useFilteredData` hook applies filters from context to the mock data via `useMemo`, returning a `DashboardData` object consumed by all charts.
4. `ThemeContext` manages light/dark mode, persisted to localStorage. `useChartTheme` hook provides Recharts-specific color tokens derived from the current theme.

**Component patterns:**
- Charts (RevenueChart, UserGrowthChart, MrrAreaChart, SubscriptionPie, ChurnTable) are lazy-loaded via `React.lazy` with `Suspense` fallbacks and wrapped in `ErrorBoundary`.
- `DashboardLayout` provides sidebar + header shell; sidebar is collapsible.
- `MetricCard` displays KPI with sparkline, trend indicator, and info tooltip.
- UI primitives in `src/components/ui/` include a Radix-based Select component using `class-variance-authority` for variants.

**TypeScript:** Strict mode enabled with `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`, and `erasableSyntaxOnly`.

**Styling:** Tailwind CSS 4 via `@tailwindcss/postcss`. Dark mode uses the `dark` class on `<html>`. Components use `clsx` + `tailwind-merge` (via `cn()` utility in `src/lib/utils.ts`).
