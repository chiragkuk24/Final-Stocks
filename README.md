# 🚀 QUANTMATRIX AI — Institutional Multi-Pillar ML & Quant Trading System

![QUANTMATRIX AI Banner](https://img.shields.io/badge/QUANTMATRIX-INSTITUTIONAL%20AI-00e699?style=for-the-badge&logo=python&logoColor=black)
![Python Version](https://img.shields.io/badge/python-3.10%2B-blue?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![Status](https://img.shields.io/badge/status-active%20production-brightgreen?style=flat-square)

**QUANTMATRIX AI** is an institutional-grade algorithmic quantitative trading dashboard and machine learning prediction pipeline. It combines multi-model ensemble regressions (Random Forest, Gradient Boosting, Extra Trees, Ridge, Lasso, ElasticNet, SVR, KNN, MLP, PyTorch LSTM), Monte Carlo stochastic simulations, global macro/geopolitical news scanners, and an autonomous post-market self-learning engine for Indian Equity, Index, Futures, and MCX Commodity markets.

---

## 🌟 Key Features & Modules

### 1. 🇺🇸 US Markets & Global News Scanner (`us_market_news_scanner.py`)
- Real-time closing feed for key US indices (S&P 500, NASDAQ, Dow Jones, Russell 2000, CBOE VIX).
- Scans past 30-day sentiment and news feeds for breakout candidates.
- Dedicated **Global Commodity & Geopolitical Risk Index** tracking military conflict, OPEC crude supply events, and central bank bullion movements.

### 2. 📊 Index 5-Day ML Forecasts (`NIFTY 50` & `BANK NIFTY`)
- Multi-model ensemble price prediction with 5-day trajectory forecasting.
- Stochastic Monte Carlo win probability estimation.
- Integrated macro regime indicators (India VIX volatility multiplier, CMF institutional flow, CBOE regime).

### 3. 🎯 200 DMA + CAR Super Breakout Stock Scanner (`Initialization.py`)
- Automated technical scanner filtering high-conviction breakout candidates based on 200 DMA, Chaikin Money Flow (CMF), TTM Squeeze, and Volume Spikes.
- Exports filtered candidates to `Final_Breakout_List.xlsx`.

### 4. ⚡ Current Month Futures Engine (`predict_futures_price_action`)
- Calculates Spot vs Futures CMP, Basis Spread (₹ & %), Cost of Carry (CoC % annualized), Contract Lot Size, and Margin requirements.
- Generates precise Intraday Buy Entry Ranges, Targets, Stop-Losses, VWAP estimates, and Pivot Levels (PP, R1, R2, S1, S2).

### 5. 🪙 MCX Commodities Engine (`predict_commodities_futures`)
- Real-time intraday price action & target range predictions for 8 core MCX Commodity contracts:
  - **Gold** & **Gold Mini** (`GOLD`, `GOLDM`)
  - **Silver** & **Silver Mini** (`SILVER`, `SILVERM`)
  - **Natural Gas** & **Natural Gas Mini** (`NATURALGAS`, `NATURALGASM`)
  - **Crude Oil** & **Crude Oil Mini** (`CRUDEOIL`, `CRUDEOILM`)

### 6. 🎯 Post-Market Model Accuracy Validation (`validate_predictions.py`)
- Evaluates actual vs predicted OHLC close prices, intraday highs, and intraday lows.
- Converts international commodity futures quotes (`GC=F`, `SI=F`, `CL=F`, `NG=F`) into exact Indian MCX INR contract units.
- Generates 3-Sheet Master Excel Reports (`Post_Market_Accuracy_Report.xlsx`) and cumulative CSV scorecards.

### 7. 🤖 Autonomous ML & Self-Correcting Learning Engine (`post_market_learning_engine.py`)
- Performs error residual decomposition across 54+ setups (Stocks, Indexes, Futures, Commodities).
- Computes mean close bias, high target variance, and low support floor drift.
- Calibrates symbol-level bias offsets (`symbol_bias_offsets`) and updates `model_learning_feedback.json` to self-correct future prediction loops.

---

## ⏰ Automated Workflow Execution Schedule (IST)

The platform runs on 5 dedicated automated GitHub Actions cron schedules:

| Workflow | IST Schedule | UTC Schedule | Main Script |
| :--- | :--- | :--- | :--- |
| **Futures Prediction** | `5:30 AM IST` | `00:00 UTC` | `ml_quant_predictor.py` |
| **Stocks Prediction** | `6:30 AM IST` | `01:00 UTC` | `ml_quant_predictor.py` |
| **MCX Commodities Prediction** | `3:30 PM IST` | `10:00 UTC` | `ml_quant_predictor.py` |
| **Equity & Index Post-Market Validation** | `4:00 PM IST` | `10:30 UTC` | `validate_predictions.py` |
| **MCX Commodities Post-Market Validation** | `1:00 AM IST` | `19:30 UTC` | `validate_predictions.py` |

---

## 💻 Web Dashboard UI

The web dashboard is built using Vanilla JavaScript, HTML5, and Vanilla CSS with modern glassmorphism aesthetics:
- **Responsive Layout**: Desktop, Tablet, and Mobile sticky navigation bar.
- **Single View Mode Enforcer**: Displays strictly one active view mode (**🎴 Cards View** or **📊 Table View**) at a time across all pages.
- **Left Sidebar Navigation**:
  - `US Markets`
  - `News Feeds`
  - `NIFTY 50`
  - `BANK NIFTY`
  - `Dashboard`
  - `Current Month Futures`
  - `Commodities`
  - `Stocks Post-Market Analysis`
  - `Indexes Post-Market Analysis`
  - `Futures Post-Market Analysis`
  - `Commodities Post-Market Analysis`
  - `About`

---

## 🛠️ Installation & Local Setup

### Prerequisites
- Python 3.10+
- Node.js (Optional, for local testing scripts)

### Installation
1. **Clone Repository**:
   ```bash
   git clone https://github.com/chiragkuk24/Final-Stocks.git
   cd Final-Stocks
   ```

2. **Install Python Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run Predictor Loop**:
   ```bash
   python ml_quant_predictor.py
   ```

4. **Run Post-Market Validation Engine**:
   ```bash
   python validate_predictions.py
   ```

5. **Launch Local Dashboard Web Server**:
   ```bash
   python -m http.server 8000
   ```
   Open `http://localhost:8000/index.html` in your browser.

---

## 📁 Repository Structure

```
Final-Stocks/
├── .github/
│   └── workflows/
│       ├── futures_prediction_530am.yml
│       ├── stocks_prediction_630am.yml
│       ├── commodities_prediction_330pm.yml
│       ├── post_market_validation.yml
│       └── commodities_post_market_validation_1am.yml
├── Initialization.py                      # [PROTECTED] Technical 200 DMA + CAR Breakout Scanner
├── ml_quant_predictor.py                  # Main ML Prediction & Forecast Engine
├── validate_predictions.py                # Post-Market Model Accuracy Validation Engine
├── post_market_learning_engine.py         # Autonomous ML Self-Learning Diagnostics
├── us_market_news_scanner.py              # US Closing Feed & Global Commodity/Geopolitical Scanner
├── index.html                             # Web Dashboard UI Structure
├── styles.css                             # Glassmorphism Design Token System
├── app.js                                 # Web Dashboard Controller & Event Handlers
├── data.js                                # Live JavaScript Data Feed Payload
├── dashboard_data.json                    # Master JSON Data Store
├── model_learning_feedback.json           # Self-Learning Calibration Weights
└── README.md                              # System Documentation
```

---

## 🔒 File Protection & Development Rules

- **`Initialization.py`**: **NEVER modify `Initialization.py` under any circumstances.** It is a protected core scanner.

---

## ⚠️ Disclaimer

This platform provides **educational market analysis and quant research only**. It is not financial advice, investment advice, or a buy/sell recommendation. Market trading carries substantial risk, and past machine learning accuracy does not guarantee future results.
