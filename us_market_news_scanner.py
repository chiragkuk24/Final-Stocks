r"""
================================================================================
  QUANTMATRIX AI - US Market Closing & 30-Day Breakout Stock News Scanner
================================================================================
  File: us_market_news_scanner.py
  Location: d:\CNH\Final-Stocks\us_market_news_scanner.py

  Functions:
    1. fetch_us_market_closing_feed() -> US indices data & executive summary
    2. scan_breakout_stocks_news_30days() -> 30-day sentiment-analyzed news feed
================================================================================
"""

import sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

import json
import logging
import math
import re
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta
from pathlib import Path
import requests
import numpy as np
import pandas as pd
import yfinance as yf
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

# Suppress yfinance logging warnings
logging.getLogger('yfinance').setLevel(logging.CRITICAL)

BASE_DIR = Path(__file__).parent
BREAKOUT_EXCEL = BASE_DIR / "Final_Breakout_List.xlsx"
TICKERS_CSV = BASE_DIR / "tickers.csv"

sentiment_analyzer = SentimentIntensityAnalyzer()

# -----------------------------------------------------------------------------
# 1. US Market Closing Feed Engine
# -----------------------------------------------------------------------------
def fetch_us_market_closing_feed() -> dict:
    """Fetch live/closing data for major US market indices and generate narrative summary."""
    indices_config = [
        {"symbol": "^GSPC", "name": "S&P 500", "short": "S&P 500"},
        {"symbol": "^IXIC", "name": "NASDAQ Composite", "short": "NASDAQ"},
        {"symbol": "^DJI", "name": "Dow Jones Industrial", "short": "DOW JONES"},
        {"symbol": "^RUT", "name": "Russell 2000", "short": "RUSSELL 2k"},
        {"symbol": "^VIX", "name": "CBOE Volatility Index", "short": "US VIX"}
    ]

    results = []
    gains_count = 0
    losses_count = 0
    nasdaq_pct = 0.0
    sp500_pct = 0.0
    vix_val = 15.0

    for item in indices_config:
        symbol = item["symbol"]
        name = item["name"]
        short = item["short"]

        cmp, prev, chg, chg_pct = 0.0, 0.0, 0.0, 0.0
        high_val, low_val = 0.0, 0.0
        w52_high, w52_low = 0.0, 0.0
        status = "CLOSED"

        try:
            t = yf.Ticker(symbol)
            hist = t.history(period="1mo")
            
            if not hist.empty and len(hist) >= 2:
                cmp = float(hist['Close'].iloc[-1])
                prev = float(hist['Close'].iloc[-2])
                chg = cmp - prev
                chg_pct = (chg / prev) * 100.0 if prev > 0 else 0.0
                high_val = float(hist['High'].iloc[-1])
                low_val = float(hist['Low'].iloc[-1])
                w52_high = float(hist['High'].max())
                w52_low = float(hist['Low'].min())
            elif not hist.empty:
                cmp = float(hist['Close'].iloc[-1])
                chg = 0.0
                chg_pct = 0.0
                high_val = float(hist['High'].iloc[-1])
                low_val = float(hist['Low'].iloc[-1])
                w52_high = float(hist['High'].max())
                w52_low = float(hist['Low'].min())

        except Exception as e:
            print(f"[WARN] Failed fetching US index {symbol}: {e}")

        if symbol == "^IXIC":
            nasdaq_pct = chg_pct
        elif symbol == "^GSPC":
            sp500_pct = chg_pct
        elif symbol == "^VIX":
            vix_val = cmp

        if chg_pct > 0:
            gains_count += 1
            trend = "BULLISH"
        elif chg_pct < 0:
            losses_count += 1
            trend = "BEARISH"
        else:
            trend = "NEUTRAL"

        results.append({
            "symbol": symbol,
            "name": name,
            "short_name": short,
            "close_price": round(cmp, 2),
            "prev_close": round(prev, 2),
            "change": round(chg, 2),
            "change_pct": round(chg_pct, 2),
            "day_high": round(high_val, 2),
            "day_low": round(low_val, 2),
            "week52_high": round(w52_high, 2),
            "week52_low": round(w52_low, 2),
            "trend": trend,
            "status": status
        })

    # Executive narrative synthesis
    if gains_count >= 3:
        market_bias = "Bullish Rally"
        bias_desc = f"US markets closed higher with NASDAQ ({nasdaq_pct:+.2f}%) and S&P 500 ({sp500_pct:+.2f}%) advancing strong on tech momentum."
    elif losses_count >= 3:
        market_bias = "Bearish Pullback"
        bias_desc = f"US equities faced selling pressure with NASDAQ ({nasdaq_pct:+.2f}%) and S&P 500 ({sp500_pct:+.2f}%) slipping lower."
    else:
        market_bias = "Mixed / Consolidation"
        bias_desc = f"US market indices closed mixed with selective sector rotation. NASDAQ ({nasdaq_pct:+.2f}%), S&P 500 ({sp500_pct:+.2f}%)."

    vix_desc = f"US Volatility Index (CBOE VIX) settled at {vix_val:.2f}, reflecting {'calm risk-on conditions' if vix_val < 18 else 'elevated market uncertainty'}."

    summary = f"{market_bias}: {bias_desc} {vix_desc}"

    return {
        "indices": results,
        "summary": summary,
        "updated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

# -----------------------------------------------------------------------------
# 2. 30-Day News Feed Scanner for Breakout Stocks
# -----------------------------------------------------------------------------
def get_breakout_symbols() -> list:
    """Load stock symbols from Final_Breakout_List.xlsx or fallback list."""
    symbols = []
    if BREAKOUT_EXCEL.exists():
        try:
            df = pd.read_excel(BREAKOUT_EXCEL)
            if 'Stock' in df.columns:
                symbols = [f"{s}.NS" if not str(s).endswith('.NS') else str(s) for s in df['Stock'].dropna().tolist()]
        except Exception as e:
            print(f"[WARN] Error reading Excel symbols: {e}")
            
    if not symbols:
        symbols = ['PNB.NS', 'HEROMOTOCO.NS', 'MUTHOOTFIN.NS', 'MARUTI.NS', 'RELIANCE.NS', 'TCS.NS', 'INFY.NS', 'EICHERMOT.NS']
    return symbols

def parse_relative_time(date_str_or_time) -> tuple:
    """Parse pubDate/timestamp and return (iso_formatted, relative_time_string, timestamp)."""
    now = datetime.now()
    pub_dt = now

    if isinstance(date_str_or_time, (int, float)):
        try:
            pub_dt = datetime.fromtimestamp(date_str_or_time)
        except Exception:
            pub_dt = now
    elif isinstance(date_str_or_time, str):
        # Try common RSS date formats
        for fmt in [
            "%a, %d %b %Y %H:%M:%S %Z",
            "%a, %d %b %Y %H:%M:%S GMT",
            "%Y-%m-%dT%H:%M:%SZ",
            "%Y-%m-%d %H:%M:%S"
        ]:
            try:
                pub_dt = datetime.strptime(date_str_or_time.replace("+00:00", "GMT"), fmt)
                break
            except Exception:
                pass

    diff = now - pub_dt
    days = diff.days
    seconds = diff.seconds
    hours = seconds // 3600
    minutes = (seconds % 3600) // 60

    if days == 0:
        if hours == 0:
            rel_str = f"{max(1, minutes)} mins ago"
        else:
            rel_str = f"{hours} hrs ago"
    elif days == 1:
        rel_str = "Yesterday"
    elif days < 30:
        rel_str = f"{days} days ago"
    else:
        rel_str = f"{days // 30} mo ago"

    return pub_dt.strftime("%Y-%m-%d %H:%M"), rel_str, pub_dt.timestamp()

def scan_breakout_stocks_news_30days(symbols: list = None) -> dict:
    """Scan news feeds over past 30 days for breakout stock list and score sentiment."""
    if not symbols:
        symbols = get_breakout_symbols()

    cutoff_date = datetime.now() - timedelta(days=30)
    all_articles = []
    stock_summaries = {}
    seen_titles = set()

    for sym in symbols:
        clean_name = sym.replace('.NS', '').replace('.BO', '')
        stock_articles = []

        # 1. Fetch yfinance news
        try:
            t = yf.Ticker(sym)
            yf_news = t.news or []
            for n in yf_news:
                content = n.get('content', n) if isinstance(n, dict) else {}
                title = content.get('title') or (n.get('title') if isinstance(n, dict) else '')
                if not title or title in seen_titles:
                    continue

                pub_time = content.get('pubDate') or content.get('providerPublishTime') or (n.get('providerPublishTime') if isinstance(n, dict) else None)
                link = content.get('canonicalUrl', {}).get('url') or (n.get('link') if isinstance(n, dict) else '#')
                publisher = content.get('provider', {}).get('displayName') or (n.get('publisher') if isinstance(n, dict) else 'Financial News')
                snippet = content.get('summary') or title

                iso_date, rel_time, ts = parse_relative_time(pub_time)
                if datetime.fromtimestamp(ts) < cutoff_date:
                    continue

                seen_titles.add(title)
                score = sentiment_analyzer.polarity_scores(title + " " + snippet)['compound']
                label = "BULLISH" if score >= 0.05 else ("BEARISH" if score <= -0.05 else "NEUTRAL")

                art_obj = {
                    "stock": clean_name,
                    "symbol": sym,
                    "title": title,
                    "publisher": publisher,
                    "link": link,
                    "snippet": snippet[:220] + "..." if len(snippet) > 220 else snippet,
                    "published_at": iso_date,
                    "relative_time": rel_time,
                    "timestamp": ts,
                    "sentiment_score": round(score, 2),
                    "sentiment_label": label
                }
                stock_articles.append(art_obj)
        except Exception as e:
            print(f"[WARN] yfinance news error for {sym}: {e}")

        # 2. Fetch Google News RSS for 30-day coverage boost
        try:
            rss_url = f"https://news.google.com/rss/search?q={clean_name}+stock+india&hl=en-IN&gl=IN&ceid=IN:en"
            resp = requests.get(rss_url, timeout=4)
            if resp.status_code == 200:
                root = ET.fromstring(resp.content)
                items = root.findall('.//item')
                for item in items[:15]:
                    title = item.find('title').text if item.find('title') is not None else ''
                    if not title or title in seen_titles:
                        continue

                    pub_date = item.find('pubDate').text if item.find('pubDate') is not None else ''
                    link = item.find('link').text if item.find('link') is not None else '#'

                    iso_date, rel_time, ts = parse_relative_time(pub_date)
                    if datetime.fromtimestamp(ts) < cutoff_date:
                        continue

                    seen_titles.add(title)
                    score = sentiment_analyzer.polarity_scores(title)['compound']
                    label = "BULLISH" if score >= 0.05 else ("BEARISH" if score <= -0.05 else "NEUTRAL")

                    # Extract publisher from title "Headline - Publisher"
                    pub_parts = title.rsplit(' - ', 1)
                    headline_text = pub_parts[0] if len(pub_parts) > 1 else title
                    publisher_name = pub_parts[1] if len(pub_parts) > 1 else 'Market News'

                    art_obj = {
                        "stock": clean_name,
                        "symbol": sym,
                        "title": headline_text,
                        "publisher": publisher_name,
                        "link": link,
                        "snippet": f"News updates and technical/fundamental catalyst scanner feed for {clean_name} stock.",
                        "published_at": iso_date,
                        "relative_time": rel_time,
                        "timestamp": ts,
                        "sentiment_score": round(score, 2),
                        "sentiment_label": label
                    }
                    stock_articles.append(art_obj)
        except Exception as e:
            print(f"[WARN] RSS news error for {sym}: {e}")

        # Sort stock articles by newest first
        stock_articles.sort(key=lambda x: x['timestamp'], reverse=True)
        all_articles.extend(stock_articles)

        # Compute stock summary stats
        if stock_articles:
            bull_cnt = sum(1 for a in stock_articles if a['sentiment_label'] == 'BULLISH')
            neu_cnt = sum(1 for a in stock_articles if a['sentiment_label'] == 'NEUTRAL')
            bear_cnt = sum(1 for a in stock_articles if a['sentiment_label'] == 'BEARISH')
            avg_score = float(np.mean([a['sentiment_score'] for a in stock_articles]))
            
            stock_summaries[clean_name] = {
                "total_articles": len(stock_articles),
                "bullish_count": bull_cnt,
                "neutral_count": neu_cnt,
                "bearish_count": bear_cnt,
                "avg_sentiment": round(avg_score, 2),
                "overall_label": "BULLISH" if avg_score >= 0.05 else ("BEARISH" if avg_score <= -0.05 else "NEUTRAL")
            }

    # Sort all articles across all stocks by timestamp (newest first)
    all_articles.sort(key=lambda x: x['timestamp'], reverse=True)

    # Compute overall statistics
    total_arts = len(all_articles)
    if total_arts > 0:
        total_bullish = sum(1 for a in all_articles if a['sentiment_label'] == 'BULLISH')
        bullish_pct = round((total_bullish / total_arts) * 100.0, 1)
        mean_sentiment = round(float(np.mean([a['sentiment_score'] for a in all_articles])), 2)

        # Find top covered stock
        stock_counts = {}
        for a in all_articles:
            stock_counts[a['stock']] = stock_counts.get(a['stock'], 0) + 1
        top_stock = max(stock_counts, key=stock_counts.get) if stock_counts else "N/A"
    else:
        bullish_pct = 0.0
        mean_sentiment = 0.0
        top_stock = "N/A"

    return {
        "total_articles": total_arts,
        "bullish_pct": bullish_pct,
        "avg_sentiment": mean_sentiment,
        "top_covered_stock": top_stock,
        "articles": all_articles,
        "stock_summaries": stock_summaries,
        "scanned_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

# -----------------------------------------------------------------------------
# 3. Main Pipeline Entry
# -----------------------------------------------------------------------------
def run_full_market_news_pipeline(symbols: list = None) -> dict:
    """Execute full US market closing feed and 30-day breakout stock news scanner."""
    print("\n[US MARKET & NEWS SCANNER] Fetching live US market indices feed...")
    us_data = fetch_us_market_closing_feed()
    
    print("[US MARKET & NEWS SCANNER] Scanning past 30-day news feeds for breakout stocks...")
    news_data = scan_breakout_stocks_news_30days(symbols)

    print(f"✅ US Market Feed: {len(us_data['indices'])} indices loaded. | Summary: {us_data['summary'][:60]}...")
    print(f"✅ News Scanner: Scanned {news_data['total_articles']} articles (Bullish: {news_data['bullish_pct']}%).")

    return {
        "us_market": us_data,
        "breakout_news": news_data
    }

if __name__ == "__main__":
    res = run_full_market_news_pipeline()
    print(json.dumps(res, indent=2)[:500] + "...")
