// ============================================================
// LunarSite AI - Scoring Engine
// ============================================================

const WEIGHTS = { waterIce: 0.35, sunlight: 0.25, terrain: 0.25, science: 0.15 };

const SITE_METRICS = {
    "im-2":        { waterIce: 95, sunlight: 85, terrain: 70, science: 90 },
    "firefly-2":   { waterIce: 20, sunlight: 60, terrain: 85, science: 95 },
    "griffin-1":   { waterIce: 100, sunlight: 75, terrain: 55, science: 95 },
    "blue-moon-1": { waterIce: 98, sunlight: 80, terrain: 60, science: 85 },
    "lunar-vise":  { waterIce: 10, sunlight: 95, terrain: 80, science: 90 },
    "csmg":        { waterIce: 20, sunlight: 60, terrain: 85, science: 80 }
};

function calculateScore(missionId) {
    const m = SITE_METRICS[missionId];
    if (!m) return 0;
    return Math.round(
        m.waterIce * WEIGHTS.waterIce +
        m.sunlight * WEIGHTS.sunlight +
        m.terrain  * WEIGHTS.terrain  +
        m.science  * WEIGHTS.science
    );
}

function rankAllSites() {
    return CLPS_MISSIONS
        .map(m => ({ ...m, score: calculateScore(m.id), breakdown: SITE_METRICS[m.id] }))
        .sort((a, b) => b.score - a.score);
}

function scoreToColor(score) {
    if (score >= 85) return "#51cf66";
    if (score >= 70) return "#ffd43b";
    if (score >= 55) return "#ff922b";
    return "#ff6b6b";
}

function getRecommendation(score) {
    if (score >= 85) return "⭐ Prime landing candidate";
    if (score >= 70) return "✅ Strong candidate";
    if (score >= 55) return "⚠️ Needs further study";
    return "❌ High risk — avoid for now";
}

function customScore(ice, sun, terrain, science) {
    return Math.round(ice * 0.35 + sun * 0.25 + terrain * 0.25 + science * 0.15);
}