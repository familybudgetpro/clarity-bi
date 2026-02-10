import React, { useState } from "react";
import {
  Filter,
  X,
  ChevronDown,
  Check,
  FileSpreadsheet,
  Plus,
  Search,
  RotateCcw,
} from "lucide-react";
import { useFilters } from "@/hooks/useFilters";

interface FilterPanelProps {
  show: boolean;
  onClose: () => void;
  filters: any;
  setFilter: (key: string, value: string) => void;
  clearAllFilters: () => void;
  activeFilterCount: number;
  uploadedFiles: any[];
  onUploadClick: () => void;
}

export function FilterPanel({
  show,
  onClose,
  filters,
  setFilter,
  clearAllFilters,
  activeFilterCount,
  uploadedFiles,
  onUploadClick,
}: FilterPanelProps) {
  if (!show) return null;

  const dateOptions = [
    "All Time",
    "Last 30 Days",
    "Last 3 Months",
    "Last 6 Months",
    "Last Year",
  ];
  const regionOptions = [
    "All Regions",
    "Dubai",
    "Abu Dhabi",
    "Sharjah",
    "Ajman",
    "RAK",
    "Al Ain",
    "UAQ",
  ];
  const dealerOptions = [
    "All Dealers",
    "Al Futtaim Motors",
    "Juma Al Majid",
    "Al Tayer Motors",
    "Trading Enterprises",
    "Al Nabooda Auto",
    "Gargash Enterprises",
    "Emirates Motor",
    "Al Rostamani",
    "AW Rostamani",
    "Al Habtoor Motors",
    "Al Masaood Auto",
  ];
  const productOptions = [
    "All Products",
    "Comprehensive",
    "Third Party",
    "Agency Repair",
    "Extended Warranty",
  ];

  return (
    <aside className="w-72 bg-card border-r border-border flex flex-col shrink-0 shadow-xl z-30 transition-all duration-300 animate-in slide-in-from-left-4 h-full">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-linear-to-r from-primary/5 to-transparent">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Filter size={14} className="text-primary" />
          </div>
          <div>
            <span className="text-sm font-bold text-foreground block">
              Filters
            </span>
            {activeFilterCount > 0 && (
              <span className="text-[10px] text-primary font-semibold">
                {activeFilterCount} active
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
              title="Clear all filters"
            >
              <RotateCcw size={14} />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Filter Groups */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-muted">
        <FilterChip
          label="Date Range"
          value={filters.dateRange}
          options={dateOptions}
          onChange={(v) => setFilter("dateRange", v)}
        />
        <FilterChip
          label="Region"
          value={filters.region}
          options={regionOptions}
          onChange={(v) => setFilter("region", v)}
        />
        <FilterChip
          label="Dealer"
          value={filters.dealer}
          options={dealerOptions}
          onChange={(v) => setFilter("dealer", v)}
          searchable
        />
        <FilterChip
          label="Product"
          value={filters.product}
          options={productOptions}
          onChange={(v) => setFilter("product", v)}
        />
      </div>

      {/* Data Sources */}
      <div className="border-t border-border p-3 bg-muted/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Data Sources
          </span>
          <button
            onClick={onUploadClick}
            className="text-primary hover:text-primary/80 transition-colors p-1 hover:bg-primary/10 rounded"
          >
            <Plus size={12} />
          </button>
        </div>
        <div className="space-y-1.5">
          {uploadedFiles.length === 0 ? (
            <div className="text-[10px] text-muted-foreground italic px-2 py-1.5 border border-dashed border-border rounded-lg bg-muted/20">
              Demo data loaded
            </div>
          ) : (
            uploadedFiles.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-2 p-2 bg-card rounded-lg border border-border text-xs shadow-sm"
              >
                <FileSpreadsheet
                  size={12}
                  className="text-green-600 shrink-0"
                />
                <span className="truncate flex-1 font-medium text-[11px]">
                  {f.name}
                </span>
                <span className="text-muted-foreground text-[9px]">
                  {f.data.length} rows
                </span>
                <Check size={10} className="text-primary shrink-0" />
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}

function FilterChip({
  label,
  value,
  options,
  onChange,
  searchable,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  searchable?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const isActive = value !== options[0];

  const filteredOptions = searchable
    ? options.filter((o) => o.toLowerCase().includes(query.toLowerCase()))
    : options;

  return (
    <div
      className={`rounded-xl border transition-all duration-200 overflow-hidden ${
        isActive
          ? "border-primary/40 bg-primary/5 ring-1 ring-primary/10"
          : "border-border/60 bg-card hover:border-border"
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2.5 text-left transition-colors group"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-2 h-2 rounded-full shrink-0 transition-colors ${
              isActive ? "bg-primary" : "bg-muted-foreground/30"
            }`}
          />
          <div className="min-w-0">
            <span className="text-[9px] text-muted-foreground uppercase font-bold block tracking-wider leading-none mb-0.5">
              {label}
            </span>
            <span
              className={`text-xs font-semibold truncate block ${
                isActive ? "text-primary" : "text-foreground"
              }`}
            >
              {value}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {isActive && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onChange(options[0]);
              }}
              className="p-0.5 hover:bg-destructive/10 hover:text-destructive rounded transition-colors text-muted-foreground"
              title="Clear"
            >
              <X size={12} />
            </button>
          )}
          <ChevronDown
            size={14}
            className={`text-muted-foreground transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {open && (
        <div className="border-t border-border/30 p-1.5 space-y-0.5 bg-card/80 backdrop-blur-sm animate-in fade-in slide-in-from-top-1 duration-150">
          {searchable && (
            <div className="px-1.5 pb-1.5">
              <div className="relative">
                <Search
                  size={12}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-muted/50 border border-transparent focus:border-primary/30 rounded-lg py-1.5 pl-7 pr-2 text-xs outline-none transition-colors"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
          )}
          <div className="max-h-36 overflow-y-auto space-y-0.5 scrollbar-thin scrollbar-thumb-muted">
            {filteredOptions.length === 0 && (
              <div className="px-3 py-2 text-xs text-muted-foreground italic">
                No matches
              </div>
            )}
            {filteredOptions.map((o) => (
              <button
                key={o}
                onClick={() => {
                  onChange(o);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                  value === o
                    ? "bg-primary/10 text-primary font-bold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {value === o && <Check size={10} className="shrink-0" />}
                <span className={value === o ? "" : "ml-4"}>{o}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
