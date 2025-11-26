// src/components/SoundPlayer.tsx
import { useSound } from 'use-sound';

const SOUND_URLS = {
  dashboard: 'https://assets.mixkit.co/sfx/preview/mixkit-epic-video-game-activation-689.mp3', // Epic rise
  lobby: 'https://assets.mixkit.co/sfx/preview/mixkit-arcade-retro-video-game-2043.mp3', // Lobby hum
  match: 'https://assets.mixkit.co/sfx/preview/mixkit-sword-clash-2018.mp3', // Sword clash
  countdown: 'https://assets.mixkit.co/sfx/preview/mixkit-countdown-voice-3963.mp3', // Beep
  correct: 'https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3', // Ding
  eliminated: 'https://assets.mixkit.co/sfx/preview/mixkit-game-notification-fail-1945.mp3', // Boom
  victory: 'https://assets.mixkit.co/sfx/preview/mixkit-magic-notification-2436.mp3', // Fanfare
};

let soundInstances: { [key: string]: ReturnType<typeof useSound> } = {};

export function playSound(name: keyof typeof SOUND_URLS) {
  if (!soundInstances[name]) {
    soundInstances[name] = useSound(SOUND_URLS[name], { volume: 0.6 });
  }
  const [play] = soundInstances[name];
  play();
}

// Hook for component use (e.g., on mount)
export function usePlayOnMount(soundName: keyof typeof SOUND_URLS) {
  useEffect(() => {
    playSound(soundName);
  }, [soundName]);
}