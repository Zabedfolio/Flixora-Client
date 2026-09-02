export interface Plan {
  _id: string;
  slug?: string;
  name: string;
  price: string;
  resolution: string;
  screens: string;
  downloads: string;
  ads: string;
  kids: string;
}

export interface PlanResponse {
  success: boolean;
  message: string;
  data: Plan[];
}

export interface BillingRecord {
  _id?: string;
  id?: string;
  userId: string;
  planId: string;
  planName: string;
  amount: string;
  invoiceId: string;
  status: 'Paid' | 'Failed';
  paymentMethod: string;
  date: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const getAllPlans = async (): Promise<PlanResponse> => {
  const response = await fetch(`${API_URL}/api/plans`, {
    cache: 'no-store',
  });
  const result: PlanResponse = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch plans');
  }

  return result;
};

export const getUserPayments = async (
  userId: string,
): Promise<BillingRecord[]> => {
  const response = await fetch(`/api/payments`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch payment history');
  }

  const res = await response.json();

  if (Array.isArray(res)) {
    return res;
  } else if (res.success && Array.isArray(res.data)) {
    return res.data;
  } else if (res.data && Array.isArray(res.data)) {
    return res.data;
  }

  return [];
};
