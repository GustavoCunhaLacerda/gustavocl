<template>
  <div class="project-card" @mouseenter="startAnimation" @mouseleave="stopAnimation">
    <h3>{{ project.name }}</h3>
    <p>{{ project.description || 'Projeto pessoal' }}</p>
    <div class="project-tech">
      <span v-if="project.language" class="tech-tag">{{ project.language }}</span>
      <span v-for="(topic, index) in project.topics" :key="index" class="tech-tag">{{ topic }}</span>
    </div>
    <div class="project-stats">
      <div class="stat">
        <span class="stat-icon">★</span>
        <span class="stat-value">{{ project.stargazers_count }}</span>
      </div>
      <div class="stat">
        <span class="stat-icon">⑂</span>
        <span class="stat-value">{{ project.forks_count }}</span>
      </div>
    </div>
    <a :href="project.html_url" target="_blank" class="project-link">Ver no GitHub</a>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { gsap } from 'gsap';

const props = defineProps({
  project: {
    type: Object,
    required: true
  }
});

const startAnimation = (e) => {
  gsap.to(e.currentTarget, {
    y: -10,
    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3)',
    borderColor: 'var(--color-accent)',
    duration: 0.3
  });
};

const stopAnimation = (e) => {
  gsap.to(e.currentTarget, {
    y: 0,
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    duration: 0.3
  });
};
</script>

<style scoped>
.project-card {
  background: rgba(26, 26, 58, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

h3 {
  font-family: var(--font-mono);
  color: var(--color-accent);
  margin-bottom: 0.5rem;
}

p {
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
  flex-grow: 1;
}

.project-tech {
  margin: 1rem 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag {
  font-size: 0.8rem;
  padding: 0.2rem 0.5rem;
  background: rgba(0, 217, 255, 0.1);
  border-radius: 4px;
  color: var(--color-accent);
}

.project-stats {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.stat-icon {
  color: var(--color-accent);
}

.project-link {
  margin-top: auto;
  align-self: flex-start;
  font-family: var(--font-mono);
  color: var(--color-accent);
  text-decoration: none;
  position: relative;
  padding-bottom: 0.2rem;
}

.project-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background-color: var(--color-accent);
  transition: width 0.3s ease;
}

.project-link:hover::after {
  width: 100%;
}
</style>
