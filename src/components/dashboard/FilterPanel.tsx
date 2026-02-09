import React, { useState } from "react";
import {
  Filter,
  X,
  ChevronDown,
  Check,
  FileSpreadsheet,
  Plus,
  Search,
} from "lucide-react";
import { useFilters } from "@/hooks/useFilters";

interface FilterPanelProps {
  show: boolean;
  onClose: () => void;
  filters: any;
  setFilter: (key: string, value: string) => void;
  uploadedFiles: any[];
  onUploadClick: () => void;
}

export function FilterPanel({
  show,
  onClose,
  filters,
  setFilter,
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
  ];
  const productOptions = [
    "All Products",
    "Comprehensive",
    "Third Party",
    "Agency Repair",
    "Extended Warranty",
  ];

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col shrink-0 shadow-xl z-30 transition-all duration-300 animate-in slide-in-from-left-4 h-full">
      <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
        <div className="flex items-center gap-2.5">
          <Filter size={16} className="text-muted-foreground" />
          <span className="text-xs font-bold text-foreground uppercase tracking-wider">
            Filters
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-destructive transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <FilterDropdown
          label="Date Range"
          value={filters.dateRange}
          options={dateOptions}
          onChange={(v) => setFilter("dateRange", v)}
        />
        <FilterDropdown
          label="Region"
          value={filters.region}
          options={regionOptions}
          onChange={(v) => setFilter("region", v)}
        />
        <FilterDropdown
          label="Dealer"
          value={filters.dealer}
          options={dealerOptions}
          onChange={(v) => setFilter("dealer", v)}
          searchable
        />
        <FilterDropdown
          label="Product"
          value={filters.product}
          options={productOptions}
          onChange={(v) => setFilter("product", v)}
        />
      </div>

      <div className="border-t border-border p-4 bg-muted/10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-foreground uppercase tracking-wider">
            Data Sources
          </span>
          <button
            onClick={onUploadClick}
            className="text-primary hover:text-primary/80 transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>
        <div className="space-y-2">
          {uploadedFiles.length === 0 ? (
            <div className="text-xs text-muted-foreground italic px-2 py-1 border border-dashed border-border rounded">
              Demo data loaded.
            </div>
          ) : (
            uploadedFiles.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-2 p-2 bg-card rounded-md border border-border text-xs shadow-sm"
              >
                <FileSpreadsheet size={14} className="text-green-600" />
                <span className="truncate flex-1 font-medium">{f.name}</span>
                <span className="text-muted-foreground text-[10px]">
                  {f.data.length} rows
                </span>
                <Check size={12} className="text-primary" />
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}

function FilterDropdown({
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
      className={`rounded-xl border transition-all duration-200 overflow-hidden ${isActive ? "border-primary/50 bg-primary/5 shadow-sm" : "border-border bg-card"}`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-muted/50 transition-colors"
      >
        <div>
          <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-0.5">
            {label}
          </span>
          <span
            className={`text-sm font-semibold truncate block ${isActive ? "text-primary" : "text-foreground"}`}
          >
            {value}
          </span>
        </div>
        <ChevronDown
          size={16}
          className={`text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="border-t border-border/50 p-2 space-y-1 bg-card/50 backdrop-blur-sm animate-in fade-in slide-in-from-top-1">
          {searchable && (
            <div className="px-2 pb-2">
              <div className="relative">
                <Search
                  size={12}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-muted/50 border border-transparent focus:border-primary/50 rounded-md py-1 pl-7 pr-2 text-xs outline-none"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
          )}
          <div className="max-h-48 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-muted">
            {filteredOptions.length === 0 && (
              <div className="px-3 py-2 text-xs text-muted-foreground italic">
                No matches found
              </div>
            )}
            {filteredOptions.map((o) => (
              <button
                key={o}
                onClick={() => {
                  onChange(o);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg transition-colors ${value === o ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
              >
                {value === o && <Check size={12} className="shrink-0" />}
                <span className={value === o ? "" : "ml-5"}>{o}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
