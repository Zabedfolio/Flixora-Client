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
  planName?: string;
  amount: string;
  invoiceId: string;
  status: 'Paid' | 'Failed';
  paymentMethod?: string;
  date: string;
}

export const DEFAULT_PLANS_FALLBACK: Plan[] = [
  {
    _id: 'basic',
    slug: 'basic',
    name: 'Basic',
    price: '$7.99/mo',
    resolution: '720p (HD)',
    screens: '1 screen',
    downloads: 'No downloads',
    ads: 'Ad-supported',
    kids: '1 kids profile',
  },
  {
    _id: 'standard',
    slug: 'standard',
    name: 'Standard',
    price: '$11.99/mo',
    resolution: '1080p (FHD)',
    screens: '2 screens',
    downloads: 'Standard downloads',
    ads: 'Ad-free',
    kids: '3 kids profiles',
  },
  {
    _id: 'premium',
    slug: 'premium',
    name: 'Premium',
    price: '$14.99/mo',
    resolution: '4K + HDR',
    screens: '4 screens',
    downloads: 'Unlimited downloads',
    ads: 'Ad-free',
    kids: 'Unlimited kids profiles',
  },
];

export const getAllPlans = async (): Promise<PlanResponse> => {
  try {
    const response = await fetch('/api/plans', {
      cache: 'no-store',
    });
    if (response.ok) {
      const result: PlanResponse = await response.json();
      if (result.success && Array.isArray(result.data) && result.data.length > 0) {
        return result;
      }
    }
  } catch (err) {
    console.error('Error fetching /api/plans:', err);
  }

  return {
    success: true,
    message: 'Plans loaded successfully',
    data: DEFAULT_PLANS_FALLBACK,
  };
};

export const getUserPayments = async (
  userId: string,
): Promise<BillingRecord[]> => {
  try {
    const response = await fetch(`/api/payments`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return [];
    }

    const res = await response.json();

    if (Array.isArray(res)) {
      return res;
    } else if (res.success && Array.isArray(res.data)) {
      return res.data;
    } else if (res.data && Array.isArray(res.data)) {
      return res.data;
    }
  } catch (err) {
    console.error('Error fetching user payments:', err);
  }

  return [];
};
