export interface Plan {
  _id: string;
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
