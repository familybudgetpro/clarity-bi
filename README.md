# Clarity BI

> Enterprise-grade Business Intelligence for Auto Insurance — Power BI experience, without the complexity.

![Clarity BI](https://img.shields.io/badge/Status-In%20Development-blue) ![Next.js](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![License](https://img.shields.io/badge/License-Proprietary-red)

---

## 🎯 Overview

**Clarity BI** is a conversational analytics platform designed specifically for the **Auto Insurance** industry. It combines the visualization power of Power BI and Tableau with an AI-driven natural language interface, enabling CEOs, CFOs, COOs, and Line Managers to generate insights without writing a single formula.

### The Problem We Solve
- **No DAX/SQL Required:** Users describe what they want in plain English.
- **Instant Insights:** Drop an Excel file and get a dashboard in seconds.
- **Mobile-First:** Designed for executives on the move.
- **No License Complexity:** Simple, link-based sharing.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLARITY BI                               │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Next.js   │  │  Recharts   │  │ Tailwind 4  │  FRONTEND   │
│  │   App Dir   │  │  + D3.js    │  │   + Inter   │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  XLSX.js    │  │  PapaParse  │  │  AI Engine  │  DATA LAYER │
│  │ Excel Parse │  │  CSV Parse  │  │  (LLM API)  │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐           │
│  │              Oracle DB Connector                 │  PHASE 2  │
│  │          (node-oracledb + Live Sync)            │           │
│  └─────────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

### Phase 1: Excel-Powered Analytics (Current)

#### 1. Smart Multi-File Upload
- **Drag-and-Drop Zone:** Drop multiple Excel/CSV files simultaneously.
- **AI Auto-Mapping:** Automatically identifies columns (Premium, Claims, Dealer, Date, etc.).
- **Cross-File Linking:** Detects relationships (e.g., `Policy_ID` in Sales links to Claims).
- **Data Versioning:** Upload "Sales_Jan.xlsx" and "Sales_Feb.xlsx" — they merge intelligently.

#### 2. Instant Discovery Dashboard
- **Zero Configuration:** The moment a file is dropped, a dashboard appears.
- **Auto-Generated KPIs:** Total Premium, Loss Ratio, Active Claims, Policy Count.
- **Smart Chart Selection:** The AI picks the best visualization for each metric.

#### 3. Conversational Analytics (The "Chat" Interface)
- **Natural Language Queries:**
  - `"Show claims by dealer for the last month"`
  - `"Compare loss ratios across regions"`
  - `"Which product has the highest profitability?"`
- **Conversational Editing:**
  - `"Change this to a pie chart"`
  - `"Filter by Dubai region"`
  - `"Add a trend line"`
  - `"Remove the legend"`
- **Contextual Suggestions:** After each query, related reports are suggested:
  - `"Compare Toyota claims vs. Nissan claims"`
  - `"Forecast claims for next month"`

#### 4. Role-Based Perspectives
| Role | Focus | Key Features |
|------|-------|--------------|
| **CEO** | Strategic Growth | Market share, revenue trends, AI strategy suggestions |
| **CFO** | Financial Health | Margins, reserves, liquidity forecasting, loss ratios |
| **COO** | Operational Efficiency | Claim processing speed, dealer performance, bottlenecks |
| **Line Manager** | Tactical Execution | Daily targets, regional performance, individual dealer support |

#### 5. Power BI-Style UI
- **Left Navigation:** Report / Data / Model views.
- **Filter Pane:** Slicer-style filters (Date Range, Region, Dealer, Product).
- **Field List:** Draggable Measures and Dimensions.
- **Canvas Grid:** Resizable, selectable visualizations.
- **Toolbar:** Add Visual, Table, Chart, Publish buttons.

#### 6. Visualization Library
- Bar Charts (Vertical & Horizontal)
- Line Charts with Trend Lines
- Combo Charts (Bars + Lines)
- Pie & Donut Charts
- Data Tables with Conditional Formatting
- KPI Cards with Sparklines
- Heatmaps (Regional Performance)

#### 7. Export & Sharing
- **One-Click PDF Export:** Branded, print-ready reports.
- **Live Sharing Links:** Stakeholders can view without login.
- **Excel Export:** Download filtered data for further analysis.

---

### Phase 2: Oracle Live Sync (Planned)

#### 1. Real-Time Oracle DB Connection
- **Connection Pooling:** High-performance `node-oracledb` integration.
- **Live Data Refresh:** Dashboards update as the database changes.
- **Schema Detection:** Auto-discovers tables and relationships.

#### 2. Executive Live Wall
- **Pulse Dashboard:** Real-time KPIs that update every few seconds.
- **Alert System:** Push notifications for critical thresholds (e.g., Loss Ratio > 70%).

---

### Phase 3: Predictive & AI Features (Planned)

#### 1. Predictive Claims
- **Historical Analysis:** Uses past claim patterns to forecast next month's payout.
- **Risk Heatmap:** Predicts which vehicle segments will see claim spikes.

#### 2. Business Strategy Consultant
- **AI-Generated Insights:**
  - `"Warning: Claim costs for [Brand X] have risen 15%. Strategy: Increase premiums by 5%."`
  - `"Sales for [Product Z] are lagging in the Northern region. Launch a dealer incentive."`

#### 3. Forecasting Engine
- **Revenue Projections:** Predict next quarter's premium income.
- **Growth Strategies:** AI suggests markets to expand into based on loss ratios and competition.

---

## 🚀 Auto Insurance Industry Modules

### 1. Sales & Products
- Revenue trends by product type (Comprehensive, Third Party, Agency Repair).
- Renewal tracking with expiry heatmaps.
- Policy conversion funnels.

### 2. Dealer Network
- Dealer scorecards (Sales Volume + Loss Ratio).
- Commission and incentive tracking.
- Market share by dealer and brand.

### 3. Claims & Risk
- Loss Ratio dashboards (Premiums vs. Claims).
- Claim aging and bottleneck detection.
- Fraud detection triggers (unusual claim patterns).

### 4. Warranties & Extended Cover
- Warranty profitability analysis.
- Part failure rate tracking.
- Repair cost vs. warranty revenue.

---

## 📱 Responsive Design

| Device | Experience |
|--------|------------|
| **Desktop** | Full Power BI-style layout with all panes |
| **Tablet** | Collapsible sidebars, touch-optimized charts |
| **Mobile** | Single-column KPI cards, swipeable charts, bottom chat |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router, Server Components) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **Charts** | Recharts + D3.js |
| **Fonts** | Inter (UI), Outfit (Headers) |
| **Excel Parsing** | XLSX.js, PapaParse |
| **AI/LLM** | OpenAI GPT-4o / Gemini (configurable) |
| **Database** | Oracle DB (Phase 2) |
| **Deployment** | Vercel |

---

## 📂 Project Structure

```
clarity-bi/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with fonts
│   │   ├── page.tsx            # Main entry point
│   │   └── globals.css         # Tailwind + custom styles
│   ├── components/
│   │   ├── dashboard/
│   │   │   └── Dashboard.tsx   # Main Power BI-style dashboard
│   │   ├── charts/             # Reusable chart components
│   │   ├── filters/            # Filter pane components
│   │   └── ui/                 # Buttons, cards, inputs
│   ├── lib/
│   │   ├── excel-parser.ts     # Excel/CSV processing
│   │   ├── ai-engine.ts        # Natural language to query
│   │   ├── data-linker.ts      # Cross-file relationship detection
│   │   └── chart-selector.ts   # Auto-selects best chart type
│   └── types/
│       └── index.ts            # TypeScript interfaces
├── public/
│   └── assets/                 # Static images, icons
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 🚦 Development Roadmap

### ✅ Completed
- [x] Project initialization (Next.js 16 + Tailwind 4)
- [x] Power BI-style UI shell (Nav, Toolbar, Filter Pane, Field List)
- [x] KPI cards with sparklines
- [x] Combo charts, Pie charts, Data tables
- [x] AI Chat panel UI
- [x] Drag-and-drop file zone
- [x] Vercel deployment
- [x] **Interactive Filtering** - Click any filter to update all charts instantly
- [x] **Click-to-Drill-Down** - Click on chart elements to filter
- [x] **Cross-Filtering** - Charts update each other in real-time
- [x] **Export at Every Point** - PDF/Image export for each widget
- [x] **Draggable Rearrangement** - Drag cards to reorder
- [x] **Predictive Analytics Engine** - Forecasting and risk analysis
- [x] **Oracle DB Connector** - Ready for live data sync

### 🔄 In Progress
- [ ] Excel parsing with real file upload
- [ ] Full natural language query processing
- [ ] Live Oracle DB connection (requires Oracle server)

### 📋 Upcoming
- [ ] Role-based perspective switching
- [ ] Contextual report suggestions
- [ ] Predictive claims visualization
- [ ] Business strategy AI recommendations panel
- [ ] WhatsApp/Email automated reports

---

## 🔧 Local Development

```bash
# Clone the repository
cd clarity-bi

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

---

## 🔗 Live Demo

**Production URL:** [https://clarity-bi-opal.vercel.app](https://clarity-bi-opal.vercel.app)

---

## 📄 License

Proprietary — All rights reserved.

---

## 👥 Team

Built for the Auto Insurance industry by the Clarity BI team.
