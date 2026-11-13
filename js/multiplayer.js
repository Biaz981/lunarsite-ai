// ============================================================
// Multiplayer - Simulated
// ============================================================

let mpConnected = false;
let mpInterval = null;

function initMultiplayer() {
    const btn = document.getElementById('multiplayerBtn');
    if (btn) btn.onclick = toggleMultiplayerPanel;
    const conn = document.getElementById('mpConnect');
    if (conn) conn.onclick = connectMultiplayer;
    const disc = document.getElementById('mpDisconnect');
    if (disc) disc.onclick = disconnectMultiplayer;
}

function toggleMultiplayerPanel() {
    const panel = document.getElementById('multiplayerPanel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

function connectMultiplayer() {
    mpConnected = true;
    const users = 1 + Math.floor(Math.random() * 4);
    document.getElementById('mpStatus').textContent = 'Connected';
    document.getElementById('mpStatus').style.color = '#51cf66';
    document.getElementById('mpUsers').textContent = users;
    document.getElementById('mpConnect').style.display = 'none';
    document.getElementById('mpDisconnect').style.display = 'block';

    logMP('Connected to LunarSite network');
    logMP(`${users} users online`);

    mpInterval = setInterval(() => {
        const actions = [
            'User_47 selected Shackleton Crater',
            'User_12 added marker at Mons Mouton',
            'User_89 ran Mission Planner',
            'User_23 exported report',
            'User_56 toggled water ice layer'
        ];
        logMP(actions[Math.floor(Math.random() * actions.length)]);
    }, 4000);
}

function disconnectMultiplayer() {
    mpConnected = false;
    clearInterval(mpInterval);
    document.getElementById('mpStatus').textContent = 'Disconnected';
    document.getElementById('mpStatus').style.color = '#ff6b6b';
    document.getElementById('mpUsers').textContent = 0;
    document.getElementById('mpConnect').style.display = 'block';
    document.getElementById('mpDisconnect').style.display = 'none';
    logMP('Disconnected');
}

function logMP(msg) {
    const log = document.getElementById('mpLog');
    const time = new Date().toLocaleTimeString();
    log.innerHTML = `[${time}] ${msg}<br>` + log.innerHTML;
}