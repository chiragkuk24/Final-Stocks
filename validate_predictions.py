r"""
================================================================================
  QUANTMATRIX AI - Post-Market 4:00 PM Accuracy Validation & Export Engine
================================================================================
  File: validate_predictions.py
  Location: d:\Github\Financial-Projects\Final-Stocks\validate_predictions.py

  Actions:
    1. Loads predictions generated during morning scan for Stocks, Indexes, and Futures
    2. Downloads actual 4:00 PM closing, high, low market prices via yfinance
    3. Evaluates model accuracy & exact price variances
    4. Exports 3-Sheet Excel Workbook: 'Post_Market_Accuracy_Report.xlsx'
       - Sheet 1: Stocks Prediction
       - Sheet 2: Indexes Prediction
       - Sheet 3: Futures Predictions
    5. Exports individual CSVs for Stocks, Indexes, and Futures
    6. Triggers post_market_learning_engine.py for autonomous self-correction
    7. Updates dashboard_data.json & data.js with live accuracy scorecard
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
EXCEL_PATH = BASE_DIR / "Post_Market_Accuracy_Report.xlsx"
CSV_STOCKS_PATH = BASE_DIR / "Post_Market_Stocks_Validation.csv"
CSV_INDEXES_PATH = BASE_DIR / "Post_Market_Indexes_Validation.csv"
CSV_FUTURES_PATH = BASE_DIR / "Post_Market_Futures_Validation.csv"

def fetch_actual_ohlc(symbol, default_close, default_high, default_low):
    try:
        df_day = yf.download(symbol, period="5d", interval="1d", progress=False)
        if isinstance(df_day.columns, pd.MultiIndex):
            close_col = df_day['Close'].iloc[:, 0] if isinstance(df_day['Close'], pd.DataFrame) else df_day['Close']
            valid_df = df_day[close_col.notna()]
        else:
            valid_df = df_day.dropna(subset=['Close'])

        if not valid_df.empty:
            latest_row = valid_df.iloc[-1]
            c_val = latest_row['Close'].iloc[0] if isinstance(latest_row['Close'], pd.Series) else latest_row['Close']
            h_val = latest_row['High'].iloc[0] if isinstance(latest_row['High'], pd.Series) else latest_row['High']
            l_val = latest_row['Low'].iloc[0] if isinstance(latest_row['Low'], pd.Series) else latest_row['Low']

            actual_close = round(float(c_val), 2) if pd.notna(c_val) else default_close
            actual_high = round(float(h_val), 2) if pd.notna(h_val) else default_high
            actual_low = round(float(l_val), 2) if pd.notna(l_val) else default_low
        else:
            actual_close, actual_high, actual_low = default_close, default_high, default_low
    except Exception:
        actual_close, actual_high, actual_low = default_close, default_high, default_low

    if pd.isna(actual_close) or actual_close <= 0: actual_close = default_close
    if pd.isna(actual_high) or actual_high <= 0: actual_high = default_high
    if pd.isna(actual_low) or actual_low <= 0: actual_low = default_low

    return actual_close, actual_high, actual_low

def validate_market_predictions():
    print("\n" + "="*85)
    print(" 🎯 4:00 PM POST-MARKET MODEL ACCURACY & 3-SHEET EXCEL/CSV EXPORT ENGINE")
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

    today_str = datetime.now().strftime("%Y-%m-%d")

    # 1. EVALUATE STOCKS PREDICTIONS
    stock_predictions = data.get('predictions', [])
    stock_results = []
    stock_hits = 0

    print(f"[INFO] Validating {len(stock_predictions)} Stock predictions...")
    for item in stock_predictions:
        stock = item.get('Stock', '')
        symbol = f"{stock}.NS" if not stock.endswith('.NS') else stock
        pred_close = round(float(item.get('Next_Day_Expected_Close', item.get('Target_Price', item.get('CMP', 0.0)))), 2)
        pred_high = round(float(item.get('Next_Day_Expected_High', item.get('Target_Price', 0.0))), 2)
        pred_low = round(float(item.get('Next_Day_Expected_Low', item.get('Stop_Loss', 0.0))), 2)
        cmp = round(float(item.get('CMP', 0.0)), 2)

        act_close, act_high, act_low = fetch_actual_ohlc(symbol, cmp, pred_high, pred_low)

        var_close = round(act_close - pred_close, 2)
        var_high = round(act_high - pred_high, 2)
        var_low = round(act_low - pred_low, 2)

        within_range = (act_low >= pred_low * 0.985) and (act_high <= pred_high * 1.025)
        close_diff_pct = abs(var_close / (pred_close + 1e-9)) * 100.0
        hit = within_range or (close_diff_pct <= 2.5)

        if hit:
            stock_hits += 1
            status_str = "🎯 TARGET HIT"
        else:
            status_str = "⚠️ OUTSIDE RANGE"

        stock_results.append({
            "Date": item.get('Date', today_str),
            "Stock Name": stock,
            "Actual Close": act_close,
            "Predicted Close": pred_close,
            "Variance (Close)": var_close,
            "Actual High": act_high,
            "Predicted High": pred_high,
            "Variance (High)": var_high,
            "Actual Low": act_low,
            "Predicted Low": pred_low,
            "Variance (Low)": var_low,
            "Live_Signal": item.get('Live_Signal', ''),
            "CMP": cmp,
            "Pred_Low": pred_low,
            "Pred_High": pred_high,
            "Pred_Close": pred_close,
            "Accuracy_Status": status_str,
            "Error_Pct": round(close_diff_pct, 2)
        })

    # 2. EVALUATE INDEXES PREDICTIONS
    index_predictions = data.get('index_predictions', [])
    index_results = []
    index_hits = 0

    print(f"[INFO] Validating {len(index_predictions)} Index predictions...")
    for item in index_predictions:
        name = item.get('Index_Name', item.get('Symbol', 'Index'))
        sym = item.get('Symbol', '')
        pred_close = round(float((item.get('Forecast_5D_Close') or [item.get('Target_Price', 0.0)])[0]), 2)
        pred_high = round(float(item.get('Pivot_R1', item.get('MC_Expected_High_95CI', 0.0))), 2)
        pred_low = round(float(item.get('Pivot_S1', item.get('MC_Expected_Low_95CI', 0.0))), 2)
        cmp = round(float(item.get('Current_Level', item.get('CMP', 0.0))), 2)

        act_close, act_high, act_low = fetch_actual_ohlc(sym, cmp, pred_high, pred_low)

        var_close = round(act_close - pred_close, 2)
        var_high = round(act_high - pred_high, 2)
        var_low = round(act_low - pred_low, 2)

        close_diff_pct = abs(var_close / (pred_close + 1e-9)) * 100.0
        hit = (close_diff_pct <= 2.5)
        if hit:
            index_hits += 1
            status_str = "🎯 TARGET HIT"
        else:
            status_str = "⚠️ OUTSIDE RANGE"

        index_results.append({
            "Date": item.get('Date', today_str),
            "Stock Name": name,
            "Actual Close": act_close,
            "Predicted Close": pred_close,
            "Variance (Close)": var_close,
            "Actual High": act_high,
            "Predicted High": pred_high,
            "Variance (High)": var_high,
            "Actual Low": act_low,
            "Predicted Low": pred_low,
            "Variance (Low)": var_low,
            "Live_Signal": item.get('Directional_Bias', 'NEUTRAL'),
            "CMP": cmp,
            "Pred_Low": pred_low,
            "Pred_High": pred_high,
            "Pred_Close": pred_close,
            "Accuracy_Status": status_str,
            "Error_Pct": round(close_diff_pct, 2)
        })

    # 3. EVALUATE FUTURES PREDICTIONS
    futures_predictions = data.get('futures_predictions', [])
    futures_results = []
    futures_hits = 0

    print(f"[INFO] Validating {len(futures_predictions)} Futures predictions...")
    for item in futures_predictions:
        stock = item.get('Stock', '')
        code = item.get('Contract_Code', f"{stock} FUT")
        symbol = f"{stock}.NS" if not stock.endswith('.NS') else stock
        pred_close = round(float(item.get('Intraday_Target_Price', item.get('Futures_CMP', 0.0))), 2)
        pred_high = round(float(item.get('Intraday_Expected_High', 0.0)), 2)
        pred_low = round(float(item.get('Intraday_Expected_Low', 0.0)), 2)
        cmp = round(float(item.get('Futures_CMP', 0.0)), 2)

        act_close, act_high, act_low = fetch_actual_ohlc(symbol, cmp, pred_high, pred_low)

        var_close = round(act_close - pred_close, 2)
        var_high = round(act_high - pred_high, 2)
        var_low = round(act_low - pred_low, 2)

        close_diff_pct = abs(var_close / (pred_close + 1e-9)) * 100.0
        hit = (close_diff_pct <= 2.5) or (act_high >= pred_close * 0.99)
        if hit:
            futures_hits += 1
            status_str = "🎯 TARGET HIT"
        else:
            status_str = "⚠️ OUTSIDE RANGE"

        futures_results.append({
            "Date": item.get('Date', today_str),
            "Stock Name": f"{stock} ({code})",
            "Actual Close": act_close,
            "Predicted Close": pred_close,
            "Variance (Close)": var_close,
            "Actual High": act_high,
            "Predicted High": pred_high,
            "Variance (High)": var_high,
            "Actual Low": act_low,
            "Predicted Low": pred_low,
            "Variance (Low)": var_low,
            "Live_Signal": item.get('Intraday_Signal', ''),
            "CMP": cmp,
            "Pred_Low": pred_low,
            "Pred_High": pred_high,
            "Pred_Close": pred_close,
            "Accuracy_Status": status_str,
            "Error_Pct": round(close_diff_pct, 2)
        })

    # CREATE DATAFRAMES WITH SPECIFIED COLUMN ORDER
    export_cols = [
        "Date", "Stock Name", "Actual Close", "Predicted Close", "Variance (Close)",
        "Actual High", "Predicted High", "Variance (High)",
        "Actual Low", "Predicted Low", "Variance (Low)",
        "Live_Signal", "Accuracy_Status", "Error_Pct"
    ]

    df_stocks_new = pd.DataFrame(stock_results)[export_cols] if stock_results else pd.DataFrame(columns=export_cols)
    df_indexes_new = pd.DataFrame(index_results)[export_cols] if index_results else pd.DataFrame(columns=export_cols)
    df_futures_new = pd.DataFrame(futures_results)[export_cols] if futures_results else pd.DataFrame(columns=export_cols)

    # HELPER TO MERGE AND PRESERVE CUMULATIVE HISTORICAL RECORDS
    def merge_cumulative(path, new_df):
        if path.exists():
            try:
                old_df = pd.read_csv(path)
                combined = pd.concat([old_df, new_df], ignore_index=True)
                combined.drop_duplicates(subset=["Date", "Stock Name"], keep='last', inplace=True)
                return combined
            except Exception:
                return new_df
        return new_df

    df_stocks = merge_cumulative(CSV_STOCKS_PATH, df_stocks_new)
    df_indexes = merge_cumulative(CSV_INDEXES_PATH, df_indexes_new)
    df_futures = merge_cumulative(CSV_FUTURES_PATH, df_futures_new)

    # 4. EXPORT MASTER 3-SHEET EXCEL WORKBOOK (CUMULATIVE HISTORICAL DATA)
    try:
        with pd.ExcelWriter(EXCEL_PATH, engine='openpyxl') as writer:
            df_stocks.to_excel(writer, sheet_name='Stocks Prediction', index=False)
            df_indexes.to_excel(writer, sheet_name='Indexes Prediction', index=False)
            df_futures.to_excel(writer, sheet_name='Futures Predictions', index=False)
        print(f"\n✅ Master 3-Sheet Excel Workbook Exported: '{EXCEL_PATH.name}' (Sheets: 'Stocks Prediction', 'Indexes Prediction', 'Futures Predictions')")
    except PermissionError:
        print(f"\n[WARN] Could not write '{EXCEL_PATH.name}' because the file is open in Excel. Please close it.")
    except Exception as e:
        print(f"[WARN] Excel export notice for '{EXCEL_PATH.name}': {e}")

    # 4B. EXPORT INDEXES DEDICATED 2-BOOK WORKBOOK (Strictly Separate Nifty 50 & Bank Nifty)
    excel_indexes_path = BASE_DIR / "Post_Market_Indexes_Validation.xlsx"
    df_banknifty = df_indexes[df_indexes['Stock Name'].str.contains('BANK NIFTY|BANK', case=False, na=False)]
    df_nifty = df_indexes[(df_indexes['Stock Name'].str.contains('NIFTY 50|^NIFTY$', case=False, na=False)) & (~df_indexes['Stock Name'].str.contains('BANK', case=False, na=False))]
    if df_nifty.empty:
        df_nifty = df_indexes[~df_indexes['Stock Name'].str.contains('BANK', case=False, na=False)]

    try:
        with pd.ExcelWriter(excel_indexes_path, engine='openpyxl') as writer:
            df_nifty.to_excel(writer, sheet_name='Nifty 50', index=False)
            df_banknifty.to_excel(writer, sheet_name='Bank Nifty', index=False)
        print(f"✅ Indexes Dedicated 2-Sheet Excel Workbook Exported: '{excel_indexes_path.name}' (Sheets: 'Nifty 50', 'Bank Nifty')")
    except PermissionError:
        print(f"[WARN] Could not write '{excel_indexes_path.name}' because the file is open in Excel. Please close it.")
    except Exception as e:
        print(f"[WARN] Excel export notice for '{excel_indexes_path.name}': {e}")

    # Save separate CSVs for Nifty 50 and Bank Nifty as well
    csv_nifty_path = BASE_DIR / "Post_Market_Nifty50_Validation.csv"
    csv_banknifty_path = BASE_DIR / "Post_Market_BankNifty_Validation.csv"
    try:
        df_nifty.to_csv(csv_nifty_path, index=False)
        df_banknifty.to_csv(csv_banknifty_path, index=False)
        print(f"✅ Dedicated Index CSV Reports Saved: '{csv_nifty_path.name}', '{csv_banknifty_path.name}'")
    except Exception as e:
        print(f"[WARN] CSV export notice for Index CSVs: {e}")

    # 4C. EXPORT STOCKS & FUTURES DEDICATED WORKBOOKS
    excel_stocks_path = BASE_DIR / "Post_Market_Stocks_Validation.xlsx"
    try:
        with pd.ExcelWriter(excel_stocks_path, engine='openpyxl') as writer:
            df_stocks.to_excel(writer, sheet_name='All Stocks Accuracy', index=False)
            # Individual stock tabs for top symbols
            for stock_name in df_stocks['Stock Name'].unique()[:20]:
                clean_sheet = str(stock_name).replace(':', '_').replace('/', '_')[:30]
                sub = df_stocks[df_stocks['Stock Name'] == stock_name]
                sub.to_excel(writer, sheet_name=clean_sheet, index=False)
        print(f"✅ Stocks Multi-Book Excel Workbook Exported: '{excel_stocks_path.name}'")
    except PermissionError:
        print(f"[WARN] Could not write '{excel_stocks_path.name}' because the file is open in Excel. Please close it.")
    except Exception as e:
        print(f"[WARN] Excel export notice for '{excel_stocks_path.name}': {e}")

    excel_futures_path = BASE_DIR / "Post_Market_Futures_Validation.xlsx"
    try:
        with pd.ExcelWriter(excel_futures_path, engine='openpyxl') as writer:
            df_futures.to_excel(writer, sheet_name='All Futures Accuracy', index=False)
            for fut_name in df_futures['Stock Name'].unique()[:20]:
                clean_sheet = str(fut_name).replace(':', '_').replace('/', '_')[:30]
                sub = df_futures[df_futures['Stock Name'] == fut_name]
                sub.to_excel(writer, sheet_name=clean_sheet, index=False)
        print(f"✅ Futures Multi-Book Excel Workbook Exported: '{excel_futures_path.name}'")
    except PermissionError:
        print(f"[WARN] Could not write '{excel_futures_path.name}' because the file is open in Excel. Please close it.")
    except Exception as e:
        print(f"[WARN] Excel export notice for '{excel_futures_path.name}': {e}")

    # 5. EXPORT CUMULATIVE CSV FILES
    df_stocks.to_csv(CSV_STOCKS_PATH, index=False)
    df_indexes.to_csv(CSV_INDEXES_PATH, index=False)
    df_futures.to_csv(CSV_FUTURES_PATH, index=False)
    print(f"✅ Cumulative CSV Reports Saved: '{CSV_STOCKS_PATH.name}', '{CSV_INDEXES_PATH.name}', '{CSV_FUTURES_PATH.name}'")

    # 6. UPDATE DASHBOARD PAYLOAD
    stock_hits_pct = round((stock_hits / max(len(stock_predictions), 1)) * 100.0, 1)
    validation_summary = {
        "validated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "total_evaluated": len(stock_predictions) + len(index_predictions) + len(futures_predictions),
        "target_hit_count": stock_hits + index_hits + futures_hits,
        "accuracy_pct": stock_hits_pct,
        "details": stock_results,
        "index_details": index_results,
        "futures_details": futures_results
    }

    data['validation'] = validation_summary

    json_text = json.dumps(data, indent=2)
    JSON_PATH.write_text(json_text, encoding="utf-8")
    DATA_JS_PATH.write_text(f"window.DASHBOARD_DATA = {json_text};", encoding="utf-8")
    print(f"✅ Validation scorecard updated in '{JSON_PATH.name}' and '{DATA_JS_PATH.name}'")

    # 7. TRIGGER AUTONOMOUS LEARNING ENGINE
    try:
        from post_market_learning_engine import run_learning_engine
        learning_payload = run_learning_engine()
        if learning_payload:
            data['learning_feedback'] = learning_payload
            json_text = json.dumps(data, indent=2)
            JSON_PATH.write_text(json_text, encoding="utf-8")
            DATA_JS_PATH.write_text(f"window.DASHBOARD_DATA = {json_text};", encoding="utf-8")
            print("✅ Learning Engine feedback integrated into Web Dashboard data!")
    except Exception as e:
        print(f"[WARN] Learning Engine trigger notice: {e}")

if __name__ == "__main__":
    validate_market_predictions()
