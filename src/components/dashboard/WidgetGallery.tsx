import React from "react";
import {
  BarChart,
  PieChart,
  LineChart,
  Table,
  Zap,
  Type,
  LayoutGrid,
  Percent,
  TrendingUp,
  History,
  Grid3X3,
} from "lucide-react";

interface WidgetGalleryProps {
  onSelect: (type: string, title: string) => void;
}

export function WidgetGallery({ onSelect }: WidgetGalleryProps) {
  const categories = [
    {
      name: "KPIs",
      icon: <Zap size={14} />,
      items: [
        {
          type: "kpi-premium",
          title: "Premium KPI",
          icon: <TrendingUp size={18} />,
        },
        { type: "kpi-loss", title: "Loss Ratio", icon: <Percent size={18} /> },
        {
          type: "kpi-policies",
          title: "Policy Count",
          icon: <Type size={18} />,
        },
      ],
    },
    {
      name: "Charts",
      icon: <LayoutGrid size={14} />,
      items: [
        {
          type: "chart-trend",
          title: "Trend Line",
          icon: <LineChart size={18} />,
        },
        {
          type: "chart-products",
          title: "Bar Chart",
          icon: <BarChart size={18} />,
        },
        { type: "chart-pie", title: "Pie Chart", icon: <PieChart size={18} /> },
        {
          type: "chart-region",
          title: "Map View",
          icon: <Grid3X3 size={18} />,
        },
      ],
    },
    {
      name: "Data",
      icon: <Table size={14} />,
      items: [
        {
          type: "table-dealers",
          title: "Dealer Table",
          icon: <Table size={18} />,
        },
        {
          type: "list-claims",
          title: "Claim List",
          icon: <History size={18} />,
        },
      ],
    },
  ];

  const allItems = [
    ...categories[0].items,
    ...categories[1].items,
    ...categories[2].items,
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allItems.map((w) => (
            <button
              key={w.type}
              onClick={() => onSelect(w.type, w.title)}
              className="group relative flex flex-col items-center gap-4 p-6 rounded-2xl bg-muted/30 hover:bg-muted border border-border/50 hover:border-primary/50 transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <div className="w-16 h-16 rounded-2xl bg-background flex items-center justify-center text-muted-foreground group-hover:text-primary transition-all shadow-md group-hover:rotate-3">
                {w.icon}
              </div>
              <div className="text-center">
                <h4 className="text-sm font-bold text-foreground mb-1">
                  {w.title}
                </h4>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  Add to Page
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
