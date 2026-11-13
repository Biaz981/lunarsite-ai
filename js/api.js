// ============================================================
// NASA Live API (Smart Solar Alert - Continuous Alarm)
// ============================================================

const NASA_API_KEY = "oCxRevHJYVXgIqfbpCE62fUcRPCcOR2JM0lG7kCE";
let hasAlertShownThisSession = false;
let solarAlarmCtx = null;
let solarAlarmOsc = null;
let solarAlarmGain = null;

async function fetchSpaceWeather() {
    try {
        const res = await fetch(`https://ccmc.gsfc.nasa.gov/DONKI-API/get/notifications`);
        if (!res.ok) throw new Error('API Error');
        
        const data = await res.json();
        const count = Array.isArray(data) ? data.length : 0;
        document.getElementById('weatherCount').textContent = count;

        const loader = document.getElementById('loader');
        const isLoaderActive = loader && loader.style.display !== 'none';

        let alertBox = document.getElementById('solarAlert');
        let alertBtn = document.getElementById('solarAlertBtn');

        if (count > 0) {
            if (!alertBtn) createAlertButton();
            else alertBtn.style.display = 'flex';

            if (!hasAlertShownThisSession && !isLoaderActive) {
                if (!alertBox) createAlertPanel();
                document.getElementById('solarAlert').style.display = 'block';
                startSolarAlarm();
                hasAlertShownThisSession = true;
            }
        } else {
            if (alertBox) alertBox.style.display = 'none';
            if (alertBtn) alertBtn.style.display = 'none';
            hasAlertShownThisSession = false;
            stopSolarAlarm();
        }
    } catch (e) {
        document.getElementById('weatherCount').textContent = '—';
    }
}

function createAlertPanel() {
    let alertBox = document.createElement('div');
    alertBox.id = 'solarAlert';
    alertBox.className = 'solar-alert-panel';
    alertBox.innerHTML = `
        <div class="solar-alert-title">⚠️ HIGH SOLAR RADIATION</div>
        <div class="solar-alert-desc">High radiation detected. Astronauts stay indoors!</div>
        <button class="solar-alert-close" onclick="closeSolarAlert()">✕ Close Alarm</button>
    `;
    document.body.appendChild(alertBox);
}

function closeSolarAlert() {
    const panel = document.getElementById('solarAlert');
    if (panel) panel.style.display = 'none';
    stopSolarAlarm();
}

function createAlertButton() {
    let alertBtn = document.createElement('div');
    alertBtn.id = 'solarAlertBtn';
    alertBtn.className = 'solar-alert-btn';
    alertBtn.innerHTML = `⚠️`;
    alertBtn.title = "View Solar Alert";
    
    alertBtn.onclick = () => {
        let panel = document.getElementById('solarAlert');
        if (!panel) createAlertPanel();
        panel = document.getElementById('solarAlert');
        if (panel.style.display === 'block') {
            panel.style.display = 'none';
            stopSolarAlarm();
        } else {
            panel.style.display = 'block';
            startSolarAlarm();
        }
    };
    document.body.appendChild(alertBtn);
}

// NAYA: Continuous Alarm (Loop)
function startSolarAlarm() {
    stopSolarAlarm(); // Pehle band karein

    try {
        solarAlarmCtx = new (window.AudioContext || window.webkitAudioContext)();
        solarAlarmOsc = solarAlarmCtx.createOscillator();
        solarAlarmGain = solarAlarmCtx.createGain();

        solarAlarmOsc.connect(solarAlarmGain);
        solarAlarmGain.connect(solarAlarmCtx.destination);

        // Beep sound (Square wave)
        solarAlarmOsc.type = 'square';
        solarAlarmOsc.frequency.setValueAtTime(1000, solarAlarmCtx.currentTime);
        
        // Beep on/off loop
        let time = solarAlarmCtx.currentTime;
        for (let i = 0; i < 1000; i++) {
            solarAlarmGain.gain.setValueAtTime(0.08, time); // On
            solarAlarmGain.gain.setValueAtTime(0, time + 0.2); // Off
            solarAlarmGain.gain.setValueAtTime(0.08, time + 0.4); // On
            solarAlarmGain.gain.setValueAtTime(0, time + 0.6); // Off
            time += 0.8; // Har 0.8 second baad repeat
        }

        solarAlarmOsc.start();

    } catch (e) {
        console.warn("Audio context failed:", e);
    }
}

function stopSolarAlarm() {
    try {
        if (solarAlarmOsc) {
            solarAlarmOsc.stop();
            solarAlarmOsc.disconnect();
            solarAlarmOsc = null;
        }
        if (solarAlarmGain) {
            solarAlarmGain.disconnect();
            solarAlarmGain = null;
        }
        if (solarAlarmCtx) {
            solarAlarmCtx.close();
            solarAlarmCtx = null;
        }
    } catch (e) {}
}

async function fetchApod() {
    try {
        const res = await fetch(`https://science.nasa.gov/wp-json/wp/v2/apod-basic`);
        if (!res.ok) throw new Error('APOD server error');
        const data = await res.json();
        const apod = Array.isArray(data) ? data[0] : data;
        document.getElementById('apodTitle').textContent = apod.title || '—';
    } catch (e) {
        document.getElementById('apodTitle').textContent = '—';
    }
}

async function fetchPakistanSolarData() {
    try {
        const lat = 31.5204; const lon = 74.3587;
        const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=ALLSKY_SFC_SW_DWN&community=RE&longitude=${lon}&latitude=${lat}&start=${today}&end=${today}&format=JSON`;
        const res = await fetch(url);
        const data = await res.json();
        const solarValue = data.properties.parameter.ALLSKY_SFC_SW_DWN[today];
        
        let solarBox = document.getElementById('pakistanSolar');
        if (!solarBox) {
            solarBox = document.createElement('div');
            solarBox.id = 'pakistanSolar';
            solarBox.innerHTML = `<div class="panel-header"><h3>🇵🇰 Pakistan Solar</h3></div><div style="font-size:0.9rem; color:#ffd43b; font-weight:600;" id="solarValue">Loading...</div>`;
            document.body.appendChild(solarBox);
            if (typeof makeDraggable === 'function') makeDraggable(solarBox);
            if (typeof makeResizable === 'function') makeResizable(solarBox);
            if (typeof addMinimizeButton === 'function') addMinimizeButton(solarBox);
        }
        document.getElementById('solarValue').textContent = solarValue ? `${solarValue} kWh/m²` : '—';
    } catch (e) { 
        const el = document.getElementById('solarValue'); 
        if (el) el.textContent = '—'; 
    }
}

function calculateMoonPhase() {
    const now = new Date();
    const knownNewMoon = new Date('2026-01-18');
    const lunarCycle = 29.53059;
    const daysSince = (now - knownNewMoon) / (1000 * 60 * 60 * 24);
    const phase = (daysSince % lunarCycle) / lunarCycle;
    let phaseName, illumination;
    if (phase < 0.03 || phase > 0.97) { phaseName = '🌑 New Moon'; illumination = 0; }
    else if (phase < 0.22) { phaseName = '🌒 Waxing Crescent'; illumination = Math.round(phase * 100); }
    else if (phase < 0.28) { phaseName = '🌓 First Quarter'; illumination = 50; }
    else if (phase < 0.47) { phaseName = '🌔 Waxing Gibbous'; illumination = Math.round(phase * 100); }
    else if (phase < 0.53) { phaseName = '🌕 Full Moon'; illumination = 100; }
    else if (phase < 0.72) { phaseName = '🌖 Waning Gibbous'; illumination = Math.round((1 - phase) * 100); }
    else if (phase < 0.78) { phaseName = '🌗 Last Quarter'; illumination = 50; }
    else { phaseName = '🌘 Waning Crescent'; illumination = Math.round((1 - phase) * 100); }
    
    let moonBox = document.getElementById('moonPhase');
    if (!moonBox) {
        moonBox = document.createElement('div');
        moonBox.id = 'moonPhase';
        moonBox.innerHTML = `<div class="panel-header"><h3>🌕 Moon Phase</h3></div><div style="font-size:0.9rem; color:#4a9eff; font-weight:600;" id="moonPhaseText">Loading...</div>`;
        document.body.appendChild(moonBox);
        if (typeof makeDraggable === 'function') makeDraggable(moonBox);
        if (typeof makeResizable === 'function') makeResizable(moonBox);
        if (typeof addMinimizeButton === 'function') addMinimizeButton(moonBox);
    }
    document.getElementById('moonPhaseText').textContent = `${phaseName} (${illumination}%)`;
}

function initAPIs() {
    fetchSpaceWeather();
    fetchApod();
    fetchPakistanSolarData();
    calculateMoonPhase();
    setInterval(fetchSpaceWeather, 300000);
    setInterval(fetchPakistanSolarData, 3600000);
}