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

export interface ClientAnalyticsOverview {
  totalConversations: number;
  salesConversations: number;
  supportConversations: number;
  avgFirstResponseSeconds: number;
  avgResolutionMinutes: number;
  resolutionRate: number; // 0–1
  mostCommonQuestions: { question: string; count: number }[];
  mostCommonComplaints: { category: string; count: number }[];
  mostRequestedProducts: { name: string; count: number }[];
  peakHours: { hourLabel: string; conversations: number }[];
  languages: { code: string; label: string; percentage: number }[];
  customerSatisfaction: {
    avgScore: number;
    distribution: { score: number; percentage: number }[];
  };
}

export type ClientAnalyticsChannel = "web" | "whatsapp" | "telegram";

export interface ClientAnalyticsConversation {
  id: string;
  date: string; // ISO string
  customerName: string;
  channel: ClientAnalyticsChannel;
  region: string;
  country: string;
  language: string;
  intent: "booking" | "inquiry" | "complaint" | "support" | "sales";
  summary: string;
  leadStatus: "new" | "qualified" | "won" | "lost" | "existing_customer";
  csatScore?: number;
  firstResponseSeconds: number;
  resolutionMinutes?: number;
}

export interface ClientAnalyticsDrillDown {
  conversations: ClientAnalyticsConversation[];
  weeklyInsight: string;
}

export interface ClientAnalytics {
  overview: ClientAnalyticsOverview;
  drilldown: ClientAnalyticsDrillDown;
}

export const EMPTY_CLIENT_ANALYTICS: ClientAnalytics = {
  overview: {
    totalConversations: 0,
    salesConversations: 0,
    supportConversations: 0,
    avgFirstResponseSeconds: 0,
    avgResolutionMinutes: 0,
    resolutionRate: 0,
    mostCommonQuestions: [
      { question: "question 1", count: 0 },
      { question: "question 2", count: 0 },
      { question: "question 3", count: 0 },
      { question: "question 4", count: 0 },
      { question: "question 5", count: 0 },
    ],
    mostCommonComplaints: [
      { category: "complaint 1", count: 0 },
      { category: "complaint 2", count: 0 },
      { category: "complaint 3", count: 0 },
    ],
    mostRequestedProducts: [
      { name: "product 1", count: 0 },
      { name: "product 2", count: 0 },
      { name: "product 3", count: 0 },
    ],
    peakHours: [
      { hourLabel: "9–10 AM", conversations: 0 },
      { hourLabel: "10–11 AM", conversations: 0 },
      { hourLabel: "3–4 PM", conversations: 0 },
      { hourLabel: "8–9 PM", conversations: 0 },
    ],
    languages: [
      { code: "es", label: "Spanish", percentage: 0 },
      { code: "en", label: "English", percentage: 0 },
      { code: "pt", label: "Portuguese", percentage: 0 },
    ],
    customerSatisfaction: {
      avgScore: 0,
      distribution: [
        { score: 5, percentage: 0 },
        { score: 4, percentage: 0 },
        { score: 3, percentage: 0 },
        { score: 2, percentage: 0 },
        { score: 1, percentage: 0 },
      ],
    },
  },
  drilldown: {
    weeklyInsight:
      "No real analytics yet. These placeholders will update once your agents start handling conversations.",
    conversations: [
      {
        id: "placeholder-1",
        date: "2025-01-01T09:00:00Z",
        customerName: "Customer 1",
        channel: "web",
        region: "LATAM",
        country: "Colombia",
        language: "es",
        intent: "support",
        summary: "Placeholder conversation summary.",
        leadStatus: "existing_customer",
        csatScore: 0,
        firstResponseSeconds: 0,
        resolutionMinutes: 0,
      },
      {
        id: "placeholder-2",
        date: "2025-01-01T12:00:00Z",
        customerName: "Customer 2",
        channel: "web",
        region: "US",
        country: "United States",
        language: "en",
        intent: "sales",
        summary: "Placeholder sales inquiry summary.",
        leadStatus: "qualified",
        csatScore: 0,
        firstResponseSeconds: 0,
        resolutionMinutes: 0,
      },
      {
        id: "placeholder-3",
        date: "2025-01-02T10:30:00Z",
        customerName: "Customer 3",
        channel: "web",
        region: "EU",
        country: "Spain",
        language: "es",
        intent: "complaint",
        summary: "Placeholder complaint summary.",
        leadStatus: "new",
        csatScore: 0,
        firstResponseSeconds: 0,
        resolutionMinutes: 0,
      },
      {
        id: "placeholder-4",
        date: "2025-01-02T15:00:00Z",
        customerName: "Customer 4",
        channel: "web",
        region: "LATAM",
        country: "Mexico",
        language: "es",
        intent: "booking",
        summary: "Placeholder booking conversation.",
        leadStatus: "won",
        csatScore: 0,
        firstResponseSeconds: 0,
        resolutionMinutes: 0,
      },
      {
        id: "placeholder-5",
        date: "2025-01-03T08:15:00Z",
        customerName: "Customer 5",
        channel: "whatsapp",
        region: "LATAM",
        country: "Argentina",
        language: "es",
        intent: "inquiry",
        summary: "Placeholder WhatsApp inquiry (coming soon).",
        leadStatus: "new",
        csatScore: 0,
        firstResponseSeconds: 0,
        resolutionMinutes: 0,
      },
      {
        id: "placeholder-6",
        date: "2025-01-03T19:00:00Z",
        customerName: "Customer 6",
        channel: "telegram",
        region: "EU",
        country: "Spain",
        language: "es",
        intent: "support",
        summary: "Placeholder Telegram support chat (coming soon).",
        leadStatus: "existing_customer",
        csatScore: 0,
        firstResponseSeconds: 0,
        resolutionMinutes: 0,
      },
      {
        id: "placeholder-7",
        date: "2025-01-04T11:05:00Z",
        customerName: "Customer 7",
        channel: "web",
        region: "US",
        country: "United States",
        language: "en",
        intent: "sales",
        summary: "Placeholder upsell conversation.",
        leadStatus: "qualified",
        csatScore: 0,
        firstResponseSeconds: 0,
        resolutionMinutes: 0,
      },
      {
        id: "placeholder-8",
        date: "2025-01-04T16:45:00Z",
        customerName: "Customer 8",
        channel: "web",
        region: "EU",
        country: "Germany",
        language: "en",
        intent: "support",
        summary: "Placeholder refund question.",
        leadStatus: "existing_customer",
        csatScore: 0,
        firstResponseSeconds: 0,
        resolutionMinutes: 0,
      },
      {
        id: "placeholder-9",
        date: "2025-01-05T09:30:00Z",
        customerName: "Customer 9",
        channel: "web",
        region: "LATAM",
        country: "Colombia",
        language: "es",
        intent: "complaint",
        summary: "Placeholder complaint follow-up.",
        leadStatus: "existing_customer",
        csatScore: 0,
        firstResponseSeconds: 0,
        resolutionMinutes: 0,
      },
      {
        id: "placeholder-10",
        date: "2025-01-05T21:10:00Z",
        customerName: "Customer 10",
        channel: "web",
        region: "US",
        country: "United States",
        language: "en",
        intent: "booking",
        summary: "Placeholder reservation request.",
        leadStatus: "won",
        csatScore: 0,
        firstResponseSeconds: 0,
        resolutionMinutes: 0,
      },
      {
        id: "placeholder-11",
        date: "2025-01-06T14:00:00Z",
        customerName: "Customer 11",
        channel: "web",
        region: "LATAM",
        country: "Peru",
        language: "es",
        intent: "support",
        summary: "Placeholder address change request.",
        leadStatus: "existing_customer",
        csatScore: 0,
        firstResponseSeconds: 0,
        resolutionMinutes: 0,
      },
      {
        id: "placeholder-12",
        date: "2025-01-07T07:50:00Z",
        customerName: "Customer 12",
        channel: "web",
        region: "EU",
        country: "United Kingdom",
        language: "en",
        intent: "sales",
        summary: "Placeholder enterprise pricing question.",
        leadStatus: "qualified",
        csatScore: 0,
        firstResponseSeconds: 0,
        resolutionMinutes: 0,
      },
      {
        id: "placeholder-13",
        date: "2025-01-07T18:20:00Z",
        customerName: "Customer 13",
        channel: "telegram",
        region: "LATAM",
        country: "Argentina",
        language: "es",
        intent: "complaint",
        summary: "Placeholder missing items report.",
        leadStatus: "existing_customer",
        csatScore: 0,
        firstResponseSeconds: 0,
        resolutionMinutes: 0,
      },
      {
        id: "placeholder-14",
        date: "2025-01-08T10:05:00Z",
        customerName: "Customer 14",
        channel: "web",
        region: "US",
        country: "United States",
        language: "en",
        intent: "booking",
        summary: "Placeholder event booking request.",
        leadStatus: "won",
        csatScore: 0,
        firstResponseSeconds: 0,
        resolutionMinutes: 0,
      },
      {
        id: "placeholder-15",
        date: "2025-01-08T19:40:00Z",
        customerName: "Customer 15",
        channel: "web",
        region: "MEA",
        country: "UAE",
        language: "en",
        intent: "support",
        summary: "Placeholder invoice question.",
        leadStatus: "existing_customer",
        csatScore: 0,
        firstResponseSeconds: 0,
        resolutionMinutes: 0,
      },
      {
        id: "placeholder-16",
        date: "2025-01-09T13:15:00Z",
        customerName: "Customer 16",
        channel: "web",
        region: "APAC",
        country: "Japan",
        language: "en",
        intent: "inquiry",
        summary: "Placeholder holiday hours question.",
        leadStatus: "new",
        csatScore: 0,
        firstResponseSeconds: 0,
        resolutionMinutes: 0,
      },
      {
        id: "placeholder-17",
        date: "2025-01-09T22:05:00Z",
        customerName: "Customer 17",
        channel: "web",
        region: "LATAM",
        country: "Colombia",
        language: "es",
        intent: "complaint",
        summary: "Placeholder quality complaint.",
        leadStatus: "existing_customer",
        csatScore: 0,
        firstResponseSeconds: 0,
        resolutionMinutes: 0,
      },
    ],
  },
};

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

export const SAMPLE_CLIENT_ANALYTICS: ClientAnalytics = {
  overview: {
    totalConversations: 746,
    salesConversations: 312,
    supportConversations: 434,
    avgFirstResponseSeconds: 24,
    avgResolutionMinutes: 7,
    resolutionRate: 0.86,
    mostCommonQuestions: [
      { question: "What are your business hours?", count: 129 },
      { question: "Do you offer home delivery?", count: 97 },
      { question: "What is the price for [service]?", count: 81 },
      { question: "How soon can I book?", count: 64 },
      { question: "Is there a cancellation fee?", count: 48 },
    ],
    mostCommonComplaints: [
      { category: "Delayed delivery", count: 32 },
      { category: "Wrong order", count: 19 },
      { category: "Payment issues", count: 11 },
    ],
    mostRequestedProducts: [
      { name: "Premium Support Plan", count: 64 },
      { name: "Express Delivery", count: 51 },
      { name: "Extended Warranty", count: 37 },
    ],
    peakHours: [
      { hourLabel: "9–10 AM", conversations: 41 },
      { hourLabel: "10–11 AM", conversations: 58 },
      { hourLabel: "3–4 PM", conversations: 72 },
      { hourLabel: "8–9 PM", conversations: 53 },
    ],
    languages: [
      { code: "es", label: "Spanish", percentage: 62 },
      { code: "en", label: "English", percentage: 31 },
      { code: "pt", label: "Portuguese", percentage: 7 },
    ],
    customerSatisfaction: {
      avgScore: 4.4,
      distribution: [
        { score: 5, percentage: 58 },
        { score: 4, percentage: 24 },
        { score: 3, percentage: 12 },
        { score: 2, percentage: 4 },
        { score: 1, percentage: 2 },
      ],
    },
  },
  drilldown: {
    weeklyInsight:
      "Most customers this week asked about delivery times and order status. Consider adding a delivery tracker link to your confirmation messages and website FAQ.",
    conversations: [
      {
        id: "1",
        date: "2025-11-10T14:23:00Z",
        customerName: "María G.",
        channel: "web",
        region: "LATAM",
        country: "Colombia",
        language: "es",
        intent: "booking",
        summary: "Customer asked about availability and booked a table for 4 on Friday.",
        leadStatus: "won",
        csatScore: 5,
        firstResponseSeconds: 12,
        resolutionMinutes: 3,
      },
      {
        id: "2",
        date: "2025-11-10T16:02:00Z",
        customerName: "John P.",
        channel: "web",
        region: "US",
        country: "United States",
        language: "en",
        intent: "complaint",
        summary:
          "Customer reported a delayed shipment and asked for an update and partial refund.",
        leadStatus: "existing_customer",
        csatScore: 3,
        firstResponseSeconds: 27,
        resolutionMinutes: 14,
      },
      {
        id: "3",
        date: "2025-11-11T09:11:00Z",
        customerName: "Luisa R.",
        channel: "web",
        region: "LATAM",
        country: "Mexico",
        language: "es",
        intent: "sales",
        summary: "Asked about enterprise pricing and requested a demo.",
        leadStatus: "qualified",
        csatScore: 4,
        firstResponseSeconds: 18,
        resolutionMinutes: 6,
      },
      {
        id: "4",
        date: "2025-11-11T17:44:00Z",
        customerName: "Pedro S.",
        channel: "web",
        region: "LATAM",
        country: "Chile",
        language: "es",
        intent: "support",
        summary: "Requested help resetting account password and updating billing info.",
        leadStatus: "existing_customer",
        csatScore: 4,
        firstResponseSeconds: 22,
        resolutionMinutes: 11,
      },
      {
        id: "5",
        date: "2025-11-12T12:08:00Z",
        customerName: "Nina K.",
        channel: "web",
        region: "EU",
        country: "Germany",
        language: "en",
        intent: "inquiry",
        summary: "Asked if the product supports multi-language for storefronts.",
        leadStatus: "qualified",
        csatScore: 5,
        firstResponseSeconds: 16,
        resolutionMinutes: 7,
      },
      {
        id: "6",
        date: "2025-11-12T19:15:00Z",
        customerName: "Carlos M.",
        channel: "web",
        region: "LATAM",
        country: "Peru",
        language: "es",
        intent: "support",
        summary: "Asked about delivery ETA for an order placed yesterday.",
        leadStatus: "existing_customer",
        csatScore: 3,
        firstResponseSeconds: 20,
        resolutionMinutes: 15,
      },
      {
        id: "7",
        date: "2025-11-13T08:55:00Z",
        customerName: "Ana L.",
        channel: "whatsapp",
        region: "LATAM",
        country: "Argentina",
        language: "es",
        intent: "sales",
        summary: "Asked for bulk pricing for 50 seats.",
        leadStatus: "qualified",
        csatScore: 4,
        firstResponseSeconds: 14,
        resolutionMinutes: 6,
      },
      {
        id: "8",
        date: "2025-11-13T21:17:00Z",
        customerName: "Sara B.",
        channel: "telegram",
        region: "EU",
        country: "Spain",
        language: "es",
        intent: "complaint",
        summary: "Reported incorrect order details in confirmation email.",
        leadStatus: "existing_customer",
        csatScore: 2,
        firstResponseSeconds: 28,
        resolutionMinutes: 18,
      },
      {
        id: "9",
        date: "2025-11-14T13:30:00Z",
        customerName: "Emily W.",
        channel: "web",
        region: "US",
        country: "United States",
        language: "en",
        intent: "booking",
        summary: "Booked a last-minute reservation for two and asked about parking.",
        leadStatus: "won",
        csatScore: 5,
        firstResponseSeconds: 10,
        resolutionMinutes: 4,
      },
      {
        id: "10",
        date: "2025-11-14T22:40:00Z",
        customerName: "Marco D.",
        channel: "whatsapp",
        region: "LATAM",
        country: "Brazil",
        language: "pt",
        intent: "inquiry",
        summary: "Asked if support is available in Portuguese and overnight shipping options.",
        leadStatus: "new",
        csatScore: 4,
        firstResponseSeconds: 19,
        resolutionMinutes: 9,
      },
      {
        id: "11",
        date: "2025-11-15T11:03:00Z",
        customerName: "Laura H.",
        channel: "web",
        region: "EU",
        country: "United Kingdom",
        language: "en",
        intent: "support",
        summary: "Asked about refund status and timelines for a returned item.",
        leadStatus: "existing_customer",
        csatScore: 3,
        firstResponseSeconds: 25,
        resolutionMinutes: 16,
      },
      {
        id: "12",
        date: "2025-11-15T15:18:00Z",
        customerName: "Victor R.",
        channel: "web",
        region: "LATAM",
        country: "Colombia",
        language: "es",
        intent: "support",
        summary: "Asked to change delivery address after checkout.",
        leadStatus: "existing_customer",
        csatScore: 4,
        firstResponseSeconds: 13,
        resolutionMinutes: 12,
      },
      {
        id: "13",
        date: "2025-11-16T09:46:00Z",
        customerName: "Sophia T.",
        channel: "web",
        region: "US",
        country: "United States",
        language: "en",
        intent: "sales",
        summary: "Inquired about integrating the agent with her Shopify store.",
        leadStatus: "qualified",
        csatScore: 5,
        firstResponseSeconds: 11,
        resolutionMinutes: 5,
      },
      {
        id: "14",
        date: "2025-11-16T18:02:00Z",
        customerName: "Diego P.",
        channel: "telegram",
        region: "LATAM",
        country: "Argentina",
        language: "es",
        intent: "complaint",
        summary: "Complained about missing order items and requested replacements.",
        leadStatus: "existing_customer",
        csatScore: 2,
        firstResponseSeconds: 26,
        resolutionMinutes: 21,
      },
      {
        id: "15",
        date: "2025-11-17T07:58:00Z",
        customerName: "Isabel C.",
        channel: "web",
        region: "LATAM",
        country: "Colombia",
        language: "es",
        intent: "booking",
        summary: "Reserved a private room for a team dinner and asked about AV setup.",
        leadStatus: "won",
        csatScore: 5,
        firstResponseSeconds: 9,
        resolutionMinutes: 6,
      },
      {
        id: "16",
        date: "2025-11-17T20:22:00Z",
        customerName: "Omar N.",
        channel: "web",
        region: "MEA",
        country: "UAE",
        language: "en",
        intent: "support",
        summary: "Asked about invoice reissue with VAT details.",
        leadStatus: "existing_customer",
        csatScore: 4,
        firstResponseSeconds: 17,
        resolutionMinutes: 10,
      },
      {
        id: "17",
        date: "2025-11-18T14:12:00Z",
        customerName: "Yuki A.",
        channel: "web",
        region: "APAC",
        country: "Japan",
        language: "en",
        intent: "inquiry",
        summary: "Asked about delivery windows during holidays.",
        leadStatus: "new",
        csatScore: 4,
        firstResponseSeconds: 20,
        resolutionMinutes: 8,
      },
    ],
  },
};
