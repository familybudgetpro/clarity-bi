import { useState, useCallback } from "react";
import { buildTemplatePage } from "@/lib/templates";

export interface Widget {
  id: string;
  type: string;
  title: string;
  grid: { x: number; y: number; w: number; h: number };
  config?: any;
}

export interface ReportPage {
  id: string;
  title: string;
  widgets: Widget[];
  layouts: any; // RGL layouts object
}

const defaultWidgetsPage1: Widget[] = [
  // Row 1: KPI Cards (compact)
  {
    id: "kpi-premium",
    type: "kpi-premium",
    title: "Total Premium",
    grid: { x: 0, y: 0, w: 3, h: 4 },
  },
  {
    id: "kpi-loss",
    type: "kpi-loss",
    title: "Loss Ratio",
    grid: { x: 3, y: 0, w: 3, h: 4 },
  },
  {
    id: "kpi-claims",
    type: "kpi-claims",
    title: "Total Claims",
    grid: { x: 6, y: 0, w: 3, h: 4 },
  },
  {
    id: "kpi-policies",
    type: "kpi-policies",
    title: "Policies Sold",
    grid: { x: 9, y: 0, w: 3, h: 4 },
  },
  // Row 2: Main Charts — trend takes more space, right side has KPI + pie stacked
  {
    id: "chart-trend",
    type: "chart-trend",
    title: "Premium vs Claims Trend",
    grid: { x: 0, y: 4, w: 7, h: 10 },
  },
  {
    id: "chart-pie",
    type: "chart-pie",
    title: "Claims by Type",
    grid: { x: 7, y: 14, w: 5, h: 10 },
  },
  {
    id: "chart-region",
    type: "chart-region",
    title: "Performance by Region",
    grid: { x: 7, y: 4, w: 5, h: 10 },
  },
  // Row 3: Product Distribution
  {
    id: "chart-bar-new",
    type: "chart-products",
    title: "Product Distribution",
    grid: { x: 0, y: 14, w: 7, h: 10 },
  },
];

const defaultWidgetsPage2: Widget[] = [
  {
    id: "chart-region-p2",
    type: "chart-region",
    title: "Regional Performance",
    grid: { x: 0, y: 0, w: 6, h: 10 },
  },
  {
    id: "table-dealers-p2",
    type: "table-dealers",
    title: "Dealer Performance Data",
    grid: { x: 6, y: 0, w: 6, h: 10 },
  },
];

const defaultWidgetsPage3: Widget[] = [
  {
    id: "kpi-loss-p3",
    type: "kpi-loss",
    title: "Overall Loss Ratio",
    grid: { x: 0, y: 0, w: 3, h: 4 },
  },
  {
    id: "kpi-claims-p3",
    type: "kpi-claims",
    title: "Total Claims Value",
    grid: { x: 3, y: 0, w: 3, h: 4 },
  },
  {
    id: "chart-pie-p3",
    type: "chart-pie",
    title: "Claims Segmentation",
    grid: { x: 6, y: 0, w: 6, h: 10 },
  },
  {
    id: "list-claims-p3",
    type: "list-claims",
    title: "Recent Large Claims",
    grid: { x: 0, y: 4, w: 6, h: 10 },
  },
];

const defaultWidgetsPage4: Widget[] = [
  {
    id: "kpi-loss-p4",
    type: "kpi-loss",
    title: "Portfolio Risk Level",
    grid: { x: 0, y: 0, w: 3, h: 4 },
  },
  {
    id: "chart-pie-p4",
    type: "chart-pie",
    title: "High Risk Claims by Category",
    grid: { x: 3, y: 0, w: 4, h: 10 },
  },
  {
    id: "chart-trend-p4",
    type: "chart-trend",
    title: "Loss Ratio Volatility",
    grid: { x: 7, y: 0, w: 5, h: 10 },
  },
];

const defaultWidgetsPage5: Widget[] = [
  {
    id: "table-dealers-p5",
    type: "table-dealers",
    title: "Dealer Performance Ranking",
    grid: { x: 0, y: 0, w: 6, h: 12 },
  },
  {
    id: "chart-region-p5",
    type: "chart-region",
    title: "Regional Dealer Distribution",
    grid: { x: 6, y: 0, w: 6, h: 12 },
  },
];

// Generate responsive layouts from widgets
function generateResponsiveLayouts(widgets: Widget[]) {
  const lg = widgets.map((w) => ({ i: w.id, ...w.grid, minW: 2, minH: 3 }));
  // md: 10 cols — scale proportionally
  const md = widgets.map((w) => ({
    i: w.id,
    x: Math.min(w.grid.x, 10 - Math.min(w.grid.w, 10)),
    y: w.grid.y,
    w: Math.min(w.grid.w, 10),
    h: w.grid.h,
    minW: 2, minH: 3,
  }));
  // sm: 6 cols — stack side-by-side or full-width
  const sm = widgets.map((w, i) => ({
    i: w.id,
    x: w.grid.w <= 3 ? (i % 2) * 3 : 0,
    y: Infinity, // auto-place vertically
    w: w.grid.w <= 3 ? 3 : 6,
    h: w.grid.h,
    minW: 2, minH: 3,
  }));
  // xs: 4 cols — mostly full width
  const xs = widgets.map((w) => ({
    i: w.id,
    x: 0,
    y: Infinity,
    w: w.grid.w <= 3 ? 2 : 4,
    h: w.grid.h,
    minW: 2, minH: 3,
  }));
  // xxs: 2 cols — everything stacked
  const xxs = widgets.map((w) => ({
    i: w.id,
    x: 0,
    y: Infinity,
    w: 2,
    h: w.grid.h,
    minW: 2, minH: 3,
  }));
  return { lg, md, sm, xs, xxs };
}

const defaultPages: ReportPage[] = [
  {
    id: "p1",
    title: "Executive Overview",
    widgets: defaultWidgetsPage1,
    layouts: generateResponsiveLayouts(defaultWidgetsPage1),
  },
  {
    id: "p2",
    title: "Market Trends",
    widgets: defaultWidgetsPage2,
    layouts: generateResponsiveLayouts(defaultWidgetsPage2),
  },
  {
    id: "p3",
    title: "Claims Deep Dive",
    widgets: defaultWidgetsPage3,
    layouts: generateResponsiveLayouts(defaultWidgetsPage3),
  },
  {
    id: "p4",
    title: "Risk Analysis",
    widgets: defaultWidgetsPage4,
    layouts: generateResponsiveLayouts(defaultWidgetsPage4),
  },
  {
    id: "p5",
    title: "Dealer Performance",
    widgets: defaultWidgetsPage5,
    layouts: generateResponsiveLayouts(defaultWidgetsPage5),
  },
];

export function useDashboardState() {
  const [pages, setPages] = useState<ReportPage[]>(defaultPages);
  const [activePageId, setActivePageId] = useState<string>("p1");

  const activePage = pages.find((p) => p.id === activePageId) || pages[0];

  const addPage = useCallback((title: string) => {
    const newPageId = `p${Date.now()}`;
    setPages((prev) => [
      ...prev,
      { id: newPageId, title, widgets: [], layouts: { lg: [] } },
    ]);
    setActivePageId(newPageId);
  }, []);

  const renamePage = useCallback((pageId: string, newTitle: string) => {
    setPages((prev) =>
      prev.map((p) => (p.id === pageId ? { ...p, title: newTitle } : p)),
    );
  }, []);

  const removePage = useCallback(
    (pageId: string) => {
      setPages((prev) => {
        if (prev.length <= 1) return prev; // Don't delete last page
        const newPages = prev.filter((p) => p.id !== pageId);
        if (activePageId === pageId) setActivePageId(newPages[0].id);
        return newPages;
      });
    },
    [activePageId],
  );

  const addWidgetToPage = useCallback(
    (pageId: string, widgetType: string, title?: string) => {
      setPages((prev) =>
        prev.map((p) => {
          if (p.id !== pageId) return p;
          const newWidget: Widget = {
            id: `${widgetType}-${Date.now()}`,
            type: widgetType,
            title: title || "New Widget",
            grid: { x: 0, y: Infinity, w: 4, h: 8 },
          };
          const newItem = { i: newWidget.id, ...newWidget.grid, minW: 2, minH: 3 };
          return {
            ...p,
            widgets: [...p.widgets, newWidget],
            layouts: {
              ...p.layouts,
              lg: [...(p.layouts.lg || []), newItem],
              md: [...(p.layouts.md || []), { ...newItem, w: Math.min(4, 10) }],
              sm: [...(p.layouts.sm || []), { ...newItem, w: 6 }],
              xs: [...(p.layouts.xs || []), { ...newItem, w: 4 }],
              xxs: [...(p.layouts.xxs || []), { ...newItem, w: 2 }],
            },
          };
        }),
      );
    },
    [],
  );

  const removeWidgetFromPage = useCallback(
    (pageId: string, widgetId: string) => {
      setPages((prev) =>
        prev.map((p) => {
          if (p.id !== pageId) return p;
          const filterLayout = (arr: any[]) => arr?.filter((l: any) => l.i !== widgetId) || [];
          return {
            ...p,
            widgets: p.widgets.filter((w) => w.id !== widgetId),
            layouts: {
              lg: filterLayout(p.layouts.lg),
              md: filterLayout(p.layouts.md),
              sm: filterLayout(p.layouts.sm),
              xs: filterLayout(p.layouts.xs),
              xxs: filterLayout(p.layouts.xxs),
            },
          };
        }),
      );
    },
    [],
  );

  const updatePageLayout = useCallback((pageId: string, newLayout: any[], allLayouts?: any) => {
    setPages((prev) =>
      prev.map((p) => {
        if (p.id !== pageId) return p;
        return {
          ...p,
          layouts: allLayouts ? { ...p.layouts, ...allLayouts } : { ...p.layouts, lg: newLayout },
          widgets: p.widgets.map((w) => {
            const match = newLayout.find((l: any) => l.i === w.id);
            return match
              ? {
                  ...w,
                  grid: { x: match.x, y: match.y, w: match.w, h: match.h },
                }
              : w;
          }),
        };
      }),
    );
  }, []);

  const createTemplatePage = useCallback((templateId: string) => {
    const newPageId = `tpl-${templateId}-${Date.now()}`;
    const page = buildTemplatePage(templateId, newPageId);
    if (!page) return;
    setPages((prev) => [...prev, page]);
    setActivePageId(newPageId);
  }, []);

  const updateWidgetConfig = useCallback(
    (pageId: string, widgetId: string, patch: Partial<Widget>) => {
      setPages((prev) =>
        prev.map((p) => {
          if (p.id !== pageId) return p;
          return {
            ...p,
            widgets: p.widgets.map((w) =>
              w.id === widgetId ? { ...w, ...patch } : w,
            ),
          };
        }),
      );
    },
    [],
  );

  return {
    pages,
    activePageId,
    setActivePageId,
    activePage,
    addPage,
    renamePage,
    removePage,
    addWidgetToPage,
    removeWidgetFromPage,
    updatePageLayout,
    updateWidgetConfig,
    createTemplatePage,
  };
}
