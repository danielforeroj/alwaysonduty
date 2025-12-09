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
