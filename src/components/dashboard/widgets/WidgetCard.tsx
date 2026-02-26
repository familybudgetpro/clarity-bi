import React, { useState, useRef } from "react";
import { MoreVertical, X, Image, FileText, Move, GripVertical, Settings } from "lucide-react";
import { exportDashboardToPDF, exportWidgetAsImage } from "@/lib/ExportManager";

interface WidgetCardProps {
  id: string;
  title: string;
  children: React.ReactNode;
  isEditing: boolean;
  onRemove?: () => void;
  onExportData?: () => void;
  onConfigure?: () => void;
  className?: string;
}

export function WidgetCard({
  id,
  title,
  children,
  isEditing,
  onRemove,
  onExportData,
  onConfigure,
  className = "",
}: WidgetCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleExport = (type: "pdf" | "image") => {
    if (cardRef.current) {
      const safeName = `Widget-${title.replace(/\s+/g, "-")}`;
      if (type === "pdf") {
        exportDashboardToPDF(cardRef.current, safeName);
      } else {
        exportWidgetAsImage(cardRef.current, safeName);
      }
    }
    setMenuOpen(false);
  };

  return (
    <div
      ref={cardRef}
      className={`bg-card border rounded-xl shadow-sm flex flex-col h-full overflow-hidden transition-all ${
        isEditing
          ? "border-primary/30 ring-1 ring-primary/20 shadow-primary/5"
          : "border-border hover:shadow-md"
      } ${className}`}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/50 bg-muted/10 shrink-0">
        {/* Drag handle — only visible in edit mode, part of header for compact layout */}
        {isEditing ? (
          <div className="flex items-center gap-1.5 min-w-0">
            <div
              className="drag-handle cursor-move text-muted-foreground/50 hover:text-primary transition-colors shrink-0"
              title="Drag to reposition"
            >
              <GripVertical size={13} />
            </div>
            <h3 className="font-semibold text-xs text-muted-foreground truncate">
              {title}
            </h3>
          </div>
        ) : (
          <h3 className="font-semibold text-sm text-foreground truncate">
            {title}
          </h3>
        )}

        <div className="flex items-center gap-1 shrink-0 ml-2">
          {isEditing ? (
            <button
              onClick={onRemove}
              className="p-1 hover:bg-destructive/15 hover:text-destructive rounded text-muted-foreground/50 hover:text-destructive transition-colors"
              title="Remove widget"
            >
              <X size={12} />
            </button>
          ) : (
            <button
              className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <MoreVertical size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 relative min-h-0 bg-background/40 overflow-hidden">
        <div className="h-full w-full p-3">{children}</div>

        {/* Export Menu Overlay */}
        {menuOpen && (
          <div className="absolute top-0 right-0 m-2 w-36 bg-popover/95 backdrop-blur-sm border border-border rounded-lg shadow-xl z-20 py-1 animate-in fade-in zoom-in-95">
            {onConfigure && (
              <button
                onClick={() => { onConfigure(); setMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-xs hover:bg-muted text-popover-foreground flex items-center gap-2 border-b border-border/50"
              >
                <Settings size={12} /> Configure
              </button>
            )}
            <button
              onClick={() => handleExport("pdf")}
              className="w-full text-left px-3 py-2 text-xs hover:bg-muted text-popover-foreground flex items-center gap-2"
            >
              <FileText size={12} /> Save as PDF
            </button>
            <button
              onClick={() => handleExport("image")}
              className="w-full text-left px-3 py-2 text-xs hover:bg-muted text-popover-foreground flex items-center gap-2"
            >
              <Image size={12} /> Save as Image
            </button>
            {onExportData && (
              <button
                onClick={() => {
                  if (onExportData) onExportData();
                  setMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs hover:bg-muted text-popover-foreground flex items-center gap-2 border-t border-border/50"
              >
                <FileText size={12} /> Export to Excel
              </button>
            )}
          </div>
        )}

        {menuOpen && (
          <div
            className="fixed inset-0 z-10"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
