/**
 * Sound Manager for Ramen Sensei
 * Manages looping audio and one-shot UI sounds with precise control.
 */

let activeSounds: Record<string, HTMLAudioElement> = {};

export function playSound(src: string, volume = 1, loop = false, key?: string) {
    if (typeof window === 'undefined') return;

    const audio = new Audio(src);
    audio.volume = volume;
    audio.loop = loop;

    if (key) {
        stopSound(key);
        activeSounds[key] = audio;
    }

    console.log("🔊 SYNC: Trying to play " + src);
    audio.play().catch((err) => {
        console.warn(`🔇 SYNC: Sound '${src}' was blocked. Click anywhere on the page to enable audio!`, err);
    });
}

export function stopSound(key: string) {
    if (activeSounds[key]) {
        activeSounds[key].pause();
        activeSounds[key].currentTime = 0;
        delete activeSounds[key];
    }
}

export function speakSensei(text: string) {
    if (typeof window === 'undefined') return;

    // Help browser load voices
    if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = () => speakSensei(text);
        return;
    }

    // Cancel existing speech to avoid overlap
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to find a "Master / Deep / Male" voice (Initial Profile)
    const voices = window.speechSynthesis.getVoices();
    const masterVoice = voices.find(v => 
        v.name.includes("Google Japanese") || 
        v.name.includes("Deep") || 
        v.name.includes("Male") ||
        v.name.includes("David") || // Standard English Male
        v.name.includes("Mark")      // Standard English Male
    );
    
    if (masterVoice) utterance.voice = masterVoice;
    
    utterance.pitch = 0.85; // Deep / Master
    utterance.rate = 0.95;  // Authoritative
    utterance.volume = 1.0;

    window.speechSynthesis.speak(utterance);
}

export function stopAllSounds() {
    if (typeof window !== 'undefined') {
        window.speechSynthesis.cancel();
    }
    Object.keys(activeSounds).forEach(stopSound);
}
