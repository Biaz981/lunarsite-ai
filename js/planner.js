// ============================================================
// Mission Planner - AI Site Selection
// ============================================================

function initPlanner() {
    const btn = document.getElementById('plannerRun');
    if (btn) btn.onclick = runPlanner;
}

function runPlanner() {
    const budget = document.getElementById('plannerBudget').value;
    const risk = document.getElementById('plannerRisk').value;
    const type = document.getElementById('plannerType').value;

    const ranked = rankAllSites();
    let best = null;
    let bestScore = -1;

    ranked.forEach(m => {
        let bonus = 0;
        const bd = m.breakdown;

        if (type === 'science' && bd.science > 85) bonus += 10;
        if (type === 'mining' && bd.waterIce > 85) bonus += 10;
        if (type === 'exploration' && bd.terrain > 80) bonus += 10;

        if (risk === 'safe' && bd.terrain > 75) bonus += 8;
        if (risk === 'risky' && bd.science > 90) bonus += 8;

        if (budget === 'low' && bd.sunlight > 80) bonus += 5;
        if (budget === 'high' && bd.waterIce > 90) bonus += 5;

        const finalScore = m.score + bonus;
        if (finalScore > bestScore) {
            bestScore = finalScore;
            best = m;
        }
    });

    const result = document.getElementById('plannerResult');
    result.classList.add('show');
    result.innerHTML = `
        <div style="font-size:0.7rem;color:#888;margin-bottom:6px;">Best for your needs:</div>
        <div style="font-size:1.1rem;font-weight:700;color:#51cf66;margin-bottom:4px;">${best.name}</div>
        <div style="font-size:0.75rem;color:#aaa;">${best.site}</div>
        <div style="font-size:0.8rem;color:#4a9eff;margin-top:6px;">Score: ${bestScore}</div>
    `;
}