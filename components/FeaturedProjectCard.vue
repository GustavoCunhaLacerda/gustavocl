<template>
  <a
    :href="project.url"
    target="_blank"
    rel="noopener noreferrer"
    class="featured-card"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <div class="card-top">
      <div class="badges">
        <span class="company-badge">{{ project.company }}</span>
        <span class="type-badge" v-if="project.type === 'research'">{{ $t('projects.research') }}</span>
      </div>
      <svg class="external" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="{ show: hovered }">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
        <polyline points="15 3 21 3 21 9"/>
        <line x1="10" y1="14" x2="21" y2="3"/>
      </svg>
    </div>

    <h3>{{ project.name }}</h3>
    <p>{{ translatedDescription }}</p>

    <div class="tech-tags">
      <span class="tech-tag" v-for="tech in project.techs" :key="tech">{{ tech }}</span>
    </div>
  </a>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useLocaleData } from '~/composables/useLocaleData';

const PROJECT_KEY_MAP = {
  'Calculadoras Medware': 'calculadoras-medware',
  'MoneySuite': 'moneysuite',
  'SIMP — TCU': 'simp-tcu',
  'Deep Fake Detection': 'deep-fake-detection'
};

const props = defineProps({
  project: { type: Object, required: true }
});

const { getProjectDescription } = useLocaleData();

const translatedDescription = computed(() => {
  const key = PROJECT_KEY_MAP[props.project.name];
  if (key) {
    return getProjectDescription(key);
  }
  return props.project.description;
});

const hovered = ref(false);
</script>

<style scoped>
.featured-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: var(--color-bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 10px;
  padding: 1.5rem;
  backdrop-filter: blur(12px);
  text-decoration: none;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.featured-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--color-accent), var(--color-glow), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.featured-card:hover {
  border-color: var(--border-hover);
  box-shadow: 0 8px 32px rgba(232, 164, 90, 0.1);
  transform: translateY(-3px);
}

.featured-card:hover::before {
  opacity: 1;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.badges {
  display: flex;
  gap: 0.4rem;
}

.company-badge {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  padding: 0.2rem 0.55rem;
  background: rgba(232, 164, 90, 0.1);
  border: 1px solid rgba(232, 164, 90, 0.2);
  border-radius: 4px;
  color: var(--color-accent);
  letter-spacing: 0.3px;
}

.type-badge {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  padding: 0.2rem 0.55rem;
  background: rgba(61, 26, 92, 0.2);
  border: 1px solid rgba(61, 26, 92, 0.4);
  border-radius: 4px;
  color: #b88adb;
  letter-spacing: 0.3px;
}

.external {
  color: var(--color-text-muted);
  opacity: 0;
  transition: all 0.2s ease;
  transform: translateX(-4px);
}

.external.show {
  opacity: 0.7;
  transform: translateX(0);
}

h3 {
  font-family: var(--font-mono);
  font-size: 1.05rem;
  color: var(--color-text);
  margin: 0;
  line-height: 1.3;
}

p {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  line-height: 1.65;
  margin: 0;
  flex-grow: 1;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(232, 164, 90, 0.06);
}

.tech-tag {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  padding: 0.18rem 0.5rem;
  background: rgba(232, 164, 90, 0.06);
  border: 1px solid rgba(232, 164, 90, 0.12);
  border-radius: 3px;
  color: var(--color-text-muted);
  letter-spacing: 0.3px;
}
</style>
