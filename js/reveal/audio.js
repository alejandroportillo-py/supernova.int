/* =============================================
   SUPERNOVA INTERNATIONAL — AUDIO.JS
   Background music system with user consent
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  const toggleBtn = document.getElementById('audio-toggle');
  if (!toggleBtn) return;

  const audio = new Audio('./music/background-loop.mp3');
  audio.loop   = true;
  audio.volume = 0.25;

  let isPlaying  = false;
  let userInteracted = false;

  // Icons
  const ICON_ON  = '🔊';
  const ICON_OFF = '🔇';

  toggleBtn.textContent = ICON_OFF;
  toggleBtn.setAttribute('aria-label', 'Toggle background music');
  toggleBtn.title = 'Background Music — Click to toggle';

  // ─── Attempt autoplay after first interaction ─────────
  function tryAutoPlay() {
    if (!userInteracted) {
      userInteracted = true;
      audio.play().then(() => {
        isPlaying = true;
        toggleBtn.textContent = ICON_ON;
        toggleBtn.classList.add('playing');
      }).catch(() => {
        // Autoplay blocked — user must click toggle
      });
    }
    document.removeEventListener('click', tryAutoPlay);
    document.removeEventListener('keydown', tryAutoPlay);
    document.removeEventListener('scroll', tryAutoPlay);
  }

  // Listen for first user gesture
  document.addEventListener('click',  tryAutoPlay, { once: true });
  document.addEventListener('keydown', tryAutoPlay, { once: true });
  document.addEventListener('scroll',  tryAutoPlay, { once: true, passive: true });

  // ─── Manual Toggle ───────────────────────────────────
  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();

    if (isPlaying) {
      // Fade out
      fadeOut(audio, 0.5).then(() => {
        audio.pause();
        isPlaying = false;
        toggleBtn.textContent = ICON_OFF;
        toggleBtn.classList.remove('playing');
      });
    } else {
      // Fade in
      audio.volume = 0;
      audio.play().then(() => {
        isPlaying = true;
        toggleBtn.textContent = ICON_ON;
        toggleBtn.classList.add('playing');
        fadeIn(audio, 0.25, 1.5);
      }).catch(() => {
        console.warn('Audio playback failed. Browser may require user gesture.');
      });
    }
  });

  // ─── Helpers: Fade in/out ────────────────────────────
  function fadeOut(audioEl, duration) {
    return new Promise(resolve => {
      const initial  = audioEl.volume;
      const steps    = 30;
      const interval = (duration * 1000) / steps;
      const step     = initial / steps;
      let   tick     = 0;

      const timer = setInterval(() => {
        tick++;
        audioEl.volume = Math.max(0, initial - step * tick);
        if (tick >= steps) { clearInterval(timer); resolve(); }
      }, interval);
    });
  }

  function fadeIn(audioEl, targetVolume, duration) {
    const steps    = 30;
    const interval = (duration * 1000) / steps;
    const step     = targetVolume / steps;
    let   tick     = 0;

    const timer = setInterval(() => {
      tick++;
      audioEl.volume = Math.min(targetVolume, step * tick);
      if (tick >= steps) clearInterval(timer);
    }, interval);
  }

  // ─── Page visibility — pause when hidden ─────────────
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && isPlaying) {
      audio.pause();
    } else if (!document.hidden && isPlaying) {
      audio.play();
    }
  });

});
