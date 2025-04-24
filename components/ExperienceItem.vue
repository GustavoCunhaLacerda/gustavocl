<template>
  <div class="experience-item">
    <div class="experience-header">
      <h3>{{ position.title }}</h3>
      <h4>{{ position.companyName }}</h4>
      <p class="experience-date">
        {{ formatDate(position.start) }} - {{ position.end.year ? formatDate(position.end) : 'Presente' }}
      </p>
    </div>
    <div class="experience-description" v-html="formattedDescription"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  position: {
    type: Object,
    required: true
  }
});

// Formatar data
const formatDate = (dateObj) => {
  if (!dateObj || !dateObj.year) return '';
  
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  return `${months[dateObj.month - 1]} ${dateObj.year}`;
};

// Formatar descrição com quebras de linha
const formattedDescription = computed(() => {
  if (!props.position.description) return '';
  return props.position.description.replace(/\n/g, '<br>');
});
</script>

<style scoped>
.experience-item {
  background: rgba(26, 26, 58, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.experience-item:hover {
  border-color: var(--color-accent);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.experience-header {
  margin-bottom: 1rem;
}

h3 {
  font-family: var(--font-mono);
  color: var(--color-accent);
  margin-bottom: 0.3rem;
}

h4 {
  font-size: 1.1rem;
  margin-bottom: 0.3rem;
}

.experience-date {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
}

.experience-description {
  color: var(--color-text-secondary);
  line-height: 1.6;
}
</style>
