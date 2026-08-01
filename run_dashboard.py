r"""
================================================================================
  QUANTMATRIX AI - One-Click Web Dashboard Launcher
================================================================================
  File: run_dashboard.py
  Location: d:\CNH\Final-Stocks\run_dashboard.py

  Actions:
    1. Executes ml_quant_predictor.py to generate fresh predictions & JSON
    2. Starts a local HTTP web server on port 8000
    3. Automatically launches the live Web Dashboard in your default browser
================================================================================
"""

import sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

import http.server
import os
import socketserver
import subprocess
import webbrowser
from pathlib import Path

PORT = 8000
BASE_DIR = Path(__file__).parent

def main():
    print("\n" + "="*70)
    print(" 🚀 QUANTMATRIX AI — Launching Live Web Dashboard...")
    print("="*70)

    # 1. Run ML & Quant Predictor
    print("\n[1/3] Running ML & Quant Prediction Engine...")
    try:
        subprocess.run([sys.executable, str(BASE_DIR / "ml_quant_predictor.py")], check=True)
    except Exception as e:
        print(f"[WARN] Engine execution notice: {e}")

    # 2. Change directory to workspace
    os.chdir(BASE_DIR)

    # 3. Launch Web Browser
    url = f"http://localhost:{PORT}/index.html"
    print(f"\n[2/3] Opening Web Dashboard at: {url}")
    webbrowser.open(url)

    # 4. Start HTTP Web Server
    print(f"[3/3] Web Dashboard HTTP Server running on port {PORT}. Press Ctrl+C to stop.\n")
    
    class DualStackServer(socketserver.TCPServer):
        allow_reuse_address = True

    Handler = http.server.SimpleHTTPRequestHandler
    with DualStackServer(("", PORT), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n[INFO] Dashboard server stopped gracefully.")

if __name__ == "__main__":
    main()
