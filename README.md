# 🌟 SuperNova International — Website

A modern, futuristic single-page website for SuperNova International — a global student-led STEAM initiative.

---

## 📁 Project Structure

```
supernova-website/
│
├── index.html                  ← Main single-page website
│
├── css/
│   ├── style.css               ← Core design system, layout, components
│   ├── animations.css          ← Keyframe animations, motion effects
│   └── responsive.css          ← Mobile-first responsive breakpoints
│
├── js/
│   ├── main.js                 ← Core: cursor, navbar, stars, reveal, counter
│   ├── animations.js           ← Three.js 3D rotating supernova element
│   ├── carousel.js             ← Gallery carousel with touch & autoplay
│   └── audio.js                ← Background music system with fade in/out
│
├── assets/
│   ├── images/                 ← General images (hero, events, etc.)
│   ├── logos/
│   │   └── supernova-logo.png  ← ⭐ PUT YOUR LOGO HERE
│   ├── videos/                 ← Background video, project videos
│   ├── documents/              ← PDFs, reports, CVs
│   └── team/                   ← Team member photos
│
├── components/
│   ├── navbar.html             ← Navbar snippet (reference)
│   └── footer.html             ← Footer snippet (reference)
│
├── models/
│   └── supernova-3d/           ← 3D model files (optional, Three.js handles it)
│
├── music/
│   └── background-loop.mp3     ← ⭐ PUT YOUR MUSIC FILE HERE
│
└── README.md
```

---

## 🚀 Running the Site Locally

### Option 1 — VS Code Live Server (Recommended)
1. Open the `supernova-website/` folder in VS Code
2. Install the **Live Server** extension
3. Right-click `index.html` → **Open with Live Server**
4. Site opens at `http://127.0.0.1:5500`

### Option 2 — Python HTTP Server
```bash
cd supernova-website
python3 -m http.server 8080
# Visit: http://localhost:8080
```

### Option 3 — Node.js `serve`
```bash
npm install -g serve
cd supernova-website
serve .
# Visit the URL shown in terminal
```

> ⚠️ Do NOT open `index.html` directly as a file (`file://`) — some features
> (Three.js, audio, fonts) require an HTTP server.

---

## 🎨 Customization Guide

### 1. Add Your Logo
- Copy your logo file to `assets/logos/supernova-logo.png`
- It will auto-appear in the navbar, hero, and footer

### 2. Add Background Music
- Place your audio file at `music/background-loop.mp3`
- Supported formats: `.mp3`, `.ogg`, `.wav`
- The site plays it on first user interaction with a mute/unmute toggle

### 3. Add Team Members
In `index.html`, find `<!-- Team member cards -->` and duplicate this block:
```html
<div class="team-card">
  <div class="team-photo">
    <img src="./assets/team/name.jpg" alt="Full Name" />
    <div class="team-overlay">
      <a href="https://linkedin.com/in/..." class="team-social">in</a>
      <a href="./assets/documents/name-cv.pdf" class="team-social">📄</a>
    </div>
  </div>
  <h3>Full Name</h3>
  <div class="team-role">Role Title</div>
  <div class="team-country">🌍 Country</div>
</div>
```

### 4. Add Projects
Duplicate a `.project-card` block and fill in:
- `project-img` → Add `<img>` or leave placeholder
- `project-tag` → Category
- `h3` → Project name
- `p` → Description
- `project-links` → Links to details, documents, external URLs

### 5. Add Gallery Images/Videos
In the `.gallery-track`, replace `<span>` placeholders:
```html
<!-- Image -->
<img src="./assets/images/gallery-1.jpg" alt="Description" />

<!-- YouTube Video -->
<iframe src="https://www.youtube.com/embed/VIDEO_ID"
        frameborder="0" allowfullscreen></iframe>
```

### 6. Update Contact Details
Search `[contact@` in `index.html` and replace all `[placeholder]` values with real info.

### 7. Update Stats
Find `data-count` attributes and change values:
```html
<span data-count="12" data-suffix="+">12+</span>
```

---

## ✨ Features

| Feature | Details |
|---|---|
| 🌌 Star field | Canvas-based animated particle starfield with nebula blobs |
| 🔵 3D Supernova | Three.js rotating supernova with particles, glow, and hover interaction |
| 🎵 Background Music | Loop with fade in/out, mute toggle, respects autoplay policies |
| 🖱️ Custom Cursor | Dual-cursor with smooth lag ring effect |
| 📜 Scroll Reveal | IntersectionObserver-based stagger reveal animations |
| 🔢 Counters | Animated number counters triggered on scroll |
| 🖼️ Carousel | Touch-enabled, auto-playing gallery carousel |
| 📱 Responsive | Mobile, tablet, desktop breakpoints |
| ♿ Accessible | ARIA labels, semantic HTML, keyboard navigation |
| ⚡ Performance | No heavy frameworks, CSS-native animations, deferred scripts |

---

## 🎨 Color Palette

| Name | Hex | Usage |
|---|---|---|
| Deep Space | `#030610` | Main background |
| Cyan | `#00d4ff` | Accent, links, glow |
| Blue Neon | `#0066ff` | CTA buttons |
| Purple | `#7b2ff7` | Secondary accent |
| Off White | `#d8e8f5` | Body text |
| Grey Light | `#8ba8c4` | Secondary text |

---

## 📦 External Dependencies

- **Fonts**: Google Fonts (Orbitron, Syne, JetBrains Mono) — loaded via CDN
- **Three.js r128** — loaded via Cloudflare CDN for 3D element
- No other frameworks or dependencies

---

## 📝 Deployment

The site is fully static — deploy to any host:
- **GitHub Pages**: Push to `gh-pages` branch
- **Netlify**: Drag-and-drop the folder
- **Vercel**: `vercel deploy`
- **Any web host**: Upload all files via FTP

---

Built with ❤️ for SuperNova International 🌟
