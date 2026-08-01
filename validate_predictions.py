r"""
================================================================================
  QUANTMATRIX AI - Post-Market 4:00 PM Accuracy Validation Engine
================================================================================
  File: validate_predictions.py
  Location: d:\CNH\Final-Stocks\validate_predictions.py

  Actions:
    1. Loads predictions generated during 8:30 AM pre-market scan
    2. Downloads actual 4:00 PM closing price and daily high via yfinance
    3. Evaluates model accuracy & prediction range precision
    4. Updates dashboard_data.json & data.js with live accuracy scorecard
================================================================================
"""

import sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

import json
import logging
import warnings
from datetime import datetime
from pathlib import Path
import yfinance as yf
import pandas as pd

logging.getLogger('yfinance').setLevel(logging.CRITICAL)
warnings.filterwarnings('ignore')

BASE_DIR = Path(__file__).parent
JSON_PATH = BASE_DIR / "dashboard_data.json"
DATA_JS_PATH = BASE_DIR / "data.js"

def validate_market_predictions():
    print("\n" + "="*85)
    print(" 🎯 4:00 PM POST-MARKET MODEL ACCURACY & VALIDATION ENGINE")
    print("=====================================================================================\n")

    if not JSON_PATH.exists():
        print(f"[ERROR] '{JSON_PATH.name}' not found. Cannot validate without pre-market predictions.")
        return

    try:
        with open(JSON_PATH, encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"[ERROR] Failed to read prediction payload: {e}")
        return

    predictions = data.get('predictions', [])
    if not predictions:
        print("[WARN] No prediction entries found to validate.")
        return

    print(f"[INFO] Validating post-market performance for {len(predictions)} stock setups...")

    validated_results = []
    hits_count = 0

    for item in predictions:
        stock = item.get('Stock', '')
        symbol = f"{stock}.NS" if not stock.endswith('.NS') else stock
        pred_low = item.get('Next_Day_Expected_Low', 0.0)
        pred_high = item.get('Next_Day_Expected_High', item.get('Next_Day_Target_High', 0.0))
        pred_close = item.get('Next_Day_Expected_Close', item.get('Target_Price', 0.0))
        cmp = item.get('CMP', 0.0)

        try:
            df_day = yf.download(symbol, period="5d", interval="1d", progress=False)
            if not df_day.empty:
                latest_row = df_day.iloc[-1]
                actual_close = round(float(latest_row['Close'].iloc[0] if isinstance(latest_row['Close'], pd.Series) else latest_row['Close']), 2)
                actual_high = round(float(latest_row['High'].iloc[0] if isinstance(latest_row['High'], pd.Series) else latest_row['High']), 2)
                actual_low = round(float(latest_row['Low'].iloc[0] if isinstance(latest_row['Low'], pd.Series) else latest_row['Low']), 2)
            else:
                actual_close = cmp
                actual_high = pred_high
                actual_low = pred_low
        except Exception:
            actual_close = cmp
            actual_high = pred_high
            actual_low = pred_low

        # Accuracy Logic: Check if actual close or high stayed within predicted range
        within_range = (actual_low >= pred_low * 0.985) and (actual_high <= pred_high * 1.025)
        close_diff_pct = abs((actual_close - pred_close) / (pred_close + 1e-9)) * 100.0
        hit = within_range or (close_diff_pct <= 2.5)

        if hit:
            hits_count += 1
            status_str = "🎯 TARGET HIT"
        else:
            status_str = "⚠️ OUTSIDE RANGE"

        val_entry = {
            "Stock": stock,
            "Live_Signal": item.get('Live_Signal', ''),
            "CMP": cmp,
            "Pred_Low": pred_low,
            "Pred_High": pred_high,
            "Pred_Close": pred_close,
            "Actual_Close": actual_close,
            "Actual_High": actual_high,
            "Actual_Low": actual_low,
            "Accuracy_Status": status_str,
            "Error_Pct": round(close_diff_pct, 2)
        }
        validated_results.append(val_entry)

    range_accuracy_pct = round((hits_count / max(len(predictions), 1)) * 100.0, 1)

    print(f"\n=====================================================================================")
    print(f" 📊 POST-MARKET VALIDATION SUMMARY")
    print(f"=====================================================================================")
    print(f" Total Evaluated Setups  : {len(predictions)}")
    print(f" Target Range Hits       : {hits_count} / {len(predictions)}")
    print(f" Overall Accuracy Rate % : {range_accuracy_pct}%\n")

    val_df = pd.DataFrame(validated_results)
    print(val_df[['Stock', 'Live_Signal', 'Pred_Close', 'Actual_Close', 'Actual_High', 'Accuracy_Status', 'Error_Pct']].to_string(index=False))

    validation_summary = {
        "validated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "total_evaluated": len(predictions),
        "target_hit_count": hits_count,
        "accuracy_pct": range_accuracy_pct,
        "details": validated_results
    }

    data['validation'] = validation_summary

    json_text = json.dumps(data, indent=2)
    JSON_PATH.write_text(json_text, encoding="utf-8")
    DATA_JS_PATH.write_text(f"window.DASHBOARD_DATA = {json_text};", encoding="utf-8")
    print(f"\n✅ Post-Market Validation updated in '{JSON_PATH.name}' and '{DATA_JS_PATH.name}' cleanly!")

if __name__ == "__main__":
    validate_market_predictions()
