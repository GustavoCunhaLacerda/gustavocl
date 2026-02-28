<template>
  <section class="experience-section" id="experience">
    <div class="container">
      <div class="section-header fade-in">
        <h2 class="section-title">{{ $t('experience.title') }}</h2>
        <p class="section-subtitle">
          {{ $t('experience.subtitle', { years: totalYears }) }}
        </p>
      </div>

      <div class="experience-timeline fade-in">
        <ExperienceItem 
          v-for="(position, index) in profileData.position" 
          :key="index" 
          :position="position" 
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import ExperienceItem from './ExperienceItem.vue';

const props = defineProps({
  profileData: {
    type: Object,
    required: true
  }
});

const totalYears = computed(() => {
  const positions = props.profileData?.position;
  if (!positions?.length) return 0;
  
  const earliest = positions.reduce((min, p) => {
    const year = p.start?.year || 9999;
    return year < min ? year : min;
  }, 9999);
  
  return Math.floor(new Date().getFullYear() - earliest);
});
</script>

<style scoped>
.experience-section {
  padding: 8rem 0;
  position: relative;
}

.section-header {
  text-align: center;
  margin-bottom: 3.5rem;
}

.section-subtitle {
  color: var(--color-text-secondary);
  font-size: 1rem;
  margin-top: -0.5rem;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

.experience-timeline {
  max-width: 800px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .experience-section {
    padding: 4rem 0;
  }

  .section-header {
    margin-bottom: 2.5rem;
  }
}
</style>
