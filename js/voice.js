// ============================================================
// Voice Narration
// ============================================================

function speak(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95; 
    u.pitch = 1.2;  // آواز کو تھوڑا پتلا (female جیسا) کرنے کے لیے
    u.volume = 1.0; 
    u.lang = 'en-US';

    // براؤزر سے تمام آوازیں حاصل کریں اور female آواز تلاش کریں
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
        voice.name.includes('Female') || 
        voice.name.includes('Samantha') || 
        voice.name.includes('Zira') || 
        voice.name.includes('Google UK English Female')
    );

    if (femaleVoice) {
        u.voice = femaleVoice;
    }

    window.speechSynthesis.speak(u);
}

function narrateMission(mission, score) {
    const isHist = mission.era === 'historical';
    const text = isHist
        ? `${mission.name}. Year ${mission.year}. Landing site: ${mission.site}. Crew: ${mission.crew}.`
        : `${mission.fullName}. Company: ${mission.company}. Landing site: ${mission.site}. AI Score: ${score} out of 100. ${getRecommendation(score)}`;
    speak(text);
}

function stopVoice() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}