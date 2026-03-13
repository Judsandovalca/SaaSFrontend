# SaaS Metrics Dashboard

A responsive SaaS analytics dashboard built with React, TypeScript, and Tailwind CSS. Displays key business metrics including revenue, user growth, churn rate, and support performance through interactive charts and data tables.

## Tech Stack

- **React 19** with TypeScript
- **Vite 8** for bundling and dev server
- **Tailwind CSS 4** for styling
- **Recharts** for data visualization
- **TanStack Table** for sortable/filterable data tables
- **Lucide React** for icons
- **date-fns** for date utilities

## Features

- **KPI Metric Cards** — Total Revenue, Active Users, Churn Rate, Avg Response Time with trend indicators
- **Revenue Chart** — Monthly revenue over time (area/line chart)
- **User Growth Chart** — New signups and active users over time
- **Subscription Distribution** — Pie chart of plan breakdown (Free, Basic, Pro, Enterprise)
- **Churn Table** — Sortable table with monthly churn data
- **Filter Bar** — Filter data by date range, plan type, and region
- **Dark UI** — Fully dark-themed interface
- **Responsive Layout** — Sidebar navigation with collapsible menu, adapts to mobile/tablet/desktop
- **Lazy Loading** — Charts are code-split and loaded on demand with skeleton placeholders
- **Error Boundaries** — Graceful fallbacks if a chart fails to render

## Project Structure

```
src/
├── components/
│   ├── cards/          # MetricCard
│   ├── charts/         # RevenueChart, UserGrowthChart, SubscriptionPie, ChurnTable
│   ├── filters/        # FilterBar
│   ├── icons/          # Custom icon components
│   ├── layout/         # DashboardLayout, Header, Sidebar
│   └── ui/             # ErrorBoundary, LoadingSkeleton
├── context/            # FilterContext (global filter state)
├── hooks/              # useFilteredData
├── data/               # Mock datasets
└── App.tsx             # Root component
```

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```
