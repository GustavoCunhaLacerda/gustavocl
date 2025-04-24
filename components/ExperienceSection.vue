<template>
  <div class="experience-section" id="experience">
    <div class="container">
      <h2 class="section-title fade-in">Experiência</h2>
      <div class="experience-grid fade-in">
        <ExperienceItem 
          v-for="(position, index) in profileData.position" 
          :key="index" 
          :position="position" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import ExperienceItem from './ExperienceItem.vue';

const props = defineProps({
  profileData: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.experience-section {
  padding: 8rem 0;
  position: relative;
}

.section-title {
  margin-bottom: 3rem;
  text-align: center;
}

.experience-grid {
  max-width: 800px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .experience-section {
    padding: 4rem 0;
  }
}
</style>
