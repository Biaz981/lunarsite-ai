// ============================================================
// AI Director: Voice Commands & Cinematic Story Mode
// ============================================================

let recognition;
let isListening = false;
let shouldKeepListening = false; // NAYA: Mic ko continuous rakhne ke liye

function initAIDirector() {
    // 1. Voice Command Setup
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = true; // NAYA: Continuous sunta rahe
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            const last = event.results.length - 1;
            const command = event.results[last][0].transcript.toLowerCase();
            handleVoiceCommand(command);
        };

        recognition.onend = () => {
            // NAYA: Agar user ne khud band nahi kiya, to dobara shuru karein
            if (shouldKeepListening) {
                try {
                    recognition.start();
                } catch (e) {}
            } else {
                isListening = false;
                const micBtn = document.getElementById('micBtn');
                if (micBtn) micBtn.style.background = 'rgba(255,255,255,0.07)';
            }
        };
    }

    // 2. Add Buttons
    const controls = document.getElementById('controls');
    if (controls) {
        const micBtn = document.createElement('button');
        micBtn.id = 'micBtn';
        micBtn.title = 'Voice Command';
        micBtn.textContent = '🎤';
        micBtn.onclick = toggleVoiceCommand;
        controls.appendChild(micBtn);

        const storyBtn = document.createElement('button');
        storyBtn.id = 'storyBtn';
        storyBtn.title = 'Cinematic Story Mode';
        storyBtn.textContent = '🎬';
        storyBtn.onclick = startStoryMode;
        controls.appendChild(storyBtn);
    }
}

// --- VOICE COMMANDS ---
function toggleVoiceCommand() {
    if (!recognition) {
        alert("Aap ka browser voice command support nahi karta. Google Chrome use karein.");
        return;
    }

    if (isListening) {
        // User ne khud band kiya
        shouldKeepListening = false;
        recognition.stop();
        isListening = false;
        document.getElementById('micBtn').style.background = 'rgba(255,255,255,0.07)';
        speak("Voice command stopped.");
    } else {
        // User ne shuru kiya
        shouldKeepListening = true;
        try {
            recognition.start();
            isListening = true;
            document.getElementById('micBtn').style.background = '#ff4d4d';
            speak("Listening continuously. Click again to stop.");
        } catch (e) {
            console.warn("Mic start error:", e);
        }
    }
}

function handleVoiceCommand(command) {
    console.log("Voice Command:", command);
    
    if (command.includes("apollo")) {
        toggleApolloLayer(true);
        speak("Showing Apollo historical missions.");
    } 
    else if (command.includes("ice") || command.includes("water")) {
        toggleIceLayer(true);
        speak("Showing water ice deposits.");
    }
    else if (command.includes("compare")) {
        speak("Opening comparison panel.");
    }
    else if (command.includes("im-2") || command.includes("intuitive")) {
        const m = CLPS_MISSIONS.find(x => x.id === 'im-2');
        if (m) selectMission(m, calculateScore(m.id));
        speak("Selecting IM-2 mission.");
    }
    else if (command.includes("reset") || command.includes("home")) {
        document.getElementById('resetView').click();
        speak("View reset.");
    }
    else if (command.includes("stop") || command.includes("band")) {
        shouldKeepListening = false;
        recognition.stop();
        isListening = false;
        document.getElementById('micBtn').style.background = 'rgba(255,255,255,0.07)';
        speak("Voice command stopped.");
    }
    else {
        speak("Sorry, I didn't understand that command.");
    }
}

// --- CINEMATIC STORY MODE ---
function startStoryMode() {
    const storySequence = [
        { id: "apollo-11", text: "In 1969, humans first stepped on the Moon at the Sea of Tranquility." },
        { id: "lunar-vise", text: "Now, NASA is returning. This is Lunar-VISE, targeting unique volcanic domes." },
        { id: "griffin-1", text: "Astrobotic's Griffin-1 will carry the VIPER rover to search for water ice at the South Pole." },
        { id: "im-2", text: "Intuitive Machines IM-2 will drill near Mons Mouton to extract this precious resource." }
    ];

    let currentIndex = 0;
    
    let overlay = document.getElementById('storyOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'storyOverlay';
        overlay.style.cssText = `
            position: fixed; bottom: 200px; left: 50%; transform: translateX(-50%);
            background: rgba(0,0,0,0.85); border-left: 4px solid #4a9eff;
            padding: 20px 30px; border-radius: 8px; color: white;
            font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem;
            z-index: 9999; max-width: 600px; text-align: center;
            box-shadow: 0 0 30px rgba(74,158,255,0.2); display: none;
            backdrop-filter: blur(10px);
        `;
        document.body.appendChild(overlay);
    }

    overlay.style.display = 'block';

    function playNextStory() {
        if (currentIndex >= storySequence.length) {
            overlay.style.display = 'none';
            speak("End of story. Thank you for watching.");
            return;
        }

        const step = storySequence[currentIndex];
        overlay.textContent = step.text;
        
        const mission = [...CLPS_MISSIONS, ...APOLLO_MISSIONS].find(m => m.id === step.id);
        if (mission) {
            const score = mission.era === 'historical' ? 100 : calculateScore(mission.id);
            selectMission(mission, score);
            speak(step.text);
        }

        currentIndex++;
        setTimeout(playNextStory, 8000);
    }

    playNextStory();
}

// Helper functions
function toggleApolloLayer(show) {
    if (typeof apollosVisible !== 'undefined' && typeof apolloGroup !== 'undefined') {
        apollosVisible = show;
        apolloGroup.visible = show;
        const btn = document.getElementById('toggleApollo');
        if (btn) btn.classList.toggle('active', show);
    }
}

function toggleIceLayer(show) {
    if (typeof iceVisible !== 'undefined' && typeof iceGroup !== 'undefined') {
        iceVisible = show;
        iceGroup.visible = show;
        const btn = document.getElementById('toggleIce');
        if (btn) btn.classList.toggle('active', show);
    }
}