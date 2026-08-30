import type { PlanResponse } from '@/types/plan';

const API_URL = '';

export const getAllPlans = async (): Promise<PlanResponse> => {
  const response = await fetch(`${API_URL}/api/plans`);

  const result: PlanResponse = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch plans');
  }

  return result;
};
