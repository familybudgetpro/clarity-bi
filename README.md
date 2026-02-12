<p align="center">
  <img src="https://img.shields.io/badge/Clarity-BI-7c3aed?style=for-the-badge&logoColor=white" alt="Clarity BI" />
  <img src="https://img.shields.io/badge/Next.js-16-000?style=for-the-badge&logo=nextdotjs" alt="Next.js" />
  <img src="https://img.shields.io/badge/FastAPI-2.0-009688?style=for-the-badge&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Gemini_AI-2.0_Flash-4285F4?style=for-the-badge&logo=google" alt="Gemini" />
</p>

# 📊 Clarity BI — AI-Powered Insurance Business Intelligence

**Clarity BI** is a next-generation insurance analytics & decision intelligence platform that transforms raw Sales & Claims data into real-time dashboards, operational KPIs, predictive insights, and AI-driven recommendations.

Built for insurance leaders, underwriters, claims teams, and sales heads to monitor performance, identify risks early, and make data-backed decisions — faster.

---

## 🚀 What Makes Clarity BI Different?

- ✅ **Business-ready KPIs** (not just charts)
- ✅ **Claims & Loss Ratio intelligence**
- ✅ **Budget vs Achieved tracking**
- ✅ **Predictive analytics** (Loss Ratio forecasting)
- ✅ **Context-aware AI assistant** (Gemini)
- ✅ **High-performance data handling** (40K+ rows)

From descriptive BI → diagnostic → predictive → prescriptive intelligence.

---

## ✨ Core Capabilities

### 📈 Executive KPIs

- **Performance**: Policies Issued, Revenue (MTD / YTD), Growth vs Last Period.
- **Budget**: Budget vs Achieved (Policies, Premium, Revenue).
- **Variance**: Drill down into performance gaps.

### 📊 Sales Intelligence

- **Trends**: Product-wise sales trends (Yearly / Quarterly / Monthly).
- **Channels**: Dealer & partner performance tracking.
- **Mix**: Product mix contribution and Customer type segmentation.
- **Geo**: Country & regional performance analysis.

### 🧾 Claims Intelligence

- **Volume**: Total claims (MTD / YTD), Claims approval ratio.
- **Aging**: Outstanding claims & aging buckets.
- **Efficiency**: Authorization TAT (average, median, SLA breach).
- **Details**: Parts failure & cost analysis, Live recent claims feed.

### 📉 Loss Ratio Analytics

- **Deep Dive**: Analyze loss ratio by Year, Product, Country, Dealer, Vehicle Make, and Customer Type.
- **Visuals**: Heatmaps, Drill-down tables, and Trend analysis.

### 🔮 Predictive Analytics (AI-Driven)

- **Forecast**: Predictive loss ratio forecasting using linear regression.
- **Risk**: Risk categorization (Low / Medium / High) for dealers and products.
- **Model**: Seasonality-aware trend modeling.

### 🤖 Gemini AI Assistant

A context-aware AI layer that understands your live data. You can ask:

- _"Why is loss ratio increasing this month?"_
- _"Which dealer is risky next quarter?"_
- _"Top products contributing to claims"_

**AI Actions**: Auto-apply filters, Navigate dashboards, Highlight anomalies.

---

## 🏗️ Architecture

```
clarity-bi/
├── backend/                    # Python FastAPI backend
│   ├── core/                   # Data logic (DataManager, Utils)
│   ├── metrics/                # KPI engines (Sales, Claims, Budget, Predictive)
│   ├── ai/                     # Gemini AI integration
│   ├── main.py                 # FastAPI app definition
│   └── requirements.txt
├── src/
│   ├── components/             # React UI components
│   ├── hooks/                  # Data & filter state management
│   └── pages/                  # Next.js pages
├── data/
│   └── SalesAndClaims.xlsx     # Source Data
└── .env                        # Environment Configuration
```

---

## 🛠️ Tech Stack

| Layer           | Technology                                  |
| --------------- | ------------------------------------------- |
| **Frontend**    | Next.js 16, React, TypeScript, Tailwind CSS |
| **Charts**      | Recharts                                    |
| **Backend**     | Python, FastAPI, Uvicorn                    |
| **Data Engine** | pandas, NumPy, SciPy                        |
| **AI**          | Google Gemini 2.0 Flash                     |
| **Deployment**  | Vercel (Serverless Python)                  |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **Python** 3.10+
- **Gemini API Key** ([Get one here](https://aistudio.google.com/apikey))

### 1. Installation

```bash
git clone https://github.com/your-org/clarity-bi.git
cd clarity-bi

# Install dependencies
npm install
pip install -r backend/requirements.txt
```

### 2. Environment Setup

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run Locally

```bash
# Start Backend (http://localhost:8000)
# Uses the new Vercel-compatible entry point
python api/index.py

# Start Frontend (http://localhost:3001)
npm run dev
```

---

## 📡 API Overview

| Endpoint        | Description                                 |
| --------------- | ------------------------------------------- |
| `/api/summary`  | Executive KPIs & High-level metrics         |
| `/api/budget`   | **[NEW]** Budget vs Achieved targets        |
| `/api/predict`  | **[NEW]** Predictive Loss Ratio forecasting |
| `/api/sales/*`  | Sales trends, dealers, products, vehicles   |
| `/api/claims/*` | Claims status, parts, trends, recent        |
| `/api/chat`     | Context-aware AI chat                       |

---

## 📄 License

MIT
