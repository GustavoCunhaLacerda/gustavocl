<template>
  <section class="hero-section" id="home">
    <div class="container">
      <div class="hero-content">
        <h1 class="fade-in">Gustavo<br>Cunha Lacerda</h1>
        <p class="hero-subtitle fade-in">
          <span class="typed-text">{{ displayedText }}</span><span class="cursor">|</span>
        </p>
        <div class="hero-buttons fade-in">
          <a href="#projects" class="btn btn-primary">Ver Projetos</a>
          <a href="#contact" class="btn btn-outline">Contato</a>
        </div>
      </div>
    </div>
    <a href="#about" class="scroll-indicator fade-in" aria-label="Rolar para baixo">
      <div class="mouse">
        <div class="wheel"></div>
      </div>
      <div class="arrow">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </a>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

defineProps({
  profileData: { type: Object, required: true }
});

const roles = ['Full Stack Developer', 'Vue.js Enthusiast', 'Problem Solver', 'Open Source Contributor'];
const displayedText = ref('');
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let timer = null;

const type = () => {
  const current = roles[roleIndex];
  if (isDeleting) {
    displayedText.value = current.slice(0, --charIndex);
  } else {
    displayedText.value = current.slice(0, ++charIndex);
  }

  let delay = isDeleting ? 60 : 100;

  if (!isDeleting && charIndex === current.length) {
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 400;
  }

  timer = setTimeout(type, delay);
};

onMounted(() => { timer = setTimeout(type, 800); });
onUnmounted(() => clearTimeout(timer));
</script>

<style scoped>
.hero-section {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding-top: 80px;
}

.hero-content {
  max-width: 800px;
}

.hero-subtitle {
  font-size: 1.4rem;
  margin-bottom: 2rem;
  color: var(--color-text-secondary);
  min-height: 2rem;
  font-family: var(--font-mono);
}

.cursor {
  color: var(--color-accent);
  animation: blink 1s step-end infinite;
  opacity: 0.8;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.btn-primary {
  background: var(--color-accent);
  color: var(--color-space-black);
  border-color: var(--color-accent);
}

.btn-primary:hover {
  background: transparent;
  color: var(--color-accent);
}

.btn-outline:hover {
  color: var(--color-space-black);
}

/* Indicador de rolagem */
.scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0.45;
  text-decoration: none;
}

.mouse {
  width: 26px;
  height: 42px;
  border: 1px solid rgba(232, 164, 90, 0.4);
  border-radius: 20px;
  position: relative;
}

.wheel {
  width: 3px;
  height: 7px;
  background: var(--color-accent);
  position: absolute;
  top: 7px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 2px;
  animation: scroll-wheel 2s infinite;
}

.arrow {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.arrow span {
  display: block;
  width: 8px;
  height: 8px;
  border-bottom: 1px solid rgba(232, 164, 90, 0.5);
  border-right: 1px solid rgba(232, 164, 90, 0.5);
  transform: rotate(45deg);
  animation: arrow-anim 2s infinite;
  opacity: 0;
}

.arrow span:nth-child(2) { animation-delay: 0.2s; }
.arrow span:nth-child(3) { animation-delay: 0.4s; }

@keyframes scroll-wheel {
  0% { opacity: 1; top: 8px; }
  50% { opacity: 0; top: 28px; }
  100% { opacity: 1; top: 8px; }
}

@keyframes arrow-anim {
  0% { opacity: 0; transform: rotate(45deg) translate(-4px, -4px); }
  50% { opacity: 1; }
  100% { opacity: 0; transform: rotate(45deg) translate(4px, 4px); }
}

@media (max-width: 768px) {
  .hero-subtitle { font-size: 1.1rem; }
  .hero-buttons { flex-direction: column; align-items: flex-start; }
}
</style>
