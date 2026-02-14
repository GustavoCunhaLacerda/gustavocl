<template>
  <div class="experience-item">
    <div class="timeline-dot"></div>
    <div class="experience-card">
      <div class="experience-header">
        <div>
          <h3>{{ position.title }}</h3>
          <h4>{{ position.companyName }}</h4>
        </div>
        <span class="experience-date">
          {{ formatDate(position.start) }} — {{ position.end?.year ? formatDate(position.end) : 'Presente' }}
        </span>
      </div>
      <div class="experience-description" v-html="formattedDescription"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  position: { type: Object, required: true }
});

const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const formatDate = (dateObj) => {
  if (!dateObj?.year) return '';
  return dateObj.month ? `${months[dateObj.month - 1]} ${dateObj.year}` : `${dateObj.year}`;
};

const formattedDescription = computed(() => {
  if (!props.position.description) return '';
  return props.position.description.replace(/\n/g, '<br>');
});
</script>

<style scoped>
.experience-item {
  position: relative;
  padding-left: 2rem;
  margin-bottom: 0;
}

/* Linha vertical da timeline */
.experience-item::before {
  content: '';
  position: absolute;
  left: 7px;
  top: 20px;
  bottom: -1.5rem;
  width: 1px;
  background: linear-gradient(to bottom, rgba(232, 164, 90, 0.5), transparent);
}

.experience-item:last-child::before {
  display: none;
}

.timeline-dot {
  position: absolute;
  left: 0;
  top: 18px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 1px solid var(--color-accent);
  background: var(--color-bg);
  box-shadow: 0 0 10px rgba(232, 164, 90, 0.3);
}

.experience-card {
  background: var(--color-bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(12px);
}

.experience-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

h3 {
  font-family: var(--font-mono);
  font-size: 1rem;
  color: var(--color-accent);
  margin-bottom: 0.2rem;
}

h4 {
  font-size: 0.95rem;
  color: var(--color-text);
  font-weight: 500;
}

.experience-date {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  white-space: nowrap;
  padding: 0.2rem 0.6rem;
  background: rgba(232, 164, 90, 0.06);
  border-radius: 3px;
  border: 1px solid rgba(232, 164, 90, 0.15);
  letter-spacing: 0.5px;
}

.experience-description {
  color: var(--color-text-secondary);
  line-height: 1.7;
  font-size: 0.95rem;
}
</style>
