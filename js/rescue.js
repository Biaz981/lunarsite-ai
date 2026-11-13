// ============================================================
// Rescue Mode - Lost Astronaut Tracker (Solar Jaisa Alarm)
// ============================================================

let rescueActive = false;
let lostAstronaut = null;
let sosAlarmCtx = null;
let sosAlarmOsc = null;
let sosAlarmGain = null;

function initRescue() {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('sos-btn')) {
            triggerRescue(e.target.dataset.missionId);
        }
    });
}

function triggerRescue(missionId) {
    const mission = CLPS_MISSIONS.find(m => m.id === missionId);
    if (!mission) return;

    rescueActive = true;
    lostAstronaut = mission;

    // Saare panels ko hide karein
    const panelsToHide = [
        'panel', 'simulatorPanel', 'comparisonPanel', 'liveData', 
        'issTracker', 'plannerPanel', 'multiplayerPanel', 
        'pakistanSolar', 'moonPhase', 'missionBar', 'timelinePanel'
    ];
    panelsToHide.forEach(id => { 
        const el = document.getElementById(id); 
        if (el) el.style.display = 'none'; 
    });

    showRescueOverlay(mission);
}

function showRescueOverlay(mission) {
    const overlay = document.getElementById('rescueOverlay');
    overlay.style.display = 'flex';

    document.getElementById('rescueLocation').innerHTML = `
        <div class="rescue-coords">
            <span>Lat: <b>${mission.lat.toFixed(4)}°</b></span>
            <span>Lon: <b>${mission.lon.toFixed(4)}°</b></span>
        </div>
        <div class="rescue-site">${mission.site}</div>
        <div class="rescue-mission">${mission.fullName}</div>
    `;

    const distance = (Math.random() * 2 + 0.5).toFixed(2);
    document.getElementById('rescueDistance').textContent = `${distance} km`;

    startSosAlarm(); // Solar jaisa alarm
    speak(`Emergency! Astronaut lost near ${mission.site}.`);
}

function closeRescue() {
    document.getElementById('rescueOverlay').style.display = 'none';
    rescueActive = false;
    lostAstronaut = null;
    stopSosAlarm();

    // Panels wapas show karein
    const panelsToShow = [
        'simulatorPanel', 'comparisonPanel', 'liveData', 
        'issTracker', 'plannerPanel', 'pakistanSolar', 
        'moonPhase', 'missionBar', 'timelinePanel'
    ];
    panelsToShow.forEach(id => { 
        const el = document.getElementById(id); 
        if (el) el.style.display = ''; 
    });
    
    const mpPanel = document.getElementById('multiplayerPanel');
    if (mpPanel) mpPanel.style.display = 'none';
}

// ============================================================
// NAYA: Bilkul Solar Alarm Jaisa (Wahi Trick, Wahi Awaz)
// ============================================================
function startSosAlarm() {
    stopSosAlarm(); // Pehle band karein

    try {
        sosAlarmCtx = new (window.AudioContext || window.webkitAudioContext)();
        sosAlarmOsc = sosAlarmCtx.createOscillator();
        sosAlarmGain = sosAlarmCtx.createGain();

        sosAlarmOsc.connect(sosAlarmGain);
        sosAlarmGain.connect(sosAlarmCtx.destination);

        // Bilkul Solar wali settings
        sosAlarmOsc.type = 'square';
        sosAlarmOsc.frequency.setValueAtTime(1000, sosAlarmCtx.currentTime);
        
        // Wahi loop jo Solar mein hai (1000 baar, 0.8s repeat)
        let time = sosAlarmCtx.currentTime;
        for (let i = 0; i < 1000; i++) {
            sosAlarmGain.gain.setValueAtTime(0.08, time); // On
            sosAlarmGain.gain.setValueAtTime(0, time + 0.2); // Off
            sosAlarmGain.gain.setValueAtTime(0.08, time + 0.4); // On
            sosAlarmGain.gain.setValueAtTime(0, time + 0.6); // Off
            time += 0.8;
        }

        sosAlarmOsc.start();

    } catch (e) {
        console.warn("Audio context failed:", e);
    }
}

function stopSosAlarm() {
    try {
        if (sosAlarmOsc) {
            sosAlarmOsc.stop();
            sosAlarmOsc.disconnect();
            sosAlarmOsc = null;
        }
        if (sosAlarmGain) {
            sosAlarmGain.disconnect();
            sosAlarmGain = null;
        }
        if (sosAlarmCtx) {
            sosAlarmCtx.close();
            sosAlarmCtx = null;
        }
    } catch (e) {}
    
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}