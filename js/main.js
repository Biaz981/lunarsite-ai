// ============================================================
// LunarSite AI - Main Orchestrator (FINAL - Panel Fix v2)
// ============================================================

let markerGroup, iceGroup, apolloGroup;
let raycaster, mouse;
let isRotating = true, iceVisible = false, apollosVisible = false;
let selectedMission = null;

// ============================================================
// PANEL OPEN / CLOSE (inline !important => drag/resize/CSS sab override)
// ============================================================
function openPanel() {
    const panel = document.getElementById('panel');
    if (!panel) return;

    panel.classList.remove('dragging', 'resizing', 'force-show');

    // drag/resize/minimize ka purana inline position/size saaf karo
    ['left', 'top', 'bottom', 'transform', 'width', 'height'].forEach(p => panel.style.removeProperty(p));

    panel.style.setProperty('position', 'fixed', 'important');
    panel.style.setProperty('top', '0', 'important');
    panel.style.setProperty('left', 'auto', 'important');
    panel.style.setProperty('right', '0', 'important');
    panel.style.setProperty('display', 'block', 'important');
    panel.style.setProperty('visibility', 'visible', 'important');
    panel.style.setProperty('opacity', '1', 'important');
}

function closePanelUI() {
    const panel = document.getElementById('panel');
    if (!panel) return;

    panel.classList.remove('dragging', 'resizing', 'force-show');
    panel.style.setProperty('left', 'auto', 'important');
    panel.style.setProperty('right', '-420px', 'important');
    document.querySelectorAll('.mission-chip').forEach(c => c.classList.remove('active'));
}

function init() {
    initScene();
    createMarkers();
    createIceLayer();
    createApolloLayer();
    initSimulator();
    initComparison();

    setTimeout(() => { initAPIs(); }, 2500);

    initTimeline();
    initPlanner();
    initTerrain();
    initISS();
    initMultiplayer();
    initRescue();
    initAIDirector();
    setupUI();
    setupRaycaster();
    updateStats();
    animate();

    setTimeout(hideLoader, 2000);
}

function createMarkers() {
    markerGroup = new THREE.Group();
    CLPS_MISSIONS.forEach(m => {
        const pos = latLonToVector3(m.lat, m.lon, 5.03);
        const score = calculateScore(m.id);
        const color = scoreToColor(score);

        const pin = new THREE.Mesh(
            new THREE.SphereGeometry(0.07, 16, 16),
            new THREE.MeshBasicMaterial({ color })
        );
        pin.position.copy(pos);
        pin.userData = { mission: m, score };
        markerGroup.add(pin);

        const ring = new THREE.Mesh(
            new THREE.RingGeometry(0.09, 0.13, 24),
            new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.6, side: THREE.DoubleSide })
        );
        ring.position.copy(pos);
        ring.lookAt(0, 0, 0);
        ring.userData = { mission: m, score };
        markerGroup.add(ring);
    });
    scene.add(markerGroup);
}

function createIceLayer() {
    iceGroup = new THREE.Group();
    WATER_ICE_SITES.forEach(site => {
        const pos = latLonToVector3(site.lat, site.lon, 5.02);
        const ice = new THREE.Mesh(
            new THREE.SphereGeometry(0.14, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0x66ddff, transparent: true, opacity: 0.55 })
        );
        ice.position.copy(pos);
        iceGroup.add(ice);
    });
    iceGroup.visible = false;
    scene.add(iceGroup);
}

function createApolloLayer() {
    apolloGroup = new THREE.Group();
    APOLLO_MISSIONS.forEach(m => {
        const pos = latLonToVector3(m.lat, m.lon, 5.03);
        const pin = new THREE.Mesh(
            new THREE.SphereGeometry(0.06, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0xffd43b })
        );
        pin.position.copy(pos);
        pin.userData = { mission: m, score: 100, historical: true };
        apolloGroup.add(pin);
    });
    apolloGroup.visible = false;
    scene.add(apolloGroup);
}

function setupRaycaster() {
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    renderer.domElement.addEventListener('click', e => {
        mouse.x = (e.clientX / innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        const all = [...markerGroup.children, ...apolloGroup.children];
        const hits = raycaster.intersectObjects(all);
        const hit = hits.find(h => h.object.userData.mission);
        if (hit) selectMission(hit.object.userData.mission, hit.object.userData.score);
    });

    renderer.domElement.addEventListener('mousemove', e => {
        mouse.x = (e.clientX / innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const all = [...markerGroup.children, ...apolloGroup.children];
        const hits = raycaster.intersectObjects(all);
        renderer.domElement.style.cursor = hits.length > 0 ? 'pointer' : 'grab';
    });
}

function selectMission(mission, score) {
    selectedMission = mission;
    const isHist = mission.era === 'historical';
    const m = isHist
        ? { waterIce: 0, sunlight: 0, terrain: 0, science: 100 }
        : SITE_METRICS[mission.id];

    // Har click par panel dobara kholo
    openPanel();

    const content = document.getElementById('panelContent');
    content.innerHTML = `
        <div class="mission-card">
            <div class="score-badge" style="background:${isHist ? '#ffd43b' : scoreToColor(score)}">
                <span class="score-number">${isHist ? '★' : score}</span>
                <span class="score-label">${isHist ? 'HISTORIC' : '/100'}</span>
            </div>
            <h3>${mission.fullName || mission.name}</h3>
            <p class="recommendation">${isHist ? `Year: ${mission.year} — ${mission.objective}` : getRecommendation(score)}</p>
            <div class="section-title">Mission Details</div>
            ${mission.company ? `<div class="row"><span>Company</span><b>${mission.company}</b></div>` : ''}
            ${mission.crew ? `<div class="row"><span>Crew</span><b>${mission.crew}</b></div>` : ''}
            ${mission.lander ? `<div class="row"><span>Lander</span><b>${mission.lander}</b></div>` : ''}
            ${mission.launch ? `<div class="row"><span>Launch</span><b>${mission.launch}</b></div>` : ''}
            <div class="row"><span>Site</span><b>${mission.site}</b></div>
            <div class="row"><span>Region</span><b>${mission.region || mission.site}</b></div>
            <div class="row"><span>Coords</span><b>${mission.lat.toFixed(2)}°, ${mission.lon.toFixed(2)}°</b></div>
            ${mission.payload ? `<div class="section-title">Payload</div><p class="objective">${mission.payload}</p>` : ''}
            ${!isHist ? `
                <div class="section-title">AI Score Breakdown</div>
                ${['waterIce','sunlight','terrain','science'].map(k => `
                    <div class="bar-row">
                        <span>${k === 'waterIce' ? 'Ice' : k === 'sunlight' ? 'Sun' : k.charAt(0).toUpperCase() + k.slice(1)}</span>
                        <div class="bar"><div style="width:${m[k]}%"></div></div>
                        <b>${m[k]}</b>
                    </div>
                `).join('')}
            ` : ''}
            ${!isHist ? renderCountdown(mission.id) : ''}
            <button class="export-btn" id="exportBtn">📄 Download Report</button>
            ${!isHist ? `<button class="sos-btn" data-mission-id="${mission.id}">🚨 SOS - Track Astronaut</button>` : ''}
        </div>
    `;

    document.querySelectorAll('.mission-chip').forEach(c => {
        c.classList.toggle('active', c.dataset.id === mission.id);
    });

    document.getElementById('exportBtn').onclick = () => exportReport(mission, score);
    narrateMission(mission, score);
    flyTo(mission);
}

function flyTo(mission) {
    isRotating = false;
    document.getElementById('toggleRotation').textContent = '▶';
    const target = latLonToVector3(mission.lat, mission.lon, 10);
    const start = camera.position.clone();
    const t0 = Date.now();
    (function step() {
        const t = Math.min((Date.now() - t0) / 1300, 1);
        const e = 1 - Math.pow(1 - t, 3);
        camera.position.lerpVectors(start, target, e);
        controls.target.lerp(new THREE.Vector3(0, 0, 0), 0.05);
        controls.update();
        if (t < 1) requestAnimationFrame(step);
    })();
}

function setupUI() {
    document.getElementById('closePanel').onclick = () => {
        closePanelUI();
        stopVoice();
    };

    document.getElementById('toggleRotation').onclick = e => {
        isRotating = !isRotating;
        e.target.textContent = isRotating ? '⏸' : '▶';
    };

    document.getElementById('resetView').onclick = () => {
        camera.position.set(0, 3, 14);
        controls.target.set(0, 0, 0);
        isRotating = true;
        isTerrainMode = false;
        scene.fog = null;
        document.getElementById('terrainBtn').classList.remove('active');
        document.getElementById('toggleRotation').textContent = '⏸';
        closePanelUI();
    };

    document.getElementById('toggleIce').onclick = e => {
        iceVisible = !iceVisible;
        iceGroup.visible = iceVisible;
        e.target.classList.toggle('active', iceVisible);
    };

    document.getElementById('toggleApollo').onclick = e => {
        apollosVisible = !apollosVisible;
        apolloGroup.visible = apollosVisible;
        e.target.classList.toggle('active', apollosVisible);
    };

    document.getElementById('stopVoice').onclick = stopVoice;

    const list = document.getElementById('missionList');
    rankAllSites().forEach(m => {
        const chip = document.createElement('div');
        chip.className = 'mission-chip';
        chip.dataset.id = m.id;
        chip.innerHTML = `${m.name} <span class="chip-score" style="color:${scoreToColor(m.score)}">${m.score}</span>`;
        chip.onclick = () => selectMission(m, m.score);
        list.appendChild(chip);
    });
}

function updateStats() {
    document.getElementById('missionCount').textContent = CLPS_MISSIONS.length + APOLLO_MISSIONS.length;
    document.getElementById('siteCount').textContent = new Set([...CLPS_MISSIONS, ...APOLLO_MISSIONS].map(m => m.site)).size;
    const ranked = rankAllSites();
    if (ranked.length > 0) document.getElementById('topScore').textContent = ranked[0].score;
}

function hideLoader() {
    const l = document.getElementById('loader');
    if (!l) return;
    l.style.opacity = '0';
    setTimeout(() => l.style.display = 'none', 700);
}

function animate() {
    requestAnimationFrame(animate);
    if (isRotating && moon && !isTerrainMode) moon.rotation.y += 0.0012;

    const t = Date.now() * 0.003;
    if (markerGroup) {
        markerGroup.children.forEach((c, i) => {
            if (c.geometry && c.geometry.type === 'RingGeometry') {
                const s = 1 + Math.sin(t + i * 0.5) * 0.18;
                c.scale.set(s, s, s);
            }
        });
    }

    controls.update();
    renderer.render(scene, camera);
}

addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
});

init();