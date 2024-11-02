export interface ErrorDetail {
  message: string;
  errors: any[];
  hints: string;
}

export interface CustomErrorInterface extends Error {
  status?: number;
  errors?: any[];
  hints?: string;
}
