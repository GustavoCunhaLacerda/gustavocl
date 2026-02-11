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
    color,
    size,
    transparent: true,
    opacity,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  return new THREE.Points(geo, mat);
};

// Nebulosa como nuvem de partículas — não esfera sólida
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
    color,
    size: 2.5 + Math.random() * 2,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });
  return new THREE.Points(geo, mat);
};

const layers = [];
const orbitals = []; // { pivot, speed }

// Cria trilha de órbita elíptica
const createOrbitRing = (rx, ry, tilt = 0) => {
  const pts = [];
  for (let i = 0; i <= 128; i++) {
    const a = (i / 128) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * rx, Math.sin(a) * ry * 0.28, Math.sin(a) * ry));
  }
  const geo = new THREE.BufferGeometry().setFromPoints(pts);
  const mat = new THREE.LineBasicMaterial({
    color: 0xe8a45a,
    transparent: true,
    opacity: 0.08,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const ring = new THREE.Line(geo, mat);
  ring.rotation.x = tilt;
  return ring;
};

// Cria planeta com glow
const createPlanet = (radius, color, emissive = 0x000000) => {
  const geo = new THREE.SphereGeometry(radius, 24, 24);
  const mat = new THREE.MeshStandardMaterial({ color, emissive, emissiveIntensity: 0.4, roughness: 0.8 });
  return new THREE.Mesh(geo, mat);
};

const buildSolarSystem = () => {
  const group = new THREE.Group();
  group.position.set(120, -40, -200);

  // Estrela central — âmbar quente
  const starGeo = new THREE.SphereGeometry(14, 32, 32);
  const starMat = new THREE.MeshBasicMaterial({ color: 0xf5c842 });
  const star = new THREE.Mesh(starGeo, starMat);
  group.add(star);

  // Halo da estrela (glow)
  const glowGeo = new THREE.SphereGeometry(22, 32, 32);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0xf0a030,
    transparent: true,
    opacity: 0.08,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.BackSide,
  });
  group.add(new THREE.Mesh(glowGeo, glowMat));

  // Luz pontual da estrela
  const light = new THREE.PointLight(0xf5c842, 1.2, 600);
  group.add(light);

  // Planetas: [raioOrbX, raioOrbY, tiltOrbita, raioPlanta, cor, velocidade]
  const planetDefs = [
    [55,  55,  0.15, 4,  0xc87040, 0.0018],  // rochoso quente
    [95,  95,  0.08, 6,  0x7a5c8a, 0.0011],  // roxo-gasoso
    [145, 145, 0.22, 5,  0x4a6e8a, 0.0007],  // azul-gelo
    [200, 200, 0.05, 9,  0x8a6030, 0.0004],  // gigante âmbar
    [260, 260, 0.18, 3,  0xb0a080, 0.0002],  // distante, pálido
  ];

  planetDefs.forEach(([rx, ry, tilt, r, color, speed]) => {
    // Trilha
    group.add(createOrbitRing(rx, ry, tilt));

    // Pivot para orbitar
    const pivot = new THREE.Group();
    pivot.rotation.x = tilt;
    const planet = createPlanet(r, color);
    planet.position.x = rx;
    pivot.add(planet);
    group.add(pivot);
    orbitals.push({ pivot, speed });
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

  // Camadas de estrelas — distâncias e tamanhos variados para profundidade
  const s1 = createStarLayer(3000, 3000, 0.8, 0.6, 0xfff0d0); // distantes, pequenas
  const s2 = createStarLayer(1200, 2000, 1.4, 0.75, 0xf0d8a0); // médias
  const s3 = createStarLayer(400,  1200, 2.2, 0.9,  0xffe8b0);  // próximas, brilhantes
  layers.push(s1, s2, s3);
  scene.add(s1, s2, s3);

  // Nebulosas como nuvens de partículas
  // Vinho/vermelho — canto superior esquerdo
  const n1 = createNebulaCloud(0x8b2a1a, 800, 180, -250, 150, -400, 0.18);
  // Roxo profundo — canto inferior direito
  const n2 = createNebulaCloud(0x4a1a6e, 1000, 220, 280, -180, -500, 0.15);
  // Laranja queimado — centro, mais atrás
  const n3 = createNebulaCloud(0xb84a10, 600, 140, 40, 60, -600, 0.12);
  // Âmbar suave — espalhado
  const n4 = createNebulaCloud(0xc87820, 400, 100, -100, -80, -350, 0.1);
  scene.add(n1, n2, n3, n4);

  // Sistema solar com órbitas
  const ambientLight = new THREE.AmbientLight(0x1a1008, 0.6);
  scene.add(ambientLight);
  scene.add(buildSolarSystem());

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('resize', onResize);
  animate();
};

const onMouseMove = (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 0.3;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 0.2;
};

const animate = () => {
  animationFrame = requestAnimationFrame(animate);

  // Paralaxe suave entre camadas
  layers[0].rotation.y += 0.00008;
  layers[0].rotation.x += 0.00003;
  layers[1].rotation.y += 0.00012;
  layers[1].rotation.x += 0.00005;
  layers[2].rotation.y += 0.00018;
  layers[2].rotation.x += 0.00008;

  // Órbitas dos planetas
  orbitals.forEach(({ pivot, speed }) => { pivot.rotation.y += speed; });

  // Câmera segue o mouse levemente
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
  cancelAnimationFrame(animationFrame);
  renderer?.dispose();
});
</script>
