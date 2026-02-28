<template>
  <div class="cube-wrapper" @click="handleClick" title="Clique para girar!">
    <div class="cube-scene">
      <div class="cube" ref="cubeRef">
        <div v-for="face in faces" :key="face.class" :class="['cube-face', face.class]">
          <div v-for="i in 9" :key="i" class="cubie" :style="{ background: face.colors[i - 1] }"></div>
        </div>
      </div>
    </div>
    <span class="cube-label">3x3</span>

    <!-- Toast easter egg -->
    <Transition name="toast">
      <div v-if="toastVisible" class="cube-toast">🧩 Você resolveu o cubo!</div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { gsap } from 'gsap';

const cubeRef = ref(null);
const isAnimating = ref(false);
const clickCount = ref(0);
const toastVisible = ref(false);
let idleTween = null;

// Cores reais do cubo Rubik — cada face tem 9 cubies
const faces = [
  { class: 'front',  colors: Array(9).fill('#c41e3a') },  // vermelho
  { class: 'back',   colors: Array(9).fill('#ff5800') },  // laranja
  { class: 'top',    colors: Array(9).fill('#f0f0f0') },  // branco
  { class: 'bottom', colors: Array(9).fill('#ffd500') },  // amarelo
  { class: 'left',   colors: Array(9).fill('#009b48') },  // verde
  { class: 'right',  colors: Array(9).fill('#0046ad') },  // azul
];

const startIdle = () => {
  idleTween = gsap.to(cubeRef.value, {
    rotationY: '+=360',
    duration: 14,
    ease: 'none',
    repeat: -1,
  });
};

const handleClick = () => {
  if (isAnimating.value) return;
  isAnimating.value = true;
  clickCount.value++;

  idleTween?.pause();

  const moves = [
    { rotationY: '+=90' },
    { rotationX: '+=90' },
    { rotationZ: '+=90' },
    { rotationY: '+=180', rotationX: '+=90' },
  ];
  const move = moves[(clickCount.value - 1) % moves.length];

  gsap.to(cubeRef.value, {
    ...move,
    duration: 0.7,
    ease: 'power2.inOut',
    onComplete: () => {
      isAnimating.value = false;
      if (clickCount.value % 12 === 0) showToast();
      else idleTween?.resume();
    },
  });
};

const showToast = () => {
  toastVisible.value = true;
  setTimeout(() => {
    toastVisible.value = false;
    idleTween?.resume();
  }, 3000);
};

onMounted(() => {
  gsap.set(cubeRef.value, { rotationX: -20, rotationY: 30 });
  startIdle();
});

onUnmounted(() => idleTween?.kill());
</script>

<style scoped>
.cube-wrapper {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 100;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  user-select: none;
}

.cube-scene {
  width: 54px;
  height: 54px;
  perspective: 200px;
}

.cube {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
}

.cube-face {
  position: absolute;
  width: 54px;
  height: 54px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 2px;
  padding: 2px;
  background: #111;
  border-radius: 3px;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.6);
}

.cubie {
  border-radius: 2px;
  opacity: 0.92;
}

/* Posicionamento das faces — cubo de 27px de profundidade (54/2) */
.front  { transform: translateZ(27px); }
.back   { transform: rotateY(180deg) translateZ(27px); }
.top    { transform: rotateX(90deg) translateZ(27px); }
.bottom { transform: rotateX(-90deg) translateZ(27px); }
.left   { transform: rotateY(-90deg) translateZ(27px); }
.right  { transform: rotateY(90deg) translateZ(27px); }

.cube-label {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--color-text-muted);
  letter-spacing: 2px;
  text-transform: uppercase;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.cube-wrapper:hover .cube-label { opacity: 1; color: var(--color-accent); }

/* Toast */
.cube-toast {
  position: absolute;
  bottom: calc(100% + 10px);
  right: 0;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-accent);
  color: var(--color-accent);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  padding: 0.5rem 0.9rem;
  border-radius: 4px;
  white-space: nowrap;
  box-shadow: 0 0 20px rgba(232, 164, 90, 0.2);
}

.toast-enter-active, .toast-leave-active { transition: all 0.35s ease; }
.toast-enter-from { opacity: 0; transform: translateY(8px); }
.toast-leave-to   { opacity: 0; transform: translateY(-8px); }
</style>
