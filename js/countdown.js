// ============================================================
// Launch Countdown
// ============================================================

const LAUNCH_DATES = {
    "im-2":        new Date("2026-11-15T00:00:00Z"),
    "firefly-2":   new Date("2026-12-01T00:00:00Z"),
    "griffin-1":   new Date("2026-12-20T00:00:00Z"),
    "blue-moon-1": new Date("2027-01-15T00:00:00Z"),
    "lunar-vise":  new Date("2026-11-15T00:00:00Z"),
    "csmg":        new Date("2026-12-01T00:00:00Z")
};

function getCountdown(missionId) {
    const launchDate = LAUNCH_DATES[missionId];
    if (!launchDate) return null;
    const diff = launchDate - new Date();
    if (diff < 0) return { launched: true, text: "🚀 LAUNCHED" };

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return { launched: false, text: `${days}d ${hours}h ${minutes}m ${seconds}s` };
}

function renderCountdown(missionId) {
    const cd = getCountdown(missionId);
    if (!cd) return '';
    if (cd.launched) return `<div class="countdown launched">🚀 Launched</div>`;
    return `<div class="countdown">
        <div class="countdown-label">Launch In</div>
        <div class="countdown-time">${cd.text}</div>
    </div>`;
}

setInterval(() => {
    if (selectedMission && !selectedMission.era) {
        const el = document.querySelector('.countdown-time');
        if (el) {
            const cd = getCountdown(selectedMission.id);
            if (cd && !cd.launched) el.textContent = cd.text;
        }
    }
}, 1000);