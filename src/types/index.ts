export interface MonthlyRevenue {
  month: string;
  revenue: number;
  mrr: number;
  arr: number;
}

export interface UserSignup {
  month: string;
  signups: number;
  activeUsers: number;
  churnedUsers: number;
}

export interface SubscriptionTier {
  tier: "Free" | "Pro" | "Enterprise";
  count: number;
  revenue: number;
  percentage: number;
}

export interface ChurnRecord {
  month: string;
  churnRate: number;
  retentionRate: number;
  churnedCustomers: number;
}

export interface SupportTicket {
  month: string;
  opened: number;
  resolved: number;
  avgResponseHours: number;
}

export interface FilterState {
  startMonth: string;
  endMonth: string;
  selectedTiers: Array<"Free" | "Pro" | "Enterprise">;
}

export interface DashboardData {
  monthlyRevenue: MonthlyRevenue[];
  userSignups: UserSignup[];
  subscriptionDistribution: SubscriptionTier[];
  churnData: ChurnRecord[];
  supportTickets: SupportTicket[];
}
