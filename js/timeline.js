// ============================================================
// Timeline Mode
// ============================================================

let timelineYear = 2026;

function initTimeline() {
    const slider = document.getElementById('timelineSlider');
    const yearLabel = document.getElementById('timelineYear');

    slider.addEventListener('input', (e) => {
        timelineYear = +e.target.value;
        yearLabel.textContent = timelineYear;
        applyTimelineFilter();
    });

    document.getElementById('resetTimeline').onclick = resetTimeline;
}

function applyTimelineFilter() {
    APOLLO_MISSIONS.forEach(mission => {
        const marker = apolloGroup.children.find(
            c => c.userData.mission && c.userData.mission.id === mission.id
        );
        if (marker) marker.visible = mission.year <= timelineYear;
    });

    markerGroup.children.forEach(child => {
        if (child.userData.mission) {
            child.visible = timelineYear >= 2025;
        }
    });
}

function resetTimeline() {
    timelineYear = 2026;
    document.getElementById('timelineSlider').value = 2026;
    document.getElementById('timelineYear').textContent = 2026;
    applyTimelineFilter();
}