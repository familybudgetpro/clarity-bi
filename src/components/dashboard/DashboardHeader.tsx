import React from "react";
import {
  Plus,
  FileUp,
  Filter,
  Layers,
  Move,
  AlertCircle,
  Download,
  Share2,
} from "lucide-react";
import { useTheme } from "@/components/ui/ThemeProvider";
import { exportDashboardToPDF } from "@/lib/ExportManager";

interface DashboardHeaderProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  isEditing: boolean;
  setIsEditing: (edit: boolean) => void;
  hasActiveFilters: boolean;
  clearAllFilters: () => void;
  onUploadClick: () => void;
  onExportClick: () => void;
}

export function DashboardHeader({
  showFilters,
  setShowFilters,
  isEditing,
  setIsEditing,
  hasActiveFilters,
  clearAllFilters,
  onUploadClick,
  onExportClick,
}: DashboardHeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-14 bg-card border-b border-border flex items-center px-4 gap-3 shrink-0 shadow-sm transition-colors duration-300">
      <div className="flex items-center gap-2 border-r border-border pr-4 mr-2">
        <ToolbarButton icon={<Plus size={16} />} label="New" />
        <ToolbarButton
          icon={<FileUp size={16} />}
          label="Upload"
          onClick={onUploadClick}
        />
      </div>

      <div className="flex items-center gap-2 border-r border-border pr-4 mr-2">
        <ToolbarButton
          icon={<Filter size={16} />}
          label="Filters"
          active={showFilters}
          onClick={() => setShowFilters(!showFilters)}
        />
        <ToolbarButton
          icon={<Move size={16} />}
          label="Edit"
          active={isEditing}
          onClick={() => setIsEditing(!isEditing)}
        />
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/20 rounded-full animate-in fade-in zoom-in border border-accent/30">
          <AlertCircle size={14} className="text-accent-foreground" />
          <span className="text-xs text-accent-foreground font-semibold">
            Filters active
          </span>
          <button
            onClick={clearAllFilters}
            className="text-xs text-primary hover:text-primary/80 font-bold underline ml-1"
          >
            Clear
          </button>
        </div>
      )}

      <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1 mr-2 border border-border">
        {["light", "dark"].map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t as any)}
            className={`px-2 py-1 text-[10px] rounded capitalize font-medium transition-all ${
              theme === t
                ? "bg-background shadow-sm text-foreground scale-105"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1" />

      {isEditing ? (
        <button
          onClick={() => setIsEditing(false)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 shadow-md transition-colors"
        >
          ✓ Done
        </button>
      ) : (
        <>
          <button
            onClick={onExportClick}
            className="flex items-center gap-2 px-4 py-2 bg-card border border-border text-foreground rounded-lg text-sm font-semibold hover:bg-muted transition-colors"
          >
            <Download size={14} />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 shadow-md transition-colors">
            <Share2 size={14} />
            Publish
          </button>
        </>
      )}
    </header>
  );
}

function ToolbarButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
        active
          ? "bg-accent text-accent-foreground font-semibold shadow-inner"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {icon}
      <span className="hidden xl:inline">{label}</span>
      {active && <div className="w-1.5 h-1.5 rounded-full bg-primary ml-1" />}
    </button>
  );
}
