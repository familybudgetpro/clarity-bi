export interface DashboardDataPoint {
  month?: string;
  premium?: number;
  claims?: number;
  policies?: number;
  region?: string;
  product?: string;
  name?: string;
  value?: number;
  amount?: number;
  color?: string;
  count?: number;
  lossRatio?: number;
  dealers?: number;
  [key: string]: string | number | undefined;
}

export interface ChartProps {
  data: DashboardDataPoint[];
  onClick?: (data: DashboardDataPoint) => void;
  selectedElement?: string | null;
}
