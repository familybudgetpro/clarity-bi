"use client";

import React, { useState, useCallback, useRef } from "react";
import { useDashboardState } from "@/hooks/useDashboardState";
import { useFilters } from "@/hooks/useFilters";
import { useData } from "@/hooks/useData";
import { Sidebar } from "./Sidebar";
import { DashboardHeader, PublishModal } from "./DashboardHeader";
import { FilterPanel } from "./FilterPanel";
import { WidgetGallery } from "./WidgetGallery";
import { ReportManager } from "./ReportManager";
import { Breadcrumbs } from "./Breadcrumbs";
import { KPIContent } from "./widgets";
import { TrendChart } from "./widgets/TrendChart";
import { PieChartWidget } from "./widgets/PieChartWidget";
import { RegionChart } from "./widgets/RegionChart";
import { ProductChart } from "./widgets/ProductChart";
import { DealerTable } from "./widgets/DealerTable"; // Ensure this matches file path
import { ChatPanel } from "./ChatPanel";
import {
  AnalyticsView,
  ClaimsView,
  PerformanceView,
  PartnersView,
  SettingsView,
  ProfileView,
} from "./ViewPages";
import { FileUp, Loader2, MousePointer, X, Layers } from "lucide-react";

import { exportDashboardToPDF } from "@/lib/ExportManager";

export default function ClarityDashboard() {
  const [activeView, setActiveView] = useState("Report");
  const [isExporting, setIsExporting] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportDashboardToPDF("#report-canvas", "Clarity-BI-Report");
    } finally {
      setIsExporting(false);
    }
  };
  const [showFilters, setShowFilters] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [showWidgetGallery, setShowWidgetGallery] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hooks
  const { filters, setFilter, clearAllFilters, activeFilterCount } =
    useFilters();
  const dashboardState = useDashboardState(); // Use the new multi-page hook
  const { filteredData, kpis, uploadedFiles, isLoading, handleFileUpload } =
    useData(filters);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  // Chat state
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      content:
        "Welcome! I've loaded a sample insurance dataset with 24,831 policies. Ask me anything — try 'Show top dealers' or 'What's the loss ratio?'",
    },
  ]);

  const generateAIResponse = (msg: string): string => {
    const lower = msg.toLowerCase();
    if (lower.includes("loss ratio") || lower.includes("loss")) {
      return `📊 The current loss ratio is **62.3%**, down 2.1% from last month. Comprehensive policies are driving higher ratios at 71%. Third Party policies remain healthy at 48%.`;
    }
    if (
      lower.includes("top dealer") ||
      lower.includes("best dealer") ||
      lower.includes("top perform")
    ) {
      return `🏆 Top Dealers by Premium:\n1. Al Futtaim Motors — AED 8.2M (18% share)\n2. Juma Al Majid — AED 6.1M (14%)\n3. Al Tayer Motors — AED 5.4M (12%)\n\nAl Futtaim also has the lowest claim frequency at 3.2%.`;
    }
    if (lower.includes("claim") || lower.includes("claims")) {
      return `📋 Claims Summary:\n• Total Active: 1,247 claims\n• Processing: 312\n• Under Review: 89\n• Average settlement: AED 12,400\n• Dubai has the highest volume at 42% of all claims.`;
    }
    if (lower.includes("premium") || lower.includes("revenue")) {
      return `💰 Total Premium collected: **AED 102.4M** this year.\nMonthly trend: +12.5% vs last year.\nDubai leads at AED 43.2M, followed by Abu Dhabi at AED 28.1M.`;
    }
    if (
      lower.includes("region") ||
      lower.includes("dubai") ||
      lower.includes("abu dhabi")
    ) {
      return `🗺️ Regional Breakdown:\n• Dubai: 42% of policies (10,429)\n• Abu Dhabi: 28% (6,953)\n• Sharjah: 15% (3,725)\n• Other Emirates: 15% (3,724)\n\nDubai shows strongest growth at +15% YoY.`;
    }
    if (lower.includes("risk") || lower.includes("portfolio")) {
      return `⚠️ Portfolio Risk Level: **MODERATE**\n• High-risk segments: Comprehensive policies in Dubai (loss ratio 74%)\n• Low-risk segments: Third Party in Sharjah (loss ratio 38%)\n• Recommendation: Review high-value comprehensive policies above AED 50K.`;
    }
    if (lower.includes("help") || lower.includes("what can")) {
      return `I can help you with:\n• 📊 "What's the loss ratio?"\n• 🏆 "Show top dealers"\n• 📋 "Claims summary"\n• 💰 "Premium revenue"\n• 🗺️ "Regional breakdown"\n• ⚠️ "Portfolio risk"\n\nJust ask naturally!`;
    }
    return `Interesting question about "${msg}". Based on the current dataset of 24,831 policies across 8 dealers, I'd suggest checking the Analytics or Claims view for more detail. Try asking me about loss ratios, top dealers, or regional breakdowns!`;
  };

  const handleSendMessage = (msg: string) => {
    setChatMessages((prev) => [...prev, { role: "user", content: msg }]);
    // Simulate typing delay
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: generateAIResponse(msg) },
      ]);
    }, 800);
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    setShowWidgetGallery(!isEditing); // Auto-show gallery when editing
  };

  // Drag & Drop File
  const handleFileDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingFile(false);
      if (e.dataTransfer.files.length > 0) {
        handleFileUpload(e.dataTransfer.files);
      }
    },
    [handleFileUpload],
  );

  // Chart Click Logic (Drill Down)
  const handleChartClick = useCallback(
    (data: any) => {
      if (data.region) {
        const newVal =
          filters.region === data.region ? "All Regions" : data.region;
        setFilter("region", newVal);
        setSelectedElement(newVal === "All Regions" ? null : data.region);
      } else if (data.product) {
        const newVal =
          filters.product === data.product ? "All Products" : data.product;
        setFilter("product", newVal);
        setSelectedElement(newVal === "All Products" ? null : data.product);
      } else if (data.name) {
        const newVal = filters.dealer === data.name ? "All Dealers" : data.name;
        setFilter("dealer", newVal);
        setSelectedElement(newVal === "All Dealers" ? null : data.name);
      }
    },
    [setFilter, filters],
  );

  // Render Widget Content Strategy
  const renderWidget = (type: string, config?: any) => {
    if (!type) return null;
    // Map generic types to specific data views for now
    // In a real app, 'config' would determine which data to show
    if (type.startsWith("kpi")) {
      if (type.includes("premium"))
        return (
          <KPIContent
            label="Premium"
            value={`$${(kpis.premium / 1000000).toFixed(2)}M`}
            change="+12.5%"
            trend="up"
            color="var(--chart-1)"
          />
        );
      if (type.includes("loss"))
        return (
          <KPIContent
            label="Loss Ratio"
            value={`${kpis.lossRatio}%`}
            change="-3.2%"
            trend="up"
            color="var(--chart-2)"
          />
        );
      if (type.includes("claims"))
        return (
          <KPIContent
            label="Claims"
            value={`$${(kpis.claims / 1000000).toFixed(2)}M`}
            change="+8.1%"
            trend="down"
            color="var(--chart-3)"
          />
        );
      if (type.includes("policies"))
        return (
          <KPIContent
            label="Policies"
            value={kpis.policies.toLocaleString()}
            change="+15.3%"
            trend="up"
            color="var(--chart-4)"
          />
        );
      return (
        <KPIContent
          label="Generic KPI"
          value="000"
          change="0%"
          trend="up"
          color="var(--muted)"
        />
      );
    }

    switch (type) {
      case "chart-trend":
        return (
          <TrendChart
            data={filteredData.monthly}
            onClick={handleChartClick}
            selectedElement={selectedElement}
          />
        );
      case "chart-pie":
        return (
          <PieChartWidget
            data={filteredData.claimTypes}
            onClick={handleChartClick}
            selectedElement={selectedElement}
          />
        );
      case "chart-region":
        return (
          <RegionChart
            data={filteredData.regions}
            onClick={handleChartClick}
            selectedElement={selectedElement}
          />
        );
      case "chart-products":
        return (
          <ProductChart
            data={filteredData.products}
            onClick={handleChartClick}
            selectedElement={selectedElement}
          />
        );
      case "table-dealers":
        return (
          <DealerTable
            data={filteredData.dealers}
            onClick={handleChartClick}
            selectedElement={selectedElement}
          />
        );
      // Fallbacks for new gallery items
      case "chart-bar":
        return (
          <ProductChart
            data={filteredData.products}
            onClick={handleChartClick}
            selectedElement={selectedElement}
          />
        );
      case "table":
        return (
          <DealerTable
            data={filteredData.dealers}
            onClick={handleChartClick}
            selectedElement={selectedElement}
          />
        );
      case "list-claims":
        return (
          <div className="h-full overflow-auto text-[11px]">
            <table className="w-full">
              <thead className="bg-muted/50 sticky top-0">
                <tr>
                  <th className="text-left p-2 font-bold text-muted-foreground uppercase">
                    ID
                  </th>
                  <th className="text-left p-2 font-bold text-muted-foreground uppercase">
                    Region
                  </th>
                  <th className="text-right p-2 font-bold text-muted-foreground uppercase">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredData.recentClaims.map((claim) => (
                  <tr
                    key={claim.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-2 font-semibold">{claim.id}</td>
                    <td className="p-2">
                      <span className="bg-muted px-1.5 py-0.5 rounded text-[9px] font-medium border border-border">
                        {claim.region}
                      </span>
                    </td>
                    <td className="p-2 text-right font-bold text-foreground">
                      ${claim.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        // Try mapping by name for gallery items
        if (type.includes("table"))
          return (
            <DealerTable
              data={filteredData.dealers}
              onClick={handleChartClick}
              selectedElement={selectedElement}
            />
          );
        if (type.includes("bar"))
          return (
            <ProductChart
              data={filteredData.products}
              onClick={handleChartClick}
              selectedElement={selectedElement}
            />
          );

        return (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
            <Loader2
              size={24}
              className="animate-spin text-primary opacity-20"
            />
            <span className="text-xs">No data for {type}</span>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-background font-sans overflow-hidden transition-colors duration-300">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".xlsx,.xls,.csv"
        multiple
        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
      />

      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          isEditing={isEditing}
          setIsEditing={toggleEditMode}
          onUploadClick={() => fileInputRef.current?.click()}
          onExportClick={handleExport}
          isExporting={isExporting}
          onPublishClick={() => setShowPublishModal(true)}
        />

        <div className="flex-1 flex overflow-hidden relative">
          <FilterPanel
            show={showFilters}
            onClose={() => setShowFilters(false)}
            filters={filters}
            setFilter={setFilter}
            clearAllFilters={clearAllFilters}
            activeFilterCount={activeFilterCount}
            uploadedFiles={uploadedFiles}
            onUploadClick={() => fileInputRef.current?.click()}
          />

          <main
            className={`flex-1 overflow-hidden relative flex flex-col ${isDraggingFile ? "bg-primary/5" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingFile(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDraggingFile(false);
            }}
            onDrop={handleFileDrop}
          >
            {activeView === "Report" ? (
              <>
                <Breadcrumbs
                  filters={filters}
                  clearFilter={(key) =>
                    setFilter(
                      key,
                      `All ${key.charAt(0).toUpperCase() + key.slice(1)}`,
                    )
                  }
                  clearAll={clearAllFilters}
                />

                <ReportManager
                  isEditing={isEditing}
                  dashboardState={dashboardState}
                  renderWidget={renderWidget}
                />
              </>
            ) : activeView === "Analytics" ? (
              <AnalyticsView />
            ) : activeView === "Claims" ? (
              <ClaimsView />
            ) : activeView === "Performance" ? (
              <PerformanceView />
            ) : activeView === "Partners" ? (
              <PartnersView />
            ) : activeView === "Settings" ? (
              <SettingsView />
            ) : activeView === "Profile" ? (
              <ProfileView />
            ) : (
              <>
                <Breadcrumbs
                  filters={filters}
                  clearFilter={(key) =>
                    setFilter(
                      key,
                      `All ${key.charAt(0).toUpperCase() + key.slice(1)}`,
                    )
                  }
                  clearAll={clearAllFilters}
                />
                <ReportManager
                  isEditing={isEditing}
                  dashboardState={dashboardState}
                  renderWidget={renderWidget}
                />
              </>
            )}

            {/* Drag Overlay */}
            {isDraggingFile && (
              <div className="absolute inset-4 border-2 border-dashed border-primary bg-primary/10 rounded-xl flex items-center justify-center z-50 pointer-events-none">
                <div className="text-center">
                  <FileUp size={64} className="mx-auto text-primary mb-4" />
                  <p className="text-xl font-bold text-primary">
                    Drop to Upload
                  </p>
                </div>
              </div>
            )}
          </main>

          {/* Clarity AI - Fixed Right Sidebar */}
          <aside className="w-80 bg-card border-l border-border flex flex-col shrink-0 shadow-2xl relative z-10">
            <ChatPanel
              messages={chatMessages}
              onSendMessage={handleSendMessage}
            />
          </aside>

          {/* Floating Reset Tooltip/Button */}
          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 hover:scale-105 transition-all z-20 animate-in fade-in slide-in-from-bottom-4 active:scale-95"
            >
              <X size={14} />
              <span className="text-xs font-bold uppercase tracking-wider">
                Reset Dashboard
              </span>
            </button>
          )}
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex flex-col items-center">
              <Loader2 size={48} className="animate-spin text-primary mb-4" />
              <p className="text-lg font-semibold text-foreground">
                Analyzing Data...
              </p>
            </div>
          </div>
        )}

        {/* Widget Gallery Overlay */}
        {isEditing && showWidgetGallery && (
          <div className="absolute inset-0 z-40 bg-background/80 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in duration-300">
            <div className="w-full max-w-5xl h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Add Widget</h2>
                  <p className="text-muted-foreground">
                    Select a visualization to add to your dashboard
                  </p>
                </div>
                <button
                  onClick={() => setShowWidgetGallery(false)}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <WidgetGallery
                  onSelect={(type, title) => {
                    dashboardState.addWidgetToPage(
                      dashboardState.activePageId,
                      type,
                      title,
                    );
                    setShowWidgetGallery(false);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Publish Modal */}
      <PublishModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
      />

      {/* Export Loading Overlay */}
      {isExporting && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div className="flex flex-col items-center bg-card border border-border rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in-95">
            <Loader2 size={40} className="animate-spin text-primary mb-4" />
            <p className="text-sm font-bold text-foreground">
              Generating PDF...
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Capturing full dashboard
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
