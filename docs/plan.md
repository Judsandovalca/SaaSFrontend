# SaaS Dashboard Frontend — Implementation Plan

## Overview

Build a React dashboard displaying 6+ months of mock SaaS metrics with interactive charts, filtering, responsive layout, and professional design.

---

## 1. Tech Stack

| Layer            | Choice                          | Rationale                                      |
| ---------------- | ------------------------------- | ---------------------------------------------- |
| Framework        | React 18 + Vite                 | Fast dev server, modern tooling                |
| Language         | TypeScript                      | Type safety for metric data structures         |
| Charts           | Recharts                        | Lightweight, composable, React-native          |
| Styling          | Tailwind CSS                    | Rapid UI development, responsive utilities     |
| Table            | TanStack Table (v8)             | Headless, type-safe, sorting/pagination built-in |
| Icons            | Lucide React                    | Clean SaaS-style icons                         |
| Date utilities   | date-fns                        | Lightweight date manipulation for filters      |
| State management | React useState/useContext       | Sufficient for this scope, no Redux needed     |

---

## 2. Mock Data Structure

All data lives in `src/data/mockData.ts` — no backend.

### 2.1 Monthly Revenue (`monthlyRevenue`)
```ts
Array<{ month: string; revenue: number; mrr: number; arr: number }>
// 8 months: Aug 2025 – Mar 2026
```

### 2.2 User Signups (`userSignups`)
```ts
Array<{ month: string; signups: number; activeUsers: number; churnedUsers: number }>
```

### 2.3 Subscription Tiers (`subscriptionDistribution`)
```ts
Array<{ tier: "Free" | "Pro" | "Enterprise"; count: number; revenue: number; percentage: number }>
```

### 2.4 Churn & Retention (`churnData`)
```ts
Array<{ month: string; churnRate: number; retentionRate: number; churnedCustomers: number }>
```

### 2.5 Support Tickets — Additional Metric (`supportTickets`)
```ts
Array<{ month: string; opened: number; resolved: number; avgResponseHours: number }>
```

---

## 3. Component Architecture

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
│   │   └── ChurnTable.tsx        # Table — churn/retention by month
│   ├── filters/
│   │   └── FilterBar.tsx         # Date range + tier dropdown filters
│   ├── icons/
│   │   └── index.tsx             # SVG icon components (no raw <svg> tags)
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

## 4. Features & Implementation Details

### 4.1 KPI Summary Cards (top row)
Four `MetricCard` components showing:
- **Total Revenue** (current month)
- **Active Users** (current month)
- **Churn Rate** (current month, with trend indicator)
- **Avg Support Response Time**

Each card shows value, percentage change vs. previous month, and a trend arrow (up/down).

### 4.2 Charts

| Chart             | Type        | Library Component    | Data Source              |
| ----------------- | ----------- | -------------------- | ------------------------ |
| Revenue Trend     | Line        | `LineChart`          | `monthlyRevenue`         |
| User Growth       | Bar         | `BarChart`           | `userSignups`            |
| Subscription Mix  | Donut       | `PieChart`           | `subscriptionDistribution` |
| Churn/Retention   | Table       | TanStack Table       | `churnData`              |

### 4.3 Interactive Filtering
- **Date range picker**: Select start/end month (dropdown selects, not a calendar widget — keeps it simple)
- **Subscription tier filter**: Multi-select dropdown (Free / Pro / Enterprise / All)
- Filters stored in `FilterContext`, consumed by `useFilteredData` hook
- All charts and cards re-render with filtered data

### 4.4 Loading States
- Simulate async data fetch with `setTimeout` (800ms delay on mount)
- `LoadingSkeleton` renders pulsing placeholder cards and chart areas
- Each chart section independently shows skeleton → rendered

### 4.5 Error Handling
- `ErrorBoundary` wraps each chart individually (one crash doesn't take down the page)
- Fallback UI: "Something went wrong" card with retry button
- Data validation in `useFilteredData` — graceful empty-state if filters return no data

### 4.6 Responsive Design
- **Desktop (≥1024px)**: 2-column chart grid, sidebar visible
- **Tablet (768–1023px)**: 1-column chart grid, collapsible sidebar
- **Mobile (<768px)**: Stacked layout, hamburger menu, horizontally scrollable table
- Tailwind breakpoints: `sm`, `md`, `lg`, `xl`

---

## 5. Design System

- **Color palette**: Indigo/slate theme (professional SaaS look)
  - Primary: `indigo-600`
  - Background: `slate-50` / `slate-900` (light/dark)
  - Cards: white with subtle shadow
  - Chart colors: `indigo-500`, `emerald-500`, `amber-500`, `rose-500`
- **Typography**: Inter font (clean, modern)
- **Spacing**: Consistent 4px grid via Tailwind
- **Border radius**: `rounded-xl` on cards, `rounded-lg` on buttons
- **Shadows**: `shadow-sm` on cards for depth

---

## 6. Implementation Order

### Phase 1 — Scaffold (Step 1)
1. Initialize Vite + React + TypeScript project
2. Install dependencies: `recharts`, `tailwindcss`, `lucide-react`, `date-fns`, `@tanstack/react-table`
3. Configure Tailwind

### Phase 2 — Data Layer (Step 2)
4. Define TypeScript types in `src/types/index.ts`
5. Create `src/data/mockData.ts` with all 5 datasets (8 months each)

### Phase 3 — Layout & UI Shell (Step 3)
6. Build `DashboardLayout`, `Sidebar`, `Header`
7. Build `MetricCard` component
8. Build `LoadingSkeleton` and `ErrorBoundary`

### Phase 4 — Charts (Step 4)
9. `RevenueChart` — line chart with tooltip
10. `UserGrowthChart` — stacked bar chart
11. `SubscriptionPie` — donut chart with legend
12. `ChurnTable` — TanStack Table with sorting, conditional coloring

### Phase 5 — Interactivity (Step 5)
13. Create `FilterContext` and `useFilteredData` hook
14. Build `FilterBar` with date range + tier selects
15. Wire filters to all charts and KPI cards

### Phase 6 — Polish (Step 6)
16. Add loading simulation and skeleton states
17. Add error boundaries around each chart
18. Responsive testing and fixes
19. Empty state handling for filtered-out data

---

## 7. File Counts & Scope Estimate

- **~18 source files** (components, hooks, context, data, types)
- **0 API calls** — pure frontend with mock data
- **0 external services** — fully self-contained

---

## 8. Conventions

- **No raw `<svg>` tags** — all SVGs must be wrapped in named React components (e.g., `<TrendUpIcon />`, `<LogoIcon />`). Custom icons live in `src/components/icons/index.tsx`; for standard icons, use `lucide-react` which already provides components.
- **TanStack Table** for all tabular data — provides sorting, pagination, and column definitions out of the box, styled with Tailwind.

---

## 9. Out of Scope

- Authentication / login
- Real backend or database
- Dark mode toggle (can be added later)
- Unit tests (can be added as follow-up)
- Deployment configuration
