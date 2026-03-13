import type {
  MonthlyRevenue,
  UserSignup,
  SubscriptionTier,
  ChurnRecord,
  SupportTicket,
} from "@/types";

export const monthlyRevenue: MonthlyRevenue[] = [
  { month: "Aug 2025", revenue: 42000, mrr: 42000, arr: 504000 },
  { month: "Sep 2025", revenue: 45500, mrr: 45500, arr: 546000 },
  { month: "Oct 2025", revenue: 48200, mrr: 48200, arr: 578400 },
  { month: "Nov 2025", revenue: 51800, mrr: 51800, arr: 621600 },
  { month: "Dec 2025", revenue: 49500, mrr: 49500, arr: 594000 },
  { month: "Jan 2026", revenue: 54200, mrr: 54200, arr: 650400 },
  { month: "Feb 2026", revenue: 58700, mrr: 58700, arr: 704400 },
  { month: "Mar 2026", revenue: 62100, mrr: 62100, arr: 745200 },
];

export const userSignups: UserSignup[] = [
  { month: "Aug 2025", signups: 320, activeUsers: 1850, churnedUsers: 45 },
  { month: "Sep 2025", signups: 385, activeUsers: 2140, churnedUsers: 52 },
  { month: "Oct 2025", signups: 410, activeUsers: 2450, churnedUsers: 48 },
  { month: "Nov 2025", signups: 475, activeUsers: 2820, churnedUsers: 55 },
  { month: "Dec 2025", signups: 350, activeUsers: 3050, churnedUsers: 72 },
  { month: "Jan 2026", signups: 520, activeUsers: 3430, churnedUsers: 58 },
  { month: "Feb 2026", signups: 580, activeUsers: 3890, churnedUsers: 63 },
  { month: "Mar 2026", signups: 610, activeUsers: 4350, churnedUsers: 55 },
];

export const subscriptionDistribution: SubscriptionTier[] = [
  { tier: "Free", count: 2610, revenue: 0, percentage: 60 },
  { tier: "Pro", count: 1305, revenue: 45675, percentage: 30 },
  { tier: "Enterprise", count: 435, revenue: 16425, percentage: 10 },
];

export const churnData: ChurnRecord[] = [
  { month: "Aug 2025", churnRate: 2.4, retentionRate: 97.6, churnedCustomers: 45 },
  { month: "Sep 2025", churnRate: 2.8, retentionRate: 97.2, churnedCustomers: 52 },
  { month: "Oct 2025", churnRate: 2.1, retentionRate: 97.9, churnedCustomers: 48 },
  { month: "Nov 2025", churnRate: 3.2, retentionRate: 96.8, churnedCustomers: 55 },
  { month: "Dec 2025", churnRate: 5.6, retentionRate: 94.4, churnedCustomers: 72 },
  { month: "Jan 2026", churnRate: 3.1, retentionRate: 96.9, churnedCustomers: 58 },
  { month: "Feb 2026", churnRate: 2.9, retentionRate: 97.1, churnedCustomers: 63 },
  { month: "Mar 2026", churnRate: 2.3, retentionRate: 97.7, churnedCustomers: 55 },
];

export const supportTickets: SupportTicket[] = [
  { month: "Aug 2025", opened: 145, resolved: 138, avgResponseHours: 4.2 },
  { month: "Sep 2025", opened: 162, resolved: 155, avgResponseHours: 3.8 },
  { month: "Oct 2025", opened: 158, resolved: 160, avgResponseHours: 3.5 },
  { month: "Nov 2025", opened: 178, resolved: 170, avgResponseHours: 4.0 },
  { month: "Dec 2025", opened: 195, resolved: 180, avgResponseHours: 5.1 },
  { month: "Jan 2026", opened: 172, resolved: 175, avgResponseHours: 3.2 },
  { month: "Feb 2026", opened: 168, resolved: 170, avgResponseHours: 2.9 },
  { month: "Mar 2026", opened: 155, resolved: 158, avgResponseHours: 2.6 },
];

export const allMonths = monthlyRevenue.map((r) => r.month);
