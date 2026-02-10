import React, { useState } from "react";
import {
  Filter,
  Move,
  Download,
  Share2,
  FileUp,
  Plus,
  Sun,
  Moon,
  Loader2,
  Link,
  Copy,
  Check,
  X,
} from "lucide-react";
import { useTheme } from "@/components/ui/ThemeProvider";

interface DashboardHeaderProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  isEditing: boolean;
  setIsEditing: (edit: boolean) => void;
  onUploadClick: () => void;
  onExportClick: () => void;
  isExporting: boolean;
  onPublishClick: () => void;
}

export function DashboardHeader({
  showFilters,
  setShowFilters,
  isEditing,
  setIsEditing,
  onUploadClick,
  onExportClick,
  isExporting,
  onPublishClick,
}: DashboardHeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-14 bg-card border-b border-border flex items-center px-4 gap-2 shrink-0 shadow-sm transition-colors duration-300">
      {/* Left: View Controls */}
      <div className="flex items-center gap-1 border-r border-border pr-3 mr-1">
        <ToolbarButton
          icon={<Filter size={15} />}
          label="Filters"
          active={showFilters}
          onClick={() => setShowFilters(!showFilters)}
        />
        <ToolbarButton
          icon={<Move size={15} />}
          label="Edit"
          active={isEditing}
          onClick={() => setIsEditing(!isEditing)}
        />
      </div>

      {/* Center: Data Management */}
      <div className="flex items-center gap-1 border-r border-border pr-3 mr-1">
        <ToolbarButton
          icon={<FileUp size={15} />}
          label="Upload"
          onClick={onUploadClick}
        />
        <ToolbarButton icon={<Plus size={15} />} label="New" />
      </div>

      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
      </button>

      <div className="flex-1" />

      {/* Right: Actions */}
      {isEditing ? (
        <button
          onClick={() => setIsEditing(false)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 shadow-md transition-colors uppercase tracking-wider"
        >
          ✓ Done
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={onExportClick}
            disabled={isExporting}
            className="flex items-center gap-2 px-3.5 py-2 bg-card border border-border text-foreground rounded-lg text-xs font-semibold hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Download size={14} />
            )}
            {isExporting ? "Exporting..." : "Export"}
          </button>
          <button
            onClick={onPublishClick}
            className="flex items-center gap-2 px-3.5 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:bg-primary/90 shadow-md transition-colors"
          >
            <Share2 size={14} />
            Publish
          </button>
        </div>
      )}
    </header>
  );
}

// Publish Modal Component
export function PublishModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handlePublish = () => {
    setIsPublishing(true);
    // Simulate publishing
    setTimeout(() => {
      const id = Math.random().toString(36).substring(2, 10);
      setPublishedUrl(`https://clarity-bi.app/share/${id}`);
      setIsPublishing(false);
    }, 2000);
  };

  const handleCopy = () => {
    if (publishedUrl) {
      navigator.clipboard.writeText(publishedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setPublishedUrl(null);
    setCopied(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={handleClose}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Share2 size={18} className="text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-sm">
                  Publish Report
                </h3>
                <p className="text-xs text-muted-foreground">
                  Generate a temporary shareable link
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="p-5">
            {!publishedUrl ? (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-4">
                  This will create a temporary link valid for{" "}
                  <strong>24 hours</strong>. Anyone with the link can view the
                  current state of this report.
                </p>
                <button
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90 shadow-lg transition-all disabled:opacity-70"
                >
                  {isPublishing ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Generating Link...
                    </>
                  ) : (
                    <>
                      <Link size={16} />
                      Generate Share Link
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-xl border border-border">
                  <Link size={14} className="text-primary shrink-0" />
                  <span className="text-xs text-foreground font-mono truncate flex-1">
                    {publishedUrl}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="shrink-0 p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span>Link active — expires in 24 hours</span>
                </div>

                <button
                  onClick={handleClose}
                  className="w-full px-4 py-2.5 bg-muted text-foreground rounded-xl text-xs font-semibold hover:bg-muted/80 transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
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
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all duration-200 ${
        active
          ? "bg-accent text-accent-foreground font-semibold shadow-inner"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {icon}
      <span className="hidden xl:inline">{label}</span>
      {active && <div className="w-1.5 h-1.5 rounded-full bg-primary ml-0.5" />}
    </button>
  );
}
