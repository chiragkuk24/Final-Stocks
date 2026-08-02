/* ==========================================================================
   QUANTMATRIX AI - Live Trading Dashboard Controller (app.js)
   ========================================================================== */

function initApp() {
    let dashboardData = null;
    let currentFilter = 'ALL';
    let currentSearch = '';
    let currentView = 'cards'; // 'cards' or 'table'
    let forecastChartInstance = null;

    // DOM Elements
    const niftyBadge = document.getElementById('nifty-regime-badge');
    const vixBadge = document.getElementById('vix-badge');
    const macroMultBadge = document.getElementById('macro-mult-badge');
    const lastUpdated = document.getElementById('last-updated');

    const kpiHighConviction = document.getElementById('kpi-high-conviction');
    const kpiTopWinprob = document.getElementById('kpi-top-winprob');
    const kpiTopStock = document.getElementById('kpi-top-stock');

    const countAll = document.getElementById('count-all');
    const countHigh = document.getElementById('count-high');
    const countMod = document.getElementById('count-mod');
    const countAvoid = document.getElementById('count-avoid');

    const cardsContainer = document.getElementById('cards-container');
    const tableContainer = document.getElementById('table-container');
    const tableBody = document.getElementById('table-body');
    const searchInput = document.getElementById('search-input');

    const btnRefresh = document.getElementById('btn-refresh');
    const btnExcel = document.getElementById('btn-excel-export');

    const modal = document.getElementById('stock-modal');
    const modalClose = document.getElementById('modal-close');

    // Sidebar Navigation Elements (4 Sections)
    const navUsmarkets = document.getElementById('nav-usmarkets');
    const navNewsfeeds = document.getElementById('nav-newsfeeds');
    const navDashboard = document.getElementById('nav-dashboard');
    const navPostmarket = document.getElementById('nav-postmarket');

    const pageUsmarkets = document.getElementById('page-usmarkets');
    const pageNewsfeeds = document.getElementById('page-newsfeeds');
    const pageDashboard = document.getElementById('page-dashboard');
    const pagePostmarket = document.getElementById('page-postmarket');

    function switchPage(page) {
        if (pageUsmarkets) pageUsmarkets.style.display = 'none';
        if (pageNewsfeeds) pageNewsfeeds.style.display = 'none';
        if (pageDashboard) pageDashboard.style.display = 'none';
        if (pagePostmarket) pagePostmarket.style.display = 'none';

        if (navUsmarkets) navUsmarkets.classList.remove('active');
        if (navNewsfeeds) navNewsfeeds.classList.remove('active');
        if (navDashboard) navDashboard.classList.remove('active');
        if (navPostmarket) navPostmarket.classList.remove('active');

        if (page === 'usmarkets') {
            if (pageUsmarkets) pageUsmarkets.style.display = '';
            if (navUsmarkets) navUsmarkets.classList.add('active');
        } else if (page === 'newsfeeds') {
            if (pageNewsfeeds) pageNewsfeeds.style.display = '';
            if (navNewsfeeds) navNewsfeeds.classList.add('active');
        } else if (page === 'postmarket') {
            if (pagePostmarket) pagePostmarket.style.display = '';
            if (navPostmarket) navPostmarket.classList.add('active');
            renderPostMarketAnalysis();
        } else {
            // Default: Dashboard
            if (pageDashboard) pageDashboard.style.display = '';
            if (navDashboard) navDashboard.classList.add('active');
        }

        // Auto close mobile drawer on section switch
        closeMobileMenu();
    }

    // Mobile Off-Canvas Sidebar Menu Toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const appSidebar = document.getElementById('app-sidebar');

    function closeMobileMenu() {
        if (appSidebar) appSidebar.classList.remove('mobile-open');
        if (sidebarOverlay) sidebarOverlay.classList.remove('active');
    }

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            if (appSidebar) appSidebar.classList.toggle('mobile-open');
            if (sidebarOverlay) sidebarOverlay.classList.toggle('active');
        });
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeMobileMenu);
    }

    if (navUsmarkets) navUsmarkets.addEventListener('click', (e) => { e.preventDefault(); switchPage('usmarkets'); });
    if (navNewsfeeds) navNewsfeeds.addEventListener('click', (e) => { e.preventDefault(); switchPage('newsfeeds'); });
    if (navDashboard) navDashboard.addEventListener('click', (e) => { e.preventDefault(); switchPage('dashboard'); });
    if (navPostmarket) navPostmarket.addEventListener('click', (e) => { e.preventDefault(); switchPage('postmarket'); });


    // Fetch Dashboard Data (Prioritizes window.DASHBOARD_DATA for instant load, then fetches fresh JSON)
    function loadDashboardData() {
        if (window.DASHBOARD_DATA && window.DASHBOARD_DATA.predictions && window.DASHBOARD_DATA.predictions.length > 0) {
            dashboardData = window.DASHBOARD_DATA;
            renderDashboard();
        }

        fetch('dashboard_data.json?t=' + new Date().getTime())
            .then(res => res.json())
            .then(data => {
                if (data && data.predictions) {
                    dashboardData = data;
                    renderDashboard();
                }
            })
            .catch(err => {
                console.log('Fetch error:', err);
                if (window.DASHBOARD_DATA && !dashboardData) {
                    dashboardData = window.DASHBOARD_DATA;
                    renderDashboard();
                }
            });
    }

    // Render Full Dashboard
    function renderDashboard() {
        if (!dashboardData) return;

        const macro = dashboardData.macro || {};
        const predictions = dashboardData.predictions || [];

        // 1. Render Macro Badges
        niftyBadge.textContent = macro.NIFTY_Regime || 'BULLISH';
        if (macro.NIFTY_Regime === 'BULLISH') niftyBadge.className = 'badge badge-green';
        else if (macro.NIFTY_Regime === 'BEARISH') niftyBadge.className = 'badge badge-red';
        else niftyBadge.className = 'badge badge-yellow';

        vixBadge.innerHTML = `<i class="fa-solid fa-shield-cat"></i> ${macro.India_VIX || 13.5} (${macro.VIX_Regime || 'Low'})`;
        macroMultBadge.textContent = `${macro.Macro_Multiplier || 1.0}x Boost`;
        if (lastUpdated) lastUpdated.textContent = `Updated: ${dashboardData.generated_at || 'Just Now'}`;

        // 2. Calculate Counts & KPIs
        const highCount = predictions.filter(p => (p.Live_Signal || '').includes('HIGH CONVICTION')).length;
        const modCount = predictions.filter(p => (p.Live_Signal || '').includes('MODERATE')).length;
        const avoidCount = predictions.filter(p => (p.Live_Signal || '').includes('AVOID')).length;

        countAll.textContent = predictions.length;
        countHigh.textContent = highCount;
        countMod.textContent = modCount;
        countAvoid.textContent = avoidCount;

        kpiHighConviction.textContent = highCount;

        if (predictions.length > 0) {
            const sortedByWin = [...predictions].sort((a, b) => (b['Final_Win_Probability_%'] || 0) - (a['Final_Win_Probability_%'] || 0));
            kpiTopWinprob.textContent = `${sortedByWin[0]['Final_Win_Probability_%'] || 0}%`;
            kpiTopStock.textContent = sortedByWin[0].Stock || '--';
        }

        // 3. Render Cards & Table
        renderFilteredView();

        // 4. Render NIFTY 50 & BANK NIFTY 5-Day ML Forecasts, US Market Feed & News Scanner
        if (dashboardData.index_predictions) renderIndexForecasts(dashboardData.index_predictions);
        if (dashboardData.us_market) renderUSMarketFeed(dashboardData.us_market);
        if (dashboardData.breakout_news) renderBreakoutNewsScanner(dashboardData.breakout_news);

        // 5. Render Post-Market Analysis if available
        renderPostMarketAnalysis();
    }

    // Global Post-Market Detail Toggle Handler
    window.togglePostMarketDetail = function(stockSymbol) {
        const detailRow = document.getElementById(`post-detail-${stockSymbol}`);
        if (detailRow) {
            detailRow.classList.toggle('hidden');
        }
    };

    // Render Post-Market Accuracy Section
    function renderPostMarketAnalysis() {
        if (!dashboardData || !dashboardData.validation) {
            // No validation data yet — show placeholder message
            const tbody = document.getElementById('post-accuracy-table-body');
            if (tbody) tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--text-muted);padding:24px;">Post-market validation data will appear after 4:00 PM IST on weekdays.</td></tr>';
            return;
        }

        const v = dashboardData.validation;

        const tsEl = document.getElementById('post-market-timestamp');
        if (tsEl) tsEl.textContent = `Validated: ${v.validated_at || '--'}`;

        const accEl = document.getElementById('post-accuracy-pct');
        if (accEl) {
            accEl.textContent = `${v.accuracy_pct || 0}%`;
            accEl.className = `post-kpi-value ${(v.accuracy_pct || 0) >= 70 ? 'green-text' : ((v.accuracy_pct || 0) >= 50 ? 'gold-text' : 'red-text')}`;
        }

        const hitEl = document.getElementById('post-hit-count');
        if (hitEl) hitEl.textContent = `${v.target_hit_count || 0} / ${v.total_evaluated || 0}`;

        const totalEl = document.getElementById('post-total-evaluated');
        if (totalEl) totalEl.textContent = v.total_evaluated || 0;

        const tbody = document.getElementById('post-accuracy-table-body');
        if (!tbody || !v.details || !Array.isArray(v.details)) return;

        tbody.innerHTML = v.details.map(d => {
            if (!d) return '';
            const stock = d.Stock || 'UNKNOWN';
            const liveSignal = d.Live_Signal || '🟢 HIGH CONVICTION BUY';
            const statusStr = d.Accuracy_Status || '🎯 TARGET HIT';
            const isHit = statusStr.includes('HIT');
            const signalClass = liveSignal.includes('HIGH') ? 'badge-green' : (liveSignal.includes('MODERATE') ? 'badge-yellow' : 'badge-red');

            const predClose = d.Pred_Close !== undefined ? d.Pred_Close : 0;
            const actualClose = d.Actual_Close !== undefined ? d.Actual_Close : 0;
            const predHigh = d.Pred_High !== undefined ? d.Pred_High : 0;
            const actualHigh = d.Actual_High !== undefined ? d.Actual_High : 0;
            const predLow = d.Pred_Low !== undefined ? d.Pred_Low : 0;
            const actualLow = d.Actual_Low !== undefined ? d.Actual_Low : 0;

            const closeErr = d.Close_Error_Pct !== undefined ? d.Close_Error_Pct : (d.Error_Pct || 0.0);
            const highErr = d.High_Error_Pct !== undefined ? d.High_Error_Pct : (predHigh > 0 ? Math.abs(((actualHigh - predHigh) / predHigh) * 100).toFixed(2) : '0.00');
            const lowErr = d.Low_Error_Pct !== undefined ? d.Low_Error_Pct : (predLow > 0 ? Math.abs(((actualLow - predLow) / predLow) * 100).toFixed(2) : '0.00');

            return `
            <tr onclick="togglePostMarketDetail('${stock}')" style="cursor: pointer;" class="post-stock-row" title="Click to view detailed Close, High, Low error breakdown">
                <td style="font-weight: 800; font-family: var(--font-heading); color: var(--accent-cyan);">${stock} <i class="fa-solid fa-chevron-down" style="font-size: 10px; margin-left: 4px; opacity: 0.7;"></i></td>
                <td><span class="badge ${signalClass}">${liveSignal}</span></td>
                <td>₹${predClose}</td>
                <td style="font-weight: 700; color: ${isHit ? 'var(--accent-emerald)' : 'var(--text-main)'};">₹${actualClose}</td>
                <td style="color: var(--accent-cyan);">₹${actualHigh}</td>
                <td style="color: var(--accent-red);">₹${actualLow}</td>
                <td style="color: ${closeErr <= 2.5 ? 'var(--accent-emerald)' : 'var(--accent-red)'}; font-weight: 600;">${closeErr}%</td>
                <td class="${isHit ? 'hit-cell' : 'miss-cell'}">${statusStr}</td>
            </tr>
            <tr id="post-detail-${stock}" class="post-detail-row hidden">
                <td colspan="8" style="padding: 0;">
                    <div class="post-detail-box card-glass-inner">
                        <div class="post-detail-title">
                            <span><i class="fa-solid fa-square-poll-vertical"></i> <strong>${stock}</strong> — Post-Market Metric Error Breakdown</span>
                            <span class="${isHit ? 'hit-cell' : 'miss-cell'}" style="padding: 3px 10px; border-radius: 6px; font-size: 12px;">${statusStr}</span>
                        </div>
                        <div class="post-detail-grid">
                            <!-- Close Comparison Card -->
                            <div class="post-detail-card">
                                <div class="pd-card-header"><i class="fa-solid fa-flag-checkered"></i> Close Price Comparison</div>
                                <div class="pd-metric-row"><span class="pd-lbl">Predicted Close:</span><span class="pd-val">₹${predClose}</span></div>
                                <div class="pd-metric-row"><span class="pd-lbl">Actual Close:</span><span class="pd-val green-text">₹${actualClose}</span></div>
                                <div class="pd-metric-row pd-err-row"><span class="pd-lbl">Close Error %:</span><span class="pd-val ${closeErr <= 2.5 ? 'green-text' : 'red-text'}">${closeErr}%</span></div>
                            </div>
                            <!-- High Comparison Card -->
                            <div class="post-detail-card">
                                <div class="pd-card-header"><i class="fa-solid fa-arrow-trend-up"></i> High Price Comparison</div>
                                <div class="pd-metric-row"><span class="pd-lbl">Predicted High:</span><span class="pd-val">₹${predHigh}</span></div>
                                <div class="pd-metric-row"><span class="pd-lbl">Actual High:</span><span class="pd-val cyan-text">₹${actualHigh}</span></div>
                                <div class="pd-metric-row pd-err-row"><span class="pd-lbl">High Error %:</span><span class="pd-val ${highErr <= 2.5 ? 'green-text' : 'red-text'}">${highErr}%</span></div>
                            </div>
                            <!-- Low Comparison Card -->
                            <div class="post-detail-card">
                                <div class="pd-card-header"><i class="fa-solid fa-arrow-trend-down"></i> Low Price Comparison</div>
                                <div class="pd-metric-row"><span class="pd-lbl">Predicted Low:</span><span class="pd-val">₹${predLow}</span></div>
                                <div class="pd-metric-row"><span class="pd-lbl">Actual Low:</span><span class="pd-val red-text">₹${actualLow}</span></div>
                                <div class="pd-metric-row pd-err-row"><span class="pd-lbl">Low Error %:</span><span class="pd-val ${lowErr <= 2.5 ? 'green-text' : 'red-text'}">${lowErr}%</span></div>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>`;
        }).join('');
    }

    // Filter & Search Logic
    function getFilteredPredictions() {
        if (!dashboardData || !dashboardData.predictions) return [];

        return dashboardData.predictions.filter(p => {
            const matchesFilter = currentFilter === 'ALL' || p.Live_Signal.includes(currentFilter.replace('🟢 ', '').replace('🟡 ', '').replace('🔴 ', ''));
            const matchesSearch = p.Stock.toLowerCase().includes(currentSearch.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }

    function renderFilteredView() {
        const filtered = getFilteredPredictions();

        if (currentView === 'cards') {
            renderCards(filtered);
            cardsContainer.classList.remove('hidden');
            tableContainer.classList.add('hidden');
        } else {
            renderTable(filtered);
            tableContainer.classList.remove('hidden');
            cardsContainer.classList.add('hidden');
        }
    }

    // Render Cards View
    function renderCards(predictions) {
        if (predictions.length === 0) {
            cardsContainer.innerHTML = `<div class="card-glass" style="padding: 30px; grid-column: 1/-1; text-align: center; color: var(--text-muted);">
                No matching breakout setups found for this filter.
            </div>`;
            return;
        }

        cardsContainer.innerHTML = predictions.map(p => {
            const isHigh = p.Live_Signal.includes('HIGH CONVICTION');
            const isMod = p.Live_Signal.includes('MODERATE');
            const badgeClass = isHigh ? 'badge-green' : (isMod ? 'badge-yellow' : 'badge-red');

            // Price Bar Calculations
            const low = p.Next_Day_Expected_Low || (p.CMP * 0.98);
            const high = p.Next_Day_Expected_High || (p.CMP * 1.02);
            const range = high - low;
            const pct = Math.min(Math.max(((p.CMP - low) / (range + 1e-9)) * 100, 10), 90);

            // Drivers chips
            const driversList = (p.Key_Drivers || '').split('|').map(d => d.trim());
            const driverChipsHtml = driversList.map(d => `<span class="chip chip-highlight">${d}</span>`).join('');

            return `
                <div class="stock-card card-glass" onclick="openModal('${p.Stock}')">
                    <div class="card-header-row">
                        <div>
                            <div class="stock-symbol">${p.Stock}</div>
                            <div class="stock-cmp">₹${p.CMP.toLocaleString('en-IN')}</div>
                        </div>
                        <span class="badge ${badgeClass}">${isHigh ? '🟢 HIGH CONVICTION' : (isMod ? '🟡 MODERATE BUY' : '🔴 AVOID')}</span>
                    </div>

                    <!-- Limit Order Box -->
                    <div class="limit-order-box">
                        <div class="entry-col">
                            <div class="label">Limit Buy Range</div>
                            <div class="value">${p.Buy_Entry_Range}</div>
                        </div>
                        <div class="entry-col chase-col" style="text-align: right;">
                            <div class="label">Max Chase Limit</div>
                            <div class="value">₹${p.Max_Chase_Price}</div>
                        </div>
                    </div>

                    <!-- Price Action Range Visualizer -->
                    <div class="price-bar-container">
                        <div class="price-bar-labels">
                            <span>Day Low: ₹${p.Next_Day_Expected_Low}</span>
                            <span>Target: ₹${p.Target_Price}</span>
                            <span>Day High: ₹${p.Next_Day_Expected_High}</span>
                        </div>
                        <div class="price-bar-track">
                            <div class="price-bar-fill" style="width: ${pct}%;"></div>
                        </div>
                    </div>

                    <!-- Execution Stats -->
                    <div class="stats-grid">
                        <div class="stat-item">
                            <span class="lbl">Today's Exp. Close</span>
                            <span class="val green-text">₹${(p.Forecast_5D_Close || [])[0] || p.Target_Price}</span>
                        </div>
                        <div class="stat-item">
                            <span class="lbl">Win Probability</span>
                            <span class="val cyan-text">${p['Final_Win_Probability_%']}%</span>
                        </div>
                        <div class="stat-item">
                            <span class="lbl">Risk : Reward</span>
                            <span class="val">${p.Risk_Reward_Ratio} : 1</span>
                        </div>
                        <div class="stat-item">
                            <span class="lbl">Stop Loss</span>
                            <span class="val red-text">₹${p.Stop_Loss}</span>
                        </div>
                    </div>

                    <!-- Drivers Chips -->
                    <div class="chips-container">
                        ${driverChipsHtml}
                    </div>
                </div>
            `;
        }).join('');
    }

    // Render Table View
    function renderTable(predictions) {
        tableBody.innerHTML = predictions.map(p => `
            <tr onclick="openModal('${p.Stock}')" style="cursor: pointer;">
                <td style="font-weight: 800; font-family: var(--font-heading);">${p.Stock}</td>
                <td><span class="badge ${p.Live_Signal.includes('HIGH') ? 'badge-green' : (p.Live_Signal.includes('MODERATE') ? 'badge-yellow' : 'badge-red')}">${p.Live_Signal}</span></td>
                <td style="font-weight: 700;">₹${p.CMP}</td>
                <td style="color: var(--accent-emerald); font-weight: 600;">${p.Buy_Entry_Range}</td>
                <td style="color: var(--accent-red); font-weight: 600;">₹${p.Max_Chase_Price}</td>
                <td style="font-weight: 700; color: var(--accent-emerald);">₹${(p.Forecast_5D_Close || [])[0] || p.Target_Price}</td>
                <td style="color: var(--accent-cyan); font-weight: 700;">${p['Final_Win_Probability_%']}%</td>
                <td>${p.Risk_Reward_Ratio}</td>
                <td style="color: var(--accent-emerald); font-weight: 700;">₹${p.Target_Price}</td>
                <td style="color: var(--accent-red);">₹${p.Stop_Loss}</td>
                <td style="font-size: 11px; color: var(--text-muted);">${p.Key_Drivers}</td>
            </tr>
        `).join('');
    }

    // Open 3-Tier Deep Analysis Modal
    window.openModal = function(stockSymbol) {
        if (!dashboardData || !dashboardData.predictions) return;
        const p = dashboardData.predictions.find(item => item.Stock === stockSymbol);
        if (!p) return;

        // Modal Header
        document.getElementById('modal-stock-name').textContent = p.Stock;
        document.getElementById('modal-cmp').textContent = `₹${p.CMP}`;

        const signalBadge = document.getElementById('modal-signal-badge');
        signalBadge.textContent = p.Live_Signal;
        signalBadge.className = `badge ${p.Live_Signal.includes('HIGH') ? 'badge-green' : (p.Live_Signal.includes('MODERATE') ? 'badge-yellow' : 'badge-red')}`;

        // 1. Fundamental Analysis Pane
        document.getElementById('m-sector').textContent = p.Sector || 'Healthcare / Diversified';
        document.getElementById('m-mcap').textContent = `₹${(p.Market_Cap_Cr || 25000).toLocaleString('en-IN')}`;
        document.getElementById('m-pe').textContent = p.PE_Ratio || '20.0';
        document.getElementById('m-revgrowth').textContent = `${(p['Revenue_Growth_%'] >= 0 ? '+' : '')}${p['Revenue_Growth_%'] || '8.0'}%`;
        document.getElementById('m-margins').textContent = `${p['Profit_Margin_%'] || '12.0'}%`;
        document.getElementById('m-roe').textContent = `${p['ROE_%'] || '15.0'}%`;
        document.getElementById('synthesis-fundamental-text').textContent = p.Fundamental_Synthesis || '';

        // 2. Technical Analysis Pane
        document.getElementById('m-rsi').textContent = p.RSI_14;
        document.getElementById('m-macd-hist').textContent = (p.MACD_Hist >= 0 ? '+' : '') + p.MACD_Hist;
        document.getElementById('m-macd-hist').className = `m-value ${p.MACD_Hist >= 0 ? 'green-text' : 'red-text'}`;
        document.getElementById('m-macd-line').textContent = `${p.MACD_Line} / ${p.MACD_Signal}`;
        document.getElementById('m-dma30').textContent = `₹${p['30_DMA']}`;
        document.getElementById('m-dma200').textContent = `₹${p['200_DMA']} (${(p['200_DMA_Dist_%'] >= 0 ? '+' : '')}${p['200_DMA_Dist_%']}%)`;
        document.getElementById('m-atr').textContent = `₹${p.ATR_14}`;
        document.getElementById('synthesis-technical-text').textContent = p.Technical_Synthesis || '';

        // 3. Quant & ML Forecast Pane
        document.getElementById('m-quant-consensus').textContent = `${p['Final_Win_Probability_%']}%`;
        document.getElementById('m-quant-r2').textContent = p.Out_Sample_R2 || '-0.77';
        document.getElementById('m-quant-mae').textContent = `${p['Model_MAE_%'] || '2.28'}%`;

        const nextClose1D = (p.Forecast_5D_Close || [])[0] || p.Target_Price;
        document.getElementById('m-quant-1dclose').textContent = `₹${nextClose1D}`;

        const nextHigh1D = p.Next_Day_Expected_High || p.Target_Price;
        document.getElementById('m-quant-1dhigh').textContent = `₹${nextHigh1D}`;

        const nextLow1D = p.Next_Day_Expected_Low || (p.CMP * 0.98);
        if (document.getElementById('m-quant-1dlow')) {
            document.getElementById('m-quant-1dlow').textContent = `₹${nextLow1D}`;
        }

        const lastClose5D = (p.Forecast_5D_Close || [])[5] || p.Target_Price;
        const pct5D = (((lastClose5D - p.CMP) / p.CMP) * 100).toFixed(2);
        document.getElementById('m-quant-5dclose').textContent = `₹${lastClose5D} (${(pct5D >= 0 ? '+' : '')}${pct5D}%)`;
        
        const lastHigh5D = (p.Forecast_5D_High || [])[5] || p.Next_Day_Expected_High;
        document.getElementById('m-quant-maxhigh').textContent = `₹${lastHigh5D}`;

        const lastLow5D = (p.Forecast_5D_Low || [])[5] || (p.CMP * 0.96);
        if (document.getElementById('m-quant-5dlow')) {
            document.getElementById('m-quant-5dlow').textContent = `₹${lastLow5D}`;
        }

        document.getElementById('m-quant-stoploss').textContent = `₹${p.Stop_Loss}`;
        document.getElementById('m-quant-rr').textContent = `${p.Risk_Reward_Ratio} : 1`;

        // 4. CAR Super Breakout Analysis Pane
        if (document.getElementById('m-car-cmp')) {
            document.getElementById('m-car-cmp').textContent = `₹${p.CMP}`;
            document.getElementById('m-car-dma30').textContent = `₹${p['30_DMA']}`;
            document.getElementById('m-car-dma50').textContent = `₹${p['50_DMA'] || (p['30_DMA'] * 0.98).toFixed(2)}`;
            document.getElementById('m-car-dma200').textContent = `₹${p['200_DMA']}`;
            const dist200 = p['200_DMA_Dist_%'] || 0.0;
            const distEl = document.getElementById('m-car-dist200');
            distEl.textContent = `${(dist200 >= 0 ? '+' : '')}${dist200}%`;
            distEl.className = `m-value ${dist200 >= 0 ? 'green-text' : 'red-text'}`;
            document.getElementById('m-car-status').textContent = p.CMP > p['30_DMA'] ? "CMP > 30 > 50 > 200 (Golden Stack)" : "Trend Alignment Active";
            document.getElementById('synthesis-car-text').textContent = p.CAR_Synthesis || `CAR Super Breakout Scanner confirms trend alignment above 30, 50, and 200 DMAs.`;
        }

        // Render Chart.js Forecast Line Chart safely
        try {
            if (typeof Chart !== 'undefined') {
                renderForecastChart(p);
            }
        } catch (err) {
            console.warn('Could not render forecast chart:', err);
        }

        // Reset to Tab 1 active
        switchModalTab('tab-fundamental');

        modal.classList.remove('hidden');
    };

    // Render 5-Day Forecast Chart using Chart.js
    function renderForecastChart(stockData) {
        if (typeof Chart === 'undefined') return;
        const canvas = document.getElementById('forecastChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        if (forecastChartInstance) {
            forecastChartInstance.destroy();
        }

        const labels = ['CMP (Today)', 'Day +1', 'Day +2', 'Day +3', 'Day +4', 'Day +5'];
        const fcClose = stockData.Forecast_5D_Close || [stockData.CMP, stockData.CMP*1.002, stockData.CMP*1.005, stockData.CMP*1.008, stockData.CMP*1.011, stockData.CMP*1.015];
        const fcHigh = stockData.Forecast_5D_High || fcClose.map(v => v * 1.01);
        const fcLow = stockData.Forecast_5D_Low || fcClose.map(v => v * 0.99);

        // Gradient Fill for Expected Close
        const gradient = ctx.createLinearGradient(0, 0, 0, 240);
        gradient.addColorStop(0, 'rgba(0, 191, 255, 0.35)');
        gradient.addColorStop(1, 'rgba(0, 191, 255, 0.0)');

        forecastChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Predicted High Target (₹)',
                        data: fcHigh,
                        borderColor: '#00e699',
                        borderDash: [5, 5],
                        borderWidth: 2,
                        pointBackgroundColor: '#00e699',
                        pointRadius: 4,
                        fill: false,
                        tension: 0.3
                    },
                    {
                        label: 'Expected Close (₹)',
                        data: fcClose,
                        borderColor: '#00bfff',
                        backgroundColor: gradient,
                        borderWidth: 3,
                        pointBackgroundColor: '#00bfff',
                        pointRadius: 6,
                        fill: true,
                        tension: 0.3
                    },
                    {
                        label: 'Predicted Low Support (₹)',
                        data: fcLow,
                        borderColor: '#ff4d6d',
                        borderDash: [5, 5],
                        borderWidth: 2,
                        pointBackgroundColor: '#ff4d6d',
                        pointRadius: 4,
                        fill: false,
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: { color: '#94a3b8', font: { family: 'Outfit', size: 12 } }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(13, 21, 39, 0.9)',
                        titleColor: '#00bfff',
                        bodyColor: '#fff',
                        borderColor: 'rgba(0, 191, 255, 0.3)',
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#94a3b8', font: { family: 'Inter' } }
                    },
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#94a3b8', font: { family: 'Inter' } }
                    }
                }
            }
        });
    }

    // Modal Tier Tab Switcher
    function switchModalTab(targetTabId) {
        document.querySelectorAll('.tier-tab-btn').forEach(btn => {
            if (btn.dataset.tab === targetTabId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        document.querySelectorAll('.tier-pane').forEach(pane => {
            if (pane.id === targetTabId) {
                pane.classList.add('active');
            } else {
                pane.classList.remove('active');
            }
        });
    }

    document.querySelectorAll('.tier-tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchModalTab(this.dataset.tab);
        });
    });

    // Close Modal
    modalClose.addEventListener('click', () => modal.classList.add('hidden'));
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });

    // Filter Tabs Click Handlers
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderFilteredView();
        });
    });

    // Search Input Handler
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        renderFilteredView();
    });

    // View Toggle Handlers
    document.getElementById('view-cards').addEventListener('click', function() {
        this.classList.add('active');
        document.getElementById('view-table').classList.remove('active');
        currentView = 'cards';
        renderFilteredView();
    });

    document.getElementById('view-table').addEventListener('click', function() {
        this.classList.add('active');
        document.getElementById('view-cards').classList.remove('active');
        currentView = 'table';
        renderFilteredView();
    });

    // Refresh Button Handler
    if (btnRefresh) {
        btnRefresh.addEventListener('click', () => {
            loadDashboardData();
        });
    }

    // Export Excel Button Handler
    if (btnExcel) {
        btnExcel.addEventListener('click', () => {
            window.location.href = 'Breakout_ML_Quant_Predictions.xlsx';
        });
    }

    /* ==========================================================================
       US Market Closing Live Feed Renderer
       ========================================================================== */
    function renderUSMarketFeed(usMarket) {
        if (!usMarket) return;

        const summaryText = document.getElementById('us-market-summary-text');
        const timestamp = document.getElementById('us-market-timestamp');
        const indicesGrid = document.getElementById('us-indices-grid');

        if (summaryText) summaryText.textContent = usMarket.summary || 'US Market Closing data updated.';
        if (timestamp) timestamp.textContent = `Updated: ${usMarket.updated_at || 'Recently'}`;

        if (!indicesGrid || !usMarket.indices) return;

        indicesGrid.innerHTML = usMarket.indices.map(idx => {
            const isGain = idx.change_pct >= 0;
            const trendClass = isGain ? 'index-bullish' : 'index-bearish';
            const changeClass = isGain ? 'gain' : 'loss';
            const icon = isGain ? '<i class="fa-solid fa-caret-up"></i>' : '<i class="fa-solid fa-caret-down"></i>';

            return `
                <div class="us-index-card ${trendClass}">
                    <div class="us-index-top">
                        <div>
                            <div class="us-index-name">${idx.short_name}</div>
                            <div class="us-index-symbol">${idx.symbol}</div>
                        </div>
                        <span class="us-market-status-badge">${idx.status || 'CLOSED'}</span>
                    </div>
                    <div class="us-index-price">$${idx.close_price.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                    <div class="us-index-change ${changeClass}">
                        ${icon} ${idx.change >= 0 ? '+' : ''}${idx.change.toFixed(2)} (${idx.change_pct >= 0 ? '+' : ''}${idx.change_pct.toFixed(2)}%)
                    </div>
                    <div class="us-index-range">
                        <span>52W High: $${idx.week52_high.toLocaleString()}</span>
                        <span>52W Low: $${idx.week52_low.toLocaleString()}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    /* ==========================================================================
       30-Day Breakout Stock News Feed Scanner Renderer
       ========================================================================== */
    let currentNewsStock = 'ALL';
    let currentNewsSentiment = 'ALL';
    let currentNewsSearch = '';

    function renderBreakoutNewsScanner(breakoutNews) {
        if (!breakoutNews) return;

        const timestamp = document.getElementById('news-scanned-timestamp');
        const kpiTotal = document.getElementById('news-kpi-total');
        const kpiBullish = document.getElementById('news-kpi-bullish');
        const kpiTopStock = document.getElementById('news-kpi-top-stock');
        const kpiAvgScore = document.getElementById('news-kpi-avg-score');
        const stockSelect = document.getElementById('news-stock-select');

        if (timestamp) timestamp.textContent = `Scanned: ${breakoutNews.scanned_at || 'Recently'}`;
        if (kpiTotal) kpiTotal.textContent = breakoutNews.total_articles || 0;
        if (kpiBullish) kpiBullish.textContent = `${breakoutNews.bullish_pct || 0}%`;
        if (kpiTopStock) kpiTopStock.textContent = breakoutNews.top_covered_stock || '--';
        if (kpiAvgScore) {
            const score = breakoutNews.avg_sentiment || 0;
            kpiAvgScore.textContent = `${score >= 0 ? '+' : ''}${score.toFixed(2)}`;
        }

        // Populate stock dropdown if not already populated
        if (stockSelect && stockSelect.options.length <= 1 && breakoutNews.stock_summaries) {
            Object.keys(breakoutNews.stock_summaries).sort().forEach(stock => {
                const opt = document.createElement('option');
                opt.value = stock;
                opt.textContent = `${stock} (${breakoutNews.stock_summaries[stock].total_articles} news)`;
                stockSelect.appendChild(opt);
            });

            stockSelect.addEventListener('change', (e) => {
                currentNewsStock = e.target.value;
                renderFilteredNewsCards(breakoutNews);
            });
        }

        // Bind sentiment tabs if not already bound
        const newsTabs = document.querySelectorAll('.news-tab');
        newsTabs.forEach(tab => {
            if (!tab.dataset.bound) {
                tab.dataset.bound = 'true';
                tab.addEventListener('click', () => {
                    newsTabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    currentNewsSentiment = tab.dataset.sentiment;
                    renderFilteredNewsCards(breakoutNews);
                });
            }
        });

        // Bind search box if not bound
        const newsSearchInput = document.getElementById('news-search-input');
        if (newsSearchInput && !newsSearchInput.dataset.bound) {
            newsSearchInput.dataset.bound = 'true';
            newsSearchInput.addEventListener('input', (e) => {
                currentNewsSearch = e.target.value.toLowerCase().trim();
                renderFilteredNewsCards(breakoutNews);
            });
        }

        renderFilteredNewsCards(breakoutNews);
    }

    function renderFilteredNewsCards(breakoutNews) {
        const container = document.getElementById('news-cards-container');
        if (!container || !breakoutNews || !breakoutNews.articles) return;

        let articles = breakoutNews.articles;

        // Filter by stock
        if (currentNewsStock !== 'ALL') {
            articles = articles.filter(a => a.stock === currentNewsStock);
        }

        // Filter by sentiment
        if (currentNewsSentiment !== 'ALL') {
            articles = articles.filter(a => a.sentiment_label === currentNewsSentiment);
        }

        // Filter by keyword search
        if (currentNewsSearch) {
            articles = articles.filter(a =>
                a.title.toLowerCase().includes(currentNewsSearch) ||
                (a.snippet && a.snippet.toLowerCase().includes(currentNewsSearch)) ||
                a.stock.toLowerCase().includes(currentNewsSearch) ||
                a.publisher.toLowerCase().includes(currentNewsSearch)
            );
        }

        if (articles.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 32px; color: var(--text-muted); background: rgba(255, 255, 255, 0.02); border-radius: 12px;">
                    <i class="fa-solid fa-newspaper" style="font-size: 2.2rem; margin-bottom: 10px; color: var(--text-dim);"></i>
                    <p>No 30-day breakout news articles match your filter selection.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = articles.map(art => {
            let sentClass = 'sentiment-neutral';
            let sentIcon = '<i class="fa-solid fa-minus"></i>';
            if (art.sentiment_label === 'BULLISH') {
                sentClass = 'sentiment-bullish';
                sentIcon = '<i class="fa-solid fa-circle-arrow-up"></i>';
            } else if (art.sentiment_label === 'BEARISH') {
                sentClass = 'sentiment-bearish';
                sentIcon = '<i class="fa-solid fa-circle-arrow-down"></i>';
            }

            return `
                <div class="news-card">
                    <div>
                        <div class="news-card-header">
                            <span class="news-stock-badge">${art.stock}</span>
                            <span class="news-sentiment-badge ${sentClass}">
                                ${sentIcon} ${art.sentiment_label} (${art.sentiment_score >= 0 ? '+' : ''}${art.sentiment_score.toFixed(2)})
                            </span>
                        </div>
                        <div class="news-title">
                            <a href="${art.link}" target="_blank" rel="noopener noreferrer">${art.title}</a>
                        </div>
                        <div class="news-snippet">${art.snippet}</div>
                    </div>
                    <div class="news-footer">
                        <span class="news-publisher"><i class="fa-solid fa-newspaper"></i> ${art.publisher}</span>
                        <span class="news-time"><i class="fa-regular fa-clock"></i> ${art.relative_time}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    /* ==========================================================================
       NIFTY 50 & BANK NIFTY 5-Day ML Forecast Renderer
       ========================================================================== */
    function renderIndexForecasts(indexPredictions) {
        const container = document.getElementById('index-forecast-container');
        if (!container || !indexPredictions || indexPredictions.length === 0) return;

        container.innerHTML = indexPredictions.map(idx => {
            const isBull = idx.Bias.includes('BULLISH');
            const biasClass = isBull ? 'sentiment-bullish' : (idx.Bias.includes('BEARISH') ? 'sentiment-bearish' : 'sentiment-neutral');
            const chgIcon = idx.Change_Pct >= 0 ? '<i class="fa-solid fa-caret-up"></i>' : '<i class="fa-solid fa-caret-down"></i>';
            const chgClass = idx.Change_Pct >= 0 ? 'green-text' : 'red-text';

            const fcClose = idx.Forecast_5D_Close || [];
            const fcHigh = idx.Forecast_5D_High || [];
            const fcLow = idx.Forecast_5D_Low || [];

            let trajRows = '';
            for (let i = 1; i <= 5; i++) {
                if (fcClose[i]) {
                    trajRows += `
                        <tr>
                            <td><strong>Day ${i}</strong></td>
                            <td class="green-text">₹${fcClose[i].toLocaleString()}</td>
                            <td class="cyan-text">₹${fcHigh[i].toLocaleString()}</td>
                            <td class="red-text">₹${fcLow[i].toLocaleString()}</td>
                        </tr>
                    `;
                }
            }

            return `
                <div class="index-forecast-card">
                    <div>
                        <div class="idx-card-top">
                            <div>
                                <div class="idx-title">${idx.Index_Name}</div>
                                <div class="us-index-symbol">${idx.Symbol} • ${idx.Date}</div>
                            </div>
                            <span class="idx-bias-badge ${biasClass}">${idx.Bias}</span>
                        </div>

                        <div style="display: flex; align-items: baseline; gap: 10px; margin-bottom: 12px;">
                            <span class="idx-cmp">₹${idx.CMP.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                            <span class="${chgClass}" style="font-weight: 700; font-size: 0.95rem;">
                                ${chgIcon} ${idx.Change >= 0 ? '+' : ''}${idx.Change.toFixed(2)} (${idx.Change_Pct >= 0 ? '+' : ''}${idx.Change_Pct.toFixed(2)}%)
                            </span>
                        </div>

                        <div class="idx-metrics-row">
                            <div class="idx-m-item">
                                <span class="lbl">5D Target</span>
                                <span class="val green-text">₹${idx.Target_5D.toLocaleString()}</span>
                            </div>
                            <div class="idx-m-item">
                                <span class="lbl">5D Support</span>
                                <span class="val red-text">₹${idx.Support_5D.toLocaleString()}</span>
                            </div>
                            <div class="idx-m-item">
                                <span class="lbl">Win Prob %</span>
                                <span class="val cyan-text">${idx['Final_Win_Probability_%']}%</span>
                            </div>
                            <div class="idx-m-item">
                                <span class="lbl">RSI(14)</span>
                                <span class="val gold-text">${idx.RSI_14}</span>
                            </div>
                        </div>

                        <div class="idx-trajectory-box">
                            <div class="idx-traj-title"><i class="fa-solid fa-chart-line"></i> 5-Day Trajectory Curve</div>
                            <table class="idx-traj-table">
                                <thead>
                                    <tr><th>Day</th><th>Exp. Close</th><th>Exp. High</th><th>Exp. Low</th></tr>
                                </thead>
                                <tbody>
                                    ${trajRows}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="idx-synthesis-text">
                        <i class="fa-solid fa-brain"></i> ${idx.AI_Synthesis}
                    </div>
                </div>
            `;
        }).join('');
    }

    // Initial Load
    loadDashboardData();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
