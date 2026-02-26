"use client";

import React, { useState, useMemo } from "react";
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
  Search,
  ChevronDown,
  ChevronRight,
  Plus,
} from "lucide-react";

interface WidgetItem {
  type: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface Category {
  name: string;
  icon: React.ReactNode;
  items: WidgetItem[];
}

interface WidgetGalleryProps {
  onSelect: (type: string, title: string) => void;
}

const CATEGORIES: Category[] = [
  {
    name: "KPIs",
    icon: <Zap size={12} />,
    items: [
      {
        type: "kpi-premium",
        title: "Premium KPI",
        description: "Total premium collected with policy count",
        icon: <TrendingUp size={15} />,
      },
      {
        type: "kpi-loss",
        title: "Loss Ratio",
        description: "Claims vs premium ratio indicator",
        icon: <Percent size={15} />,
      },
      {
        type: "kpi-claims",
        title: "Claims KPI",
        description: "Total claims amount and count",
        icon: <History size={15} />,
      },
      {
        type: "kpi-policies",
        title: "Policy Count",
        description: "Active policies and dealer count",
        icon: <Type size={15} />,
      },
    ],
  },
  {
    name: "Charts",
    icon: <LayoutGrid size={12} />,
    items: [
      {
        type: "chart-trend",
        title: "Trend Line",
        description: "Monthly premium and claims over time",
        icon: <LineChart size={15} />,
      },
      {
        type: "chart-products",
        title: "Bar Chart",
        description: "Product mix by policies and premium",
        icon: <BarChart size={15} />,
      },
      {
        type: "chart-pie",
        title: "Pie Chart",
        description: "Claim status breakdown by type",
        icon: <PieChart size={15} />,
      },
      {
        type: "chart-region",
        title: "Dealer Performance",
        description: "Horizontal bar chart by dealer",
        icon: <Grid3X3 size={15} />,
      },
    ],
  },
  {
    name: "Data",
    icon: <Table size={12} />,
    items: [
      {
        type: "table-dealers",
        title: "Dealer Table",
        description: "Full dealer metrics with loss ratio",
        icon: <Table size={15} />,
      },
      {
        type: "list-claims",
        title: "Claim List",
        description: "Recent claims with status and amount",
        icon: <History size={15} />,
      },
    ],
  },
];

export function WidgetGallery({ onSelect }: WidgetGalleryProps) {
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return CATEGORIES;
    return CATEGORIES
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (item) =>
            item.title.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q),
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [search]);

  const totalWidgets = CATEGORIES.reduce((sum, cat) => sum + cat.items.length, 0);

  const toggleCollapse = (name: string) =>
    setCollapsed((prev) => ({ ...prev, [name]: !prev[name] }));

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="px-3 pb-3 pt-1 shrink-0">
        <div className="relative">
          <Search
            size={12}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search widgets..."
            className="w-full pl-7 pr-3 py-1.5 text-xs bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground/60"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1 scrollbar-thin scrollbar-thumb-border">
        {filtered.map((cat) => (
          <div key={cat.name}>
            {/* Category header */}
            <button
              onClick={() => toggleCollapse(cat.name)}
              className="w-full flex items-center gap-1.5 px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              {collapsed[cat.name] ? (
                <ChevronRight size={10} />
              ) : (
                <ChevronDown size={10} />
              )}
              <span className="flex items-center gap-1">
                {cat.icon}
                {cat.name}
              </span>
              <span className="ml-auto text-[9px] bg-muted px-1.5 py-0.5 rounded-full">
                {cat.items.length}
              </span>
            </button>

            {/* Items */}
            {!collapsed[cat.name] && (
              <div className="space-y-0.5">
                {cat.items.map((item) => (
                  <button
                    key={item.type}
                    onClick={() => onSelect(item.type, item.title)}
                    className="group w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-muted/70 hover:border-primary/30 border border-transparent transition-all text-left"
                  >
                    <div className="shrink-0 w-7 h-7 rounded-md bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground leading-tight truncate">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground leading-tight mt-0.5 truncate">
                        {item.description}
                      </p>
                    </div>
                    <div className="shrink-0 w-5 h-5 rounded-full bg-muted/0 group-hover:bg-primary/10 flex items-center justify-center text-muted-foreground/0 group-hover:text-primary transition-all">
                      <Plus size={11} />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Search size={20} className="mb-2 opacity-30" />
            <p className="text-xs">No widgets match &quot;{search}&quot;</p>
          </div>
        )}
      </div>
    </div>
  );
}
