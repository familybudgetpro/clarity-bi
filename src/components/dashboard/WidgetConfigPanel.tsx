"use client";
import React, { useState, useEffect } from "react";
import {
  X,
  BarChart2,
  LineChart,
  PieChart,
  AreaChart,
  Table2,
  AlertTriangle,
  Plus,
  Trash2,
} from "lucide-react";
import { Widget } from "@/hooks/useDashboardState";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface WidgetConfig {
  customTitle?: string;
  chartVariant?: "bar" | "line" | "area" | "pie";
  kpiWarningThreshold?: number;
  kpiDangerThreshold?: number;
  conditionalRules?: ConditionalRule[];
  comparisonMode?: boolean;
}

export interface ConditionalRule {
  id: string;
  metric: string;
  operator: ">" | "<" | ">=" | "<=" | "=";
  value: number;
  color: string;
  label: string;
}

// ─── Chart type options ───────────────────────────────────────────────────

const CHART_TYPES: {
  id: WidgetConfig["chartVariant"];
  label: string;
  icon: React.ReactNode;
}[] = [
  { id: "bar", label: "Bar", icon: <BarChart2 size={16} /> },
  { id: "line", label: "Line", icon: <LineChart size={16} /> },
  { id: "area", label: "Area", icon: <AreaChart size={16} /> },
  { id: "pie", label: "Pie", icon: <PieChart size={16} /> },
];

const isChartWidget = (type: string) =>
  ["chart-trend", "chart-region", "chart-products", "chart-pie"].includes(
    type,
  );

const isKpiWidget = (type: string) => type.startsWith("kpi-");

// ─── Component ─────────────────────────────────────────────────────────────

interface WidgetConfigPanelProps {
  widget: Widget;
  onUpdate: (patch: Partial<Widget>) => void;
  onClose: () => void;
}

export function WidgetConfigPanel({
  widget,
  onUpdate,
  onClose,
}: WidgetConfigPanelProps) {
  const [title, setTitle] = useState(widget.title);
  const [config, setConfig] = useState<WidgetConfig>({
    chartVariant: "bar",
    kpiWarningThreshold: undefined,
    kpiDangerThreshold: undefined,
    conditionalRules: [],
    comparisonMode: false,
    ...(widget.config ?? {}),
  });

  // Sync if widget changes externally
  useEffect(() => {
    setTitle(widget.title);
    setConfig({ chartVariant: "bar", ...(widget.config ?? {}) });
  }, [widget.id]);

  const patchConfig = (patch: Partial<WidgetConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  };

  const handleSave = () => {
    onUpdate({ title, config });
    onClose();
  };

  const addRule = () => {
    patchConfig({
      conditionalRules: [
        ...(config.conditionalRules ?? []),
        {
          id: `rule-${Date.now()}`,
          metric: "premium",
          operator: ">",
          value: 0,
          color: "#ef4444",
          label: "High",
        },
      ],
    });
  };

  const removeRule = (id: string) => {
    patchConfig({
      conditionalRules: (config.conditionalRules ?? []).filter(
        (r) => r.id !== id,
      ),
    });
  };

  const updateRule = (id: string, patch: Partial<ConditionalRule>) => {
    patchConfig({
      conditionalRules: (config.conditionalRules ?? []).map((r) =>
        r.id === id ? { ...r, ...patch } : r,
      ),
    });
  };

  return (
    /* Backdrop */
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-80 bg-card border-l border-border shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
          <div>
            <h2 className="font-semibold text-sm text-foreground">
              Widget Settings
            </h2>
            <p className="text-[10px] text-muted-foreground mt-0.5 truncate max-w-[200px]">
              {widget.type}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* ── Identity ── */}
          <section>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Identity
            </h3>
            <label className="block text-xs font-medium text-foreground mb-1">
              Widget Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
              placeholder="Widget title..."
            />
          </section>

          {/* ── Chart Type ── */}
          {isChartWidget(widget.type) && (
            <section>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Chart Type
              </h3>
              <div className="grid grid-cols-4 gap-1.5">
                {CHART_TYPES.map((ct) => (
                  <button
                    key={ct.id}
                    onClick={() => patchConfig({ chartVariant: ct.id })}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-xs transition-all ${
                      config.chartVariant === ct.id
                        ? "bg-primary/10 border-primary text-primary"
                        : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {ct.icon}
                    <span>{ct.label}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* ── KPI Thresholds ── */}
          {isKpiWidget(widget.type) && (
            <section>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle size={11} className="text-amber-500" />
                KPI Thresholds
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Warning threshold (amber)
                  </label>
                  <input
                    type="number"
                    value={config.kpiWarningThreshold ?? ""}
                    onChange={(e) =>
                      patchConfig({
                        kpiWarningThreshold: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                    className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400/40 text-foreground"
                    placeholder="e.g. 0.6"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Danger threshold (red)
                  </label>
                  <input
                    type="number"
                    value={config.kpiDangerThreshold ?? ""}
                    onChange={(e) =>
                      patchConfig({
                        kpiDangerThreshold: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                    className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400/40 text-foreground"
                    placeholder="e.g. 0.8"
                  />
                </div>
              </div>
            </section>
          )}

          {/* ── Comparison Mode ── */}
          {isChartWidget(widget.type) && (
            <section>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Display Options
              </h3>
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div
                  onClick={() =>
                    patchConfig({ comparisonMode: !config.comparisonMode })
                  }
                  className={`w-9 h-5 rounded-full relative transition-colors duration-200 ${
                    config.comparisonMode ? "bg-primary" : "bg-muted border border-border"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${
                      config.comparisonMode ? "right-0.5" : "left-0.5"
                    }`}
                  />
                </div>
                <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                  Comparison Mode
                </span>
              </label>
              <p className="text-[10px] text-muted-foreground mt-1 ml-11">
                Show period-over-period overlay
              </p>
            </section>
          )}

          {/* ── Conditional Formatting ── */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Conditional Rules
              </h3>
              <button
                onClick={addRule}
                className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80 font-medium"
              >
                <Plus size={10} /> Add Rule
              </button>
            </div>

            {(config.conditionalRules ?? []).length === 0 ? (
              <p className="text-[11px] text-muted-foreground bg-muted/40 rounded-lg p-3 text-center">
                No rules yet — add one above
              </p>
            ) : (
              <div className="space-y-2">
                {(config.conditionalRules ?? []).map((rule) => (
                  <div
                    key={rule.id}
                    className="bg-muted/40 border border-border rounded-lg p-2.5 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <select
                        value={rule.metric}
                        onChange={(e) =>
                          updateRule(rule.id, { metric: e.target.value })
                        }
                        className="flex-1 text-xs bg-background border border-border rounded px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                      >
                        <option value="premium">Premium</option>
                        <option value="claims">Claims</option>
                        <option value="lossRatio">Loss Ratio</option>
                        <option value="policies">Policies</option>
                      </select>
                      <select
                        value={rule.operator}
                        onChange={(e) =>
                          updateRule(rule.id, {
                            operator: e.target.value as ConditionalRule["operator"],
                          })
                        }
                        className="w-14 text-xs bg-background border border-border rounded px-1 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                      >
                        {[">", "<", ">=", "<=", "="].map((op) => (
                          <option key={op} value={op}>
                            {op}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={rule.value}
                        onChange={(e) =>
                          updateRule(rule.id, { value: Number(e.target.value) })
                        }
                        className="w-16 text-xs bg-background border border-border rounded px-2 py-1 text-foreground focus:outline-none"
                      />
                      <button
                        onClick={() => removeRule(rule.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-[10px] text-muted-foreground">
                        Color:
                      </label>
                      <input
                        type="color"
                        value={rule.color}
                        onChange={(e) =>
                          updateRule(rule.id, { color: e.target.value })
                        }
                        className="w-7 h-6 rounded border border-border cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={rule.label}
                        onChange={(e) =>
                          updateRule(rule.id, { label: e.target.value })
                        }
                        className="flex-1 text-xs bg-background border border-border rounded px-2 py-1 text-foreground focus:outline-none"
                        placeholder="Label..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Footer actions */}
        <div className="px-4 py-3 border-t border-border bg-muted/20 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 text-sm py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 text-sm py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
