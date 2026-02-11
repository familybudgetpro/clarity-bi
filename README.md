<p align="center">
  <img src="https://img.shields.io/badge/Clarity-BI-7c3aed?style=for-the-badge&logoColor=white" alt="Clarity BI" />
  <img src="https://img.shields.io/badge/Next.js-16-000?style=for-the-badge&logo=nextdotjs" alt="Next.js" />
  <img src="https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Gemini_AI-2.0_Flash-4285F4?style=for-the-badge&logo=google" alt="Gemini" />
</p>

# Clarity BI

**Real-time Insurance Business Intelligence Dashboard** — A full-stack analytics platform that transforms raw Sales & Claims Excel data into interactive visualizations, correlation analysis, and AI-powered insights.

---

## ✨ Features

### 📊 Dashboard & Analytics

- **KPI Cards** — Total Premium, Loss Ratio, Claim Rate, Active Policies
- **Monthly Trends** — Premium and claims over time with interactive charts
- **Dealer Performance** — Revenue share, claim rate, and loss ratio per dealer
- **Product Mix** — Policy distribution across insurance products
- **Vehicle Analysis** — Claims and premium breakdown by vehicle make

### 📋 Claims Intelligence

- **Status Breakdown** — Approved, Rejected, Reversed with visual indicators
- **Parts Analysis** — Most common failure parts ranked by cost and frequency
- **Recent Claims Feed** — Live feed of latest claims with status badges
- **Claims Trends** — Monthly claim volume and amount tracking

### 🔗 Correlation Engine

- **Dealer Correlation** — Claim rate & loss ratio per dealer
- **Product Correlation** — Which products generate the most claims
- **Vehicle Make Correlation** — Risk analysis across vehicle brands
- **Yearly Trends** — Year-over-year claim rate analysis

### 📝 Data Manager

- **Paginated Tables** — Browse 40K+ rows with fast pagination
- **Inline Editing** — Double-click any cell to edit with validation
- **Search & Sort** — Full-text search across all columns
- **Audit Trail** — Every edit tracked with timestamp, old/new values
- **Reset & Export** — Revert all changes or export to Excel

### 🤖 Gemini AI Assistant

- **Context-Aware Chat** — AI understands your live data (KPIs, filters, trends)
- **Natural Language Queries** — Ask "What's the loss ratio?" or "Top dealers by claims"
- **Smart Suggestions** — Auto-generated questions based on your data
- **Powered by Gemini 2.0 Flash** — Fast, accurate responses

### 🎛️ Advanced Filtering

- **Staged Filtering** — Select multiple filters, then click "Apply" to reduce latency
- **Dynamic Options** — Dealer, Product, Year, Month, Vehicle Make, Claim Status
- **Custom Date Range** — Filter by specific policy sales windows
- **Full-text Search** — Instantly search across all fields

### ⚡ Performance & UX

- **AI Actions** — Chat auto-navigates and applies filters (e.g., "Show Dealer X" -> Opens Dealer view + Filters)
- **Responsive Widgets** — Charts adapt perfectly to any screen size
- **Conditional Rendering** — Intelligent empty states when data is missing

---

## 🏗️ Architecture

```
clarity-bi/
├── backend/                    # Python FastAPI backend
│   ├── main.py                 # FastAPI app (20+ endpoints)
│   ├── data_processor.py       # Analytics engine (pandas/numpy/scipy)
│   ├── gemini_service.py       # Gemini AI integration
│   └── requirements.txt        # Python dependencies
├── src/
│   ├── components/dashboard/   # React dashboard components
│   │   ├── Dashboard.tsx       # Main dashboard shell
│   │   ├── ViewPages.tsx       # Analytics, Claims, Performance, Partners views
│   │   ├── DataManagerView.tsx # Editable data table with audit log
│   │   ├── ChatPanel.tsx       # Gemini AI chat interface
│   │   ├── FilterPanel.tsx     # Dynamic filter sidebar
│   │   └── Sidebar.tsx         # Navigation sidebar
│   ├── hooks/
│   │   ├── useData.ts          # API data layer (fetch, edit, chat, export)
│   │   └── useFilters.ts       # Filter state management
│   └── ...
├── Sales&ClaimsData.xls        # Source data (auto-loaded)
└── .env                        # Environment variables (GEMINI_API_KEY)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **Python** 3.10+
- **Gemini API Key** ([Get one here](https://aistudio.google.com/apikey))

### 1. Clone & Install

```bash
git clone https://github.com/your-org/clarity-bi.git
cd clarity-bi

# Frontend dependencies
npm install

# Backend dependencies
pip install -r backend/requirements.txt
```

### 2. Configure Environment

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Add Your Data

Place your Excel file as `Sales&ClaimsData.xls` in the project root. The file should have:

- A **Sales** sheet with columns: `Dealer`, `Product`, `Gross Premium`, `Policy No`, `Year`, `Month`, `Make`, `Model`, etc.
- A **Claims** sheet with columns: `Dealer`, `Make`, `Model`, `Policy No`, `Claim Status`, `Total Auth Amount`, `Part Type`, etc.
- Both sheets linked by `Policy No`

### 4. Run

```bash
# Terminal 1: Start the backend (auto-loads Excel on startup)
cd backend
python main.py
# → http://localhost:8000

# Terminal 2: Start the frontend
npm run dev
# → http://localhost:3001
```

Open **http://localhost:3001** in your browser.

---

## 📡 API Reference

| Endpoint                | Method | Description                                    |
| ----------------------- | ------ | ---------------------------------------------- |
| `/api/status`           | GET    | Check data loaded status & AI availability     |
| `/api/upload`           | POST   | Upload Excel file (multipart form)             |
| `/api/summary`          | GET    | KPIs: premium, claims, loss ratio, claim rate  |
| `/api/filters`          | GET    | Available filter options                       |
| `/api/sales/monthly`    | GET    | Monthly premium & policy trends                |
| `/api/sales/dealers`    | GET    | Dealer performance table                       |
| `/api/sales/products`   | GET    | Product mix breakdown                          |
| `/api/sales/vehicles`   | GET    | Vehicle make distribution                      |
| `/api/claims/status`    | GET    | Claim status breakdown                         |
| `/api/claims/parts`     | GET    | Parts failure analysis                         |
| `/api/claims/trends`    | GET    | Monthly claim trends                           |
| `/api/claims/recent`    | GET    | Recent claims feed                             |
| `/api/correlations`     | GET    | Claim correlations by dealer/product/make/year |
| `/api/data/{table}`     | GET    | Paginated raw data (sales/claims)              |
| `/api/data/update`      | PUT    | Inline cell edit with validation               |
| `/api/data/bulk-update` | PUT    | Batch cell updates                             |
| `/api/data/reset`       | POST   | Revert all edits to original data              |
| `/api/data/changes`     | GET    | Audit log of all edits                         |
| `/api/export/{table}`   | GET    | Download table as Excel                        |
| `/api/chat`             | POST   | AI chat with data context                      |
| `/api/chat/suggestions` | GET    | AI-generated question suggestions              |

All GET endpoints accept filter query params: `dealer`, `product`, `year`, `month`, `make`, `date_from`, `date_to`, `search`, `claim_status`.

---

## 🛠️ Tech Stack

| Layer           | Technology                                  |
| --------------- | ------------------------------------------- |
| Frontend        | Next.js 16, React, TypeScript, Tailwind CSS |
| Charts          | Recharts                                    |
| Icons           | Lucide React                                |
| Backend         | Python, FastAPI, Uvicorn                    |
| Data Processing | pandas, NumPy, SciPy                        |
| AI              | Google Gemini 2.0 Flash                     |
| Data Format     | Excel (.xls/.xlsx) via xlrd/openpyxl        |

---

## 📄 License

MIT
