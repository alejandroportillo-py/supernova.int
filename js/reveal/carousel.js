/* =============================================
   SUPERNOVA INTERNATIONAL — CAROUSEL.JS
   Gallery carousel with touch & auto-play
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  const track    = document.querySelector('.gallery-track');
  const items    = document.querySelectorAll('.gallery-item');
  const prevBtn  = document.getElementById('gallery-prev');
  const nextBtn  = document.getElementById('gallery-next');
  const dotsWrap = document.querySelector('.gallery-dots');

  if (!track || items.length === 0) return;

  const VISIBLE  = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  const TOTAL    = items.length;
  let   current  = 0;
  let   autoPlay = null;

  // ─── Create dots ──────────────────────────
  if (dotsWrap) {
    for (let i = 0; i < TOTAL; i++) {
      const dot = document.createElement('button');
      dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  }

  function updateDots() {
    if (!dotsWrap) return;
    dotsWrap.querySelectorAll('.gallery-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  // ─── Go to slide ─────────────────────────
  function goTo(index) {
    current = ((index % TOTAL) + TOTAL) % TOTAL;
    const itemWidth = items[0].offsetWidth + 24; // gap 24px
    track.style.transform = `translateX(-${current * itemWidth}px)`;
    updateDots();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetAutoPlay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetAutoPlay(); });

  // ─── Auto-play ───────────────────────────
  function startAutoPlay() {
    autoPlay = setInterval(next, 4000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlay);
    startAutoPlay();
  }

  startAutoPlay();

  // Pause on hover
  const carousel = document.querySelector('.gallery-carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', () => clearInterval(autoPlay));
    carousel.addEventListener('mouseleave', startAutoPlay);
  }

  // ─── Touch/swipe support ──────────────────
  let touchStartX = 0;
  let touchEndX   = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? next() : prev();
      resetAutoPlay();
    }
  }, { passive: true });

  // ─── Keyboard ────────────────────────────
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { prev(); resetAutoPlay(); }
    if (e.key === 'ArrowRight') { next(); resetAutoPlay(); }
  });

  // ─── Window resize ───────────────────────
  window.addEventListener('resize', () => {
    goTo(current); // Recalculate offset
  }, { passive: true });

});
