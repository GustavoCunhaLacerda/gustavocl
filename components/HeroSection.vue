<template>
  <div class="hero-section">
    <div class="container">
      <div class="hero-content">
        <h1 class="fade-in">Gustavo Cunha Lacerda</h1>
        <p class="hero-subtitle fade-in">{{ profileData.headline }}</p>
        <div class="hero-buttons fade-in">
          <a href="#projects" class="btn">Ver Projetos</a>
          <a href="#contact" class="btn">Contato</a>
        </div>
      </div>
    </div>
    <div class="scroll-indicator fade-in">
      <div class="mouse">
        <div class="wheel"></div>
      </div>
      <div class="arrow">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  profileData: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.hero-section {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.hero-content {
  max-width: 800px;
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: var(--color-text-secondary);
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
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
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.scroll-indicator:hover {
  opacity: 1;
}

.mouse {
  width: 30px;
  height: 50px;
  border: 2px solid var(--color-accent);
  border-radius: 20px;
  position: relative;
}

.wheel {
  width: 4px;
  height: 8px;
  background-color: var(--color-accent);
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 2px;
  animation: scroll 2s infinite;
}

.arrow {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.arrow span {
  display: block;
  width: 10px;
  height: 10px;
  border-bottom: 2px solid var(--color-accent);
  border-right: 2px solid var(--color-accent);
  transform: rotate(45deg);
  animation: arrow 2s infinite;
  opacity: 0;
}

.arrow span:nth-child(1) {
  animation-delay: 0s;
}

.arrow span:nth-child(2) {
  animation-delay: 0.2s;
}

.arrow span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes scroll {
  0% {
    opacity: 1;
    top: 10px;
  }
  50% {
    opacity: 0;
    top: 30px;
  }
  100% {
    opacity: 1;
    top: 10px;
  }
}

@keyframes arrow {
  0% {
    opacity: 0;
    transform: rotate(45deg) translate(-5px, -5px);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: rotate(45deg) translate(5px, 5px);
  }
}

@media (max-width: 768px) {
  .hero-subtitle {
    font-size: 1.2rem;
  }
  
  .hero-buttons {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
