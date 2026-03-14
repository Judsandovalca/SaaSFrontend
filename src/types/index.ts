export interface MonthlyRevenue {
  month: string;
  revenue: number;
  mrr: number;
  arr: number;
  freeRevenue: number;
  proRevenue: number;
  enterpriseRevenue: number;
}

export interface UserSignup {
  month: string;
  signups: number;
  activeUsers: number;
  churnedUsers: number;
  freeUsers: number;
  proUsers: number;
  enterpriseUsers: number;
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

export interface MrrByTier {
  month: string;
  free: number;
  pro: number;
  enterprise: number;
  total: number;
}

export interface FilterState {
  startMonth: string;
  endMonth: string;
  selectedTiers: Array<"Free" | "Pro" | "Enterprise">;
  compareMode: boolean;
}

export interface DashboardData {
  monthlyRevenue: MonthlyRevenue[];
  userSignups: UserSignup[];
  subscriptionDistribution: SubscriptionTier[];
  churnData: ChurnRecord[];
  supportTickets: SupportTicket[];
  mrrByTier: MrrByTier[];
}
