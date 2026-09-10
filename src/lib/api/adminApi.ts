export interface PlanMetric {
  planName: 'Basic' | 'Standard' | 'Premium' | string;
  activeSubscribers: number;
  monthlyPrice: number;
  monthlyRevenue: number;
  percentageOfTotal: number;
}

export interface MonthlyRevenueDataPoint {
  month: string;
  revenue: number;
  subscribers: number;
  churnRate: number;
  refunds: number;
}

export interface RevenueOverviewData {
  mrr: number;
  arr: number;
  totalSubscribers: number;
  activeSubscribers: number;
  churnRate: number;
  arpu: number;
  mrrGrowth: number;
  subscribersGrowth: number;
  planBreakdown: PlanMetric[];
  revenueTimeline: MonthlyRevenueDataPoint[];
}

export type TransactionStatus = 'success' | 'failed' | 'refunded';

export interface AdminTransaction {
  _id: string;
  stripeTransactionId: string;
  userId: string;
  userEmail: string;
  userName?: string;
  planId?: string;
  planName?: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  date: string;
  invoiceId: string;
  paymentMethod: string;
  refundId?: string;
  refundReason?: string;
  refundedAt?: string;
  createdAt?: string;
}

export interface TransactionListResponse {
  success: boolean;
  message?: string;
  data: AdminTransaction[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
  summary: {
    totalRevenue: number;
    successfulCount: number;
    refundedCount: number;
    failedCount: number;
  };
}

export interface AdminPlan {
  _id: string;
  name: string;
  slug?: string;
  price: string;
  monthlyPrice?: number;
  billingCycle: 'monthly' | 'yearly';
  resolution: string;
  videoQuality?: string;
  screens: string;
  maxScreens?: number;
  downloads: string;
  ads: string;
  kids: string;
  isActive?: boolean;
}

export interface PromoCodeItem {
  _id: string;
  code: string;
  discountPercentage: number;
  expirationDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  createdAt?: string;
}

export interface PromoCodeFormInput {
  code: string;
  discountPercentage: number;
  expirationDate: string;
  usageLimit: number;
}

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || process.env.NEXT_PUBLIC_API_URL || 'https://flixora-server.vercel.app';

class AdminApiClient {
  /**
   * Helper to perform fetch with fallback to internal Next.js API routes
   */
  private async request<T>(serverPath: string, nextApiPath: string, options?: RequestInit): Promise<T> {
    try {
      // First try calling Express backend directly
      const response = await fetch(`${SERVER_URL}${serverPath}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options?.headers || {}),
        },
      });

      if (response.ok) {
        const json = await response.json();
        return (json.data !== undefined ? json : { success: true, data: json }) as T;
      }
    } catch {
      // Backend not running on port 5000; fall through to Next.js API route
    }

    // Fallback to Next.js internal API route
    const nextResponse = await fetch(nextApiPath, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });

    if (!nextResponse.ok) {
      const errorJson = await nextResponse.json().catch(() => ({}));
      throw new Error(errorJson.message || `API request failed: ${nextResponse.status}`);
    }

    return await nextResponse.json();
  }

  // 1. Revenue Analytics
  public async getRevenueOverview(): Promise<RevenueOverviewData> {
    const res = await this.request<{ success: boolean; data: RevenueOverviewData }>(
      '/api/analytics/revenue-overview',
      '/api/admin/analytics'
    );
    return res.data;
  }

  // 2. Transactions & Refunds
  public async getTransactions(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<TransactionListResponse> {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.search) query.set('search', params.search);
    if (params.status && params.status !== 'all') query.set('status', params.status);

    const queryString = query.toString() ? `?${query.toString()}` : '';

    return await this.request<TransactionListResponse>(
      `/api/transactions${queryString}`,
      `/api/admin/transactions${queryString}`
    );
  }

  public async processRefund(transactionId: string, reason: string): Promise<AdminTransaction> {
    const res = await this.request<{ success: boolean; data: AdminTransaction }>(
      `/api/transactions/${transactionId}/refund`,
      `/api/admin/transactions/${transactionId}/refund`,
      {
        method: 'POST',
        body: JSON.stringify({ reason }),
      }
    );
    return res.data;
  }

  // 3. Subscription Plans CRUD
  public async getPlans(): Promise<AdminPlan[]> {
    const res = await this.request<{ success: boolean; data: AdminPlan[] }>(
      '/api/plans',
      '/api/admin/plans'
    );
    return res.data;
  }

  public async createPlan(plan: Partial<AdminPlan>): Promise<AdminPlan> {
    const res = await this.request<{ success: boolean; data: AdminPlan }>(
      '/api/plans',
      '/api/admin/plans',
      {
        method: 'POST',
        body: JSON.stringify(plan),
      }
    );
    return res.data;
  }

  public async updatePlan(id: string, plan: Partial<AdminPlan>): Promise<AdminPlan> {
    const res = await this.request<{ success: boolean; data: AdminPlan }>(
      `/api/plans/${id}`,
      `/api/admin/plans/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(plan),
      }
    );
    return res.data;
  }

  public async deletePlan(id: string): Promise<boolean> {
    const res = await this.request<{ success: boolean }>(
      `/api/plans/${id}`,
      `/api/admin/plans/${id}`,
      {
        method: 'DELETE',
      }
    );
    return res.success;
  }

  // 4. Promo Codes CRUD
  public async getPromoCodes(): Promise<PromoCodeItem[]> {
    const res = await this.request<{ success: boolean; data: PromoCodeItem[] }>(
      '/api/promo-codes',
      '/api/admin/promo-codes'
    );
    return res.data;
  }

  public async createPromoCode(input: PromoCodeFormInput): Promise<PromoCodeItem> {
    const res = await this.request<{ success: boolean; data: PromoCodeItem }>(
      '/api/promo-codes',
      '/api/admin/promo-codes',
      {
        method: 'POST',
        body: JSON.stringify(input),
      }
    );
    return res.data;
  }

  public async deletePromoCode(id: string): Promise<boolean> {
    const res = await this.request<{ success: boolean }>(
      `/api/promo-codes/${id}`,
      `/api/admin/promo-codes/${id}`,
      {
        method: 'DELETE',
      }
    );
    return res.success;
  }
}

export const adminApi = new AdminApiClient();
export default adminApi;
