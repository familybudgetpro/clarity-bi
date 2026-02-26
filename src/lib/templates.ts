import { ReportPage, Widget } from "@/hooks/useDashboardState";

// ─── Helper ────────────────────────────────────────────────────────────────

function makeLayouts(widgets: Widget[]) {
  return { lg: widgets.map((w) => ({ i: w.id, ...w.grid })) };
}

// ─── Template Definitions ──────────────────────────────────────────────────

const executiveSummaryWidgets: Widget[] = [
  { id: "t1-kpi-premium", type: "kpi-premium", title: "Total Premium", grid: { x: 0, y: 0, w: 3, h: 4 } },
  { id: "t1-kpi-policies", type: "kpi-policies", title: "Policies Sold", grid: { x: 3, y: 0, w: 3, h: 4 } },
  { id: "t1-kpi-claims", type: "kpi-claims", title: "Total Claims", grid: { x: 6, y: 0, w: 3, h: 4 } },
  { id: "t1-kpi-loss", type: "kpi-loss", title: "Loss Ratio", grid: { x: 9, y: 0, w: 3, h: 4 } },
  { id: "t1-trend", type: "chart-trend", title: "Premium vs Claims Trend", grid: { x: 0, y: 4, w: 8, h: 12 } },
  { id: "t1-pie", type: "chart-pie", title: "Claims by Type", grid: { x: 8, y: 4, w: 4, h: 12 } },
  { id: "t1-region", type: "chart-region", title: "Regional Performance", grid: { x: 0, y: 16, w: 6, h: 10 } },
  { id: "t1-products", type: "chart-products", title: "Product Distribution", grid: { x: 6, y: 16, w: 6, h: 10 } },
];

const salesPerformanceWidgets: Widget[] = [
  { id: "t2-kpi-premium", type: "kpi-premium", title: "Total Premium", grid: { x: 0, y: 0, w: 4, h: 4 } },
  { id: "t2-kpi-policies", type: "kpi-policies", title: "Policies Sold", grid: { x: 4, y: 0, w: 4, h: 4 } },
  { id: "t2-kpi-loss", type: "kpi-loss", title: "Loss Ratio", grid: { x: 8, y: 0, w: 4, h: 4 } },
  { id: "t2-products", type: "chart-products", title: "Premium by Product", grid: { x: 0, y: 4, w: 6, h: 12 } },
  { id: "t2-region", type: "chart-region", title: "Regional Sales", grid: { x: 6, y: 4, w: 6, h: 12 } },
  { id: "t2-dealers", type: "table-dealers", title: "Dealer Ranking", grid: { x: 0, y: 16, w: 12, h: 12 } },
];

const claimsAnalysisWidgets: Widget[] = [
  { id: "t3-kpi-claims", type: "kpi-claims", title: "Total Claims Value", grid: { x: 0, y: 0, w: 4, h: 4 } },
  { id: "t3-kpi-loss", type: "kpi-loss", title: "Loss Ratio", grid: { x: 4, y: 0, w: 4, h: 4 } },
  { id: "t3-kpi-policies", type: "kpi-policies", title: "Affected Policies", grid: { x: 8, y: 0, w: 4, h: 4 } },
  { id: "t3-trend", type: "chart-trend", title: "Claims vs Premium Over Time", grid: { x: 0, y: 4, w: 7, h: 12 } },
  { id: "t3-pie", type: "chart-pie", title: "Claims Segmentation by Type", grid: { x: 7, y: 4, w: 5, h: 12 } },
  { id: "t3-list", type: "list-claims", title: "Recent Large Claims", grid: { x: 0, y: 16, w: 12, h: 10 } },
];

const riskMonitorWidgets: Widget[] = [
  { id: "t4-kpi-loss", type: "kpi-loss", title: "Portfolio Risk Level", grid: { x: 0, y: 0, w: 6, h: 4 } },
  { id: "t4-kpi-claims", type: "kpi-claims", title: "Claims at Risk", grid: { x: 6, y: 0, w: 6, h: 4 } },
  { id: "t4-trend", type: "chart-trend", title: "Loss Ratio Trend", grid: { x: 0, y: 4, w: 6, h: 14 } },
  { id: "t4-pie", type: "chart-pie", title: "High Risk Claims by Category", grid: { x: 6, y: 4, w: 6, h: 14 } },
  { id: "t4-region", type: "chart-region", title: "Risk by Region", grid: { x: 0, y: 18, w: 12, h: 10 } },
];

const dealerInsightsWidgets: Widget[] = [
  { id: "t5-kpi-premium", type: "kpi-premium", title: "Total Premium via Dealers", grid: { x: 0, y: 0, w: 4, h: 4 } },
  { id: "t5-kpi-policies", type: "kpi-policies", title: "Policies via Dealers", grid: { x: 4, y: 0, w: 4, h: 4 } },
  { id: "t5-kpi-loss", type: "kpi-loss", title: "Portfolio Loss Ratio", grid: { x: 8, y: 0, w: 4, h: 4 } },
  { id: "t5-dealers", type: "table-dealers", title: "Dealer Performance Ranking", grid: { x: 0, y: 4, w: 12, h: 14 } },
  { id: "t5-region", type: "chart-region", title: "Regional Dealer Distribution", grid: { x: 0, y: 18, w: 12, h: 10 } },
];

const productFocusWidgets: Widget[] = [
  { id: "t6-kpi-premium", type: "kpi-premium", title: "Total Premium", grid: { x: 0, y: 0, w: 3, h: 4 } },
  { id: "t6-kpi-policies", type: "kpi-policies", title: "Policies Sold", grid: { x: 3, y: 0, w: 3, h: 4 } },
  { id: "t6-kpi-claims", type: "kpi-claims", title: "Claims Paid", grid: { x: 6, y: 0, w: 3, h: 4 } },
  { id: "t6-kpi-loss", type: "kpi-loss", title: "Loss Ratio", grid: { x: 9, y: 0, w: 3, h: 4 } },
  { id: "t6-products", type: "chart-products", title: "Premium by Product Line", grid: { x: 0, y: 4, w: 7, h: 13 } },
  { id: "t6-pie", type: "chart-pie", title: "Product Mix by Claims", grid: { x: 7, y: 4, w: 5, h: 13 } },
  { id: "t6-trend", type: "chart-trend", title: "Product Revenue Trend", grid: { x: 0, y: 17, w: 12, h: 11 } },
];

// ─── Template Registry ────────────────────────────────────────────────────

export const TEMPLATES: Record<
  string,
  { label: string; description: string; widgets: Widget[] }
> = {
  "executive-summary": {
    label: "Executive Summary",
    description: "High-level KPIs + trend + regional + product breakdown",
    widgets: executiveSummaryWidgets,
  },
  "sales-performance": {
    label: "Sales Performance",
    description: "Premium vs policies, product mix, dealer ranking",
    widgets: salesPerformanceWidgets,
  },
  "claims-analysis": {
    label: "Claims Analysis",
    description: "Deep dive into claims, loss ratio, and large claims list",
    widgets: claimsAnalysisWidgets,
  },
  "risk-monitor": {
    label: "Risk Monitor",
    description: "Loss ratio volatility, risk by region and category",
    widgets: riskMonitorWidgets,
  },
  "dealer-insights": {
    label: "Dealer Insights",
    description: "Dealer table, regional distribution, portfolio KPIs",
    widgets: dealerInsightsWidgets,
  },
  "product-focus": {
    label: "Product Focus",
    description: "Product line premium, revenue trend, claims mix",
    widgets: productFocusWidgets,
  },
};

// ─── Factory ──────────────────────────────────────────────────────────────

export function buildTemplatePage(
  templateId: string,
  pageId: string,
): ReportPage | null {
  const tpl = TEMPLATES[templateId];
  if (!tpl) return null;

  // Suffix widget IDs with pageId to avoid collisions
  const widgets = tpl.widgets.map((w) => ({
    ...w,
    id: `${w.id}-${pageId}`,
  }));

  return {
    id: pageId,
    title: tpl.label,
    widgets,
    layouts: makeLayouts(widgets),
  };
}
