// ============================================================
// What-If Simulator
// ============================================================

function initSimulator() {
    ['ice', 'sun', 'terrain', 'science'].forEach(id => {
        const slider = document.getElementById(id + 'Slider');
        if (slider) slider.addEventListener('input', updateSimulation);
    });
    updateSimulation();
}

function updateSimulation() {
    const ice     = +document.getElementById('iceSlider').value;
    const sun     = +document.getElementById('sunSlider').value;
    const terrain = +document.getElementById('terrainSlider').value;
    const science = +document.getElementById('scienceSlider').value;

    const score = customScore(ice, sun, terrain, science);

    document.getElementById('val-ice').textContent = ice;
    document.getElementById('val-sun').textContent = sun;
    document.getElementById('val-terrain').textContent = terrain;
    document.getElementById('val-science').textContent = science;

    document.getElementById('simScore').textContent = score;
    document.getElementById('simScore').style.color = scoreToColor(score);
    document.getElementById('simRecommendation').textContent = getRecommendation(score);
}