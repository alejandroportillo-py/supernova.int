/* =============================================
   SUPERNOVA INTERNATIONAL — MAIN.JS
   Core initialization, cursor, nav, stars
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Custom Cursor ──────────────────────────
  const cursor     = document.querySelector('.cursor');
  const cursorRing = document.querySelector('.cursor-ring');

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate(${mouseX - 6}px, ${mouseY - 6}px)`;
  });

  // Smooth ring follow
  function animateCursor() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Scale cursor on hover
  document.querySelectorAll('a, button, [role="button"]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform += ' scale(1.5)';
      cursorRing.style.transform += ' scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = cursor.style.transform.replace(' scale(1.5)', '');
      cursorRing.style.transform = cursorRing.style.transform.replace(' scale(1.5)', '');
    });
  });


  // ─── Navbar Scroll ──────────────────────────
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });


  // ─── Mobile Menu ────────────────────────────
  const hamburger  = document.querySelector('.hamburger');
  const navMobile  = document.querySelector('.nav-mobile');
  const overlay    = document.querySelector('.nav-overlay');

  if (hamburger && navMobile) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navMobile.classList.toggle('open');
    });

    navMobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMobile.classList.remove('open');
      });
    });
  }


  // ─── Active nav link on scroll ──────────────
  const sections     = document.querySelectorAll('section[id]');
  const navLinkEls   = document.querySelectorAll('.nav-links a[href^="#"]');

  const observerOptions = {
    rootMargin: '-40% 0px -40% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinkEls.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, observerOptions);

  sections.forEach(s => sectionObserver.observe(s));


  // ─── Stars Canvas (Particle Background) ─────
  const starsCanvas = document.getElementById('stars-canvas');
  if (starsCanvas) {
    const ctx    = starsCanvas.getContext('2d');
    let width    = starsCanvas.width  = window.innerWidth;
    let height   = starsCanvas.height = window.innerHeight;
    let stars    = [];
    let nebulas  = [];

    // Resize handler
    window.addEventListener('resize', () => {
      width  = starsCanvas.width  = window.innerWidth;
      height = starsCanvas.height = window.innerHeight;
      initStars();
    }, { passive: true });

    // Star class
    class Star {
      constructor() { this.reset(); }
      reset() {
        this.x     = Math.random() * width;
        this.y     = Math.random() * height;
        this.size  = Math.random() * 1.5 + 0.2;
        this.speed = Math.random() * 0.15 + 0.02;
        this.twinkle = Math.random() * Math.PI * 2;
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
        this.opacity = Math.random() * 0.7 + 0.2;
        this.color = Math.random() > 0.85
          ? `rgba(150, 220, 255, ${this.opacity})`
          : `rgba(255, 255, 255, ${this.opacity})`;
      }
      update() {
        this.twinkle += this.twinkleSpeed;
        this.y += this.speed;
        if (this.y > height + 5) { this.y = -5; this.x = Math.random() * width; }
      }
      draw() {
        const t = Math.sin(this.twinkle) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * t, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    // Nebula class (background color blobs)
    class Nebula {
      constructor() {
        this.x      = Math.random() * width;
        this.y      = Math.random() * height;
        this.radius = Math.random() * 300 + 100;
        this.hue    = Math.random() > 0.5 ? 200 : 260; // blue or purple
        this.opacity = Math.random() * 0.04 + 0.01;
      }
      draw() {
        const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        grd.addColorStop(0, `hsla(${this.hue}, 80%, 60%, ${this.opacity})`);
        grd.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }
    }

    function initStars() {
      const count = Math.floor((width * height) / 4000);
      stars  = Array.from({ length: count }, () => new Star());
      nebulas = Array.from({ length: 5 }, () => new Nebula());
    }

    function animateStars() {
      ctx.clearRect(0, 0, width, height);
      nebulas.forEach(n => n.draw());
      stars.forEach(s => { s.update(); s.draw(); });
      requestAnimationFrame(animateStars);
    }

    initStars();
    animateStars();
  }


  // ─── Scroll Reveal ──────────────────────────
  const revealEls = document.querySelectorAll('.reveal, .stagger-reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));


  // ─── Counter Animation ──────────────────────
  const counters = document.querySelectorAll('[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        let count    = 0;
        const step   = Math.ceil(target / 60);
        const timer  = setInterval(() => {
          count = Math.min(count + step, target);
          el.textContent = count + suffix;
          if (count >= target) clearInterval(timer);
        }, 24);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));


  // ─── Typewriter effect ──────────────────────
  const typewriterEls = document.querySelectorAll('[data-typewrite]');

  typewriterEls.forEach(el => {
    const phrases = el.getAttribute('data-typewrite').split('|');
    let   phraseIdx = 0;
    let   charIdx   = 0;
    let   deleting  = false;

    function type() {
      const current = phrases[phraseIdx];
      if (deleting) {
        el.textContent = current.substring(0, --charIdx);
        if (charIdx === 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          setTimeout(type, 500);
          return;
        }
        setTimeout(type, 50);
      } else {
        el.textContent = current.substring(0, ++charIdx);
        if (charIdx === current.length) {
          deleting = true;
          setTimeout(type, 2500);
          return;
        }
        setTimeout(type, 90);
      }
    }
    type();
  });


  // ─── Smooth scroll for anchors ───────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  // ─── Parallax on hero ───────────────────────
  const heroContent = document.querySelector('.hero-content');

  window.addEventListener('scroll', () => {
    if (heroContent) {
      const y = window.scrollY;
      heroContent.style.transform = `translateY(${y * 0.3}px)`;
      heroContent.style.opacity   = 1 - y / (window.innerHeight * 0.8);
    }
  }, { passive: true });


  // ─── Contact form ────────────────────────────
  const form = document.getElementById('contact-form');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn     = form.querySelector('.btn-primary');
      const original = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled    = true;

      // Simulate submission — replace with real endpoint
      setTimeout(() => {
        btn.textContent = '✓ Message Sent!';
        btn.style.background = 'linear-gradient(135deg, #00ff88, #00cc66)';
        form.reset();

        setTimeout(() => {
          btn.textContent = original;
          btn.style.background = '';
          btn.disabled   = false;
        }, 3000);
      }, 1500);
    });
  }

});
