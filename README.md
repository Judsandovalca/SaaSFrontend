# SaaS Dashboard Frontend

A React dashboard displaying 6+ months of mock SaaS metrics with interactive charts, filtering, responsive layout, and professional design.

## Tech Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Charts**: Recharts
- **Styling**: Tailwind CSS
- **Table**: TanStack Table (v8)
- **Icons**: Lucide React
- **Date utilities**: date-fns

## Features

- **KPI Summary Cards** — Total Revenue, Active Users, Churn Rate, and Avg Support Response Time with trend indicators
- **Interactive Charts** — Revenue trend (line), User growth (bar), Subscription mix (donut), Churn/retention (table)
- **Filtering** — Date range picker and subscription tier multi-select, applied across all charts and cards
- **Loading States** — Simulated async fetch with skeleton loaders
- **Error Handling** — Per-chart error boundaries with retry
- **Responsive Design** — Desktop (2-column grid + sidebar), Tablet (1-column, collapsible sidebar), Mobile (stacked layout, hamburger menu)

## Mock Data

All data is generated locally in `src/data/mockData.ts` — no backend required. Datasets include:

- Monthly Revenue (MRR/ARR)
- User Signups & Activity
- Subscription Tier Distribution
- Churn & Retention
- Support Tickets

## Getting Started

```bash
npm install
npm run dev
```

## Project Structure

```
src/
├── data/            # Mock datasets & types
├── components/
│   ├── layout/      # DashboardLayout, Sidebar, Header
│   ├── cards/       # MetricCard (KPI summary)
│   ├── charts/      # RevenueChart, UserGrowthChart, SubscriptionPie, ChurnTable
│   ├── filters/     # FilterBar (date range + tier)
│   ├── icons/       # SVG icon components
│   └── ui/          # LoadingSkeleton, ErrorBoundary
├── hooks/           # useFilteredData
├── context/         # FilterContext
└── types/           # Shared TypeScript interfaces
```
