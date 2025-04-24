<template>
  <div class="projects-section" id="projects">
    <div class="container">
      <h2 class="section-title fade-in">Projetos</h2>
      <div class="projects-grid fade-in">
        <ProjectCard 
          v-for="(project, index) in projects" 
          :key="index" 
          :project="project" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import ProjectCard from './ProjectCard.vue';

const props = defineProps({
  projects: {
    type: Array,
    required: true
  }
});
</script>

<style scoped>
.projects-section {
  padding: 8rem 0;
  position: relative;
}

.section-title {
  margin-bottom: 3rem;
  text-align: center;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

@media (max-width: 768px) {
  .projects-section {
    padding: 4rem 0;
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>
