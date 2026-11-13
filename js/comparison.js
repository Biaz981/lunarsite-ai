// ============================================================
// Comparison Mode
// ============================================================

function initComparison() {
    const selectA = document.getElementById('compareA');
    const selectB = document.getElementById('compareB');

    CLPS_MISSIONS.forEach(m => {
        [selectA, selectB].forEach(sel => {
            const opt = document.createElement('option');
            opt.value = m.id;
            opt.textContent = m.name;
            sel.appendChild(opt);
        });
    });

    selectA.addEventListener('change', renderComparison);
    selectB.addEventListener('change', renderComparison);
}

function renderComparison() {
    const aId = document.getElementById('compareA').value;
    const bId = document.getElementById('compareB').value;
    if (!aId || !bId) return;

    const a = CLPS_MISSIONS.find(m => m.id === aId);
    const b = CLPS_MISSIONS.find(m => m.id === bId);
    const mA = SITE_METRICS[a.id], mB = SITE_METRICS[b.id];
    const sA = calculateScore(a.id), sB = calculateScore(b.id);

    document.getElementById('comparisonResult').innerHTML = `
        <div class="compare-row">
            <div class="compare-col">
                <h3>${a.name}</h3>
                <div class="big-score" style="color:${scoreToColor(sA)}">${sA}</div>
                ${renderBars(mA)}
            </div>
            <div class="compare-col">
                <h3>${b.name}</h3>
                <div class="big-score" style="color:${scoreToColor(sB)}">${sB}</div>
                ${renderBars(mB)}
            </div>
        </div>
        <div class="winner">
            ${sA > sB ? `🏆 Winner: ${a.name}` : sB > sA ? `🏆 Winner: ${b.name}` : '🤝 Tie'}
        </div>
    `;
}

function renderBars(m) {
    const labels = { waterIce: 'Ice', sunlight: 'Sun', terrain: 'Terrain', science: 'Science' };
    return Object.keys(labels).map(k => `
        <div class="bar-row">
            <span>${labels[k]}</span>
            <div class="bar"><div style="width:${m[k]}%"></div></div>
            <b>${m[k]}</b>
        </div>
    `).join('');
}