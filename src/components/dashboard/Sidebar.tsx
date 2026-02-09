import React from "react";
import { LayoutDashboard, Table2, Database, Settings } from "lucide-react";

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export function Sidebar({ activeView, setActiveView }: SidebarProps) {
  return (
    <aside className="w-16 bg-card border-r border-border flex flex-col items-center py-4 gap-2 z-20 shadow-sm">
      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-6 ring-1 ring-primary/20">
        <span className="text-primary font-black text-lg">C</span>
      </div>
      <NavIcon
        icon={<LayoutDashboard size={20} />}
        active={activeView === "Report"}
        onClick={() => setActiveView("Report")}
        tooltip="Report"
      />
      <NavIcon
        icon={<Table2 size={20} />}
        active={activeView === "Data"}
        onClick={() => setActiveView("Data")}
        tooltip="Data"
      />
      <NavIcon
        icon={<Database size={20} />}
        active={activeView === "Model"}
        onClick={() => setActiveView("Model")}
        tooltip="Model"
      />
      <div className="flex-1" />
      <NavIcon icon={<Settings size={20} />} tooltip="Settings" />
    </aside>
  );
}

function NavIcon({
  icon,
  active,
  onClick,
  tooltip,
}: {
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  tooltip?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${
        active
          ? "bg-primary text-primary-foreground shadow-md shadow-primary/30 rotate-3"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      }`}
      title={tooltip}
    >
      {icon}
    </button>
  );
}
