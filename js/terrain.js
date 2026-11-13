// ============================================================
// 3D Terrain View - Land on Surface
// ============================================================

let isTerrainMode = false;

function initTerrain() {
    const btn = document.getElementById('terrainBtn');
    if (btn) btn.onclick = toggleTerrain;
}

function toggleTerrain() {
    if (!selectedMission) {
        alert('Pehle koi mission select karein.');
        return;
    }

    isTerrainMode = !isTerrainMode;
    const btn = document.getElementById('terrainBtn');
    btn.classList.toggle('active', isTerrainMode);

    if (isTerrainMode) {
        landOnSurface(selectedMission);
    } else {
        camera.position.set(0, 3, 14);
        controls.target.set(0, 0, 0);
        scene.fog = null;
        isRotating = true;
    }
}

function landOnSurface(mission) {
    const target = latLonToVector3(mission.lat, mission.lon, 5.5);
    const start = camera.position.clone();
    const t0 = Date.now();
    isRotating = false;

    (function step() {
        const t = Math.min((Date.now() - t0) / 1500, 1);
        const e = 1 - Math.pow(1 - t, 3);
        camera.position.lerpVectors(start, target, e);
        controls.target.lerp(latLonToVector3(mission.lat, mission.lon, 5), 0.08);
        controls.update();
        if (t < 1) requestAnimationFrame(step);
        else scene.fog = new THREE.Fog(0x000004, 3, 12);
    })();
}