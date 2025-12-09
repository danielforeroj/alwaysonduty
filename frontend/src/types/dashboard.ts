export interface PlanDetails {
  name: string;
  billing_status: string | null;
  trial_ends_at: string | null;
  monthly_conversations_limit: number;
  brands_limit: number;
  seats_included: number;
  channels_included: number;
}

export interface UsageMetrics {
  current_month_conversations: number;
  current_month_messages: number;
  customers_count: number;
  connected_channels_count: number;
  seats_used: number;
}

export interface DailyConversationCount {
  date: string;
  count: number;
}

export interface ChannelBreakdown {
  channel: string;
  count: number;
  percentage?: number;
}

export interface DashboardMetrics {
  plan: PlanDetails;
  usage: UsageMetrics;
  timeseries: {
    daily_conversations_last_30_days: DailyConversationCount[];
  };
  breakdown: {
    conversations_by_channel: ChannelBreakdown[];
  };
}

export const EMPTY_METRICS: DashboardMetrics = {
  plan: {
    name: "starter",
    billing_status: "trial",
    trial_ends_at: null,
    monthly_conversations_limit: 200,
    brands_limit: 1,
    seats_included: 1,
    channels_included: 1,
  },
  usage: {
    current_month_conversations: 0,
    current_month_messages: 0,
    customers_count: 0,
    connected_channels_count: 0,
    seats_used: 1,
  },
  timeseries: {
    daily_conversations_last_30_days: [],
  },
  breakdown: {
    conversations_by_channel: [],
  },
};

export const SAMPLE_METRICS: DashboardMetrics = {
  plan: {
    name: "growth",
    billing_status: "active",
    trial_ends_at: null,
    monthly_conversations_limit: 2000,
    brands_limit: 3,
    seats_included: 5,
    channels_included: 3,
  },
  usage: {
    current_month_conversations: 746,
    current_month_messages: 4218,
    customers_count: 189,
    connected_channels_count: 1,
    seats_used: 3,
  },
  timeseries: {
    daily_conversations_last_30_days: [
      { date: "2025-11-10", count: 12 },
      { date: "2025-11-11", count: 18 },
      { date: "2025-11-12", count: 22 },
      { date: "2025-11-13", count: 24 },
      { date: "2025-11-14", count: 31 },
      { date: "2025-11-15", count: 17 },
      { date: "2025-11-16", count: 9 },
      { date: "2025-11-17", count: 15 },
      { date: "2025-11-18", count: 21 },
      { date: "2025-11-19", count: 25 },
      { date: "2025-11-20", count: 28 },
      { date: "2025-11-21", count: 33 },
      { date: "2025-11-22", count: 19 },
      { date: "2025-11-23", count: 11 },
      { date: "2025-11-24", count: 20 },
      { date: "2025-11-25", count: 26 },
      { date: "2025-11-26", count: 29 },
      { date: "2025-11-27", count: 34 },
      { date: "2025-11-28", count: 38 },
      { date: "2025-11-29", count: 23 },
      { date: "2025-11-30", count: 14 },
      { date: "2025-12-01", count: 24 },
      { date: "2025-12-02", count: 30 },
      { date: "2025-12-03", count: 32 },
      { date: "2025-12-04", count: 36 },
      { date: "2025-12-05", count: 40 },
      { date: "2025-12-06", count: 26 },
      { date: "2025-12-07", count: 18 },
      { date: "2025-12-08", count: 28 },
      { date: "2025-12-09", count: 35 },
    ],
  },
  breakdown: {
    conversations_by_channel: [
      { channel: "Web (widget)", count: 610, percentage: 81 },
      { channel: "WhatsApp (coming soon)", count: 90, percentage: 12 },
      { channel: "Telegram (coming soon)", count: 46, percentage: 7 },
    ],
  },
};
