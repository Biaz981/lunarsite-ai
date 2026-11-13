// ============================================================
// ISS Live Tracker
// ============================================================

let issPath = [];

function initISS() {
    updateISS();
    setInterval(updateISS, 5000);
}

async function updateISS() {
    try {
        const res = await fetch('http://api.open-notify.org/iss-now.json');
        const data = await res.json();
        const lat = parseFloat(data.iss_position.latitude);
        const lon = parseFloat(data.iss_position.longitude);

        document.getElementById('issLat').textContent = lat.toFixed(2);
        document.getElementById('issLon').textContent = lon.toFixed(2);
        document.getElementById('issAlt').textContent = (408 + Math.random()*5).toFixed(0);
        document.getElementById('issVel').textContent = '27,600';

        issPath.push({ lat, lon });
        if (issPath.length > 50) issPath.shift();
        drawISSPath();
    } catch (e) {
        document.getElementById('issLat').textContent = '—';
        document.getElementById('issLon').textContent = '—';
    }
}

function drawISSPath() {
    const canvas = document.getElementById('issCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(74,158,255,0.15)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * 20);
        ctx.lineTo(canvas.width, i * 20);
        ctx.stroke();
    }

    if (issPath.length > 1) {
        ctx.strokeStyle = '#4a9eff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        issPath.forEach((p, i) => {
            const x = ((p.lon + 180) / 360) * canvas.width;
            const y = ((90 - p.lat) / 180) * canvas.height;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();
    }

    if (issPath.length > 0) {
        const last = issPath[issPath.length - 1];
        const x = ((last.lon + 180) / 360) * canvas.width;
        const y = ((90 - last.lat) / 180) * canvas.height;
        ctx.fillStyle = '#51cf66';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
    }
}