// Type definitions for Clarity BI

export interface DataFile {
  id: string;
  fileName: string;
  uploadedAt: Date;
  sheets: DataSheet[];
  status: 'uploading' | 'parsing' | 'ready' | 'error';
  error?: string;
}

export interface DataSheet {
  name: string;
  columns: Column[];
  rowCount: number;
  data: Record<string, unknown>[];
}

export interface Column {
  id: string;
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  role: 'measure' | 'dimension' | 'date' | 'id';
  samples: unknown[];
  uniqueCount: number;
  nullCount: number;
  format?: string;
}

export interface Filter {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'gt' | 'lt' | 'between' | 'in';
  value: string | number | string[] | [number, number];
  label: string;
}

export interface Visualization {
  id: string;
  type: 'bar' | 'line' | 'pie' | 'donut' | 'area' | 'combo' | 'table' | 'kpi' | 'heatmap' | 'scatter';
  title: string;
  config: ChartConfiguration;
  position: { x: number; y: number; width: number; height: number };
  sourceTable?: string;
  filters?: Filter[];
}

export interface ChartConfiguration {
  xAxis?: string;
  yAxis?: string[];
  series?: ChartSeries[];
  colors?: string[];
  showLegend?: boolean;
  showGrid?: boolean;
  stacked?: boolean;
  horizontal?: boolean;
  valueFormat?: 'currency' | 'percent' | 'number';
}

export interface ChartSeries {
  name: string;
  dataKey: string;
  type?: 'bar' | 'line' | 'area';
  color: string;
  yAxisId?: 'left' | 'right';
}

export interface Report {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  visualizations: Visualization[];
  filters: Filter[];
  perspective: 'ceo' | 'cfo' | 'coo' | 'manager';
}

export interface KPI {
  id: string;
  label: string;
  value: string | number;
  previousValue?: string | number;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  format?: 'currency' | 'percent' | 'number';
  icon?: string;
  color?: string;
  sparkData?: number[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  visualizationId?: string;
  suggestions?: Suggestion[];
}

export interface Suggestion {
  query: string;
  icon: string;
  category: 'related' | 'deeper' | 'forecast';
}

export interface Perspective {
  id: 'ceo' | 'cfo' | 'coo' | 'manager';
  label: string;
  description: string;
  defaultKPIs: string[];
  defaultVisualizations: string[];
  color: string;
}

export const PERSPECTIVES: Perspective[] = [
  {
    id: 'ceo',
    label: 'CEO',
    description: 'Strategic growth and market overview',
    defaultKPIs: ['totalPremium', 'marketShare', 'revenue', 'growth'],
    defaultVisualizations: ['revenueTrend', 'marketComparison', 'topDealers'],
    color: '#3b82f6',
  },
  {
    id: 'cfo',
    label: 'CFO',
    description: 'Financial health and risk management',
    defaultKPIs: ['lossRatio', 'reserves', 'margins', 'cashFlow'],
    defaultVisualizations: ['lossRatioTrend', 'claimsForecast', 'profitability'],
    color: '#10b981',
  },
  {
    id: 'coo',
    label: 'COO',
    description: 'Operational efficiency and performance',
    defaultKPIs: ['claimsProcessed', 'avgProcessingTime', 'bottlenecks', 'satisfaction'],
    defaultVisualizations: ['processingTimes', 'dealerPerformance', 'claimAging'],
    color: '#f59e0b',
  },
  {
    id: 'manager',
    label: 'Line Manager',
    description: 'Daily targets and team performance',
    defaultKPIs: ['dailySales', 'teamTarget', 'pendingTasks', 'dealerSupport'],
    defaultVisualizations: ['dailyProgress', 'teamRanking', 'taskList'],
    color: '#8b5cf6',
  },
];

// Insurance-specific types
export interface Dealer {
  id: string;
  name: string;
  region: string;
  premium: number;
  claims: number;
  policies: number;
  lossRatio: number;
  status: 'healthy' | 'warning' | 'critical';
}

export interface Claim {
  id: string;
  policyId: string;
  dealerId: string;
  type: 'collision' | 'theft' | 'totalLoss' | 'windscreen' | 'thirdParty' | 'warranty';
  amount: number;
  status: 'pending' | 'processing' | 'approved' | 'rejected' | 'paid';
  filedAt: Date;
  processedAt?: Date;
  vehicleBrand?: string;
  vehicleModel?: string;
}

export interface Policy {
  id: string;
  dealerId: string;
  product: 'comprehensive' | 'thirdParty' | 'agencyRepair' | 'extendedWarranty';
  premium: number;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'expired' | 'cancelled';
  vehicleBrand: string;
  vehicleModel: string;
  region: string;
}

export interface ForecastResult {
  period: string;
  predicted: number;
  lowerBound: number;
  upperBound: number;
  confidence: number;
}

export interface StrategyInsight {
  id: string;
  type: 'warning' | 'opportunity' | 'action';
  title: string;
  description: string;
  metric: string;
  impact: 'high' | 'medium' | 'low';
  suggestedAction: string;
  createdAt: Date;
}
