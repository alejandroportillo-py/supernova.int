/* =============================================
   SUPERNOVA INTERNATIONAL — ANIMATIONS.JS
   Three.js rotating supernova 3D element
   ============================================= */

(function initSupernova3D() {

  const canvas = document.getElementById('supernova-3d');
  if (!canvas || typeof THREE === 'undefined') return;

  // ─── Scene Setup ──────────────────────────
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.z = 2.8;

  // ─── Core Star (Glowing Sphere) ────────────
  const coreGeo = new THREE.SphereGeometry(0.35, 32, 32);
  const coreMat = new THREE.MeshBasicMaterial({ color: 0x00d4ff });
  const core    = new THREE.Mesh(coreGeo, coreMat);
  scene.add(core);

  // ─── Glow Halos ────────────────────────────
  function createHalo(radius, color, opacity) {
    const geo = new THREE.SphereGeometry(radius, 32, 32);
    const mat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      side: THREE.BackSide,
      depthWrite: false
    });
    return new THREE.Mesh(geo, mat);
  }

  const glow1 = createHalo(0.5,  0x00d4ff, 0.25);
  const glow2 = createHalo(0.65, 0x0066ff, 0.12);
  const glow3 = createHalo(0.85, 0x7b2ff7, 0.06);
  scene.add(glow1, glow2, glow3);

  // ─── Particle Ring / Ejecta ─────────────────
  const particleCount = 400;
  const positions     = new Float32Array(particleCount * 3);
  const colors        = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    // Distribute in a ring-disc with some scatter
    const angle  = Math.random() * Math.PI * 2;
    const radius = 0.55 + Math.random() * 0.6;
    const spread = (Math.random() - 0.5) * 0.4;
    const tilt   = (Math.random() - 0.5) * 0.3;

    positions[i * 3]     = Math.cos(angle) * radius;
    positions[i * 3 + 1] = Math.sin(angle) * radius * 0.3 + spread * tilt;
    positions[i * 3 + 2] = Math.sin(angle) * radius * 0.3 + spread;

    // Color gradient: cyan -> blue -> purple
    const t = Math.random();
    if (t < 0.4) {
      colors[i * 3]     = 0;
      colors[i * 3 + 1] = 0.83;
      colors[i * 3 + 2] = 1;
    } else if (t < 0.7) {
      colors[i * 3]     = 0;
      colors[i * 3 + 1] = 0.4;
      colors[i * 3 + 2] = 1;
    } else {
      colors[i * 3]     = 0.48;
      colors[i * 3 + 1] = 0.18;
      colors[i * 3 + 2] = 0.97;
    }
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

  const particleMat = new THREE.PointsMaterial({
    size:          0.06,
    vertexColors:  true,
    transparent:   true,
    opacity:       0.9,
    sizeAttenuation: true,
    depthWrite:    false
  });

  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // ─── Outer Spark Particles ─────────────────
  const sparkCount = 150;
  const sparkPos   = new Float32Array(sparkCount * 3);

  for (let i = 0; i < sparkCount; i++) {
    const phi   = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    const r     = 0.9 + Math.random() * 0.5;
    sparkPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    sparkPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    sparkPos[i * 3 + 2] = r * Math.cos(phi);
  }

  const sparkGeo = new THREE.BufferGeometry();
  sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));

  const sparkMat = new THREE.PointsMaterial({
    size:        0.03,
    color:       0xffffff,
    transparent: true,
    opacity:     0.6,
    sizeAttenuation: true,
    depthWrite:  false
  });

  const sparks = new THREE.Points(sparkGeo, sparkMat);
  scene.add(sparks);

  // ─── Interaction State ─────────────────────
  let hovered   = false;
  let targetSpeed = 0.008;
  let currentSpeed = 0.008;

  canvas.addEventListener('mouseenter', () => { hovered = true;  targetSpeed = 0.03; });
  canvas.addEventListener('mouseleave', () => { hovered = false; targetSpeed = 0.008; });
  canvas.addEventListener('touchstart', () => { targetSpeed = 0.05; });
  canvas.addEventListener('touchend',   () => { targetSpeed = 0.008; });

  // ─── Animation Loop ────────────────────────
  let t = 0;

  function animate() {
    requestAnimationFrame(animate);
    t += 0.01;

    // Ease speed
    currentSpeed += (targetSpeed - currentSpeed) * 0.05;

    // Rotate structures
    particles.rotation.y += currentSpeed;
    particles.rotation.x += currentSpeed * 0.3;
    sparks.rotation.y    -= currentSpeed * 0.5;
    sparks.rotation.x    += currentSpeed * 0.2;
    core.rotation.y      += currentSpeed * 0.5;

    // Pulse glow halos
    const pulse = Math.sin(t * 1.5) * 0.03 + 1;
    glow1.scale.setScalar(pulse);
    glow2.scale.setScalar(pulse * 0.97);
    glow3.scale.setScalar(pulse * 0.95);

    // Core brightness pulse
    const brightness = 0.85 + Math.sin(t * 2) * 0.15;
    coreMat.color.setRGB(0, brightness * 0.83, brightness);

    renderer.render(scene, camera);
  }

  animate();

})();