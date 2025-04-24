<template>
  <div>
    <div ref="spaceCanvas" class="space-bg"></div>
    <div class="fluid-shape fluid-shape-1"></div>
    <div class="fluid-shape fluid-shape-2"></div>
    <div class="fluid-shape fluid-shape-3"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { gsap } from 'gsap';

const spaceCanvas = ref(null);
let scene, camera, renderer, stars = [];
let animationFrame;

// Criar estrelas para o fundo espacial
const createStars = () => {
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  
  for (let i = 0; i < 2000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    vertices.push(x, y, z);
  }
  
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  
  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 2,
    transparent: true
  });
  
  const starField = new THREE.Points(geometry, material);
  scene.add(starField);
  
  return starField;
};

// Criar nebulosas para o fundo espacial
const createNebula = (color, size, position) => {
  const geometry = new THREE.SphereGeometry(size, 32, 32);
  const material = new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.15,
  });
  
  const nebula = new THREE.Mesh(geometry, material);
  nebula.position.set(position.x, position.y, position.z);
  scene.add(nebula);
  
  // Animar a nebulosa
  gsap.to(nebula.position, {
    x: position.x + Math.random() * 50 - 25,
    y: position.y + Math.random() * 50 - 25,
    duration: 15 + Math.random() * 10,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true
  });
  
  return nebula;
};

// Inicializar a cena Three.js
const initThree = () => {
  const container = spaceCanvas.value;
  
  // Configurar cena
  scene = new THREE.Scene();
  
  // Configurar câmera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  camera.position.z = 500;
  
  // Configurar renderer
  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);
  
  // Adicionar estrelas
  stars = createStars();
  
  // Adicionar nebulosas
  createNebula(0x8a2be2, 100, { x: -150, y: 100, z: -300 });
  createNebula(0x4b0082, 150, { x: 200, y: -150, z: -400 });
  createNebula(0x00d9ff, 80, { x: 0, y: 0, z: -350 });
  
  // Iniciar animação
  animate();
  
  // Lidar com redimensionamento da janela
  window.addEventListener('resize', onWindowResize);
};

// Função de animação
const animate = () => {
  animationFrame = requestAnimationFrame(animate);
  
  // Rotacionar lentamente as estrelas
  if (stars) {
    stars.rotation.x += 0.0001;
    stars.rotation.y += 0.0002;
  }
  
  renderer.render(scene, camera);
};

// Redimensionar quando a janela mudar de tamanho
const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

// Lifecycle hooks
onMounted(() => {
  initThree();
});

onUnmounted(() => {
  window.removeEventListener('resize', onWindowResize);
  cancelAnimationFrame(animationFrame);
  
  // Limpar recursos
  if (renderer) {
    renderer.dispose();
    const canvas = renderer.domElement;
    if (canvas && canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }
  }
});
</script>
