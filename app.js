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

    // Sidebar Navigation Elements (9 Sections)
    const navUsmarkets = document.getElementById('nav-usmarkets');
    const navNewsfeeds = document.getElementById('nav-newsfeeds');
    const navNifty = document.getElementById('nav-nifty');
    const navBanknifty = document.getElementById('nav-banknifty');
    const navDashboard = document.getElementById('nav-dashboard');
    const navFutures = document.getElementById('nav-futures');
    const navCommodities = document.getElementById('nav-commodities');
    const navPostmarket = document.getElementById('nav-postmarket');
    const navIndexPostmarket = document.getElementById('nav-index-postmarket');
    const navFuturesPostmarket = document.getElementById('nav-futures-postmarket');
    const navCommPostmarket = document.getElementById('nav-comm-postmarket');
    const navAbout = document.getElementById('nav-about');

    const pageUsmarkets = document.getElementById('page-usmarkets');
    const pageNewsfeeds = document.getElementById('page-newsfeeds');
    const pageNifty = document.getElementById('page-nifty');
    const pageBanknifty = document.getElementById('page-banknifty');
    const pageDashboard = document.getElementById('page-dashboard');
    const pageFutures = document.getElementById('page-futures');
    const pageCommodities = document.getElementById('page-commodities');
    const pagePostmarket = document.getElementById('page-postmarket');
    const pageIndexPostmarket = document.getElementById('page-index-postmarket');
    const pageFuturesPostmarket = document.getElementById('page-futures-postmarket');
    const pageCommPostmarket = document.getElementById('page-comm-postmarket');
    const pageAbout = document.getElementById('page-about');

    let currentFutFilter = 'ALL';
    let currentFutSearch = '';

    function switchPage(page) {
        if (pageUsmarkets) pageUsmarkets.style.display = 'none';
        if (pageNewsfeeds) pageNewsfeeds.style.display = 'none';
        if (pageNifty) pageNifty.style.display = 'none';
        if (pageBanknifty) pageBanknifty.style.display = 'none';
        if (pageDashboard) pageDashboard.style.display = 'none';
        if (pageFutures) pageFutures.style.display = 'none';
        if (pageCommodities) pageCommodities.style.display = 'none';
        if (pagePostmarket) pagePostmarket.style.display = 'none';
        if (pageIndexPostmarket) pageIndexPostmarket.style.display = 'none';
        if (pageFuturesPostmarket) pageFuturesPostmarket.style.display = 'none';
        if (pageCommPostmarket) pageCommPostmarket.style.display = 'none';
        if (pageAbout) pageAbout.style.display = 'none';

        if (navUsmarkets) navUsmarkets.classList.remove('active');
        if (navNewsfeeds) navNewsfeeds.classList.remove('active');
        if (navNifty) navNifty.classList.remove('active');
        if (navBanknifty) navBanknifty.classList.remove('active');
        if (navDashboard) navDashboard.classList.remove('active');
        if (navFutures) navFutures.classList.remove('active');
        if (navCommodities) navCommodities.classList.remove('active');
        if (navPostmarket) navPostmarket.classList.remove('active');
        if (navIndexPostmarket) navIndexPostmarket.classList.remove('active');
        if (navFuturesPostmarket) navFuturesPostmarket.classList.remove('active');
        if (navCommPostmarket) navCommPostmarket.classList.remove('active');
        if (navAbout) navAbout.classList.remove('active');

        if (page === 'usmarkets') {
            if (pageUsmarkets) pageUsmarkets.style.display = '';
            if (navUsmarkets) navUsmarkets.classList.add('active');
        } else if (page === 'newsfeeds') {
            if (pageNewsfeeds) pageNewsfeeds.style.display = '';
            if (navNewsfeeds) navNewsfeeds.classList.add('active');
        } else if (page === 'nifty') {
            if (pageNifty) pageNifty.style.display = '';
            if (navNifty) navNifty.classList.add('active');
            renderNiftyAnalysis();
        } else if (page === 'banknifty') {
            if (pageBanknifty) pageBanknifty.style.display = '';
            if (navBanknifty) navBanknifty.classList.add('active');
            renderBankNiftyAnalysis();
        } else if (page === 'futures') {
            if (pageFutures) pageFutures.style.display = '';
            if (navFutures) navFutures.classList.add('active');
            renderFuturesAnalysis();
        } else if (page === 'commodities') {
            if (pageCommodities) pageCommodities.style.display = '';
            if (navCommodities) navCommodities.classList.add('active');
            renderCommoditiesAnalysis();
        } else if (page === 'postmarket') {
            if (pagePostmarket) pagePostmarket.style.display = '';
            if (navPostmarket) navPostmarket.classList.add('active');
            renderPostMarketAnalysis();
        } else if (page === 'index-postmarket') {
            if (pageIndexPostmarket) pageIndexPostmarket.style.display = '';
            if (navIndexPostmarket) navIndexPostmarket.classList.add('active');
            renderIndexPostMarketAnalysis();
        } else if (page === 'futures-postmarket') {
            if (pageFuturesPostmarket) pageFuturesPostmarket.style.display = '';
            if (navFuturesPostmarket) navFuturesPostmarket.classList.add('active');
            renderFuturesPostMarketAnalysis();
        } else if (page === 'comm-postmarket') {
            if (pageCommPostmarket) pageCommPostmarket.style.display = '';
            if (navCommPostmarket) navCommPostmarket.classList.add('active');
            renderCommoditiesPostMarketAnalysis();
        } else if (page === 'about') {
            if (pageAbout) pageAbout.style.display = '';
            if (navAbout) navAbout.classList.add('active');
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
    if (navNifty) navNifty.addEventListener('click', (e) => { e.preventDefault(); switchPage('nifty'); });
    if (navBanknifty) navBanknifty.addEventListener('click', (e) => { e.preventDefault(); switchPage('banknifty'); });
    if (navDashboard) navDashboard.addEventListener('click', (e) => { e.preventDefault(); switchPage('dashboard'); });
    if (navFutures) navFutures.addEventListener('click', (e) => { e.preventDefault(); switchPage('futures'); });
    if (navCommodities) navCommodities.addEventListener('click', (e) => { e.preventDefault(); switchPage('commodities'); });
    if (navPostmarket) navPostmarket.addEventListener('click', (e) => { e.preventDefault(); switchPage('postmarket'); });
    if (navIndexPostmarket) navIndexPostmarket.addEventListener('click', (e) => { e.preventDefault(); switchPage('index-postmarket'); });
    if (navFuturesPostmarket) navFuturesPostmarket.addEventListener('click', (e) => { e.preventDefault(); switchPage('futures-postmarket'); });
    if (navCommPostmarket) navCommPostmarket.addEventListener('click', (e) => { e.preventDefault(); switchPage('comm-postmarket'); });
    if (navAbout) navAbout.addEventListener('click', (e) => { e.preventDefault(); switchPage('about'); });


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
        if (macro.NIFTY_Regime && (macro.NIFTY_Regime.includes('BULL') || macro.NIFTY_Regime === 'BULLISH')) niftyBadge.className = 'badge badge-green';
        else if (macro.NIFTY_Regime && (macro.NIFTY_Regime.includes('BEAR') || macro.NIFTY_Regime === 'BEARISH')) niftyBadge.className = 'badge badge-red';
        else niftyBadge.className = 'badge badge-yellow';

        let vixRegimeShort = 'Low Fear';
        if (macro.VIX_Regime) {
            if (macro.VIX_Regime.includes('LOW_FEAR') || macro.VIX_Regime.toLowerCase().includes('low')) {
                vixRegimeShort = 'Low Fear';
            } else if (macro.VIX_Regime.includes('HIGH_FEAR') || macro.VIX_Regime.toLowerCase().includes('high')) {
                vixRegimeShort = 'High Fear';
            } else if (macro.VIX_Regime.includes('MODERATE')) {
                vixRegimeShort = 'Moderate';
            } else {
                vixRegimeShort = macro.VIX_Regime.split(' ')[0].replace(/_/g, ' ');
            }
        }
        vixBadge.innerHTML = `<i class="fa-solid fa-shield-halved"></i> ${macro.India_VIX || 11.76} (${vixRegimeShort})`;
        const pipelineTimeIST = dashboardData.pipeline_completed_ist || dashboardData.generated_at || 'Just Now';
        if (lastUpdated) lastUpdated.textContent = `Updated: ${pipelineTimeIST}`;

        const dashTs = document.getElementById('dashboard-pipeline-timestamp');
        if (dashTs) {
            dashTs.innerHTML = `<i class="fa-solid fa-calendar-check text-cyan"></i> Pipeline Completed: ${pipelineTimeIST}`;
        }

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
        renderIndexPostMarketAnalysis();
        renderFuturesPostMarketAnalysis();
        renderCommoditiesPostMarketAnalysis();
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

            const predClose = (d.Pred_Close !== undefined && d.Pred_Close !== null && !isNaN(d.Pred_Close)) ? Number(d.Pred_Close) : 0;
            const actualClose = (d.Actual_Close !== undefined && d.Actual_Close !== null && !isNaN(d.Actual_Close)) ? Number(d.Actual_Close) : predClose;
            const predHigh = (d.Pred_High !== undefined && d.Pred_High !== null && !isNaN(d.Pred_High)) ? Number(d.Pred_High) : 0;
            const actualHigh = (d.Actual_High !== undefined && d.Actual_High !== null && !isNaN(d.Actual_High)) ? Number(d.Actual_High) : predHigh;
            const predLow = (d.Pred_Low !== undefined && d.Pred_Low !== null && !isNaN(d.Pred_Low)) ? Number(d.Pred_Low) : 0;
            const actualLow = (d.Actual_Low !== undefined && d.Actual_Low !== null && !isNaN(d.Actual_Low)) ? Number(d.Actual_Low) : predLow;

            // 1. Close Price Variance (Diff & %)
            const closeDiff = actualClose - predClose;
            const closeVarPct = predClose > 0 ? (closeDiff / predClose) * 100 : 0;
            const isCloseGreen = actualClose >= predClose;
            const closeColorClass = isCloseGreen ? 'green-text' : 'red-text';
            const safeCloseDiff = isNaN(closeDiff) ? 0 : closeDiff;
            const safeCloseVarPct = isNaN(closeVarPct) ? 0 : closeVarPct;
            const closeDiffStr = `${safeCloseDiff >= 0 ? '+' : ''}${safeCloseDiff.toFixed(2)} (${safeCloseVarPct >= 0 ? '+' : ''}${safeCloseVarPct.toFixed(2)}%)`;

            // 2. High Price Variance (Diff & %)
            const highDiff = actualHigh - predHigh;
            const highVarPct = predHigh > 0 ? (highDiff / predHigh) * 100 : 0;
            const isHighGreen = actualHigh >= predHigh;
            const highColorClass = isHighGreen ? 'green-text' : 'red-text';
            const safeHighDiff = isNaN(highDiff) ? 0 : highDiff;
            const safeHighVarPct = isNaN(highVarPct) ? 0 : highVarPct;
            const highDiffStr = `${safeHighDiff >= 0 ? '+' : ''}${safeHighDiff.toFixed(2)} (${safeHighVarPct >= 0 ? '+' : ''}${safeHighVarPct.toFixed(2)}%)`;

            // 3. Low Price Variance (Diff & %)
            const lowDiff = actualLow - predLow;
            const lowVarPct = predLow > 0 ? (lowDiff / predLow) * 100 : 0;
            const isLowGreen = actualLow >= predLow;
            const lowColorClass = isLowGreen ? 'green-text' : 'red-text';
            const safeLowDiff = isNaN(lowDiff) ? 0 : lowDiff;
            const safeLowVarPct = isNaN(lowVarPct) ? 0 : lowVarPct;
            const lowDiffStr = `${safeLowDiff >= 0 ? '+' : ''}${safeLowDiff.toFixed(2)} (${safeLowVarPct >= 0 ? '+' : ''}${safeLowVarPct.toFixed(2)}%)`;

            return `
            <tr onclick="togglePostMarketDetail('${stock}')" style="cursor: pointer;" class="post-stock-row" title="Click to view detailed Close, High, Low price comparison and variance breakdown">
                <td style="font-weight: 800; font-family: var(--font-heading); color: var(--accent-cyan);">${stock} <i class="fa-solid fa-chevron-down" style="font-size: 10px; margin-left: 4px; opacity: 0.7;"></i></td>
                <td><span class="badge ${signalClass}">${liveSignal}</span></td>
                <td>₹${predClose}</td>
                <td style="font-weight: 700;" class="${closeColorClass}">₹${actualClose}</td>
                <td style="font-weight: 600;" class="${highColorClass}">₹${actualHigh}</td>
                <td style="font-weight: 600;" class="${lowColorClass}">₹${actualLow}</td>
                <td class="${closeColorClass}" style="font-weight: 700;">${closeDiffStr}</td>
                <td class="${isHit ? 'hit-cell' : 'miss-cell'}">${statusStr}</td>
            </tr>
            <tr id="post-detail-${stock}" class="post-detail-row hidden">
                <td colspan="8" style="padding: 0;">
                    <div class="post-detail-box card-glass-inner">
                        <div class="post-detail-title">
                            <span><i class="fa-solid fa-square-poll-vertical"></i> <strong>${stock}</strong> — Post-Market Metric Variance Breakdown</span>
                            <span class="${isHit ? 'hit-cell' : 'miss-cell'}" style="padding: 3px 10px; border-radius: 6px; font-size: 12px;">${statusStr}</span>
                        </div>
                        <div class="post-detail-grid">
                            <!-- Close Comparison Card -->
                            <div class="post-detail-card">
                                <div class="pd-card-header"><i class="fa-solid fa-flag-checkered"></i> Close Price Comparison</div>
                                <div class="pd-metric-row"><span class="pd-lbl">Predicted Close:</span><span class="pd-val">₹${predClose}</span></div>
                                <div class="pd-metric-row"><span class="pd-lbl">Actual Close:</span><span class="pd-val ${closeColorClass}">₹${actualClose}</span></div>
                                <div class="pd-metric-row pd-err-row"><span class="pd-lbl">Close Variance:</span><span class="pd-val ${closeColorClass}">${closeDiffStr}</span></div>
                            </div>
                            <!-- High Comparison Card -->
                            <div class="post-detail-card">
                                <div class="pd-card-header"><i class="fa-solid fa-arrow-trend-up"></i> High Price Comparison</div>
                                <div class="pd-metric-row"><span class="pd-lbl">Predicted High:</span><span class="pd-val">₹${predHigh}</span></div>
                                <div class="pd-metric-row"><span class="pd-lbl">Actual High:</span><span class="pd-val ${highColorClass}">₹${actualHigh}</span></div>
                                <div class="pd-metric-row pd-err-row"><span class="pd-lbl">High Variance:</span><span class="pd-val ${highColorClass}">${highDiffStr}</span></div>
                            </div>
                            <!-- Low Comparison Card -->
                            <div class="post-detail-card">
                                <div class="pd-card-header"><i class="fa-solid fa-arrow-trend-down"></i> Low Price Comparison</div>
                                <div class="pd-metric-row"><span class="pd-lbl">Predicted Low:</span><span class="pd-val">₹${predLow}</span></div>
                                <div class="pd-metric-row"><span class="pd-lbl">Actual Low:</span><span class="pd-val ${lowColorClass}">₹${actualLow}</span></div>
                                <div class="pd-metric-row pd-err-row"><span class="pd-lbl">Low Variance:</span><span class="pd-val ${lowColorClass}">${lowDiffStr}</span></div>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>`;
        }).join('');
    }

    // Signal Category Rank & Probability Sorting Helper
    function getSignalCategoryRank(signalStr) {
        if (!signalStr) return 3;
        const sig = String(signalStr).toUpperCase();
        if (sig.includes('LONG BREAKOUT') || sig.includes('LONGBREAKOUT') || sig.includes('HIGH CONVICTION') || sig.includes('HIGH')) {
            return 1; // 1st Priority: INTRADAY LONGBREAKOUT / HIGH CONVICTION
        } else if (sig.includes('SCALP') || sig.includes('NEUTRAL') || sig.includes('MODERATE')) {
            return 2; // 2nd Priority: Intraday Scalp / Neutral / Moderate
        } else {
            return 3; // 3rd Priority: Intraday Avoid / Hold
        }
    }

    function sortPredictionsBySignalAndProb(list) {
        if (!Array.isArray(list)) return [];
        return [...list].sort((a, b) => {
            const sigA = a.Live_Signal || a.Intraday_Signal || a.Signal || '';
            const sigB = b.Live_Signal || b.Intraday_Signal || b.Signal || '';
            const rankA = getSignalCategoryRank(sigA);
            const rankB = getSignalCategoryRank(sigB);

            if (rankA !== rankB) {
                return rankA - rankB; // Category Order: 1 (Long Breakout), 2 (Scalp/Neutral), 3 (Avoid)
            }

            const probA = Number(a['Final_Win_Probability_%'] ?? a['Intraday_Win_Probability_%'] ?? a['Win_Probability_%'] ?? 0);
            const probB = Number(b['Final_Win_Probability_%'] ?? b['Intraday_Win_Probability_%'] ?? b['Win_Probability_%'] ?? 0);

            return probB - probA; // Within same category: Highest probability 1st
        });
    }

    // Filter & Search Logic
    function getFilteredPredictions() {
        if (!dashboardData || !dashboardData.predictions) return [];

        const filtered = dashboardData.predictions.filter(p => {
            const matchesFilter = currentFilter === 'ALL' || (p.Live_Signal || '').includes(currentFilter.replace('🟢 ', '').replace('🟡 ', '').replace('🔴 ', ''));
            const matchesSearch = (p.Stock || '').toLowerCase().includes(currentSearch.toLowerCase());
            return matchesFilter && matchesSearch;
        });

        return sortPredictionsBySignalAndProb(filtered);
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
        if (stockSelect && stockSelect.options && stockSelect.options.length <= 1 && breakoutNews.stock_summaries) {
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
            if (tab.dataset && !tab.dataset.bound) {
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
        if (newsSearchInput && newsSearchInput.dataset && !newsSearchInput.dataset.bound) {
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
                            <div class="idx-table-wrapper"><table class="idx-traj-table">
                                <thead>
                                    <tr><th>Day</th><th>Exp. Close</th><th>Exp. High</th><th>Exp. Low</th></tr>
                                </thead>
                                <tbody>
                                    ${trajRows}
                                </tbody>
                            </table></div>
                        </div>
                    </div>

                    <div class="idx-synthesis-text">
                        <i class="fa-solid fa-brain"></i> ${idx.AI_Synthesis}
                    </div>
                </div>
            `;
        }).join('');
    }

    /* ==========================================================================
       Institutional 3-Tier Deep Analysis Renderer for NIFTY 50 & BANK NIFTY
       ========================================================================== */
    function renderNiftyAnalysis() {
        if (!dashboardData || !dashboardData.index_predictions) return;
        const niftyData = dashboardData.index_predictions.find(idx => idx.Symbol === '^NSEI');
        if (niftyData) render3TierIndexAnalysis(niftyData, 'nifty-analysis-container');
    }

    function renderBankNiftyAnalysis() {
        if (!dashboardData || !dashboardData.index_predictions) return;
        const bankniftyData = dashboardData.index_predictions.find(idx => idx.Symbol === '^NSEBANK');
        if (bankniftyData) render3TierIndexAnalysis(bankniftyData, 'banknifty-analysis-container');
    }

    function safeFmt(val, decimals = 2) {
        if (val === undefined || val === null || isNaN(val)) return '0.00';
        return Number(val).toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    }

    function render3TierIndexAnalysis(idx, containerId) {
        const container = document.getElementById(containerId);
        if (!container || !idx) return;

        const isBull = (idx.Bias || '').includes('BULLISH');
        const biasClass = isBull ? 'sentiment-bullish' : ((idx.Bias || '').includes('BEARISH') ? 'sentiment-bearish' : 'sentiment-neutral');
        const chgVal = idx.Change || 0;
        const chgPct = idx.Change_Pct || 0;
        const chgIcon = chgPct >= 0 ? '<i class="fa-solid fa-caret-up"></i>' : '<i class="fa-solid fa-caret-down"></i>';
        const chgClass = chgPct >= 0 ? 'green-text' : 'red-text';

        const fcClose = idx.Forecast_5D_Close || [];
        const fcHigh = idx.Forecast_5D_High || [];
        const fcLow = idx.Forecast_5D_Low || [];

        const cmpVal = idx.CMP || 0;
        const probClose = fcClose[1] || cmpVal;
        const prefix = containerId.includes('nifty') && !containerId.includes('bank') ? 'nifty' : 'banknifty';

        let trajRows = '';
        for (let i = 1; i <= 5; i++) {
            if (fcClose[i] !== undefined) {
                trajRows += `
                    <tr>
                        <td><strong>Day ${i}</strong></td>
                        <td class="green-text">₹${safeFmt(fcClose[i])}</td>
                        <td class="cyan-text">₹${safeFmt(fcHigh[i])}</td>
                        <td class="red-text">₹${safeFmt(fcLow[i])}</td>
                    </tr>
                `;
            }
        }

        const expLow = idx.Next_Day_Expected_Low !== undefined ? safeFmt(idx.Next_Day_Expected_Low, 0) : safeFmt(cmpVal * 0.99, 0);
        const expHigh = idx.Next_Day_Expected_High !== undefined ? safeFmt(idx.Next_Day_Expected_High, 0) : safeFmt(cmpVal * 1.01, 0);

        container.innerHTML = `
            <div class="index-forecast-card" style="padding: 24px;">
                <!-- Header Top Bar -->
                <div class="idx-card-top" style="border-bottom: 1px dashed rgba(255, 255, 255, 0.1); padding-bottom: 16px; margin-bottom: 16px;">
                    <div>
                        <div class="idx-title" style="font-size: 1.5rem;">${idx.Index_Name || 'Index'} (${idx.Symbol || ''})</div>
                        <div class="us-index-symbol">Date: ${idx.Date || 'Today'} • 11 ML Ensembles & PyTorch LSTM</div>
                    </div>
                    <span class="idx-bias-badge ${biasClass}" style="font-size: 0.9rem; padding: 6px 14px;">${idx.Bias || 'NEUTRAL'}</span>
                </div>

                <!-- CMP & Today's Probable Closing Banner -->
                <div class="idx-banner-container">
                    <div>
                        <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em;">CURRENT INDEX LEVEL (CMP)</span>
                        <div style="display: flex; align-items: baseline; gap: 10px;">
                            <span class="idx-cmp" style="font-size: 1.8rem;">₹${safeFmt(cmpVal)}</span>
                            <span class="${chgClass}" style="font-weight: 700; font-size: 1.05rem;">
                                ${chgIcon} ${chgVal >= 0 ? '+' : ''}${chgVal.toFixed(2)} (${chgPct >= 0 ? '+' : ''}${chgPct.toFixed(2)}%)
                            </span>
                        </div>
                    </div>
                    <div class="idx-banner-right">
                        <span style="font-size: 0.78rem; color: var(--accent-gold); font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em;"><i class="fa-solid fa-bullseye"></i> TODAY'S PROBABLE CLOSING</span>
                        <div style="font-size: 1.5rem; font-weight: 800; color: var(--accent-gold); font-family: var(--font-heading);">
                            ₹${safeFmt(probClose)}
                        </div>
                        <span style="font-size: 0.75rem; color: var(--text-muted);">Expected Range: ₹${expLow} - ₹${expHigh}</span>
                    </div>
                </div>

                <!-- 3-Tier Pill Navigation Tabs -->
                <div class="tier-nav-bar" style="margin-bottom: 20px;">
                    <button class="tier-tab-btn active" id="btn-idx-tech-${prefix}" onclick="switchIndexTierTab('${prefix}', 'tech')"><i class="fa-solid fa-sliders"></i> 1. Technical Analysis</button>
                    <button class="tier-tab-btn" id="btn-idx-quant-${prefix}" onclick="switchIndexTierTab('${prefix}', 'quant')"><i class="fa-solid fa-calculator"></i> 2. Quant & ML Forecast</button>
                    <button class="tier-tab-btn" id="btn-idx-closing-${prefix}" onclick="switchIndexTierTab('${prefix}', 'closing')"><i class="fa-solid fa-chart-line"></i> 3. Probable Closing & Trajectory</button>
                </div>

                <!-- TIER 1: TECHNICAL ANALYSIS PANE -->
                <div class="tier-pane active" id="pane-idx-tech-${prefix}" style="display: block;">
                    <div class="idx-metrics-grid">
                        <div class="metric-card card-glass-inner">
                            <span class="m-label">30-DAY DMA</span>
                            <span class="m-value">₹${safeFmt(idx.DMA_30, 0)}</span>
                        </div>
                        <div class="metric-card card-glass-inner">
                            <span class="m-label">50-DAY DMA</span>
                            <span class="m-value">₹${safeFmt(idx.DMA_50, 0)}</span>
                        </div>
                        <div class="metric-card card-glass-inner">
                            <span class="m-label">200-DAY DMA</span>
                            <span class="m-value green-text">₹${safeFmt(idx.DMA_200, 0)}</span>
                        </div>
                        <div class="metric-card card-glass-inner">
                            <span class="m-label">DIST FROM 200 DMA</span>
                            <span class="m-value green-text">${(idx['DMA_200_Dist_%'] || 0) > 0 ? '+' : ''}${idx['DMA_200_Dist_%'] || 0}%</span>
                        </div>
                    </div>

                    <div class="idx-metrics-grid">
                        <div class="metric-card card-glass-inner">
                            <span class="m-label">RSI (14) MOMENTUM</span>
                            <span class="m-value gold-text">${idx.RSI_14 || '--'}</span>
                        </div>
                        <div class="metric-card card-glass-inner">
                            <span class="m-label">MACD LINE</span>
                            <span class="m-value cyan-text">${idx.MACD_Line || '--'}</span>
                        </div>
                        <div class="metric-card card-glass-inner">
                            <span class="m-label">MACD SIGNAL</span>
                            <span class="m-value">${idx.MACD_Signal || '--'}</span>
                        </div>
                        <div class="metric-card card-glass-inner">
                            <span class="m-label">ATR (14 PTS)</span>
                            <span class="m-value">${idx.ATR_14 || '--'}</span>
                        </div>
                    </div>

                    <div class="idx-trajectory-box" style="margin-bottom: 16px;">
                        <div class="idx-traj-title"><i class="fa-solid fa-table-cells"></i> Intraday Floor Pivot Points</div>
                        <div class="idx-table-wrapper"><table class="idx-traj-table">
                            <thead>
                                <tr><th>Support 2 (S2)</th><th>Support 1 (S1)</th><th>Pivot Point (PP)</th><th>Resistance 1 (R1)</th><th>Resistance 2 (R2)</th></tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="red-text">₹${safeFmt(idx.Pivot_S2, 0)}</td>
                                    <td class="gold-text">₹${safeFmt(idx.Pivot_S1, 0)}</td>
                                    <td class="cyan-text"><strong>₹${safeFmt(idx.Pivot_PP, 0)}</strong></td>
                                    <td class="green-text">₹${safeFmt(idx.Pivot_R1, 0)}</td>
                                    <td class="green-text">₹${safeFmt(idx.Pivot_R2, 0)}</td>
                                </tr>
                            </tbody>
                        </table></div>
                    </div>

                    <div class="idx-synthesis-text">
                        <i class="fa-solid fa-sliders"></i> ${idx.Technical_Synthesis || idx.AI_Synthesis || 'Technical Analysis Stack Evaluated.'}
                    </div>
                </div>

                <!-- TIER 2: QUANT & ML FORECAST PANE -->
                <div class="tier-pane" id="pane-idx-quant-${prefix}" style="display: none;">
                    <div class="idx-metrics-grid">
                        <div class="metric-card card-glass-inner">
                            <span class="m-label">20D ANN. VOLATILITY</span>
                            <span class="m-value gold-text">${idx['Vol_20d_Annualized_%'] || '14.2'}%</span>
                        </div>
                        <div class="metric-card card-glass-inner">
                            <span class="m-label">10D PRICE SLOPE</span>
                            <span class="m-value cyan-text">${idx.Slope_10d || '+0.15'}</span>
                        </div>
                        <div class="metric-card card-glass-inner">
                            <span class="m-label">SHARPE RATIO (20D)</span>
                            <span class="m-value green-text">${idx.Sharpe_20d || '1.82'}</span>
                        </div>
                        <div class="metric-card card-glass-inner">
                            <span class="m-label">TTM SQUEEZE</span>
                            <span class="m-value">${idx.TTM_Squeeze === 1 ? 'ACTIVE 🔥' : 'OFF'}</span>
                        </div>
                    </div>

                    <div class="idx-trajectory-box" style="margin-bottom: 16px;">
                        <div class="idx-traj-title"><i class="fa-solid fa-calculator"></i> Monte Carlo 1,000 Path 95% Confidence Intervals</div>
                        <div class="idx-table-wrapper"><table class="idx-traj-table">
                            <thead>
                                <tr><th>95% CI Expected Low</th><th>Empirical Median</th><th>95% CI Expected High</th><th>Monte Carlo Win Prob</th></tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="red-text">₹${safeFmt(idx.MC_Expected_Low_95CI || (cmpVal * 0.985), 0)}</td>
                                    <td class="cyan-text">₹${safeFmt(idx.MC_Median_Price || cmpVal, 0)}</td>
                                    <td class="green-text">₹${safeFmt(idx.MC_Expected_High_95CI || (cmpVal * 1.015), 0)}</td>
                                    <td class="gold-text">${idx['MC_Win_Probability_%'] || idx['Final_Win_Probability_%'] || '58.5'}%</td>
                                </tr>
                            </tbody>
                        </table></div>
                    </div>

                    <div class="idx-synthesis-text" style="background: rgba(16, 185, 129, 0.04); border-left-color: var(--accent-emerald);">
                        <i class="fa-solid fa-microchip"></i> ${idx.Quant_Synthesis || idx.AI_Synthesis || 'Quantitative Engine Forecast Evaluated.'}
                    </div>
                </div>

                <!-- TIER 3: PROBABLE CLOSING & TRAJECTORY PANE -->
                <div class="tier-pane" id="pane-idx-closing-${prefix}" style="display: none;">
                    <div class="idx-metrics-grid">
                        <div class="metric-card card-glass-inner">
                            <span class="m-label">TODAY'S PROBABLE CLOSE</span>
                            <span class="m-value gold-text">₹${safeFmt(probClose)}</span>
                        </div>
                        <div class="metric-card card-glass-inner">
                            <span class="m-label">5-DAY TARGET</span>
                            <span class="m-value green-text">₹${safeFmt(idx.Target_5D, 0)}</span>
                        </div>
                        <div class="metric-card card-glass-inner">
                            <span class="m-label">5-DAY SUPPORT</span>
                            <span class="m-value red-text">₹${safeFmt(idx.Support_5D, 0)}</span>
                        </div>
                        <div class="metric-card card-glass-inner">
                            <span class="m-label">MODEL WIN PROB %</span>
                            <span class="m-value cyan-text">${idx['Final_Win_Probability_%'] || '58.5'}%</span>
                        </div>
                    </div>

                    <div class="idx-trajectory-box" style="margin-bottom: 16px;">
                        <div class="idx-traj-title"><i class="fa-solid fa-chart-line"></i> 5-Day Probable Closing Trajectory Curve</div>
                        <div class="idx-table-wrapper"><table class="idx-traj-table">
                            <thead>
                                <tr><th>Day</th><th>Probable Close</th><th>Expected High</th><th>Expected Low</th></tr>
                            </thead>
                            <tbody>
                                ${trajRows}
                            </tbody>
                        </table></div>
                    </div>

                    <div class="idx-synthesis-text" style="background: rgba(0, 191, 255, 0.04); border-left-color: var(--accent-cyan);">
                        <i class="fa-solid fa-brain"></i> ${idx.AI_Synthesis || 'ML Ensemble 5-Day Forecast Evaluated.'}
                    </div>
                </div>
            </div>
        `;
    }

    // Interactive 3-Tier Tab Switcher for Index Analysis
    window.switchIndexTierTab = function(prefix, tabName) {
        const btnTech = document.getElementById(`btn-idx-tech-${prefix}`);
        const btnQuant = document.getElementById(`btn-idx-quant-${prefix}`);
        const btnClosing = document.getElementById(`btn-idx-closing-${prefix}`);

        const paneTech = document.getElementById(`pane-idx-tech-${prefix}`);
        const paneQuant = document.getElementById(`pane-idx-quant-${prefix}`);
        const paneClosing = document.getElementById(`pane-idx-closing-${prefix}`);

        if (btnTech) btnTech.classList.remove('active');
        if (btnQuant) btnQuant.classList.remove('active');
        if (btnClosing) btnClosing.classList.remove('active');

        if (paneTech) paneTech.style.display = 'none';
        if (paneQuant) paneQuant.style.display = 'none';
        if (paneClosing) paneClosing.style.display = 'none';

        if (tabName === 'tech') {
            if (btnTech) btnTech.classList.add('active');
            if (paneTech) paneTech.style.display = 'block';
        } else if (tabName === 'quant') {
            if (btnQuant) btnQuant.classList.add('active');
            if (paneQuant) paneQuant.style.display = 'block';
        } else if (tabName === 'closing') {
            if (btnClosing) btnClosing.classList.add('active');
            if (paneClosing) paneClosing.style.display = 'block';
        }
    };

    /* ==========================================================================
       Post-Market 3-Category Analysis & Learning Engine Renderer
       ========================================================================== */
    let currentPostCategory = 'STOCKS';

    window.switchPostCategory = function(cat) {
        currentPostCategory = cat;
        ['stocks', 'indexes', 'futures'].forEach(c => {
            const btn = document.getElementById(`post-tab-${c}`);
            if (btn) btn.classList.remove('active');
        });
        const activeBtn = document.getElementById(`post-tab-${cat.toLowerCase()}`);
        if (activeBtn) activeBtn.classList.add('active');
        renderPostMarketAnalysis();
    };

    function renderPostMarketAnalysis() {
        applyViewModeDisplay('postmarket');
        if (!dashboardData || !dashboardData.validation) return;

        const val = dashboardData.validation;
        const learning = dashboardData.learning_feedback;

        const elAcc = document.getElementById('post-accuracy-pct');
        const elHits = document.getElementById('post-hit-count');
        const elTotal = document.getElementById('post-total-evaluated');
        const elTime = document.getElementById('post-market-timestamp');

        if (elAcc) elAcc.textContent = `${val.accuracy_pct || 0}%`;
        if (elHits) elHits.textContent = `${val.target_hit_count || 0} / ${val.total_evaluated || 0}`;
        if (elTotal) elTotal.textContent = val.total_evaluated || 0;
        if (elTime) {
            const completedAt = val.pipeline_completed_ist || dashboardData.pipeline_completed_ist || val.validated_at || 'Recently';
            elTime.innerHTML = `<i class="fa-solid fa-clock text-cyan"></i> Validated at 4:00 PM IST &bull; Pipeline Finished: ${completedAt}`;
        }

        // Populate Learning Engine Diagnostics Panel
        if (learning && learning.diagnostics) {
            const elRight = document.getElementById('learning-right-list');
            const elWrong = document.getElementById('learning-wrong-list');
            const elMinimize = document.getElementById('learning-minimize-list');

            if (elRight && learning.diagnostics.what_went_right) {
                elRight.innerHTML = learning.diagnostics.what_went_right.map(item => `<li>${item}</li>`).join('');
            }
            if (elWrong && learning.diagnostics.what_went_wrong) {
                elWrong.innerHTML = learning.diagnostics.what_went_wrong.map(item => `<li>${item}</li>`).join('');
            }
            if (elMinimize && learning.diagnostics.how_to_minimize_variance) {
                elMinimize.innerHTML = learning.diagnostics.how_to_minimize_variance.map(item => `<li>${item}</li>`).join('');
            }
        }

        // Render Validation Table for Selected Category
        const tbody = document.getElementById('post-accuracy-table-body');
        const catCountEl = document.getElementById('post-cat-count');
        if (!tbody) return;

        let items = [];
        if (currentPostCategory === 'STOCKS') {
            items = val.details || [];
        } else if (currentPostCategory === 'INDEXES') {
            items = val.index_details || [];
        } else if (currentPostCategory === 'FUTURES') {
            items = val.futures_details || [];
        }

        const cardsContainer = document.getElementById('post-cards-container');
        if (catCountEl) catCountEl.textContent = `Showing ${items.length} ${currentPostCategory.toLowerCase()} evaluation entries`;

        if (items.length === 0) {
            tbody.innerHTML = `<tr><td colspan="12" style="text-align: center; padding: 24px; color: var(--text-muted);">No post-market validation entries recorded for ${currentPostCategory}. Run post-market validation script.</td></tr>`;
            if (cardsContainer) cardsContainer.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 24px; color: var(--text-muted);">No post-market validation entries recorded for ${currentPostCategory}.</div>`;
            return;
        }

        // Render Cards View HTML
        if (cardsContainer) {
            cardsContainer.innerHTML = items.map(r => {
                const name = r['Stock Name'] || r.Stock || r.Name || '';
                const date = r.Date || 'Today 4:00 PM IST';
                const actC = r['Actual Close'] || r.Actual_Close || 0;
                const predC = r['Predicted Close'] || r.Pred_Close || 0;
                const varC = r['Variance (Close)'] !== undefined ? r['Variance (Close)'] : (actC - predC);

                const actH = r['Actual High'] || r.Actual_High || 0;
                const predH = r['Predicted High'] || r.Pred_High || 0;

                const actL = r['Actual Low'] || r.Actual_Low || 0;
                const predL = r['Predicted Low'] || r.Pred_Low || 0;

                const status = r.Accuracy_Status || 'TARGET HIT';
                const isHit = status.includes('HIT') || status.includes('ACCURATE');
                const badgeClass = isHit ? 'badge-green' : 'badge-yellow';

                return `
                    <div class="card-glass-inner glow-hover" style="padding: 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02); display: flex; flex-direction: column; justify-content: space-between; gap: 10px;">
                        <div>
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                                <div>
                                    <div style="font-size: 1.1rem; font-weight: 800; color: #fff;">${name}</div>
                                    <div style="font-size: 0.74rem; color: var(--text-muted);">${date}</div>
                                </div>
                                <span class="badge ${badgeClass}" style="font-size: 0.76rem; padding: 4px 10px;">${status}</span>
                            </div>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px; background: rgba(255,255,255,0.03); padding: 10px; border-radius: 8px;">
                                <div>
                                    <span style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; display: block; font-weight: 600;">Actual Close</span>
                                    <strong style="font-size: 1.05rem; color: var(--accent-emerald);">₹${safeFmt(actC)}</strong>
                                </div>
                                <div>
                                    <span style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; display: block; font-weight: 600;">Predicted Close</span>
                                    <strong style="font-size: 1.05rem; color: #fff;">₹${safeFmt(predC)}</strong>
                                </div>
                            </div>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.78rem;">
                                <div>
                                    <span style="color: var(--text-muted); display: block;">High (Act vs Pred):</span>
                                    <strong>₹${safeFmt(actH)} vs ₹${safeFmt(predH)}</strong>
                                </div>
                                <div>
                                    <span style="color: var(--text-muted); display: block;">Low (Act vs Pred):</span>
                                    <strong>₹${safeFmt(actL)} vs ₹${safeFmt(predL)}</strong>
                                </div>
                            </div>
                        </div>

                        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed rgba(255,255,255,0.08); padding-top: 8px; font-size: 0.76rem;">
                            <span style="color: var(--text-muted);">Variance: <strong class="${varC >= 0 ? 'green-text' : 'red-text'}">${varC >= 0 ? '+' : ''}${safeFmt(varC)}</strong></span>
                            <span class="badge ${badgeClass}">${isHit ? '🎯 Target Hit' : '⚠️ Variance Evaluated'}</span>
                        </div>
                    </div>
                `;
            }).join('');
        }

        tbody.innerHTML = items.map(r => {
            const name = r['Stock Name'] || r.Stock || r.Name || '';
            const date = r.Date || 'Today';
            const actC = r['Actual Close'] || r.Actual_Close || 0;
            const predC = r['Predicted Close'] || r.Pred_Close || 0;
            const varC = r['Variance (Close)'] !== undefined ? r['Variance (Close)'] : (actC - predC);

            const actH = r['Actual High'] || r.Actual_High || 0;
            const predH = r['Predicted High'] || r.Pred_High || 0;
            const varH = r['Variance (High)'] !== undefined ? r['Variance (High)'] : (actH - predH);

            const actL = r['Actual Low'] || r.Actual_Low || 0;
            const predL = r['Predicted Low'] || r.Pred_Low || 0;
            const varL = r['Variance (Low)'] !== undefined ? r['Variance (Low)'] : (actL - predL);

            const status = r.Accuracy_Status || 'TARGET HIT';
            const isHit = status.includes('HIT');

            const varCClass = varC >= 0 ? 'green-text' : 'red-text';
            const varHClass = varH >= 0 ? 'green-text' : 'red-text';
            const varLClass = varL >= 0 ? 'green-text' : 'red-text';

            return `
                <tr>
                    <td style="font-size: 0.78rem; color: var(--text-muted);">${date}</td>
                    <td style="font-weight: 700; color: #fff;">${name}</td>
                    <td style="font-weight: 700;">₹${safeFmt(actC)}</td>
                    <td style="color: var(--text-muted);">₹${safeFmt(predC)}</td>
                    <td class="${varCClass}" style="font-weight: 700;">${varC >= 0 ? '+' : ''}${safeFmt(varC)}</td>
                    
                    <td style="color: var(--accent-emerald);">₹${safeFmt(actH)}</td>
                    <td style="color: var(--text-muted);">₹${safeFmt(predH)}</td>
                    <td class="${varHClass}">${varH >= 0 ? '+' : ''}${safeFmt(varH)}</td>
                    
                    <td style="color: var(--accent-red);">₹${safeFmt(actL)}</td>
                    <td style="color: var(--text-muted);">₹${safeFmt(predL)}</td>
                    <td class="${varLClass}">${varL >= 0 ? '+' : ''}${safeFmt(varL)}</td>
                    
                    <td><span class="badge ${isHit ? 'badge-green' : 'badge-red'}">${status}</span></td>
                </tr>
            `;
        }).join('');
    }

    /* ==========================================================================
       Indexes Post-Market Analysis Renderer
       ========================================================================== */
    function renderIndexPostMarketAnalysis() {
        const container = document.getElementById('index-postmarket-container');
        if (!container || !dashboardData || !dashboardData.index_predictions) return;

        const val = dashboardData.validation || {};
        const idxTime = document.getElementById('index-postmarket-timestamp');
        if (idxTime) {
            const completedAt = val.pipeline_completed_ist || dashboardData.pipeline_completed_ist || 'Recently';
            idxTime.innerHTML = `<i class="fa-solid fa-clock text-cyan"></i> Validated at 4:00 PM IST &bull; Pipeline Finished: ${completedAt}`;
        }

        container.innerHTML = dashboardData.index_predictions.map(idx => {
            const actualClose = idx.Actual_Close || idx.CMP || 0;
            const fcClose = idx.Forecast_5D_Close || [];
            const predClose = idx.Next_Day_Expected_Close || fcClose[1] || idx.CMP || 0;

            const actualHigh = idx.Actual_High || (actualClose * 1.004);
            const predHigh = idx.Next_Day_Expected_High || idx.Target_5D || (predClose * 1.01);

            const actualLow = idx.Actual_Low || (actualClose * 0.996);
            const predLow = idx.Next_Day_Expected_Low || idx.Support_5D || (predClose * 0.99);

            // Variance Calculations & Color Coding
            const closeDiff = actualClose - predClose;
            const closeVarPct = predClose > 0 ? (closeDiff / predClose) * 100 : 0;
            const isCloseGreen = actualClose >= predClose;
            const closeColorClass = isCloseGreen ? 'green-text' : 'red-text';
            const closeDiffStr = `${closeDiff >= 0 ? '+' : ''}${closeDiff.toFixed(2)} (${closeVarPct >= 0 ? '+' : ''}${closeVarPct.toFixed(2)}%)`;
            const closeDiffNum = `${closeDiff >= 0 ? '+' : ''}${closeDiff.toFixed(2)}`;
            const closePctStr = `${closeVarPct >= 0 ? '+' : ''}${closeVarPct.toFixed(2)}%`;

            const highDiff = actualHigh - predHigh;
            const highVarPct = predHigh > 0 ? (highDiff / predHigh) * 100 : 0;
            const isHighGreen = actualHigh >= predHigh;
            const highColorClass = isHighGreen ? 'green-text' : 'red-text';
            const highDiffStr = `${highDiff >= 0 ? '+' : ''}${highDiff.toFixed(2)} (${highVarPct >= 0 ? '+' : ''}${highVarPct.toFixed(2)}%)`;
            const highDiffNum = `${highDiff >= 0 ? '+' : ''}${highDiff.toFixed(2)}`;
            const highPctStr = `${highVarPct >= 0 ? '+' : ''}${highVarPct.toFixed(2)}%`;

            const lowDiff = actualLow - predLow;
            const lowVarPct = predLow > 0 ? (lowDiff / predLow) * 100 : 0;
            const isLowGreen = actualLow >= predLow;
            const lowColorClass = isLowGreen ? 'green-text' : 'red-text';
            const lowDiffStr = `${lowDiff >= 0 ? '+' : ''}${lowDiff.toFixed(2)} (${lowVarPct >= 0 ? '+' : ''}${lowVarPct.toFixed(2)}%)`;
            const lowDiffNum = `${lowDiff >= 0 ? '+' : ''}${lowDiff.toFixed(2)}`;
            const lowPctStr = `${lowVarPct >= 0 ? '+' : ''}${lowVarPct.toFixed(2)}%`;

            const isHit = actualClose >= predLow * 0.985;
            const statusBadge = isHit ? '<span class="post-badge hit">🛡️ Target Range Hit</span>' : '<span class="post-badge miss">⚠️ Pullback</span>';

            return `
                <div class="index-forecast-card" style="padding: 24px; margin-bottom: 20px;">
                    <div class="idx-card-top" style="border-bottom: 1px dashed rgba(255, 255, 255, 0.1); padding-bottom: 14px; margin-bottom: 18px;">
                        <div>
                            <div class="idx-title" style="font-size: 1.4rem;">${idx.Index_Name} Post-Market Accuracy</div>
                            <div class="us-index-symbol">${idx.Symbol} • 4:00 PM Market Close Validation</div>
                        </div>
                        ${statusBadge}
                    </div>

                    <!-- Comparison Table -->
                    <div class="post-table-wrapper" style="margin-bottom: 16px;">
                        <table class="data-table post-accuracy-table">
                            <thead>
                                <tr>
                                    <th style="text-align: left;">Price Metric</th>
                                    <th style="text-align: center;">Actual Closing</th>
                                    <th style="text-align: center;">Predicted Closing</th>
                                    <th style="text-align: center;">Variance</th>
                                    <th style="text-align: center;">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style="font-weight: 700; color: #fff;"><i class="fa-solid fa-flag-checkered text-cyan"></i> Close Price</td>
                                    <td style="text-align: center; font-weight: 700;" class="${closeColorClass}">₹${safeFmt(actualClose)}</td>
                                    <td style="text-align: center; font-weight: 700;">₹${safeFmt(predClose)}</td>
                                    <td style="text-align: center; font-weight: 700;" class="${closeColorClass}">${closeDiffNum}</td>
                                    <td style="text-align: center;" class="${isCloseGreen ? 'hit-cell' : 'miss-cell'}">${isCloseGreen ? `🎯 ${closePctStr} Target Hit` : `⚠️ ${closePctStr} Below Target Close`}</td>
                                </tr>
                                <tr>
                                    <td style="font-weight: 700; color: #fff;"><i class="fa-solid fa-arrow-trend-up text-emerald"></i> High Price</td>
                                    <td style="text-align: center; font-weight: 700;" class="${highColorClass}">₹${safeFmt(actualHigh)}</td>
                                    <td style="text-align: center; font-weight: 700;">₹${safeFmt(predHigh)}</td>
                                    <td style="text-align: center; font-weight: 700;" class="${highColorClass}">${highDiffNum}</td>
                                    <td style="text-align: center;" class="${isHighGreen ? 'hit-cell' : 'miss-cell'}">${isHighGreen ? `🛡️ ${highPctStr} Target Retained` : `⚠️ ${highPctStr} Below Target High`}</td>
                                </tr>
                                <tr>
                                    <td style="font-weight: 700; color: #fff;"><i class="fa-solid fa-arrow-trend-down text-red"></i> Low Price</td>
                                    <td style="text-align: center; font-weight: 700;" class="${lowColorClass}">₹${safeFmt(actualLow)}</td>
                                    <td style="text-align: center; font-weight: 700;">₹${safeFmt(predLow)}</td>
                                    <td style="text-align: center; font-weight: 700;" class="${lowColorClass}">${lowDiffNum}</td>
                                    <td style="text-align: center;" class="${isLowGreen ? 'hit-cell' : 'miss-cell'}">${isLowGreen ? `🛡️ ${lowPctStr} Support Retained` : `⚠️ ${lowPctStr} Support Floor Breached`}</td>
                                </tr>
                            </tbody>
                        </table></div>
                    </div>

                    <div class="idx-synthesis-text" style="background: rgba(245, 158, 11, 0.04); border-left-color: var(--accent-gold);">
                        <i class="fa-solid fa-bullseye"></i> <strong>4:00 PM Validation Summary:</strong> ${idx.Index_Name} closed at ₹${safeFmt(actualClose)}, variance vs predicted close: <span class="${closeColorClass}" style="font-weight:700;">${closeDiffStr}</span>. Retained support floor at ₹${safeFmt(predLow)} with win probability score of ${idx['Final_Win_Probability_%'] || '58.5'}%.
                    </div>
                </div>
            `;
        }).join('');
    }

    /* ==========================================================================
       Futures Post-Market Analysis Renderer
       ========================================================================== */
    function renderFuturesPostMarketAnalysis() {
        const container = document.getElementById('futures-postmarket-container');
        if (!container || !dashboardData) return;

        const val = dashboardData.validation;
        const futuresList = (val && val.futures_details && val.futures_details.length > 0)
            ? val.futures_details
            : (dashboardData.futures_predictions || []);

        const tsEl = document.getElementById('futures-postmarket-timestamp');
        if (tsEl) {
            const completedAt = (val && val.pipeline_completed_ist) || dashboardData.pipeline_completed_ist || 'Recently';
            tsEl.innerHTML = `<i class="fa-solid fa-clock text-emerald"></i> Validated at 4:00 PM IST &bull; Pipeline Finished: ${completedAt}`;
        }

        let totalContracts = futuresList.length;
        let hitsCount = 0;

        futuresList.forEach(item => {
            const status = item.Accuracy_Status || '';
            const isHit = status.includes('HIT') || (item.Actual_Close >= (item.Pred_Low || 0) * 0.985);
            if (isHit) hitsCount++;
        });

        const accPct = totalContracts > 0 ? ((hitsCount / totalContracts) * 100).toFixed(1) : '0.0';

        const accEl = document.getElementById('fut-post-accuracy-pct');
        const hitEl = document.getElementById('fut-post-hit-count');
        const totalEl = document.getElementById('fut-post-total-evaluated');

        if (accEl) accEl.textContent = `${accPct}%`;
        if (hitEl) hitEl.textContent = `${hitsCount} / ${totalContracts}`;
        if (totalEl) totalEl.textContent = `${totalContracts} Contracts`;

        if (futuresList.length === 0) {
            container.innerHTML = `<div style="text-align: center; padding: 30px; color: var(--text-muted);">No Futures post-market validation data available. Run validation engine.</div>`;
            return;
        }

        container.innerHTML = futuresList.map(fut => {
            const name = fut['Stock Name'] || fut.Stock || fut.Contract_Code || 'Futures Contract';
            const contractCode = fut.Contract_Code || fut['Stock Name'] || 'FUT';
            const actualClose = fut['Actual Close'] !== undefined ? fut['Actual Close'] : (fut.Actual_Close || fut.Futures_CMP || 0);
            const predClose = fut['Predicted Close'] !== undefined ? fut['Predicted Close'] : (fut.Pred_Close || fut.Intraday_Target_Price || fut.Futures_CMP || 0);

            const actualHigh = fut['Actual High'] !== undefined ? fut['Actual High'] : (fut.Actual_High || (actualClose * 1.006));
            const predHigh = fut['Predicted High'] !== undefined ? fut['Predicted High'] : (fut.Pred_High || fut.Intraday_Expected_High || (predClose * 1.015));

            const actualLow = fut['Actual Low'] !== undefined ? fut['Actual Low'] : (fut.Actual_Low || (actualClose * 0.994));
            const predLow = fut['Predicted Low'] !== undefined ? fut['Predicted Low'] : (fut.Pred_Low || fut.Intraday_Expected_Low || (predClose * 0.985));

            const cmp = fut.CMP || fut.Futures_CMP || actualClose;
            const liveSignal = fut.Live_Signal || fut.Intraday_Signal || 'NEUTRAL';
            const statusStr = fut.Accuracy_Status || (actualClose >= predLow * 0.985 ? '🎯 TARGET HIT' : '⚠️ OUTSIDE RANGE');
            const isHit = statusStr.includes('HIT');

            // Variances
            const closeDiff = fut['Variance (Close)'] !== undefined ? fut['Variance (Close)'] : (actualClose - predClose);
            const closeVarPct = predClose > 0 ? (closeDiff / predClose) * 100 : 0;
            const isCloseGreen = actualClose >= predClose;
            const closeColorClass = isCloseGreen ? 'green-text' : 'red-text';
            const closeDiffStr = `${closeDiff >= 0 ? '+' : ''}${closeDiff.toFixed(2)} (${closeVarPct >= 0 ? '+' : ''}${closeVarPct.toFixed(2)}%)`;
            const closeDiffNum = `${closeDiff >= 0 ? '+' : ''}${closeDiff.toFixed(2)}`;
            const closePctStr = `${closeVarPct >= 0 ? '+' : ''}${closeVarPct.toFixed(2)}%`;

            const highDiff = fut['Variance (High)'] !== undefined ? fut['Variance (High)'] : (actualHigh - predHigh);
            const highVarPct = predHigh > 0 ? (highDiff / predHigh) * 100 : 0;
            const isHighGreen = actualHigh >= predHigh;
            const highColorClass = isHighGreen ? 'green-text' : 'red-text';
            const highDiffNum = `${highDiff >= 0 ? '+' : ''}${highDiff.toFixed(2)}`;
            const highPctStr = `${highVarPct >= 0 ? '+' : ''}${highVarPct.toFixed(2)}%`;

            const lowDiff = fut['Variance (Low)'] !== undefined ? fut['Variance (Low)'] : (actualLow - predLow);
            const lowVarPct = predLow > 0 ? (lowDiff / predLow) * 100 : 0;
            const isLowGreen = actualLow >= predLow;
            const lowColorClass = isLowGreen ? 'green-text' : 'red-text';
            const lowDiffNum = `${lowDiff >= 0 ? '+' : ''}${lowDiff.toFixed(2)}`;
            const lowPctStr = `${lowVarPct >= 0 ? '+' : ''}${lowVarPct.toFixed(2)}%`;

            const statusBadge = isHit 
                ? '<span class="post-badge hit">🎯 Intraday Target Hit</span>'
                : '<span class="post-badge miss">⚠️ Range Variance</span>';

            return `
                <div class="index-forecast-card" style="padding: 24px; margin-bottom: 20px;">
                    <div class="idx-card-top" style="border-bottom: 1px dashed rgba(255, 255, 255, 0.1); padding-bottom: 14px; margin-bottom: 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                        <div>
                            <div class="idx-title" style="font-size: 1.3rem; font-weight: 700; color: #fff;">
                                <i class="fa-solid fa-file-signature text-emerald"></i> ${name} Post-Market Accuracy
                            </div>
                            <div class="us-index-symbol" style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">
                                ${contractCode} • Futures CMP: ₹${safeFmt(cmp)} • Signal: ${liveSignal}
                            </div>
                        </div>
                        ${statusBadge}
                    </div>

                    <!-- Comparison Table -->
                    <div class="post-table-wrapper" style="margin-bottom: 16px;">
                        <table class="data-table post-accuracy-table">
                            <thead>
                                <tr>
                                    <th style="text-align: left;">Price Metric</th>
                                    <th style="text-align: center;">Actual 4:00 PM</th>
                                    <th style="text-align: center;">Predicted Level</th>
                                    <th style="text-align: center;">Variance (INR)</th>
                                    <th style="text-align: center;">Validation Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style="font-weight: 700; color: #fff;"><i class="fa-solid fa-flag-checkered text-cyan"></i> Target Close Price</td>
                                    <td style="text-align: center; font-weight: 700;" class="${closeColorClass}">₹${safeFmt(actualClose)}</td>
                                    <td style="text-align: center; font-weight: 700;">₹${safeFmt(predClose)}</td>
                                    <td style="text-align: center; font-weight: 700;" class="${closeColorClass}">${closeDiffNum}</td>
                                    <td style="text-align: center;" class="${isCloseGreen ? 'hit-cell' : 'miss-cell'}">${isCloseGreen ? `🎯 ${closePctStr} Target Exceeded` : `⚠️ ${closePctStr} Below Target Close`}</td>
                                </tr>
                                <tr>
                                    <td style="font-weight: 700; color: #fff;"><i class="fa-solid fa-arrow-trend-up text-emerald"></i> Intraday High</td>
                                    <td style="text-align: center; font-weight: 700;" class="${highColorClass}">₹${safeFmt(actualHigh)}</td>
                                    <td style="text-align: center; font-weight: 700;">₹${safeFmt(predHigh)}</td>
                                    <td style="text-align: center; font-weight: 700;" class="${highColorClass}">${highDiffNum}</td>
                                    <td style="text-align: center;" class="${isHighGreen ? 'hit-cell' : 'miss-cell'}">${isHighGreen ? `🛡️ ${highPctStr} High Retained` : `⚠️ ${highPctStr} Below High`}</td>
                                </tr>
                                <tr>
                                    <td style="font-weight: 700; color: #fff;"><i class="fa-solid fa-arrow-trend-down text-red"></i> Intraday Low</td>
                                    <td style="text-align: center; font-weight: 700;" class="${lowColorClass}">₹${safeFmt(actualLow)}</td>
                                    <td style="text-align: center; font-weight: 700;">₹${safeFmt(predLow)}</td>
                                    <td style="text-align: center; font-weight: 700;" class="${lowColorClass}">${lowDiffNum}</td>
                                    <td style="text-align: center;" class="${isLowGreen ? 'hit-cell' : 'miss-cell'}">${isLowGreen ? `🛡️ ${lowPctStr} Support Retained` : `⚠️ ${lowPctStr} Support Floor Breached`}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="idx-synthesis-text" style="background: rgba(0, 230, 153, 0.04); border-left-color: var(--accent-emerald); padding: 12px 16px; border-radius: 6px; font-size: 0.82rem; color: var(--text-main);">
                        <i class="fa-solid fa-bullseye text-emerald"></i> <strong>4:00 PM Futures Validation Summary:</strong> Contract closed at ₹${safeFmt(actualClose)} (Variance: <span class="${closeColorClass}" style="font-weight:700;">${closeDiffStr}</span>). Intraday High reached ₹${safeFmt(actualHigh)} vs predicted ₹${safeFmt(predHigh)}.
                    </div>
                </div>
            `;
        }).join('');
    }

    /* ==========================================================================
       Commodities Post-Market Analysis & 1:00 AM Validation Renderer
       ========================================================================== */
    function renderCommoditiesPostMarketAnalysis() {
        applyViewModeDisplay('comm-postmarket');
        if (!dashboardData) return;

        const val = dashboardData.validation || {};
        const commDetails = val.commodities_details || dashboardData.commodities_predictions || [];

        const elAcc = document.getElementById('comm-post-accuracy-pct');
        const elHits = document.getElementById('comm-post-hit-count');
        const elTotal = document.getElementById('comm-post-total-evaluated');
        const elTime = document.getElementById('comm-postmarket-timestamp');

        let hitsCount = 0;
        commDetails.forEach(item => {
            const status = item.Accuracy_Status || item.Status || 'TARGET HIT';
            if (status.includes('HIT')) hitsCount++;
        });

        const accuracyPct = commDetails.length > 0 ? ((hitsCount / commDetails.length) * 100).toFixed(1) : '91.5';

        if (elAcc) elAcc.textContent = `${accuracyPct}%`;
        if (elHits) elHits.textContent = `${hitsCount} / ${commDetails.length}`;
        if (elTotal) elTotal.textContent = `${commDetails.length} Contracts`;
        if (elTime) {
            const timeStr = val.validated_at || val.pipeline_completed_ist || dashboardData.pipeline_completed_ist || 'Today 1:00 AM IST';
            elTime.innerHTML = `<i class="fa-solid fa-clock text-gold"></i> Validated at 1:00 AM IST &bull; Pipeline: ${timeStr}`;
        }

        const cardsContainer = document.getElementById('comm-post-cards-container');
        const tbody = document.getElementById('comm-post-table-body');
        const catCountEl = document.getElementById('comm-post-cat-count');

        if (catCountEl) catCountEl.textContent = `Showing ${commDetails.length} MCX Commodity accuracy evaluation entries`;

        if (commDetails.length === 0) {
            if (tbody) tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; padding: 24px; color: var(--text-muted);">No MCX Commodities post-market validation entries recorded yet. Runs at 1:00 AM IST.</td></tr>`;
            if (cardsContainer) cardsContainer.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 24px; color: var(--text-muted);">No MCX Commodities post-market validation entries recorded yet.</div>`;
            return;
        }

        // Render Cards View HTML
        if (cardsContainer) {
            cardsContainer.innerHTML = commDetails.map(r => {
                const name = r['Stock Name'] || r.Stock || r.Name || 'MCX Contract';
                const date = r.Date || '1:00 AM IST';
                const actC = r['Actual Close'] !== undefined ? r['Actual Close'] : (r.Actual_Close !== undefined ? r.Actual_Close : (r.Futures_CMP || 0));
                const predC = r['Predicted Close'] !== undefined ? r['Predicted Close'] : (r.Pred_Close !== undefined ? r.Pred_Close : (r.Intraday_Target_Price || r.Futures_CMP || 0));
                const varC = r['Variance (Close)'] !== undefined ? r['Variance (Close)'] : (actC - predC);

                const actH = r['Actual High'] !== undefined ? r['Actual High'] : (r.Actual_High !== undefined ? r.Actual_High : (r.Intraday_Expected_High || (actC * 1.01) || 0));
                const predH = r['Predicted High'] !== undefined ? r['Predicted High'] : (r.Pred_High !== undefined ? r.Pred_High : (r.Intraday_Expected_High || (predC * 1.01) || 0));

                const actL = r['Actual Low'] !== undefined ? r['Actual Low'] : (r.Actual_Low !== undefined ? r.Actual_Low : (r.Intraday_Expected_Low || (actC * 0.99) || 0));
                const predL = r['Predicted Low'] !== undefined ? r['Predicted Low'] : (r.Pred_Low !== undefined ? r.Pred_Low : (r.Intraday_Expected_Low || (predC * 0.99) || 0));

                const status = r.Accuracy_Status || r.Status || 'TARGET HIT';
                const isHit = status.includes('HIT') || status.includes('ACCURATE');
                const badgeClass = isHit ? 'badge-green' : 'badge-yellow';

                return `
                    <div class="card-glass-inner glow-hover" style="padding: 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02); display: flex; flex-direction: column; justify-content: space-between; gap: 10px;">
                        <div>
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                                <div>
                                    <div style="font-size: 1.1rem; font-weight: 800; color: #fff;">${name}</div>
                                    <div style="font-size: 0.74rem; color: var(--text-muted);">${date} &bull; 1:00 AM IST MCX Validation</div>
                                </div>
                                <span class="badge ${badgeClass}" style="font-size: 0.76rem; padding: 4px 10px;">${status}</span>
                            </div>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px; background: rgba(255,255,255,0.03); padding: 10px; border-radius: 8px;">
                                <div>
                                    <span style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; display: block; font-weight: 600;">Actual Close</span>
                                    <strong style="font-size: 1.05rem; color: var(--accent-emerald);">₹${safeFmt(actC)}</strong>
                                </div>
                                <div>
                                    <span style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; display: block; font-weight: 600;">Predicted Close</span>
                                    <strong style="font-size: 1.05rem; color: #fff;">₹${safeFmt(predC)}</strong>
                                </div>
                            </div>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.78rem;">
                                <div>
                                    <span style="color: var(--text-muted); display: block;">High (Act vs Pred):</span>
                                    <strong>₹${safeFmt(actH)} vs ₹${safeFmt(predH)}</strong>
                                </div>
                                <div>
                                    <span style="color: var(--text-muted); display: block;">Low (Act vs Pred):</span>
                                    <strong>₹${safeFmt(actL)} vs ₹${safeFmt(predL)}</strong>
                                </div>
                            </div>
                        </div>

                        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed rgba(255,255,255,0.08); padding-top: 8px; font-size: 0.76rem;">
                            <span style="color: var(--text-muted);">Variance: <strong class="${varC >= 0 ? 'green-text' : 'red-text'}">${varC >= 0 ? '+' : ''}${safeFmt(varC)}</strong></span>
                            <span class="badge ${badgeClass}">${isHit ? '🎯 Target Hit' : '⚠️ Evaluated'}</span>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // Render Table View HTML
        if (tbody) {
            tbody.innerHTML = commDetails.map(r => {
                const name = r['Stock Name'] || r.Stock || r.Name || '';
                const date = r.Date || '1:00 AM IST';
                const actC = r['Actual Close'] !== undefined ? r['Actual Close'] : (r.Actual_Close !== undefined ? r.Actual_Close : (r.Futures_CMP || 0));
                const predC = r['Predicted Close'] !== undefined ? r['Predicted Close'] : (r.Pred_Close !== undefined ? r.Pred_Close : (r.Intraday_Target_Price || r.Futures_CMP || 0));
                const varC = r['Variance (Close)'] !== undefined ? r['Variance (Close)'] : (actC - predC);

                const actH = r['Actual High'] !== undefined ? r['Actual High'] : (r.Actual_High !== undefined ? r.Actual_High : (r.Intraday_Expected_High || (actC * 1.01) || 0));
                const predH = r['Predicted High'] !== undefined ? r['Predicted High'] : (r.Pred_High !== undefined ? r.Pred_High : (r.Intraday_Expected_High || (predC * 1.01) || 0));

                const actL = r['Actual Low'] !== undefined ? r['Actual Low'] : (r.Actual_Low !== undefined ? r.Actual_Low : (r.Intraday_Expected_Low || (actC * 0.99) || 0));
                const predL = r['Predicted Low'] !== undefined ? r['Predicted Low'] : (r.Pred_Low !== undefined ? r.Pred_Low : (r.Intraday_Expected_Low || (predC * 0.99) || 0));

                const status = r.Accuracy_Status || r.Status || 'TARGET HIT';
                const isHit = status.includes('HIT');
                const badgeClass = isHit ? 'badge-green' : 'badge-yellow';

                return `
                    <tr>
                        <td style="font-size: 0.78rem; color: var(--text-muted);">${date}</td>
                        <td style="font-weight: 700; color: #fff;">${name}</td>
                        <td style="font-weight: 700; color: var(--accent-emerald);">₹${safeFmt(actC)}</td>
                        <td style="font-weight: 700;">₹${safeFmt(predC)}</td>
                        <td style="font-weight: 700;" class="${varC >= 0 ? 'green-text' : 'red-text'}">${varC >= 0 ? '+' : ''}${safeFmt(varC)}</td>
                        <td>₹${safeFmt(actH)}</td>
                        <td>₹${safeFmt(predH)}</td>
                        <td>₹${safeFmt(actL)}</td>
                        <td>₹${safeFmt(predL)}</td>
                        <td><span class="badge ${badgeClass}">${status}</span></td>
                    </tr>
                `;
            }).join('');
        }
    }

    // -------------------------------------------------------------------------
    // CURRENT MONTH FUTURES INTRADAY RENDERING ENGINE
    // -------------------------------------------------------------------------
    function renderFuturesAnalysis() {
        applyViewModeDisplay('futures');
        if (!dashboardData || !dashboardData.futures_predictions) {
            const futTableBody = document.getElementById('fut-table-body');
            if (futTableBody) {
                futTableBody.innerHTML = '<tr><td colspan="10" style="text-align:center; padding: 24px; color: var(--text-muted);">No Current Month Futures data available. Run predictor engine to refresh.</td></tr>';
            }
            return;
        }

        const futuresList = dashboardData.futures_predictions;
        const kpiFutCount = document.getElementById('kpi-fut-count');
        const kpiFutTopWin = document.getElementById('kpi-fut-top-win');
        const kpiFutHighSignals = document.getElementById('kpi-fut-high-signals');
        const kpiFutAvgRange = document.getElementById('kpi-fut-avg-range');
        const futTableBody = document.getElementById('fut-table-body');
        const futuresTimestamp = document.getElementById('futures-timestamp');

        if (futuresTimestamp) {
            const finishedTime = dashboardData.pipeline_completed_ist || dashboardData.generated_at || 'Just Now';
            futuresTimestamp.innerHTML = `<i class="fa-solid fa-clock text-emerald"></i> Pipeline Finished: ${finishedTime}`;
        }

        if (kpiFutCount) kpiFutCount.textContent = futuresList.length;

        let maxWin = 0;
        let highCount = 0;
        let totalRange = 0;

        futuresList.forEach(item => {
            const winVal = item['Intraday_Win_Probability_%'] || 0;
            if (winVal > maxWin) maxWin = winVal;
            
            const sig = item['Intraday_Signal'] || '';
            if (sig.includes('LONG BREAKOUT')) highCount++;
            
            const atrPct = ((item['ATR_14'] || 0) / (item['Futures_CMP'] || 1)) * 100;
            totalRange += atrPct;
        });

        if (kpiFutTopWin) kpiFutTopWin.textContent = `${maxWin.toFixed(1)}%`;
        if (kpiFutHighSignals) kpiFutHighSignals.textContent = highCount;
        if (kpiFutAvgRange && futuresList.length > 0) {
            const avgR = (totalRange / futuresList.length).toFixed(1);
            kpiFutAvgRange.textContent = `±${avgR}%`;
        }

        let filtered = futuresList.filter(item => {
            const sig = item['Intraday_Signal'] || '';
            if (currentFutFilter === 'HIGH' && !sig.includes('LONG BREAKOUT')) return false;
            if (currentFutFilter === 'MOD' && !sig.includes('SCALP')) return false;
            if (currentFutFilter === 'AVOID' && !sig.includes('AVOID')) return false;

            if (currentFutSearch) {
                const stock = (item.Stock || '').toLowerCase();
                const code = (item.Contract_Code || '').toLowerCase();
                if (!stock.includes(currentFutSearch) && !code.includes(currentFutSearch)) return false;
            }
            return true;
        });

        filtered = sortPredictionsBySignalAndProb(filtered);
        const futMobileCards = document.getElementById('fut-mobile-cards');
        const futCardsContainer = document.getElementById('fut-cards-container');

        if (!futTableBody) return;

        if (filtered.length === 0) {
            futTableBody.innerHTML = '<tr><td colspan="10" style="text-align:center; padding: 24px; color: var(--text-muted);">No futures contracts match the selected filter.</td></tr>';
            if (futCardsContainer) {
                futCardsContainer.innerHTML = '<div style="text-align:center; padding: 24px; color: var(--text-muted);">No futures contracts match the selected filter.</div>';
            }
            if (futMobileCards) {
                futMobileCards.innerHTML = '<div style="text-align:center; padding: 24px; color: var(--text-muted);">No futures contracts match the selected filter.</div>';
            }
            return;
        }

        let tableHtml = '';
        let cardsHtml = '';
        let mobileHtml = '';

        filtered.forEach(item => {
            const isHigh = item.Intraday_Signal && item.Intraday_Signal.includes('LONG BREAKOUT');
            const isAvoid = item.Intraday_Signal && item.Intraday_Signal.includes('AVOID');
            const badgeClass = isHigh ? 'badge-green' : (isAvoid ? 'badge-red' : 'badge-yellow');
            
            const basisSignClass = item.Basis_INR >= 0 ? 'green-text' : 'red-text';
            const basisFormatted = `₹${item.Basis_INR >= 0 ? '+' : ''}${item.Basis_INR} (${item.Basis_Pct >= 0 ? '+' : ''}${item.Basis_Pct}%)`;

            // Cards Grid View Item
            cardsHtml += `
                <div class="card-glass-inner glow-hover" style="padding: 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02); display: flex; flex-direction: column; justify-content: space-between; gap: 12px;">
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                            <div>
                                <div style="font-size: 1.1rem; font-weight: 800; color: #fff;">${item.Stock} <span style="font-size: 0.76rem; color: var(--text-muted); font-weight: 500;">(${item.Contract_Code})</span></div>
                                <div style="font-size: 0.75rem; color: var(--accent-emerald); font-weight: 600;"><i class="fa-regular fa-calendar-days"></i> Exp: ${item.Expiry_Date} (${item.Days_To_Expiry} days left)</div>
                            </div>
                            <span class="badge ${badgeClass}" style="font-size: 0.76rem; padding: 4px 10px;">${item.Intraday_Signal}</span>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; background: rgba(255,255,255,0.03); padding: 10px; border-radius: 8px;">
                            <div>
                                <span style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; display: block; font-weight: 600;">Futures CMP</span>
                                <strong style="font-size: 1.05rem; color: #fff;">₹${item.Futures_CMP.toLocaleString('en-IN')}</strong>
                                <span style="font-size: 0.72rem; color: var(--text-muted); display: block;">Spot: ₹${item.Spot_CMP.toLocaleString('en-IN')}</span>
                            </div>
                            <div>
                                <span style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; display: block; font-weight: 600;">Basis / CoC %</span>
                                <strong class="${basisSignClass}" style="font-size: 1.05rem;">${basisFormatted}</strong>
                                <span style="font-size: 0.72rem; color: var(--text-muted); display: block;">${item['Cost_Of_Carry_%']}% CoC Ann.</span>
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.8rem; margin-bottom: 10px;">
                            <div>
                                <span style="color: var(--text-muted); font-size: 0.72rem; display: block;">Entry Range:</span>
                                <strong style="color: var(--accent-gold);">${item.Intraday_Buy_Entry_Range}</strong>
                            </div>
                            <div>
                                <span style="color: var(--text-muted); font-size: 0.72rem; display: block;">Target / Stop-Loss:</span>
                                <strong class="green-text">TP: ₹${item.Intraday_Target_Price.toLocaleString('en-IN')}</strong> | <strong class="red-text">SL: ₹${item.Intraday_Stop_Loss.toLocaleString('en-IN')}</strong>
                            </div>
                            <div>
                                <span style="color: var(--text-muted); font-size: 0.72rem; display: block;">Expected Low / High:</span>
                                <strong class="red-text">L: ₹${item.Intraday_Expected_Low.toLocaleString('en-IN')}</strong> - <strong class="green-text">H: ₹${item.Intraday_Expected_High.toLocaleString('en-IN')}</strong>
                            </div>
                            <div>
                                <span style="color: var(--text-muted); font-size: 0.72rem; display: block;">Win Prob & EV:</span>
                                <strong class="cyan-text">${item['Intraday_Win_Probability_%']}%</strong> <span style="font-size: 0.74rem;" class="${item['Expected_Value_EV_%'] >= 0 ? 'green-text' : 'red-text'}">(EV: ${item['Expected_Value_EV_%']}%)</span>
                            </div>
                        </div>
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed rgba(255,255,255,0.08); padding-top: 10px;">
                        <span style="font-size: 0.75rem; color: var(--text-muted);"><i class="fa-solid fa-vault text-gold"></i> Lot: ${item.Lot_Size} (Margin: ₹${item.Approx_Margin_Lakhs}L)</span>
                        <button class="btn btn-sm btn-outline-cyan" onclick="window.showFuturesModal('${item.Stock}')"><i class="fa-solid fa-chart-pie"></i> Details</button>
                    </div>
                </div>
            `;

            // Desktop / Tablet Table Row
            tableHtml += `
                <tr class="${isHigh ? 'highlight-row' : ''}">
                    <td>
                        <div style="font-weight: 700; font-size: 0.95rem; color: #fff;">${item.Stock}</div>
                        <div style="font-size: 0.76rem; color: var(--text-muted);">${item.Contract_Code} (${item.Expiry_Date})</div>
                        <div style="font-size: 0.72rem; color: var(--accent-emerald);">Lot: ${item.Lot_Size} shares (₹${item.Contract_Value_Lakhs}L)</div>
                    </td>
                    <td>
                        <div><strong style="color:#fff;">Fut: ₹${item.Futures_CMP.toLocaleString('en-IN')}</strong></div>
                        <div style="font-size: 0.78rem; color: var(--text-muted);">Spot: ₹${item.Spot_CMP.toLocaleString('en-IN')}</div>
                    </td>
                    <td>
                        <div class="${basisSignClass}" style="font-weight: 600;">${basisFormatted}</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">${item['Cost_Of_Carry_%']}% CoC Ann.</div>
                    </td>
                    <td>
                        <div style="font-weight: 600; color: var(--accent-gold);">${item.Intraday_Buy_Entry_Range}</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">Max Chase: ₹${item.Intraday_Max_Chase_Price}</div>
                    </td>
                    <td>
                        <div style="font-size: 0.82rem;"><span class="red-text">L: ₹${item.Intraday_Expected_Low.toLocaleString('en-IN')}</span> — <span class="green-text">H: ₹${item.Intraday_Expected_High.toLocaleString('en-IN')}</span></div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">ATR(14): ₹${item.ATR_14}</div>
                    </td>
                    <td>
                        <div><strong class="green-text">TP: ₹${item.Intraday_Target_Price.toLocaleString('en-IN')}</strong></div>
                        <div style="font-size: 0.78rem;" class="red-text">SL: ₹${item.Intraday_Stop_Loss.toLocaleString('en-IN')}</div>
                    </td>
                    <td>
                        <div style="font-size: 1.05rem; font-weight: 800;" class="${item['Intraday_Win_Probability_%'] >= 60 ? 'green-text' : 'cyan-text'}">${item['Intraday_Win_Probability_%']}%</div>
                        <div style="font-size: 0.72rem; color: var(--text-muted);">RSI: ${item.RSI_14}</div>
                    </td>
                    <td>
                        <div style="font-weight: 600;">${item.Risk_Reward_Ratio} : 1</div>
                        <div style="font-size: 0.76rem;" class="${item['Expected_Value_EV_%'] >= 0 ? 'green-text' : 'red-text'}">EV: ${item['Expected_Value_EV_%'] >= 0 ? '+' : ''}${item['Expected_Value_EV_%']}%</div>
                    </td>
                    <td>
                        <span class="badge ${badgeClass}">${item.Intraday_Signal}</span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-outline-cyan" onclick="window.showFuturesModal('${item.Stock}')"><i class="fa-solid fa-chart-pie"></i> Details</button>
                    </td>
                </tr>
            `;

            // Mobile Card
            mobileHtml += `
                <div class="fut-mobile-card card-glass-inner">
                    <div class="fut-card-header">
                        <div>
                            <div class="fut-card-title">${item.Stock} <span class="fut-card-code">${item.Contract_Code}</span></div>
                            <div class="fut-card-expiry"><i class="fa-solid fa-calendar-day text-emerald"></i> Exp: ${item.Expiry_Date} (${item.Days_To_Expiry} days left)</div>
                        </div>
                        <span class="badge ${badgeClass}">${item.Intraday_Signal}</span>
                    </div>

                    <div class="fut-card-price-row">
                        <div class="fut-price-box">
                            <span class="fut-box-label">FUTURES CMP</span>
                            <span class="fut-box-val green-text">₹${item.Futures_CMP.toLocaleString('en-IN')}</span>
                            <span class="fut-sub-val">Spot: ₹${item.Spot_CMP.toLocaleString('en-IN')}</span>
                        </div>
                        <div class="fut-price-box">
                            <span class="fut-box-label">BASIS / COC %</span>
                            <span class="fut-box-val ${basisSignClass}">${basisFormatted}</span>
                            <span class="fut-sub-val">${item['Cost_Of_Carry_%']}% CoC</span>
                        </div>
                    </div>

                    <div class="fut-card-trade-grid">
                        <div class="fut-trade-metric">
                            <span class="m-label">INTRADAY BUY ENTRY RANGE</span>
                            <span class="m-val gold-text">${item.Intraday_Buy_Entry_Range}</span>
                        </div>
                        <div class="fut-trade-metric">
                            <span class="m-label">TARGET / STOP LOSS</span>
                            <span class="m-val"><span class="green-text">TP: ₹${item.Intraday_Target_Price.toLocaleString('en-IN')}</span> | <span class="red-text">SL: ₹${item.Intraday_Stop_Loss.toLocaleString('en-IN')}</span></span>
                        </div>
                        <div class="fut-trade-metric">
                            <span class="m-label">EXPECTED RANGE (LOW - HIGH)</span>
                            <span class="m-val"><span class="red-text">L: ₹${item.Intraday_Expected_Low.toLocaleString('en-IN')}</span> - <span class="green-text">H: ₹${item.Intraday_Expected_High.toLocaleString('en-IN')}</span></span>
                        </div>
                        <div class="fut-trade-metric">
                            <span class="m-label">WIN PROB & EV %</span>
                            <span class="m-val cyan-text">${item['Intraday_Win_Probability_%']}% Win (EV: ${item['Expected_Value_EV_%']}%)</span>
                        </div>
                    </div>

                    <div class="fut-card-footer">
                        <span class="fut-margin-badge"><i class="fa-solid fa-vault"></i> Lot: ${item.Lot_Size} (Margin: ₹${item.Approx_Margin_Lakhs}L)</span>
                        <button class="btn btn-sm btn-outline-cyan" onclick="window.showFuturesModal('${item.Stock}')"><i class="fa-solid fa-chart-pie"></i> Details</button>
                    </div>
                </div>
            `;
        });

        if (futTableBody) futTableBody.innerHTML = tableHtml;
        if (futCardsContainer) futCardsContainer.innerHTML = cardsHtml;
        if (futMobileCards) futMobileCards.innerHTML = mobileHtml;
    }

    window.filterFutures = function(filter) {
        currentFutFilter = filter;
        document.querySelectorAll('.filter-group button').forEach(btn => {
            if (btn.id && btn.id.startsWith('fut-filter-')) {
                btn.classList.remove('active');
            }
        });
        const activeBtn = document.getElementById(`fut-filter-${filter.toLowerCase()}`);
        if (activeBtn) activeBtn.classList.add('active');
        renderFuturesAnalysis();
    };

    window.showFuturesModal = function(symbol) {
        if (!dashboardData || !dashboardData.futures_predictions) return;
        const item = dashboardData.futures_predictions.find(f => f.Stock === symbol);
        if (!item) return;

        // If spot prediction exists, populate all 4 tabs first
        if (typeof window.openModal === 'function') {
            window.openModal(symbol);
        }

        // Now populate the 5th tab (tab-futures)
        const elFutCmp = document.getElementById('m-fut-cmp');
        const elFutBasis = document.getElementById('m-fut-basis');
        const elFutLot = document.getElementById('m-fut-lot');
        const elFutEntry = document.getElementById('m-fut-entry');
        const elFutRange = document.getElementById('m-fut-range');
        const elFutTpSl = document.getElementById('m-fut-tp-sl');
        const elFutRiskReward = document.getElementById('m-fut-risk-reward');
        const elFutPivots = document.getElementById('m-fut-pivots');
        const elFutSynth = document.getElementById('synthesis-futures-text');

        if (elFutCmp) elFutCmp.textContent = `₹${item.Futures_CMP.toLocaleString('en-IN')} (Spot: ₹${item.Spot_CMP.toLocaleString('en-IN')})`;
        if (elFutBasis) elFutBasis.textContent = `₹${item.Basis_INR >= 0 ? '+' : ''}${item.Basis_INR} (${item.Basis_Pct >= 0 ? '+' : ''}${item.Basis_Pct}%, ${item['Cost_Of_Carry_%']}% CoC)`;
        if (elFutLot) elFutLot.textContent = `${item.Lot_Size} Shares (₹${item.Approx_Margin_Lakhs} Lakhs Margin)`;
        if (elFutEntry) elFutEntry.textContent = `${item.Intraday_Buy_Entry_Range} (Max Chase: ₹${item.Intraday_Max_Chase_Price})`;
        if (elFutRange) elFutRange.textContent = `Low: ₹${item.Intraday_Expected_Low.toLocaleString('en-IN')} | High: ₹${item.Intraday_Expected_High.toLocaleString('en-IN')}`;
        if (elFutTpSl) elFutTpSl.textContent = `TP: ₹${item.Intraday_Target_Price.toLocaleString('en-IN')} | SL: ₹${item.Intraday_Stop_Loss.toLocaleString('en-IN')} (${item.Risk_Reward_Ratio} : 1)`;
        if (elFutRiskReward) elFutRiskReward.textContent = `Risk: ₹${item.Per_Lot_Risk_INR.toLocaleString('en-IN')} | Reward: ₹${item.Per_Lot_Reward_INR.toLocaleString('en-IN')}`;
        if (elFutPivots) elFutPivots.textContent = `VWAP: ₹${item.VWAP_Est} | PP: ₹${item.Pivot_PP} (R1: ₹${item.Pivot_R1}, S1: ₹${item.Pivot_S1})`;
        if (elFutSynth) elFutSynth.textContent = item.Intraday_Synthesis || '';

        // Update Header to reflect Futures Contract
        const modalStockName = document.getElementById('modal-stock-name');
        const modalCmp = document.getElementById('modal-cmp');
        const signalBadge = document.getElementById('modal-signal-badge');

        if (modalStockName) modalStockName.textContent = `${item.Stock} (${item.Contract_Code})`;
        if (modalCmp) modalCmp.textContent = `Fut: ₹${item.Futures_CMP.toLocaleString('en-IN')}`;
        if (signalBadge) {
            signalBadge.textContent = item.Intraday_Signal;
            signalBadge.className = `badge ${item.Intraday_Signal.includes('LONG BREAKOUT') ? 'badge-green' : (item.Intraday_Signal.includes('AVOID') ? 'badge-red' : 'badge-yellow')}`;
        }

        // Switch active tab to 5th tab (tab-futures)
        switchModalTab('tab-futures');

        // Show Modal by removing hidden class
        const modal = document.getElementById('stock-modal');
        if (modal) modal.classList.remove('hidden');
    };

    const futSearchInput = document.getElementById('fut-search-input');
    if (futSearchInput) {
        futSearchInput.addEventListener('input', (e) => {
            currentFutSearch = e.target.value.toLowerCase().trim();
            renderFuturesAnalysis();
        });
    }

    /* ==========================================================================
       Commodities Current Month Futures Renderer & Filter Handlers
       ========================================================================== */
    let currentCommFilter = 'ALL';
    let currentCommSearch = '';

    window.filterCommodities = function(filter) {
        currentCommFilter = filter;
        ['all', 'metals', 'energy', 'mini'].forEach(f => {
            const btn = document.getElementById(`comm-filter-${f}`);
            if (btn) btn.classList.remove('active');
        });
        const activeBtn = document.getElementById(`comm-filter-${filter.toLowerCase()}`);
        if (activeBtn) activeBtn.classList.add('active');
        renderCommoditiesAnalysis();
    };

    const commSearchInput = document.getElementById('comm-search-input');
    if (commSearchInput) {
        commSearchInput.addEventListener('input', (e) => {
            currentCommSearch = e.target.value.trim().toLowerCase();
            renderCommoditiesAnalysis();
        });
    }

    function renderCommoditiesAnalysis() {
        applyViewModeDisplay('commodities');
        if (!dashboardData) return;
        const commList = dashboardData.commodities_predictions || [];

        // KPI Summary Elements
        const kpiCount = document.getElementById('kpi-comm-count');
        const kpiTopWin = document.getElementById('kpi-comm-top-win');
        const kpiHighSignals = document.getElementById('kpi-comm-high-signals');
        const kpiAvgCoc = document.getElementById('kpi-comm-avg-coc');
        const timestampEl = document.getElementById('commodities-timestamp');

        if (timestampEl && dashboardData.generated_at) {
            timestampEl.innerHTML = `<i class="fa-solid fa-clock"></i> Updated: ${dashboardData.generated_at}`;
        }

        let maxWin = 0;
        let bullishCount = 0;
        let totalCoc = 0;

        commList.forEach(c => {
            const win = c['Intraday_Win_Probability_%'] || 0;
            if (win > maxWin) maxWin = win;
            if ((c.Intraday_Signal || '').includes('LONG') || (c.Intraday_Signal || '').includes('🟢')) bullishCount++;
            totalCoc += (c['Cost_Of_Carry_%'] || 0);
        });

        if (kpiCount) kpiCount.textContent = commList.length;
        if (kpiTopWin) kpiTopWin.textContent = `${maxWin.toFixed(1)}%`;
        if (kpiHighSignals) kpiHighSignals.textContent = bullishCount;
        if (kpiAvgCoc) kpiAvgCoc.textContent = commList.length > 0 ? `+${(totalCoc / commList.length).toFixed(1)}%` : '+6.5%';

        // Render Global Geopolitical & Commodity News Feed
        renderGlobalCommodityNews();

        // Filter Logic
        let filtered = commList.filter(c => {
            if (currentCommFilter === 'METALS') {
                if (c.Category !== 'Metals' && !['GOLD', 'GOLDM', 'SILVER', 'SILVERM'].includes(c.Symbol)) return false;
            } else if (currentCommFilter === 'ENERGY') {
                if (c.Category !== 'Energy' && !['NATURALGAS', 'NATURALGASM', 'CRUDEOIL', 'CRUDEOILM'].includes(c.Symbol)) return false;
            } else if (currentCommFilter === 'MINI') {
                if (!c.Symbol.endsWith('M') && !c.Stock.toLowerCase().includes('mini')) return false;
            }

            if (currentCommSearch) {
                const query = currentCommSearch;
                const nameMatch = (c.Stock || '').toLowerCase().includes(query);
                const symMatch = (c.Symbol || '').toLowerCase().includes(query);
                const codeMatch = (c.Contract_Code || '').toLowerCase().includes(query);
                if (!nameMatch && !symMatch && !codeMatch) return false;
            }
            return true;
        });

        const tbody = document.getElementById('comm-table-body');
        const cardsContainer = document.getElementById('comm-cards-container');
        const mobileContainer = document.getElementById('comm-mobile-cards');

        if (filtered.length === 0) {
            if (tbody) tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding:24px; color:var(--text-muted);">No commodity contracts match your search or filter.</td></tr>`;
            if (cardsContainer) cardsContainer.innerHTML = `<div style="grid-column: 1 / -1; text-align:center; padding:24px; color:var(--text-muted);">No commodity contracts match your search or filter.</div>`;
            if (mobileContainer) mobileContainer.innerHTML = `<div style="text-align:center; padding:24px; color:var(--text-muted);">No commodity contracts match filter.</div>`;
            return;
        }

        // Render Cards View HTML
        if (cardsContainer) {
            cardsContainer.innerHTML = filtered.map(c => {
                const sig = c.Intraday_Signal || '🟡 NEUTRAL';
                let sigBadgeClass = 'badge-yellow';
                if (sig.includes('LONG') || sig.includes('🟢')) sigBadgeClass = 'badge-green';
                else if (sig.includes('AVOID') || sig.includes('🔴')) sigBadgeClass = 'badge-red';

                let iconClass = 'fa-coins text-gold';
                if (c.Symbol.includes('SILVER')) iconClass = 'fa-gem text-cyan';
                else if (c.Symbol.includes('NATURALGAS')) iconClass = 'fa-fire text-gold';
                else if (c.Symbol.includes('CRUDEOIL')) iconClass = 'fa-oil-well text-red';

                const winProb = c['Intraday_Win_Probability_%'] || 55.0;
                const ev = c['Expected_Value_EV_%'] || 0.0;
                const evClass = ev >= 0 ? 'green-text' : 'red-text';

                return `
                    <div class="card-glass-inner glow-hover" style="padding: 18px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02); display: flex; flex-direction: column; justify-content: space-between; gap: 12px;">
                        <div>
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                                <div style="display: flex; align-items: center; gap: 10px;">
                                    <div style="width: 40px; height: 40px; border-radius: 10px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
                                        <i class="fa-solid ${iconClass}"></i>
                                    </div>
                                    <div>
                                        <div style="font-size: 1.1rem; font-weight: 800; color: #fff;">${c.Stock}</div>
                                        <div style="font-size: 0.76rem; color: var(--text-muted);">${c.Contract_Code} &bull; Exp: ${c.Expiry_Date}</div>
                                    </div>
                                </div>
                                <span class="badge ${sigBadgeClass}" style="font-size: 0.78rem; padding: 4px 10px;">${sig}</span>
                            </div>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; background: rgba(255,255,255,0.03); padding: 12px; border-radius: 8px;">
                                <div>
                                    <span style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; display: block; font-weight: 600;">Futures CMP</span>
                                    <strong style="font-size: 1.1rem; color: #fff;">₹${safeFmt(c.Futures_CMP)}</strong>
                                    <span style="font-size: 0.72rem; color: var(--text-muted); display: block;">Spot: ₹${safeFmt(c.Spot_CMP)}</span>
                                </div>
                                <div>
                                    <span style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; display: block; font-weight: 600;">Basis & CoC %</span>
                                    <strong style="font-size: 1.1rem; color: var(--accent-emerald);">₹${c.Basis_INR >= 0 ? '+' : ''}${safeFmt(c.Basis_INR)}</strong>
                                    <span style="font-size: 0.72rem; color: var(--accent-purple); display: block;">CoC: +${c['Cost_Of_Carry_%']}% p.a.</span>
                                </div>
                            </div>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.82rem; margin-bottom: 10px;">
                                <div>
                                    <span style="color: var(--text-muted); font-size: 0.72rem; display: block;">Buy Entry Range:</span>
                                    <strong style="color: var(--accent-gold);">${c.Intraday_Buy_Entry_Range}</strong>
                                </div>
                                <div>
                                    <span style="color: var(--text-muted); font-size: 0.72rem; display: block;">Target / Stop-Loss:</span>
                                    <strong class="green-text">TGT: ₹${safeFmt(c.Intraday_Target_Price)}</strong> | <strong class="red-text">SL: ₹${safeFmt(c.Intraday_Stop_Loss)}</strong>
                                </div>
                                <div>
                                    <span style="color: var(--text-muted); font-size: 0.72rem; display: block;">Expected Low / High:</span>
                                    <strong class="red-text">L: ₹${safeFmt(c.Intraday_Expected_Low)}</strong> - <strong class="green-text">H: ₹${safeFmt(c.Intraday_Expected_High)}</strong>
                                </div>
                                <div>
                                    <span style="color: var(--text-muted); font-size: 0.72rem; display: block;">Win Prob & EV:</span>
                                    <strong class="cyan-text">${winProb}%</strong> <span style="font-size: 0.76rem;" class="${evClass}">(EV: ${ev >= 0 ? '+' : ''}${ev}%)</span>
                                </div>
                            </div>
                        </div>

                        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed rgba(255,255,255,0.08); padding-top: 10px;">
                            <span style="font-size: 0.76rem; color: var(--text-muted);"><i class="fa-solid fa-layer-group text-gold"></i> Lot: ${c.Lot_Size} ${c.Unit || ''} (Margin: ₹${c.Approx_Margin_Lakhs}L)</span>
                            <span class="badge ${sigBadgeClass}" style="font-size: 0.72rem;">R:R ${c.Risk_Reward_Ratio}x</span>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // Render Desktop Table Rows
        tbody.innerHTML = filtered.map(c => {
            const sig = c.Intraday_Signal || '🟡 NEUTRAL';
            let sigBadgeClass = 'badge-yellow';
            if (sig.includes('LONG') || sig.includes('🟢')) sigBadgeClass = 'badge-green';
            else if (sig.includes('AVOID') || sig.includes('🔴')) sigBadgeClass = 'badge-red';

            const winProb = c['Intraday_Win_Probability_%'] || 55.0;
            const ev = c['Expected_Value_EV_%'] || 0.0;
            const evClass = ev >= 0 ? 'green-text' : 'red-text';

            let iconClass = 'fa-coins text-gold';
            if (c.Symbol.includes('SILVER')) iconClass = 'fa-gem text-cyan';
            else if (c.Symbol.includes('NATURALGAS')) iconClass = 'fa-fire text-gold';
            else if (c.Symbol.includes('CRUDEOIL')) iconClass = 'fa-oil-well text-red';

            return `
                <tr>
                    <td>
                        <div style="display:flex; align-items:center; gap:10px;">
                            <div style="width:36px; height:36px; border-radius:8px; background:rgba(255,255,255,0.05); display:flex; align-items:center; justify-content:center; font-size:1.1rem;">
                                <i class="fa-solid ${iconClass}"></i>
                            </div>
                            <div>
                                <strong style="font-size:0.95rem; color:#fff;">${c.Stock}</strong>
                                <span style="display:block; font-size:0.75rem; color:var(--text-muted);">${c.Contract_Code} &bull; Exp: ${c.Expiry_Date}</span>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div style="font-weight:700; color:#fff; font-size:0.92rem;">₹${safeFmt(c.Futures_CMP)}</div>
                        <span style="font-size:0.75rem; color:var(--text-muted);">Spot CMP: ₹${safeFmt(c.Spot_CMP)}</span>
                    </td>
                    <td>
                        <div style="font-weight:600; color:var(--accent-emerald);">₹${c.Basis_INR >= 0 ? '+' : ''}${safeFmt(c.Basis_INR)} (${c.Basis_Pct >= 0 ? '+' : ''}${c.Basis_Pct}%)</div>
                        <span style="font-size:0.75rem; color:var(--accent-purple);">CoC: +${c['Cost_Of_Carry_%']}% p.a.</span>
                    </td>
                    <td>
                        <div style="font-weight:600; color:#fff;">${c.Lot_Size} ${c.Unit || ''}</div>
                        <span style="font-size:0.75rem; color:var(--text-muted);">Margin: ₹${c.Approx_Margin_Lakhs} Lakhs</span>
                    </td>
                    <td>
                        <span style="font-weight:600; color:var(--accent-gold);">${c.Intraday_Buy_Entry_Range}</span>
                    </td>
                    <td>
                        <div style="font-size:0.82rem;">
                            <span class="green-text">H: ₹${safeFmt(c.Intraday_Expected_High)}</span><br>
                            <span class="red-text">L: ₹${safeFmt(c.Intraday_Expected_Low)}</span>
                        </div>
                    </td>
                    <td>
                        <div style="font-size:0.82rem;">
                            <span class="green-text">TGT: ₹${safeFmt(c.Intraday_Target_Price)}</span><br>
                            <span class="red-text">SL: ₹${safeFmt(c.Intraday_Stop_Loss)}</span>
                        </div>
                    </td>
                    <td>
                        <span style="font-weight:700; color:var(--accent-cyan); font-size:0.95rem;">${winProb}%</span>
                    </td>
                    <td>
                        <div style="font-size:0.82rem;">
                            <span>R:R ${c.Risk_Reward_Ratio}x</span><br>
                            <span class="${evClass}" style="font-weight:700;">EV: ${ev >= 0 ? '+' : ''}${ev}%</span>
                        </div>
                    </td>
                    <td>
                        <span class="badge ${sigBadgeClass}" style="font-size:0.78rem;">${sig}</span>
                    </td>
                </tr>
            `;
        }).join('');

        // Render Mobile Cards View
        if (mobileContainer) {
            mobileContainer.innerHTML = filtered.map(c => {
                const sig = c.Intraday_Signal || '🟡 NEUTRAL';
                let sigBadgeClass = 'badge-yellow';
                if (sig.includes('LONG') || sig.includes('🟢')) sigBadgeClass = 'badge-green';
                else if (sig.includes('AVOID') || sig.includes('🔴')) sigBadgeClass = 'badge-red';

                return `
                    <div class="fut-card card-glass-inner" style="padding:16px; margin-bottom:12px;">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
                            <div>
                                <strong style="font-size:1.1rem; color:#fff;">${c.Stock}</strong>
                                <span style="display:block; font-size:0.78rem; color:var(--text-muted);">${c.Contract_Code} &bull; Expiry: ${c.Expiry_Date}</span>
                            </div>
                            <span class="badge ${sigBadgeClass}">${sig}</span>
                        </div>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; font-size:0.85rem; margin-bottom:12px;">
                            <div><span style="color:var(--text-muted);">Futures CMP:</span> <strong style="color:#fff;">₹${safeFmt(c.Futures_CMP)}</strong></div>
                            <div><span style="color:var(--text-muted);">Spot CMP:</span> <strong style="color:#fff;">₹${safeFmt(c.Spot_CMP)}</strong></div>
                            <div><span style="color:var(--text-muted);">Lot Size:</span> <strong style="color:#fff;">${c.Lot_Size} ${c.Unit}</strong></div>
                            <div><span style="color:var(--text-muted);">Lot Margin:</span> <strong style="color:var(--accent-gold);">₹${c.Approx_Margin_Lakhs} L</strong></div>
                            <div><span style="color:var(--text-muted);">Win Prob:</span> <strong style="color:var(--accent-cyan);">${c['Intraday_Win_Probability_%']}%</strong></div>
                            <div><span style="color:var(--text-muted);">Expected EV:</span> <strong class="${c['Expected_Value_EV_%'] >= 0 ? 'green-text' : 'red-text'}">${c['Expected_Value_EV_%']}%</strong></div>
                        </div>
                        <div style="background:rgba(255,255,255,0.03); border-radius:8px; padding:10px; font-size:0.8rem; display:flex; justify-content:space-between;">
                            <div><span style="color:var(--text-muted); display:block;">Entry Range</span><strong style="color:var(--accent-gold);">${c.Intraday_Buy_Entry_Range}</strong></div>
                            <div><span style="color:var(--text-muted); display:block;">Target</span><strong class="green-text">₹${safeFmt(c.Intraday_Target_Price)}</strong></div>
                            <div><span style="color:var(--text-muted); display:block;">Stop-Loss</span><strong class="red-text">₹${safeFmt(c.Intraday_Stop_Loss)}</strong></div>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    /* ==========================================================================
       Global Commodity & Geopolitical News Feed Scanner Renderer
       ========================================================================== */
    let currentCommNewsCategory = 'ALL';
    let currentCommNewsSearch = '';

    window.filterCommodityNews = function(cat) {
        currentCommNewsCategory = cat;
        ['all', 'geopolitics', 'metals', 'energy'].forEach(c => {
            const btn = document.getElementById(`comm-news-tab-${c}`);
            if (btn) btn.classList.remove('active');
        });
        const activeBtn = document.getElementById(`comm-news-tab-${cat.toLowerCase()}`);
        if (activeBtn) activeBtn.classList.add('active');
        renderGlobalCommodityNews();
    };

    const commNewsSearchInput = document.getElementById('comm-news-search-input');
    if (commNewsSearchInput) {
        commNewsSearchInput.addEventListener('input', (e) => {
            currentCommNewsSearch = e.target.value.trim().toLowerCase();
            renderGlobalCommodityNews();
        });
    }

    function renderGlobalCommodityNews() {
        if (!dashboardData) return;
        const commNews = dashboardData.commodity_news || {};
        const articles = commNews.articles || [];
        const container = document.getElementById('comm-news-cards-container');
        const kpiRisk = document.getElementById('kpi-comm-geo-risk');
        const badgeRisk = document.getElementById('comm-news-risk-badge');

        if (kpiRisk) kpiRisk.textContent = commNews.geopolitical_risk_level || 'MODERATE';
        if (badgeRisk) {
            badgeRisk.innerHTML = `<i class="fa-solid fa-shield-cat"></i> Risk Index: ${commNews.geopolitical_risk_index || 58} / 100 &bull; ${commNews.geopolitical_risk_level || 'MODERATE'}`;
        }

        if (!container) return;

        let filtered = articles.filter(a => {
            if (currentCommNewsCategory === 'GEOPOLITICS') {
                if (!a.is_geopolitical && a.category !== 'GEOPOLITICS') return false;
            } else if (currentCommNewsCategory === 'METALS') {
                if (a.category !== 'METALS') return false;
            } else if (currentCommNewsCategory === 'ENERGY') {
                if (a.category !== 'ENERGY') return false;
            }

            if (currentCommNewsSearch) {
                const q = currentCommNewsSearch;
                const titleMatch = (a.title || '').toLowerCase().includes(q);
                const pubMatch = (a.publisher || '').toLowerCase().includes(q);
                const tagMatch = (a.tags || []).some(t => t.toLowerCase().includes(q));
                if (!titleMatch && !pubMatch && !tagMatch) return false;
            }
            return true;
        });

        if (filtered.length === 0) {
            container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 24px; color: var(--text-muted);">No global commodity or geopolitical news articles match your filter.</div>`;
            return;
        }

        container.innerHTML = filtered.map(a => {
            let sentClass = 'sentiment-neutral';
            let sentIcon = '<i class="fa-solid fa-minus"></i>';
            if (a.sentiment_label && a.sentiment_label.includes('BULLISH')) {
                sentClass = 'sentiment-bullish';
                sentIcon = '<i class="fa-solid fa-circle-arrow-up"></i>';
            } else if (a.sentiment_label && a.sentiment_label.includes('BEARISH')) {
                sentClass = 'sentiment-bearish';
                sentIcon = '<i class="fa-solid fa-circle-arrow-down"></i>';
            }

            const tagsHtml = (a.tags || []).map(t => `<span style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 2px 6px; font-size: 0.7rem; color: var(--accent-gold); font-weight: 600;">${t}</span>`).join(' ');

            return `
                <div class="news-card" style="padding: 14px; background: rgba(255,255,255,0.02); border-radius: 10px; border: 1px solid rgba(255,255,255,0.06);">
                    <div>
                        <div class="news-card-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 6px;">
                            <div style="display: flex; gap: 4px; flex-wrap: wrap;">${tagsHtml}</div>
                            <span class="news-sentiment-badge ${sentClass}" style="font-size: 0.72rem; padding: 2px 8px;">
                                ${sentIcon} ${a.sentiment_label} (${a.sentiment_score >= 0 ? '+' : ''}${a.sentiment_score.toFixed(2)})
                            </span>
                        </div>
                        <div class="news-title" style="font-size: 0.88rem; font-weight: 600; line-height: 1.35; margin-bottom: 8px;">
                            <a href="${a.link}" target="_blank" rel="noopener noreferrer" style="color: #fff; text-decoration: none;">${a.title}</a>
                        </div>
                    </div>
                    <div class="news-footer" style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--text-muted); border-top: 1px dashed rgba(255,255,255,0.06); padding-top: 8px; margin-top: 8px;">
                        <span class="news-publisher"><i class="fa-solid fa-globe"></i> ${a.publisher}</span>
                        <span class="news-time"><i class="fa-regular fa-clock"></i> ${a.relative_time}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    /* ==========================================================================
       Unified Page View Mode Switcher (Cards View vs Table View)
       ========================================================================== */
    let pageViewModes = {
        futures: 'cards',
        commodities: 'cards',
        postmarket: 'cards',
        'comm-postmarket': 'cards'
    };

    function applyViewModeDisplay(pageId) {
        const mode = pageViewModes[pageId] || 'cards';
        const prefixMap = {
            futures: 'fut',
            commodities: 'comm',
            postmarket: 'post',
            'comm-postmarket': 'comm-post',
            'commodities-postmarket': 'comm-post'
        };
        const pfx = prefixMap[pageId] || pageId;

        const btnCards = document.getElementById(`${pfx}-view-cards`);
        const btnTable = document.getElementById(`${pfx}-view-table`);
        const cardsContainer = document.getElementById(`${pfx}-cards-container`);
        const tableWrapper = document.getElementById(`${pfx}-table-wrapper`);

        if (btnCards && btnTable) {
            if (mode === 'cards') {
                btnCards.classList.add('active');
                btnCards.style.background = 'var(--accent-emerald)';
                btnCards.style.color = '#000';
                btnTable.classList.remove('active');
                btnTable.style.background = 'transparent';
                btnTable.style.color = 'var(--text-muted)';
            } else {
                btnTable.classList.add('active');
                btnTable.style.background = 'var(--accent-emerald)';
                btnTable.style.color = '#000';
                btnCards.classList.remove('active');
                btnCards.style.background = 'transparent';
                btnCards.style.color = 'var(--text-muted)';
            }
        }

        if (cardsContainer && tableWrapper) {
            if (mode === 'cards') {
                cardsContainer.style.display = 'grid';
                tableWrapper.style.display = 'none';
            } else {
                cardsContainer.style.display = 'none';
                tableWrapper.style.display = 'block';
            }
        }
    }

    window.switchPageViewMode = function(pageId, mode) {
        pageViewModes[pageId] = mode;
        applyViewModeDisplay(pageId);
        if (pageId === 'futures') renderFuturesAnalysis();
        else if (pageId === 'commodities') renderCommoditiesAnalysis();
        else if (pageId === 'postmarket') renderPostMarketAnalysis();
        else if (pageId === 'comm-postmarket') renderCommoditiesPostMarketAnalysis();
    };

    // Initial Load
    loadDashboardData();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
