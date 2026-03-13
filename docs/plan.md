# SaaS Dashboard Frontend — Implementation Plan

## Overview

Build a React dashboard displaying 6+ months of mock SaaS metrics with interactive charts, filtering, responsive layout, and professional design.

---

## Tech Stack

| Layer            | Choice                          | Rationale                                      |
| ---------------- | ------------------------------- | ---------------------------------------------- |
| Framework        | React 18 + Vite                 | Fast dev server, modern tooling                |
| Language         | TypeScript (strict mode)        | Type safety for metric data structures         |
| Charts           | Recharts                        | Lightweight, composable, React-native          |
| Styling          | Tailwind CSS                    | Rapid UI development, responsive utilities     |
| Table            | TanStack Table (v8)             | Headless, type-safe, sorting/pagination        |
| Icons            | Lucide React                    | Clean SaaS-style icon components               |
| Date utilities   | date-fns                        | Lightweight date manipulation for filters      |
| State management | React useState/useContext       | Sufficient for this scope, no Redux needed     |

---

## Conventions

- **No raw `<svg>` tags** — all SVGs wrapped in named React components (e.g., `<TrendUpIcon />`). Custom icons in `src/components/icons/`. Standard icons via `lucide-react`.
- **TanStack Table** for all tabular data — sorting, pagination, column definitions styled with Tailwind.
- **Strict TypeScript** — no `any`, all props typed, all data interfaces exported from `src/types/`.
- **Component isolation** — each component in its own file, single responsibility.

---

## Component Architecture

```
src/
├── data/
│   └── mockData.ts              # All mock datasets + types
├── components/
│   ├── layout/
│   │   ├── DashboardLayout.tsx   # Sidebar + header + main grid
│   │   ├── Sidebar.tsx           # Navigation sidebar
│   │   └── Header.tsx            # Top bar with title + filters
│   ├── cards/
│   │   └── MetricCard.tsx        # KPI summary card (reusable)
│   ├── charts/
│   │   ├── RevenueChart.tsx      # Line chart — monthly revenue trend
│   │   ├── UserGrowthChart.tsx   # Bar chart — signups over time
│   │   ├── SubscriptionPie.tsx   # Donut chart — tier breakdown
│   │   └── ChurnTable.tsx        # TanStack Table — churn/retention
│   ├── filters/
│   │   └── FilterBar.tsx         # Date range + tier dropdown filters
│   ├── icons/
│   │   └── index.tsx             # SVG icon components
│   └── ui/
│       ├── LoadingSkeleton.tsx   # Skeleton loader for cards/charts
│       └── ErrorBoundary.tsx     # Error boundary with fallback UI
├── hooks/
│   └── useFilteredData.ts       # Custom hook: apply filters to mock data
├── context/
│   └── FilterContext.tsx        # Global filter state (date range, tier)
├── types/
│   └── index.ts                 # Shared TypeScript interfaces
├── App.tsx
└── main.tsx
```

---

## Mock Data Structure

All data in `src/data/mockData.ts` — no backend.

| Dataset                  | Shape                                                                              | Months |
| ------------------------ | ---------------------------------------------------------------------------------- | ------ |
| `monthlyRevenue`         | `{ month, revenue, mrr, arr }`                                                     | 8      |
| `userSignups`            | `{ month, signups, activeUsers, churnedUsers }`                                    | 8      |
| `subscriptionDistribution` | `{ tier: "Free"│"Pro"│"Enterprise", count, revenue, percentage }`               | —      |
| `churnData`              | `{ month, churnRate, retentionRate, churnedCustomers }`                             | 8      |
| `supportTickets`         | `{ month, opened, resolved, avgResponseHours }`                                    | 8      |

---

## Phases

### Phase 1 — Project Scaffold

**Goal**: Working Vite + React + TypeScript project with all dependencies installed and configured.

- [ ] Initialize Vite project with React + TypeScript template
- [ ] Install runtime dependencies: `recharts`, `lucide-react`, `date-fns`, `@tanstack/react-table`
- [ ] Install and configure Tailwind CSS (v3+)
- [ ] Configure `tsconfig.json` with strict mode enabled
- [ ] Set up path aliases (`@/` → `src/`) in Vite and tsconfig
- [ ] Create folder structure (`components/`, `data/`, `hooks/`, `context/`, `types/`, `components/icons/`)
- [ ] Verify dev server starts with no errors (`npm run dev`)

**Acceptance Criteria**:
- [ ] `npm run dev` launches without errors or warnings
- [ ] `npm run build` completes with zero TypeScript errors
- [ ] Tailwind classes render correctly on a test element
- [ ] All listed dependencies appear in `package.json`

---

### Phase 2 — Data Layer

**Goal**: Fully typed mock datasets ready for consumption by components.

- [ ] Define all TypeScript interfaces in `src/types/index.ts`
  - [ ] `MonthlyRevenue`, `UserSignup`, `SubscriptionTier`, `ChurnRecord`, `SupportTicket`
  - [ ] `FilterState` type (date range + tier selection)
  - [ ] `DashboardData` aggregate type
- [ ] Create `src/data/mockData.ts`
  - [ ] `monthlyRevenue` — 8 months (Aug 2025 – Mar 2026) with realistic growth
  - [ ] `userSignups` — 8 months with signups, active users, churned users
  - [ ] `subscriptionDistribution` — 3 tiers with counts, revenue, percentages (must sum to 100%)
  - [ ] `churnData` — 8 months with rates between 2–8%
  - [ ] `supportTickets` — 8 months with opened, resolved, avg response hours
- [ ] All arrays exported as `const` with `as const` or proper typing

**Acceptance Criteria**:
- [ ] Every data array has 8 entries (except `subscriptionDistribution` which has 3)
- [ ] All data conforms to its TypeScript interface — zero type errors
- [ ] No `any` types used anywhere in the data layer
- [ ] Subscription percentages sum to exactly 100
- [ ] Data values are realistic and internally consistent (e.g., `activeUsers >= signups - churnedUsers`)

---

### Phase 3 — Layout & UI Shell

**Goal**: Page layout renders with sidebar, header, KPI cards, and placeholder sections for charts.

- [ ] Build `DashboardLayout.tsx` — CSS grid with sidebar + main content area
- [ ] Build `Sidebar.tsx` — navigation with lucide-react icons (no raw SVGs)
- [ ] Build `Header.tsx` — dashboard title, subtitle
- [ ] Build `MetricCard.tsx` — reusable KPI card component
  - [ ] Props: `title`, `value`, `change` (percentage), `trend` (up/down), `icon`
  - [ ] Trend arrow as a React icon component (not raw SVG)
  - [ ] Color-coded change: green for positive, red for negative
- [ ] Build `LoadingSkeleton.tsx` — pulsing skeleton for cards and chart areas
- [ ] Build `ErrorBoundary.tsx` — class component with fallback UI and retry button
- [ ] Build icon components in `src/components/icons/` for any custom SVGs
- [ ] Wire up 4 `MetricCard` instances with hardcoded data in `App.tsx`
  - [ ] Total Revenue
  - [ ] Active Users
  - [ ] Churn Rate
  - [ ] Avg Support Response Time

**Acceptance Criteria**:
- [ ] Layout renders a sidebar + main content grid on desktop (≥1024px)
- [ ] Sidebar collapses or hides on tablet/mobile (<1024px)
- [ ] All 4 KPI cards display with correct formatting (currency, percentages, counts)
- [ ] Trend indicators show correct color (green=up revenue, red=up churn)
- [ ] Skeleton loaders are visually distinct and animate (pulse)
- [ ] ErrorBoundary catches a thrown error and renders fallback with retry button
- [ ] Zero raw `<svg>` tags in any component — all wrapped as React components
- [ ] No TypeScript errors

---

### Phase 4 — Charts & Table

**Goal**: All 4 data visualizations render correctly with mock data.

- [ ] `RevenueChart.tsx` — Recharts `LineChart`
  - [ ] X-axis: months, Y-axis: revenue ($)
  - [ ] Tooltip showing exact values on hover
  - [ ] Formatted axis labels (e.g., "$45K")
  - [ ] Responsive container
- [ ] `UserGrowthChart.tsx` — Recharts `BarChart`
  - [ ] Stacked or grouped bars: signups vs. active users
  - [ ] Legend, tooltip, formatted labels
  - [ ] Responsive container
- [ ] `SubscriptionPie.tsx` — Recharts `PieChart` (donut style)
  - [ ] 3 segments: Free, Pro, Enterprise
  - [ ] Labels with tier name + percentage
  - [ ] Custom colors per tier
  - [ ] Responsive container
- [ ] `ChurnTable.tsx` — TanStack Table
  - [ ] Columns: Month, Churn Rate, Retention Rate, Churned Customers
  - [ ] Sortable columns (click header to sort)
  - [ ] Conditional row styling: highlight months with churn > 5% in red/amber
  - [ ] Styled with Tailwind (striped rows, hover states)
- [ ] All charts wrapped in `ErrorBoundary`

**Acceptance Criteria**:
- [ ] Line chart renders 8 data points with smooth line and visible tooltips
- [ ] Bar chart renders grouped/stacked bars with correct values
- [ ] Donut chart shows 3 segments that sum to 100%
- [ ] TanStack Table renders all 8 rows with sortable column headers
- [ ] Clicking a table header sorts the column (ascending/descending toggle)
- [ ] High-churn rows are visually highlighted
- [ ] All charts resize correctly when window is resized (responsive containers)
- [ ] Each chart failing independently does not crash the full dashboard
- [ ] No raw `<svg>` tags in chart wrapper code (Recharts internal SVGs are fine)
- [ ] No TypeScript errors

---

### Phase 5 — Interactive Filtering

**Goal**: User can filter dashboard data by date range and subscription tier; all visualizations update accordingly.

- [ ] Create `FilterContext.tsx`
  - [ ] State: `startMonth`, `endMonth`, `selectedTiers` (array)
  - [ ] Provider wraps entire dashboard
  - [ ] Actions: `setDateRange`, `setTiers`, `resetFilters`
- [ ] Create `useFilteredData.ts` hook
  - [ ] Consumes `FilterContext`
  - [ ] Returns filtered versions of all 5 datasets
  - [ ] Handles edge case: empty result set (no data matches filters)
- [ ] Build `FilterBar.tsx`
  - [ ] Start month dropdown (select from available months)
  - [ ] End month dropdown (select from available months, must be ≥ start)
  - [ ] Tier multi-select (Free / Pro / Enterprise / All toggle)
  - [ ] Reset button to clear all filters
- [ ] Wire `FilterBar` into `Header` or above the chart grid
- [ ] Connect all components to `useFilteredData`:
  - [ ] KPI cards recalculate based on filtered data
  - [ ] Revenue chart updates line data
  - [ ] User growth chart updates bars
  - [ ] Subscription pie recalculates (if tier filter active, show only selected)
  - [ ] Churn table filters rows by date range

**Acceptance Criteria**:
- [ ] Selecting a 3-month range shows only 3 data points in line/bar charts and 3 rows in table
- [ ] Filtering to a single tier shows only that tier's segment in the pie chart
- [ ] KPI cards update values when filters change (not stuck on full-range data)
- [ ] "Reset" button returns all visualizations to full dataset
- [ ] End month cannot be set before start month (validation)
- [ ] Empty state: if filters produce zero results, a friendly message is displayed (not a blank/broken chart)
- [ ] Filter state persists while navigating within the dashboard (context-based)
- [ ] No TypeScript errors

---

### Phase 6 — Polish & Production Readiness

**Goal**: Professional SaaS aesthetic, loading states, error handling, and responsive behavior across all breakpoints.

- [ ] Loading states
  - [ ] Simulate 800ms data load with `setTimeout` on initial mount
  - [ ] Show `LoadingSkeleton` for KPI cards during load
  - [ ] Show `LoadingSkeleton` for each chart area during load
  - [ ] Smooth transition from skeleton → rendered content
- [ ] Error handling
  - [ ] `ErrorBoundary` wraps each chart section individually
  - [ ] Fallback shows "Something went wrong" with retry button
  - [ ] Retry re-mounts the failed component
  - [ ] Data validation: graceful empty-state when filters return no data
- [ ] Responsive design verification
  - [ ] Desktop (≥1024px): 2-column chart grid, sidebar visible
  - [ ] Tablet (768–1023px): 1-column chart grid, collapsible sidebar
  - [ ] Mobile (<768px): stacked layout, hamburger menu, horizontally scrollable table
- [ ] Visual polish
  - [ ] Consistent indigo/slate color theme across all components
  - [ ] Inter font loaded and applied
  - [ ] Card shadows, border radius, spacing consistent with design system
  - [ ] Chart colors match design palette (indigo, emerald, amber, rose)
  - [ ] Hover/focus states on all interactive elements (buttons, dropdowns, table rows)
- [ ] Final cleanup
  - [ ] Remove all `console.log` statements
  - [ ] Remove unused imports and variables
  - [ ] Verify zero TypeScript errors (`npm run build`)
  - [ ] Verify zero runtime console errors/warnings

**Acceptance Criteria**:
- [ ] Initial page load shows skeletons → data in under 1 second
- [ ] Deliberately breaking a chart component shows fallback, not white screen
- [ ] Dashboard is usable and readable at 375px, 768px, 1024px, and 1440px widths
- [ ] All interactive elements have visible hover/focus states
- [ ] `npm run build` produces zero errors and zero warnings
- [ ] No `any` types in the entire codebase
- [ ] No raw `<svg>` tags in any component file
- [ ] All data visualizations respond to filter changes within the same render cycle (no stale data flashes)

---

## Quality Gates (must pass before marking a phase complete)

| Gate                    | Check                                                        |
| ----------------------- | ------------------------------------------------------------ |
| **TypeScript strict**   | `npm run build` — zero errors with `strict: true`            |
| **No `any`**            | Search codebase — zero instances of `: any` or `as any`      |
| **No raw SVG**          | Search codebase — zero `<svg` tags outside `node_modules`    |
| **Responsive**          | Manual check at 375px, 768px, 1024px, 1440px                |
| **Console clean**       | Browser console shows zero errors/warnings on all pages      |
| **Accessibility**       | All interactive elements keyboard-navigable, images have alt |
| **Component isolation** | Each component in its own file, single export                |
| **Consistent styling**  | All colors from Tailwind palette, no inline hex/rgb values   |

---

## Out of Scope

- Authentication / login
- Real backend or database
- Dark mode toggle (dashboard ships in dark mode only; toggle is a future TODO)
- Unit tests
- Deployment configuration
- Internationalization (i18n)
