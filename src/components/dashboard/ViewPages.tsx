import React from "react";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
  Palette,
  Database,
  Globe,
  Lock,
  Mail,
  Building,
  FileText,
  Award,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

// ─── Analytics View ────────────────────────────────────────────
export function AnalyticsView() {
  const stats = [
    { label: "Total Policies", value: "24,831", change: "+8.4%", up: true },
    { label: "Active Claims", value: "1,247", change: "-3.1%", up: false },
    { label: "Avg. Premium", value: "AED 4,120", change: "+5.7%", up: true },
    { label: "Loss Ratio", value: "62.3%", change: "-2.1%", up: false },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div>
        <h1 className="text-xl font-black text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Key performance metrics and trends
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">
              {s.label}
            </p>
            <p className="text-2xl font-black text-foreground">{s.value}</p>
            <div
              className={`flex items-center gap-1 mt-1 text-xs font-semibold ${s.up ? "text-green-600" : "text-red-500"}`}
            >
              {s.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {s.change} vs last month
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <InsightCard
          icon={<Target size={16} />}
          title="Revenue Forecast"
          desc="Q1 projections indicate 12% growth in premium collections based on current pipeline."
          color="text-blue-500 bg-blue-500/10"
        />
        <InsightCard
          icon={<Zap size={16} />}
          title="Anomaly Detection"
          desc="3 dealers showing unusual claim patterns. Al Tayer Motors flagged for review."
          color="text-amber-500 bg-amber-500/10"
        />
        <InsightCard
          icon={<Shield size={16} />}
          title="Risk Assessment"
          desc="Portfolio risk level is MODERATE. Comprehensive policies driving higher loss ratios."
          color="text-purple-500 bg-purple-500/10"
        />
        <InsightCard
          icon={<Award size={16} />}
          title="Top Performer"
          desc="Al Futtaim Motors leads with 18% market share and lowest claim frequency."
          color="text-green-500 bg-green-500/10"
        />
      </div>
    </div>
  );
}

// ─── Claims View ───────────────────────────────────────────────
export function ClaimsView() {
  const claims = [
    {
      id: "CLM-2024-0847",
      dealer: "Al Futtaim Motors",
      amount: "AED 12,500",
      status: "Processing",
      date: "Feb 8, 2026",
    },
    {
      id: "CLM-2024-0846",
      dealer: "Al Tayer Motors",
      amount: "AED 8,200",
      status: "Approved",
      date: "Feb 7, 2026",
    },
    {
      id: "CLM-2024-0845",
      dealer: "Gargash Enterprises",
      amount: "AED 23,100",
      status: "Under Review",
      date: "Feb 6, 2026",
    },
    {
      id: "CLM-2024-0844",
      dealer: "Al Nabooda Auto",
      amount: "AED 5,800",
      status: "Closed",
      date: "Feb 5, 2026",
    },
    {
      id: "CLM-2024-0843",
      dealer: "Trading Enterprises",
      amount: "AED 15,400",
      status: "Processing",
      date: "Feb 4, 2026",
    },
    {
      id: "CLM-2024-0842",
      dealer: "Juma Al Majid",
      amount: "AED 9,700",
      status: "Approved",
      date: "Feb 3, 2026",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-foreground">Claims</h1>
          <p className="text-sm text-muted-foreground">
            Track and manage insurance claims
          </p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded-full text-xs font-bold">
            12 Pending
          </span>
          <span className="px-3 py-1 bg-green-500/10 text-green-600 border border-green-500/20 rounded-full text-xs font-bold">
            847 Approved
          </span>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-4 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Claim ID
              </th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Dealer
              </th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Amount
              </th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {claims.map((c) => (
              <tr
                key={c.id}
                className="border-b border-border/50 hover:bg-muted/20 transition-colors"
              >
                <td className="px-4 py-3 text-xs font-mono font-bold text-primary">
                  {c.id}
                </td>
                <td className="px-4 py-3 text-xs text-foreground font-medium">
                  {c.dealer}
                </td>
                <td className="px-4 py-3 text-xs text-foreground font-bold">
                  {c.amount}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={c.status} />
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {c.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Performance View ──────────────────────────────────────────
export function PerformanceView() {
  const dealers = [
    {
      name: "Al Futtaim Motors",
      score: 94,
      trend: "+3",
      policies: 4210,
      region: "Dubai",
    },
    {
      name: "Juma Al Majid",
      score: 89,
      trend: "+1",
      policies: 3180,
      region: "Dubai",
    },
    {
      name: "Al Tayer Motors",
      score: 86,
      trend: "-2",
      policies: 2950,
      region: "Abu Dhabi",
    },
    {
      name: "Trading Enterprises",
      score: 82,
      trend: "+5",
      policies: 2400,
      region: "Sharjah",
    },
    {
      name: "Al Nabooda Auto",
      score: 79,
      trend: "+2",
      policies: 1800,
      region: "Dubai",
    },
    {
      name: "Gargash Enterprises",
      score: 76,
      trend: "-1",
      policies: 1650,
      region: "Abu Dhabi",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div>
        <h1 className="text-xl font-black text-foreground">Performance</h1>
        <p className="text-sm text-muted-foreground">
          Dealer performance scorecards and rankings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {dealers.map((d, i) => (
          <div
            key={d.name}
            className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                    #{i + 1}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {d.region}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-foreground">{d.name}</h3>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-primary">{d.score}</p>
                <p className="text-[10px] text-muted-foreground">/ 100</p>
              </div>
            </div>

            {/* Score Bar */}
            <div className="w-full h-2 bg-muted rounded-full mb-2 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${d.score}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>{d.policies.toLocaleString()} policies</span>
              <span
                className={`font-bold ${d.trend.startsWith("+") ? "text-green-600" : "text-red-500"}`}
              >
                {d.trend} pts
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Partners View ─────────────────────────────────────────────
export function PartnersView() {
  const partners = [
    {
      name: "Al Futtaim Motors",
      type: "Platinum",
      since: "2018",
      region: "Dubai",
      active: true,
    },
    {
      name: "Juma Al Majid",
      type: "Gold",
      since: "2019",
      region: "Dubai",
      active: true,
    },
    {
      name: "Al Tayer Motors",
      type: "Platinum",
      since: "2017",
      region: "Abu Dhabi",
      active: true,
    },
    {
      name: "Trading Enterprises",
      type: "Silver",
      since: "2020",
      region: "Sharjah",
      active: true,
    },
    {
      name: "Gargash Enterprises",
      type: "Gold",
      since: "2019",
      region: "Abu Dhabi",
      active: true,
    },
    {
      name: "Al Nabooda Auto",
      type: "Silver",
      since: "2021",
      region: "Dubai",
      active: true,
    },
    {
      name: "Emirates Motor",
      type: "Gold",
      since: "2018",
      region: "Dubai",
      active: false,
    },
    {
      name: "Al Rostamani",
      type: "Silver",
      since: "2020",
      region: "RAK",
      active: true,
    },
  ];

  const tierColors: Record<string, string> = {
    Platinum: "text-purple-600 bg-purple-500/10 border-purple-500/20",
    Gold: "text-amber-600 bg-amber-500/10 border-amber-500/20",
    Silver: "text-slate-600 bg-slate-500/10 border-slate-500/20",
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-foreground">Partners</h1>
          <p className="text-sm text-muted-foreground">
            Dealer network and partnership management
          </p>
        </div>
        <div className="flex gap-2">
          {["Platinum", "Gold", "Silver"].map((t) => (
            <span
              key={t}
              className={`px-3 py-1 border rounded-full text-xs font-bold ${tierColors[t]}`}
            >
              {partners.filter((p) => p.type === t).length} {t}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {partners.map((p) => (
          <div
            key={p.name}
            className={`bg-card border rounded-xl p-4 shadow-sm hover:shadow-md transition-all ${p.active ? "border-border" : "border-border opacity-60"}`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building size={18} className="text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-foreground truncate">
                  {p.name}
                </h3>
                <p className="text-[10px] text-muted-foreground">
                  Partner since {p.since}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span
                className={`px-2 py-0.5 border rounded-full text-[10px] font-bold ${tierColors[p.type]}`}
              >
                {p.type}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {p.region}
              </span>
              <div className="flex items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full ${p.active ? "bg-green-500" : "bg-muted-foreground/30"}`}
                />
                <span className="text-[10px] text-muted-foreground">
                  {p.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Settings View ─────────────────────────────────────────────
export function SettingsView() {
  const [activeTab, setActiveTab] = React.useState("General");
  const [settings, setSettings] = React.useState({
    // General
    region: "English (UAE)",
    theme: "System",
    notifications: true,
    sound: false,
    // Data
    autoRefresh: true,
    compression: false,
    exportFormat: "PDF",
    // Security
    twoFactor: true,
    sessionTimeout: "30 min",
    biometric: false,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const sections = [
    { id: "General", icon: SettingsIcon },
    { id: "Data", icon: Database },
    { id: "Security", icon: Shield },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-card/50">
      {/* Header */}
      <div className="p-6 border-b border-border bg-card shrink-0">
        <h1 className="text-xl font-black text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your workspace preferences
        </p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Nav */}
        <div className="w-48 border-r border-border p-3 space-y-1 bg-card/30 overflow-y-auto">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveTab(s.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                activeTab === s.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <s.icon size={14} />
              {s.id}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {activeTab === "General" && (
              <>
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-foreground border-b border-border pb-2">
                    Preferences
                  </h3>
                  <div className="grid gap-4">
                    <SettingRow
                      label="Language & Region"
                      desc="Format dates and currency for your region"
                    >
                      <select
                        value={settings.region}
                        onChange={(e) =>
                          setSettings({ ...settings, region: e.target.value })
                        }
                        className="bg-muted border border-border rounded-lg text-xs px-2 py-1.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      >
                        <option>English (UAE)</option>
                        <option>English (US)</option>
                        <option>Arabic (UAE)</option>
                      </select>
                    </SettingRow>

                    <SettingRow
                      label="Theme Preference"
                      desc="Choose your preferred appearance"
                    >
                      <div className="flex items-center gap-1 bg-muted p-1 rounded-lg border border-border">
                        {["Light", "Dark", "System"].map((t) => (
                          <button
                            key={t}
                            onClick={() =>
                              setSettings({ ...settings, theme: t })
                            }
                            className={`px-3 py-1 text-[10px] font-medium rounded-md transition-all ${
                              settings.theme === t
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </SettingRow>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="text-sm font-bold text-foreground border-b border-border pb-2">
                    Notifications
                  </h3>
                  <div className="grid gap-4">
                    <ToggleRow
                      label="Enable Notifications"
                      desc="Receive alerts for high-risk claims"
                      checked={settings.notifications}
                      onChange={() => toggle("notifications")}
                    />
                    <ToggleRow
                      label="Sound Effects"
                      desc="Play sounds for new messages"
                      checked={settings.sound}
                      onChange={() => toggle("sound")}
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === "Data" && (
              <>
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-foreground border-b border-border pb-2">
                    Data Management
                  </h3>
                  <div className="grid gap-4">
                    <SettingRow
                      label="Default Export Format"
                      desc="File type for report downloads"
                    >
                      <select
                        value={settings.exportFormat}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            exportFormat: e.target.value,
                          })
                        }
                        className="bg-muted border border-border rounded-lg text-xs px-2 py-1.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      >
                        <option>PDF</option>
                        <option>Excel</option>
                        <option>CSV</option>
                      </select>
                    </SettingRow>

                    <ToggleRow
                      label="Auto-Refresh Data"
                      desc="Refresh dashboard every 5 minutes"
                      checked={settings.autoRefresh}
                      onChange={() => toggle("autoRefresh")}
                    />
                    <ToggleRow
                      label="Data Compression"
                      desc="Reduce bandwidth usage for large datasets"
                      checked={settings.compression}
                      onChange={() => toggle("compression")}
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === "Security" && (
              <>
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-foreground border-b border-border pb-2">
                    Security Settings
                  </h3>
                  <div className="grid gap-4">
                    <ToggleRow
                      label="Two-Factor Authentication"
                      desc="Require OTP for login"
                      checked={settings.twoFactor}
                      onChange={() => toggle("twoFactor")}
                    />
                    <ToggleRow
                      label="Biometric Login"
                      desc="Use FaceID/TouchID where available"
                      checked={settings.biometric}
                      onChange={() => toggle("biometric")}
                    />
                    <SettingRow
                      label="Session Timeout"
                      desc="Auto-logout duration"
                    >
                      <select
                        value={settings.sessionTimeout}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            sessionTimeout: e.target.value,
                          })
                        }
                        className="bg-muted border border-border rounded-lg text-xs px-2 py-1.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      >
                        <option>15 min</option>
                        <option>30 min</option>
                        <option>1 hour</option>
                        <option>4 hours</option>
                      </select>
                    </SettingRow>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingRow({
  label,
  desc,
  children,
}: {
  label: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-card border border-border rounded-xl shadow-sm">
      <div>
        <h4 className="text-xs font-bold text-foreground">{label}</h4>
        <p className="text-[10px] text-muted-foreground">{desc}</p>
      </div>
      {children}
    </div>
  );
}

function ToggleRow({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-card border border-border rounded-xl shadow-sm">
      <div>
        <h4 className="text-xs font-bold text-foreground">{label}</h4>
        <p className="text-[10px] text-muted-foreground">{desc}</p>
      </div>
      <button
        onClick={onChange}
        className={`w-9 h-5 rounded-full relative transition-colors ${
          checked ? "bg-primary" : "bg-muted-foreground/30"
        }`}
      >
        <div
          className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

// ─── Profile View ──────────────────────────────────────────────
export function ProfileView() {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div>
        <h1 className="text-xl font-black text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Your account information
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-2xl shadow-lg">
            MA
          </div>
          <div>
            <h2 className="text-lg font-black text-foreground">Muhsin Admin</h2>
            <p className="text-sm text-muted-foreground">admin@clarity-bi.ae</p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full border border-primary/20">
              Administrator
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProfileField
            icon={<User size={14} />}
            label="Full Name"
            value="Muhsin Admin"
          />
          <ProfileField
            icon={<Mail size={14} />}
            label="Email"
            value="admin@clarity-bi.ae"
          />
          <ProfileField
            icon={<Building size={14} />}
            label="Organization"
            value="Clarity Insurance"
          />
          <ProfileField
            icon={<Shield size={14} />}
            label="Role"
            value="Super Admin"
          />
          <ProfileField
            icon={<Globe size={14} />}
            label="Region"
            value="UAE - Dubai"
          />
          <ProfileField
            icon={<Lock size={14} />}
            label="Last Login"
            value="Today, 09:22 AM"
          />
        </div>
      </div>
    </div>
  );
}

// ─── Shared Components ─────────────────────────────────────────

function InsightCard({
  icon,
  title,
  desc,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start gap-3">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${color}`}
        >
          {icon}
        </div>
        <div>
          <h4 className="text-sm font-bold text-foreground mb-1">{title}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Processing: "text-blue-600 bg-blue-500/10 border-blue-500/20",
    Approved: "text-green-600 bg-green-500/10 border-green-500/20",
    "Under Review": "text-amber-600 bg-amber-500/10 border-amber-500/20",
    Closed: "text-muted-foreground bg-muted/50 border-border",
  };

  return (
    <span
      className={`inline-block px-2 py-0.5 border rounded-full text-[10px] font-bold ${colors[status] || ""}`}
    >
      {status}
    </span>
  );
}

function ProfileField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-xl border border-border/50">
      <div className="text-muted-foreground">{icon}</div>
      <div>
        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
          {label}
        </p>
        <p className="text-sm text-foreground font-medium">{value}</p>
      </div>
    </div>
  );
}
