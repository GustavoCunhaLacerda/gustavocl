<template>
  <div ref="spaceCanvas" class="space-bg"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';

const spaceCanvas = ref(null);
let scene, camera, renderer;
let animationFrame;
let mouseX = 0, mouseY = 0;
let isVisible = true;

const updateSceneTheme = () => {
  if (!scene) return;
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const bg = isLight ? 0xf5f0ea : 0x0d0a08;
  scene.background = new THREE.Color(bg);
  scene.fog = new THREE.FogExp2(bg, 0.0006);
};

const createStarLayer = (count, spread, size, opacity, color) => {
  const geo = new THREE.BufferGeometry();
  const verts = [];
  for (let i = 0; i < count; i++) {
    verts.push(
      (Math.random() - 0.5) * spread,
      (Math.random() - 0.5) * spread,
      (Math.random() - 0.5) * spread * 0.4
    );
  }
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  const mat = new THREE.PointsMaterial({
    color, size, transparent: true, opacity,
    sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false,
  });
  return new THREE.Points(geo, mat);
};

const createNebulaCloud = (color, count, spread, cx, cy, cz, opacity) => {
  const geo = new THREE.BufferGeometry();
  const verts = [];
  for (let i = 0; i < count; i++) {
    const r = Math.random() * spread;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    verts.push(
      cx + r * Math.sin(phi) * Math.cos(theta),
      cy + r * Math.sin(phi) * Math.sin(theta) * 0.5,
      cz + r * Math.cos(phi) * 0.3
    );
  }
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  const mat = new THREE.PointsMaterial({
    color, size: 2.5 + Math.random() * 2, transparent: true, opacity,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
  });
  return new THREE.Points(geo, mat);
};

const layers = [];
const orbitals = [];
const planetMeshes = []; // for spin

const createOrbitRing = (rx, ry, tilt = 0) => {
  const pts = [];
  for (let i = 0; i <= 128; i++) {
    const a = (i / 128) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * rx, Math.sin(a) * ry * 0.28, Math.sin(a) * ry));
  }
  const geo = new THREE.BufferGeometry().setFromPoints(pts);
  const mat = new THREE.LineBasicMaterial({
    color: 0xe8a45a, transparent: true, opacity: 0.08,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const ring = new THREE.Line(geo, mat);
  ring.rotation.x = tilt;
  return ring;
};

// Glow sprite around a planet
const createGlow = (radius, color, opacity = 0.15) => {
  const geo = new THREE.SphereGeometry(radius, 24, 24);
  const mat = new THREE.MeshBasicMaterial({
    color, transparent: true, opacity,
    blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.BackSide,
  });
  return new THREE.Mesh(geo, mat);
};

// Outer Wilds inspired planets
const buildSolarSystem = () => {
  const group = new THREE.Group();
  group.position.set(120, -40, -200);

  // === SUN — warm amber like the Outer Wilds sun ===
  const sunGeo = new THREE.SphereGeometry(14, 32, 32);
  const sunMat = new THREE.MeshBasicMaterial({ color: 0xffc840 });
  const sun = new THREE.Mesh(sunGeo, sunMat);
  group.add(sun);

  // Sun corona layers
  group.add(createGlow(20, 0xffa020, 0.12));
  group.add(createGlow(28, 0xff8010, 0.06));
  group.add(createGlow(38, 0xff6000, 0.03));

  // Sun light
  const sunLight = new THREE.PointLight(0xffc840, 2.0, 800);
  group.add(sunLight);

  // Planet definitions — Outer Wilds inspired
  // [orbitR, tilt, radius, color, emissive, emissiveIntensity, orbitSpeed, spinSpeed, extras]
  const planets = [
    {
      // Timber Hearth — earthy green/brown, home planet
      orbit: 55, tilt: 0.15, radius: 5,
      color: 0x4a7a3a, emissive: 0x2a4a1a, emissiveI: 0.5,
      orbitSpeed: 0.0018, spinSpeed: 0.008,
      glow: { radius: 7.5, color: 0x5a9a4a, opacity: 0.1 },
    },
    {
      // Giant's Deep — deep ocean blue with swirling storms
      orbit: 95, tilt: 0.08, radius: 9,
      color: 0x1a4a7a, emissive: 0x0a3a6a, emissiveI: 0.6,
      orbitSpeed: 0.0011, spinSpeed: 0.012,
      glow: { radius: 13, color: 0x2a6aaa, opacity: 0.12 },
    },
    {
      // Brittle Hollow — volcanic purple/magenta, crumbling
      orbit: 145, tilt: 0.22, radius: 6,
      color: 0x7a3a6a, emissive: 0xaa4040, emissiveI: 0.7,
      orbitSpeed: 0.0007, spinSpeed: 0.006,
      glow: { radius: 9, color: 0xcc5544, opacity: 0.1 },
    },
    {
      // Dark Bramble — eerie pale green, mysterious
      orbit: 200, tilt: 0.05, radius: 11,
      color: 0x3a5a3a, emissive: 0x2a6a3a, emissiveI: 0.4,
      orbitSpeed: 0.0004, spinSpeed: 0.003,
      glow: { radius: 16, color: 0x4a8a5a, opacity: 0.08 },
    },
    {
      // Ash Twin — sandy amber, close to sun feel
      orbit: 260, tilt: 0.18, radius: 4,
      color: 0xc89050, emissive: 0xa07030, emissiveI: 0.6,
      orbitSpeed: 0.0002, spinSpeed: 0.01,
      glow: { radius: 6, color: 0xe8a45a, opacity: 0.1 },
    },
  ];

  planets.forEach((p) => {
    group.add(createOrbitRing(p.orbit, p.orbit, p.tilt));

    const pivot = new THREE.Group();
    pivot.rotation.x = p.tilt;

    // Planet mesh — MeshBasicMaterial so it's always visible, no light dependency
    const geo = new THREE.SphereGeometry(p.radius, 32, 32);
    const mat = new THREE.MeshBasicMaterial({ color: p.color });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.x = p.orbit;

    // Emissive overlay — additive blended sphere slightly larger
    const emGeo = new THREE.SphereGeometry(p.radius * 1.01, 32, 32);
    const emMat = new THREE.MeshBasicMaterial({
      color: p.emissive, transparent: true, opacity: p.emissiveI * 0.5,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const emMesh = new THREE.Mesh(emGeo, emMat);
    mesh.add(emMesh);

    // Atmosphere glow
    mesh.add(createGlow(p.glow.radius, p.glow.color, p.glow.opacity));

    pivot.add(mesh);
    group.add(pivot);
    orbitals.push({ pivot, speed: p.orbitSpeed });
    planetMeshes.push({ mesh, spinSpeed: p.spinSpeed });
  });

  return group;
};

const initThree = () => {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0d0a08);
  scene.fog = new THREE.FogExp2(0x0d0a08, 0.0006);

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 3000);
  camera.position.z = 600;

  renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  spaceCanvas.value.appendChild(renderer.domElement);

  // Star layers
  const s1 = createStarLayer(3000, 3000, 0.8, 0.6, 0xfff0d0);
  const s2 = createStarLayer(1200, 2000, 1.4, 0.75, 0xf0d8a0);
  const s3 = createStarLayer(400, 1200, 2.2, 0.9, 0xffe8b0);
  layers.push(s1, s2, s3);
  scene.add(s1, s2, s3);

  // Nebulae
  scene.add(createNebulaCloud(0x8b2a1a, 800, 180, -250, 150, -400, 0.18));
  scene.add(createNebulaCloud(0x4a1a6e, 1000, 220, 280, -180, -500, 0.15));
  scene.add(createNebulaCloud(0xb84a10, 600, 140, 40, 60, -600, 0.12));
  scene.add(createNebulaCloud(0xc87820, 400, 100, -100, -80, -350, 0.1));

  // Solar system
  const ambientLight = new THREE.AmbientLight(0x1a1008, 0.6);
  scene.add(ambientLight);
  scene.add(buildSolarSystem());

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', handleVisibility);

  const observer = new MutationObserver(updateSceneTheme);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  updateSceneTheme();

  animate();
};

const onMouseMove = (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 0.3;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 0.2;
};

const handleVisibility = () => {
  if (document.hidden) {
    isVisible = false;
    cancelAnimationFrame(animationFrame);
  } else {
    isVisible = true;
    animate();
  }
};

const animate = () => {
  if (!isVisible) return;
  animationFrame = requestAnimationFrame(animate);

  // Star parallax
  layers[0].rotation.y += 0.00008;
  layers[0].rotation.x += 0.00003;
  layers[1].rotation.y += 0.00012;
  layers[1].rotation.x += 0.00005;
  layers[2].rotation.y += 0.00018;
  layers[2].rotation.x += 0.00008;

  // Planet orbits
  orbitals.forEach(({ pivot, speed }) => { pivot.rotation.y += speed; });

  // Planet spin
  planetMeshes.forEach(({ mesh, spinSpeed }) => { mesh.rotation.y += spinSpeed; });

  // Camera follows mouse
  camera.position.x += (mouseX * 40 - camera.position.x) * 0.02;
  camera.position.y += (-mouseY * 30 - camera.position.y) * 0.02;
  camera.lookAt(scene.position);

  renderer.render(scene, camera);
};

const onResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

onMounted(initThree);
onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('resize', onResize);
  document.removeEventListener('visibilitychange', handleVisibility);
  cancelAnimationFrame(animationFrame);
  renderer?.dispose();
});
</script>
