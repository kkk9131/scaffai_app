// API関連の型定義

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any[];
}

export interface CalculationApiRequest {
  width_NS: number;
  width_EW: number;
  eaves_N: number;
  eaves_E: number;
  eaves_S: number;
  eaves_W: number;
  boundary_N?: number | null;
  boundary_E?: number | null;
  boundary_S?: number | null;
  boundary_W?: number | null;
  standard_height: number;
  roof_shape: string;
  tie_column: boolean;
  railing_count: number;
  use_355_NS: number;
  use_300_NS: number;
  use_150_NS: number;
  use_355_EW: number;
  use_300_EW: number;
  use_150_EW: number;
  target_margin: number;
}