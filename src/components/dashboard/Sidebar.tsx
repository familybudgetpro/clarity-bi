import React, { useState } from "react";
import {
  LayoutDashboard,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Settings,
  LogOut,
  User,
  ChevronUp,
} from "lucide-react";

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const navItems = [
  { id: "Report", icon: LayoutDashboard, label: "Dashboard" },
  { id: "Analytics", icon: BarChart3, label: "Analytics" },
  { id: "Claims", icon: PieChart, label: "Claims" },
  { id: "Performance", icon: TrendingUp, label: "Performance" },
  { id: "Partners", icon: Users, label: "Partners" },
];

export function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <aside className="w-16 bg-card border-r border-border flex flex-col items-center py-4 gap-1 z-20 shadow-sm relative">
      {/* Logo */}
      <div className="w-10 h-10 bg-linear-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
        <span className="text-primary-foreground font-black text-lg">C</span>
      </div>

      {/* Navigation Items */}
      {navItems.map((item) => (
        <NavIcon
          key={item.id}
          icon={<item.icon size={20} />}
          active={activeView === item.id}
          onClick={() => setActiveView(item.id)}
          tooltip={item.label}
        />
      ))}

      <div className="flex-1" />

      {/* Settings */}
      <NavIcon
        icon={<Settings size={20} />}
        tooltip="Settings"
        onClick={() => setActiveView("Settings")}
        active={activeView === "Settings"}
      />

      {/* Profile Avatar */}
      <div className="relative mt-2">
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-md hover:scale-105 transition-transform ring-2 ring-transparent hover:ring-primary/30"
          title="Profile"
        >
          MA
        </button>

        {/* Profile Dropdown */}
        {profileOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setProfileOpen(false)}
            />
            <div className="absolute bottom-full left-full ml-2 mb-1 w-56 bg-popover border border-border rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200 overflow-hidden">
              {/* User Info */}
              <div className="p-3 border-b border-border bg-linear-to-r from-primary/5 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    MA
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">
                      Muhsin Admin
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      admin@clarity-bi.ae
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-1.5">
                <ProfileMenuItem
                  icon={<User size={14} />}
                  label="My Profile"
                  onClick={() => {
                    setActiveView("Profile");
                    setProfileOpen(false);
                  }}
                />
                <ProfileMenuItem
                  icon={<Settings size={14} />}
                  label="Account Settings"
                  onClick={() => {
                    setActiveView("Settings");
                    setProfileOpen(false);
                  }}
                />
              </div>

              <div className="border-t border-border p-1.5">
                <ProfileMenuItem
                  icon={<LogOut size={14} />}
                  label="Sign Out"
                  danger
                  onClick={() => setProfileOpen(false)}
                />
              </div>
            </div>
          </>
        )}
      </div>
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
      className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 group relative ${
        active
          ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      }`}
      title={tooltip}
    >
      {icon}
      {/* Tooltip */}
      <div className="absolute left-full ml-3 px-2.5 py-1 bg-popover border border-border rounded-lg shadow-lg text-xs font-medium text-popover-foreground opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
        {tooltip}
      </div>
    </button>
  );
}

function ProfileMenuItem({
  icon,
  label,
  danger,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg transition-colors ${
        danger
          ? "text-destructive hover:bg-destructive/10"
          : "text-foreground hover:bg-muted"
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}
