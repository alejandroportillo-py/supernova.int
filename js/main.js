/* ================================================
   SUPERNOVA INTERNATIONAL — main.js
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Custom Cursor ─────────────────────────── */
  const cursor = document.querySelector('.cursor');
  const ring   = document.querySelector('.cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  if (cursor && ring) {
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.transform = `translate(${mx - 5}px, ${my - 5}px)`;
    });
    (function loop() {
      rx += (mx - rx) * 0.13;
      ry += (my - ry) * 0.13;
      ring.style.transform = `translate(${rx - 17}px, ${ry - 17}px)`;
      requestAnimationFrame(loop);
    })();
  }

  /* ── Navbar scroll ─────────────────────────── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  /* ── Nav Dropdown "Explorar" ───────────────── */
  const exploreBtn   = document.getElementById('nav-explore-btn');
  const explorePanel = document.getElementById('nav-explore-panel');

  if (exploreBtn && explorePanel) {
    exploreBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = explorePanel.classList.contains('open');
      explorePanel.classList.toggle('open', !isOpen);
      exploreBtn.setAttribute('aria-expanded', String(!isOpen));
    });

    // Cerrar al hacer click fuera
    document.addEventListener('click', () => {
      explorePanel.classList.remove('open');
      exploreBtn.setAttribute('aria-expanded', 'false');
    });

    // Evitar que clicks dentro del panel lo cierren
    explorePanel.addEventListener('click', (e) => e.stopPropagation());

    // Cerrar panel al activar cualquier ítem dentro
    explorePanel.querySelectorAll('.nav-dropdown-link').forEach(link => {
      link.addEventListener('click', () => {
        explorePanel.classList.remove('open');
        exploreBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── Mobile hamburger ──────────────────────── */
  const hamburger = document.getElementById('hamburger-btn');
  const navMobile = document.getElementById('nav-mobile');
  if (hamburger && navMobile) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navMobile.classList.toggle('open');
    });
    navMobile.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMobile.classList.remove('open');
      });
    });
  }

  /* ── Smooth scroll ─────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  /* ── Scroll reveal ─────────────────────────── */
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal, .stagger-reveal').forEach(el => revObs.observe(el));

  /* ── Star field canvas ─────────────────────── */
  const sc = document.getElementById('stars-canvas');
  if (sc) {
    const ctx = sc.getContext('2d');
    let W = sc.width = innerWidth;
    let H = sc.height = innerHeight;
    let stars = [], nebulas = [];

    class Star {
      constructor() { this.reset(); }
      reset() {
        this.x    = Math.random() * W;
        this.y    = Math.random() * H;
        this.size = Math.random() * 1.4 + 0.2;
        this.spd  = Math.random() * 0.12 + 0.02;
        this.tw   = Math.random() * Math.PI * 2;
        this.ts   = Math.random() * 0.02 + 0.005;
        this.op   = Math.random() * 0.7 + 0.2;
        this.col  = Math.random() > 0.85
          ? `rgba(180,220,255,${this.op})`
          : `rgba(255,255,255,${this.op})`;
      }
      update() {
        this.tw += this.ts;
        this.y  += this.spd;
        if (this.y > H + 5) { this.y = -5; this.x = Math.random() * W; }
      }
      draw() {
        const t = Math.sin(this.tw) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * t, 0, Math.PI * 2);
        ctx.fillStyle = this.col;
        ctx.fill();
      }
    }

    class Nebula {
      constructor() {
        this.x  = Math.random() * W;
        this.y  = Math.random() * H;
        this.r  = Math.random() * 280 + 100;
        this.h  = Math.random() > 0.5 ? 265 : 280;
        this.op = Math.random() * 0.04 + 0.01;
      }
      draw() {
        const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
        g.addColorStop(0, `hsla(${this.h},80%,60%,${this.op})`);
        g.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }
    }

    function init() {
      const n = Math.floor(W * H / 4200);
      stars   = Array.from({ length: n }, () => new Star());
      nebulas = Array.from({ length: 5 }, () => new Nebula());
    }

    function anim() {
      ctx.clearRect(0, 0, W, H);
      nebulas.forEach(n => n.draw());
      stars.forEach(s => { s.update(); s.draw(); });
      requestAnimationFrame(anim);
    }

    window.addEventListener('resize', () => {
      W = sc.width = innerWidth;
      H = sc.height = innerHeight;
      init();
    }, { passive: true });

    init();
    anim();
  }

  /* ── Hero parallax ─────────────────────────── */
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    window.addEventListener('scroll', () => {
      const y = scrollY;
      heroContent.style.transform = `translateY(${y * 0.28}px)`;
      heroContent.style.opacity   = Math.max(0, 1 - y / (innerHeight * 0.85));
    }, { passive: true });
  }

  /* ── Counter animation ─────────────────────── */
  const cntObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      let val = 0;
      const step = Math.ceil(target / 60);
      const t = setInterval(() => {
        val = Math.min(val + step, target);
        el.textContent = val + suffix;
        if (val >= target) clearInterval(t);
      }, 24);
      cntObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => cntObs.observe(el));

  /* ── Generation tabs ───────────────────────── */
  const genTabs   = document.querySelectorAll('.gen-tab');
  const genPanels = document.querySelectorAll('.gen-panel');
  genTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      genTabs.forEach(t => t.classList.remove('active'));
      genPanels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('gen-' + tab.dataset.gen);
      if (panel) panel.classList.add('active');
    });
  });

  /* ── Delegation tabs ───────────────────────── */
  const delTabs   = document.querySelectorAll('.del-tab');
  const delPanels = document.querySelectorAll('.delegation-panel');
  delTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      delTabs.forEach(t => t.classList.remove('active'));
      delPanels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('del-' + tab.dataset.del);
      if (panel) panel.classList.add('active');
    });
  });

  /* ── Country filter ────────────────────────── */
  const cfBtns = document.querySelectorAll('.country-filter-btn');
  const cCards = document.querySelectorAll('.country-card');
  cfBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      cfBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      cCards.forEach(card => {
        card.style.display = (f === 'all' || card.classList.contains(f)) ? '' : 'none';
      });
    });
  });

  /* ── Project modal ─────────────────────────── */
  const modal      = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');

  function openModal(data) {
    if (!modal) return;
    document.getElementById('modal-tag').textContent     = data.tag     || '';
    document.getElementById('modal-title').textContent   = data.title   || '';
    document.getElementById('modal-desc').textContent    = data.desc    || '';
    document.getElementById('modal-year').textContent    = data.year    || '—';
    document.getElementById('modal-country').textContent = data.country || '—';
    document.getElementById('modal-status').textContent  = data.status  || '—';

    const teamEl = document.getElementById('modal-team-list');
    if (teamEl) teamEl.innerHTML = (data.team || []).map(m => `<li>${m}</li>`).join('');

    const resEl = document.getElementById('modal-results-list');
    if (resEl) resEl.innerHTML = (data.results || []).map(r => `<li>${r}</li>`).join('');

    const vf = document.getElementById('modal-video-frame');
    if (vf) {
      vf.innerHTML = data.videoUrl
        ? `<iframe src="${data.videoUrl}" allowfullscreen></iframe>`
        : `<div style="display:flex;align-items:center;justify-content:center;height:200px;color:var(--grey);font-family:var(--font-m);font-size:.75rem;">[Video placeholder — agrega un URL de YouTube]</div>`;
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal)      modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  document.querySelectorAll('.project-card[data-project]').forEach(card => {
    card.addEventListener('click', () => {
      const key = card.dataset.project;
      openModal(window.projectData?.[key] || {
        title: key, tag: 'Proyecto',
        desc: '[Descripción del proyecto próximamente.]',
        year: '—', country: '—', status: '—',
        team: [], results: []
      });
    });
  });

  /* ── Marquee — duplicar items para loop infinito ─ */
  document.querySelectorAll('.marquee-track').forEach(track => {
    // Clonar todos los hijos para el efecto infinito
    const items = Array.from(track.children);
    items.forEach(item => {
      const clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
  });

  /* ── Photo upload (generaciones) ──────────── */
  document.querySelectorAll('.gen-upload-label').forEach(label => {
    const input = label.querySelector('input[type=file]');
    if (!input) return;
    input.addEventListener('change', e => {
      Array.from(e.target.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = ev => {
          const container = label.closest('.gen-gallery');
          if (!container) return;
          const div = document.createElement('div');
          div.className = 'gen-photo';
          const img = document.createElement('img');
          img.src = ev.target.result;
          img.alt = 'Foto generación';
          div.appendChild(img);
          container.insertBefore(div, label);
        };
        reader.readAsDataURL(file);
      });
    });
  });

  /* ── Contact form ──────────────────────────── */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn  = form.querySelector('.btn-primary');
      const orig = btn.textContent;
      btn.textContent = 'Enviando...';
      btn.disabled    = true;
      setTimeout(() => {
        btn.textContent   = '✓ Mensaje enviado';
        btn.style.background = 'linear-gradient(135deg,#00ff88,#00cc66)';
        form.reset();
        setTimeout(() => {
          btn.textContent      = orig;
          btn.style.background = '';
          btn.disabled         = false;
        }, 3000);
      }, 1500);
    });
  }

});

/* ── Project data ──────────────────────────────
   Rellena con los datos reales de cada proyecto.
   El key debe coincidir con data-project="key"
────────────────────────────────────────────── */
window.projectData = {
  'tech-voyage': {
    tag:     'Tecnología · Ciencias Marinas',
    title:   'Tech Voyage',
    desc:    'Un proyecto interdisciplinario que explora sistemas de navegación inteligente y análisis de datos oceánicos, combinando ciencias marinas con tecnología de vanguardia para ayudar a investigadores a comprender patrones oceánicos y cambios ambientales.',
    year:    '2023–2024',
    country: 'Internacional',
    status:  'Activo',
    team:    ['[Nombre] — Investigador Principal', '[Nombre] — Desarrollador', '[Nombre] — Análisis de Datos'],
    results: ['[Premio o reconocimiento 1]', '[Publicación o resultado 2]', '[Resultado de competencia 3]'],
    videoUrl: '' // Ej: 'https://www.youtube.com/embed/VIDEO_ID'
  },
  'robotics': {
    tag:     'Robótica · Ingeniería',
    title:   'Iniciativa de Robótica',
    desc:    'Equipos estudiantiles diseñan y construyen robots autónomos para resolver desafíos del mundo real, compitiendo en competencias nacionales e internacionales. La iniciativa abarca diseño mecánico, electrónica y programación.',
    year:    '2023–Presente',
    country: 'Paraguay / Costa Rica',
    status:  'En curso',
    team:    ['[Nombre] — Mecánica', '[Nombre] — Electrónica', '[Nombre] — Programación'],
    results: ['[Resultado de competencia]', '[Premio obtenido]', '[Hito alcanzado]'],
    videoUrl: ''
  },
  'future-project': {
    tag:     '[Categoría]',
    title:   '[Próximo Proyecto]',
    desc:    '[Descripción del proyecto. Reemplazar con información real cuando esté disponible.]',
    year:    '2025',
    country: '[País]',
    status:  'Planificación',
    team:    ['[Miembro]'],
    results: ['[Por determinar]'],
    videoUrl: ''
  }
};