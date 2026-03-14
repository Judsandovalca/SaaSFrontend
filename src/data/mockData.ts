import type {
  MonthlyRevenue,
  UserSignup,
  SubscriptionTier,
  ChurnRecord,
  SupportTicket,
  MrrByTier,
} from "@/types";

// ---------------------------------------------------------------------------
// Seeded pseudo-random generator for reproducible, realistic data
// ---------------------------------------------------------------------------
function createRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const rng = createRng(42);

function vary(base: number, pct: number): number {
  return Math.round(base * (1 + (rng() - 0.5) * 2 * pct));
}

// ---------------------------------------------------------------------------
// Configuration — SaaS growth model
// ---------------------------------------------------------------------------
const MONTHS = [
  "Aug 2025", "Sep 2025", "Oct 2025", "Nov 2025",
  "Dec 2025", "Jan 2026", "Feb 2026", "Mar 2026",
];

const TIER_SPLIT = { free: 0.60, pro: 0.30, enterprise: 0.10 };
const PRO_ARPU = 35;       // $/user/month
const ENTERPRISE_ARPU = 120; // $/user/month

const BASE_SIGNUPS = 320;
const SIGNUP_GROWTH = 0.09; // ~9% MoM signup growth
const BASE_ACTIVE = 1850;

const BASE_CHURN_RATE = 2.4; // %
const CHURN_SPIKE_MONTH = 4; // Dec 2025 (index 4) — holiday churn spike

const BASE_TICKETS_OPENED = 145;
const BASE_AVG_RESPONSE = 4.2;

// ---------------------------------------------------------------------------
// Generator functions — each metric is derived from user/tier model
// ---------------------------------------------------------------------------
function generateUserSignups(): UserSignup[] {
  let activeUsers = BASE_ACTIVE;
  let signups = BASE_SIGNUPS;

  return MONTHS.map((month, i) => {
    if (i > 0) {
      signups = vary(Math.round(BASE_SIGNUPS * Math.pow(1 + SIGNUP_GROWTH, i)), 0.05);
    }

    const churnRate = i === CHURN_SPIKE_MONTH
      ? BASE_CHURN_RATE * 2.2
      : vary(BASE_CHURN_RATE * 10, 0.25) / 10;
    const churnedUsers = Math.round(activeUsers * (churnRate / 100));

    if (i > 0) {
      activeUsers = activeUsers + signups - churnedUsers;
    }

    const freeUsers = Math.round(activeUsers * TIER_SPLIT.free);
    const proUsers = Math.round(activeUsers * TIER_SPLIT.pro);
    const enterpriseUsers = activeUsers - freeUsers - proUsers;

    return {
      month,
      signups,
      activeUsers,
      churnedUsers,
      freeUsers,
      proUsers,
      enterpriseUsers,
    };
  });
}

function generateMonthlyRevenue(users: UserSignup[]): MonthlyRevenue[] {
  return users.map((u) => {
    const proRevenue = u.proUsers * PRO_ARPU;
    const enterpriseRevenue = u.enterpriseUsers * ENTERPRISE_ARPU;
    const freeRevenue = 0;
    const mrr = proRevenue + enterpriseRevenue;
    return {
      month: u.month,
      revenue: mrr,
      mrr,
      arr: mrr * 12,
      freeRevenue,
      proRevenue,
      enterpriseRevenue,
    };
  });
}

function generateChurnData(users: UserSignup[]): ChurnRecord[] {
  return users.map((u, i) => {
    const prevActive = i > 0 ? users[i - 1].activeUsers : u.activeUsers;
    const churnRate = prevActive > 0
      ? parseFloat(((u.churnedUsers / prevActive) * 100).toFixed(1))
      : 0;
    return {
      month: u.month,
      churnRate,
      retentionRate: parseFloat((100 - churnRate).toFixed(1)),
      churnedCustomers: u.churnedUsers,
    };
  });
}

function generateSubscriptionDistribution(users: UserSignup[]): SubscriptionTier[] {
  const latest = users[users.length - 1];
  const total = latest.activeUsers;
  return [
    {
      tier: "Free",
      count: latest.freeUsers,
      revenue: 0,
      percentage: Math.round((latest.freeUsers / total) * 100),
    },
    {
      tier: "Pro",
      count: latest.proUsers,
      revenue: latest.proUsers * PRO_ARPU,
      percentage: Math.round((latest.proUsers / total) * 100),
    },
    {
      tier: "Enterprise",
      count: latest.enterpriseUsers,
      revenue: latest.enterpriseUsers * ENTERPRISE_ARPU,
      percentage: Math.round((latest.enterpriseUsers / total) * 100),
    },
  ];
}

function generateSupportTickets(): SupportTicket[] {
  return MONTHS.map((month, i) => {
    const seasonFactor = i === CHURN_SPIKE_MONTH ? 1.35 : 1;
    const opened = vary(Math.round(BASE_TICKETS_OPENED * (1 + i * 0.02) * seasonFactor), 0.06);
    const resolved = vary(opened, 0.04);
    const avgResponseHours = parseFloat(
      Math.max(1.5, BASE_AVG_RESPONSE - i * 0.2 + (rng() - 0.5) * 0.4).toFixed(1)
    );
    return { month, opened, resolved, avgResponseHours };
  });
}

function generateMrrByTier(revenue: MonthlyRevenue[]): MrrByTier[] {
  return revenue.map((r) => ({
    month: r.month,
    free: r.freeRevenue,
    pro: r.proRevenue,
    enterprise: r.enterpriseRevenue,
    total: r.mrr,
  }));
}

// ---------------------------------------------------------------------------
// Generate all datasets (interconnected via the user model)
// ---------------------------------------------------------------------------
export const userSignups = generateUserSignups();
export const monthlyRevenue = generateMonthlyRevenue(userSignups);
export const churnData = generateChurnData(userSignups);
export const subscriptionDistribution = generateSubscriptionDistribution(userSignups);
export const supportTickets = generateSupportTickets();
export const mrrByTier = generateMrrByTier(monthlyRevenue);

export const allMonths = MONTHS;
