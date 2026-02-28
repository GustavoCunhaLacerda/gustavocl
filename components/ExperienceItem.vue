<template>
  <div 
    class="experience-item" 
    :class="{ 'is-expanded': isExpanded }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- Timeline connector -->
    <div class="timeline-track">
      <div class="timeline-dot" :class="{ active: !position.end?.year }">
        <div class="dot-pulse" v-if="!position.end?.year"></div>
      </div>
      <div class="timeline-line"></div>
    </div>

    <!-- Card -->
    <div class="experience-card" :class="{ hovered: isHovered }">
      <!-- Header -->
      <div class="card-header">
        <div class="company-info">
          <img 
            v-if="resolvedLogo && !logoError" 
            :src="resolvedLogo" 
            :alt="position.companyName"
            class="company-logo"
            loading="lazy"
            @error="logoError = true"
          />
          <div class="company-logo-fallback" v-if="!resolvedLogo || logoError">
            {{ position.companyName?.charAt(0) }}
          </div>
          <div class="header-text">
            <h3 class="position-title">{{ positionTitle }}</h3>
            <a 
              v-if="position.companyURL" 
              :href="position.companyURL" 
              target="_blank" 
              rel="noopener noreferrer"
              class="company-name"
            >
              {{ position.companyName }}
              <svg class="external-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
            <h4 v-else class="company-name-plain">{{ position.companyName }}</h4>
          </div>
        </div>

        <div class="meta-badges">
          <span class="date-badge">
            {{ formatDate(position.start) }} — {{ position.end?.year ? formatDate(position.end) : $t('experience.present') }}
          </span>
          <span class="duration-badge" v-if="duration">
            {{ duration }}
          </span>
          <span class="type-badge" v-if="position.employmentType">
            {{ $t(`experience.employmentType.${position.employmentType}`) }}
          </span>
        </div>
      </div>

      <!-- Description -->
      <div class="description-wrapper" :class="{ collapsed: !isExpanded && isLongDescription }">
        <p class="experience-description">{{ positionDescription }}</p>
        <div class="description-fade" v-if="!isExpanded && isLongDescription"></div>
      </div>

      <button 
        v-if="isLongDescription" 
        class="expand-btn" 
        @click="isExpanded = !isExpanded"
        :aria-expanded="isExpanded"
        aria-label="Expandir descrição"
      >
        {{ isExpanded ? $t('experience.expandLess') : $t('experience.expandMore') }}
        <svg 
          class="chevron" 
          :class="{ rotated: isExpanded }" 
          width="14" height="14" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2"
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      <!-- Tech tags -->
      <div class="tech-tags" v-if="techTags.length">
        <span class="tech-tag" v-for="tag in techTags" :key="tag">{{ tag }}</span>
      </div>

      <!-- Location -->
      <div class="location" v-if="position.location">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        {{ position.location }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLocaleData } from '../composables/useLocaleData';

const { t, locale } = useI18n();
const { getPositionTitle, getPositionDescription } = useLocaleData();

const props = defineProps({
  position: { type: Object, required: true }
});

const isExpanded = ref(false);
const isHovered = ref(false);
const logoError = ref(false);

// Local logo imports (replace online URLs)
import dataprevLogo from '~/assets/logo/dataprev.jpg';
import medwareLogo from '~/assets/logo/medware.jpg';
import xpboxLogo from '~/assets/logo/xpbox.webp';
import tcuLogo from '~/assets/logo/tcu.jpeg';
import ifbLogo from '~/assets/logo/ifb.png';

const companyLogoMap = {
  'DATAPREV': dataprevLogo,
  'Medware Sistemas Médicos': medwareLogo,
  'Xpbox Digital': xpboxLogo,
  'Tribunal de Contas da União': tcuLogo,
  'IFB - Instituto Federal de Brasília (Oficial)': ifbLogo
};

const companyKeyMap = {
  'DATAPREV': 'dataprev',
  'Medware Sistemas Médicos': 'medware',
  'Xpbox Digital': 'xpbox',
  'Tribunal de Contas da União': 'tcu',
  'IFB - Instituto Federal de Brasília': 'ifb'
};

const resolvedLogo = computed(() => {
  return companyLogoMap[props.position.companyName] || props.position.companyLogo;
});

const positionKey = computed(() => companyKeyMap[props.position.companyName] || '');

const positionTitle = computed(() => {
  const key = positionKey.value;
  return key ? getPositionTitle(key) : props.position.title;
});

const positionDescription = computed(() => {
  const key = positionKey.value;
  return key ? getPositionDescription(key) : props.position.description;
});

const formatDate = (dateObj) => {
  if (!dateObj?.year) return '';
  if (!dateObj.month) return `${dateObj.year}`;
  return `${t(`experience.months[${dateObj.month - 1}]`)} ${dateObj.year}`;
};

const duration = computed(() => {
  const start = props.position.start;
  const end = props.position.end?.year ? props.position.end : { year: new Date().getFullYear(), month: new Date().getMonth() + 1 };
  if (!start?.year) return '';
  
  let totalMonths = (end.year - start.year) * 12 + ((end.month || 1) - (start.month || 1));
  if (totalMonths < 1) totalMonths = 1;
  
  const years = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;
  
  const yearWord = years > 1 ? t('experience.duration.years') : t('experience.duration.year');
  const monthWord = remainingMonths > 1 ? t('experience.duration.months') : t('experience.duration.month');
  const andWord = t('experience.duration.and');
  
  if (years > 0 && remainingMonths > 0) return `${years} ${yearWord} ${andWord} ${remainingMonths} ${monthWord}`;
  if (years > 0) return `${years} ${yearWord}`;
  return `${remainingMonths} ${monthWord}`;
});

const isLongDescription = computed(() => {
  return (positionDescription.value?.length || 0) > 200;
});

// Extract tech tags from description
const knownTechs = [
  'PHP', 'jQuery', 'Bootstrap', 'MySQL', 'Slim Framework', 'Nuxt.js', 'Nuxt',
  '.NET 5', '.NET', 'C#', 'React Native', 'React', 'Vue.js', 'Vue',
  'Tailwind CSS', 'Tailwind', 'JavaScript', 'TypeScript', 'Python',
  'PyTorch', 'MediaPipe', 'Firebase', 'Axios', 'Figma', 'REST', 'Rest',
  'HTML', 'CSS', 'Node.js', 'Git', 'WebSocket'
];

const techTags = computed(() => {
  const desc = positionDescription.value || '';
  const found = new Set();
  
  knownTechs.forEach(tech => {
    const regex = new RegExp(`\\b${tech.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(desc)) {
      // Normalize duplicates
      if (tech === 'Nuxt.js') found.add('Nuxt.js');
      else if (tech === 'Nuxt' && !found.has('Nuxt.js')) found.add('Nuxt');
      else if (tech === 'Vue.js') found.add('Vue.js');
      else if (tech === 'Vue' && !found.has('Vue.js')) found.add('Vue');
      else if (tech === 'Tailwind CSS') found.add('Tailwind CSS');
      else if (tech === 'Tailwind' && !found.has('Tailwind CSS')) found.add('Tailwind');
      else if (tech === '.NET 5') found.add('.NET 5');
      else if (tech === '.NET' && !found.has('.NET 5')) found.add('.NET');
      else if (tech === 'Rest' || tech === 'REST') found.add('REST');
      else found.add(tech);
    }
  });
  
  return [...found];
});
</script>

<style scoped>
.experience-item {
  display: flex;
  gap: 1.5rem;
  position: relative;
}

/* Timeline track */
.timeline-track {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 20px;
}

.timeline-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid var(--color-accent-dim);
  background: var(--color-bg);
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
  margin-top: 1.6rem;
}

.timeline-dot.active {
  border-color: var(--color-accent);
  background: var(--color-accent);
  box-shadow: 0 0 12px rgba(232, 164, 90, 0.4);
}

.dot-pulse {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1px solid var(--color-accent);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0; transform: scale(0.8); }
  50% { opacity: 0.6; transform: scale(1.3); }
}

.timeline-line {
  width: 1px;
  flex: 1;
  background: linear-gradient(to bottom, rgba(232, 164, 90, 0.3), rgba(232, 164, 90, 0.05));
  margin-top: 0.5rem;
}

.experience-item:last-child .timeline-line {
  background: linear-gradient(to bottom, rgba(232, 164, 90, 0.3), transparent);
}

/* Card */
.experience-card {
  flex: 1;
  background: var(--color-bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(12px);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.experience-card.hovered {
  border-color: var(--border-hover);
  box-shadow: 0 8px 32px rgba(232, 164, 90, 0.08);
  transform: translateX(4px);
}

/* Header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.company-info {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.company-logo {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid var(--border-subtle);
  flex-shrink: 0;
}

.company-logo-fallback {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: rgba(232, 164, 90, 0.1);
  border: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 1.1rem;
  color: var(--color-accent);
  flex-shrink: 0;
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.position-title {
  font-family: var(--font-mono);
  font-size: 1rem;
  color: var(--color-accent);
  margin-bottom: 0;
  line-height: 1.3;
}

.company-name {
  font-size: 0.9rem;
  color: var(--color-text);
  font-weight: 500;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  transition: color 0.2s ease;
}

.company-name:hover {
  color: var(--color-accent);
}

.external-icon {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.company-name:hover .external-icon {
  opacity: 0.7;
}

.company-name-plain {
  font-size: 0.9rem;
  color: var(--color-text);
  font-weight: 500;
  margin-bottom: 0;
}

/* Meta badges */
.meta-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  align-items: flex-start;
}

.date-badge,
.duration-badge,
.type-badge {
  font-size: 0.72rem;
  font-family: var(--font-mono);
  padding: 0.2rem 0.55rem;
  border-radius: 4px;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

.date-badge {
  color: var(--color-text-muted);
  background: rgba(232, 164, 90, 0.06);
  border: 1px solid rgba(232, 164, 90, 0.12);
}

.duration-badge {
  color: var(--color-accent-dim);
  background: rgba(232, 164, 90, 0.08);
  border: 1px solid rgba(232, 164, 90, 0.18);
}

.type-badge {
  color: var(--color-text-secondary);
  background: rgba(160, 140, 120, 0.08);
  border: 1px solid rgba(160, 140, 120, 0.15);
}

/* Description */
.description-wrapper {
  position: relative;
  overflow: hidden;
  transition: max-height 0.4s ease;
}

.description-wrapper.collapsed {
  max-height: 100px;
}

.description-fade {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: linear-gradient(to bottom, transparent, var(--color-bg-card));
  pointer-events: none;
}

.experience-description {
  color: var(--color-text-secondary);
  line-height: 1.75;
  font-size: 0.92rem;
  white-space: pre-line;
  margin-bottom: 0.5rem;
}

/* Expand button */
.expand-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: none;
  border: none;
  color: var(--color-accent);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  cursor: pointer;
  padding: 0.3rem 0;
  letter-spacing: 0.5px;
  transition: opacity 0.2s ease;
}

.expand-btn:hover {
  opacity: 0.8;
}

.chevron {
  transition: transform 0.3s ease;
}

.chevron.rotated {
  transform: rotate(180deg);
}

/* Tech tags */
.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.85rem;
  padding-top: 0.85rem;
  border-top: 1px solid rgba(232, 164, 90, 0.06);
}

.tech-tag {
  display: inline-block;
  padding: 0.22rem 0.6rem;
  background: rgba(232, 164, 90, 0.06);
  border: 1px solid rgba(232, 164, 90, 0.15);
  border-radius: 3px;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--color-text-secondary);
  letter-spacing: 0.3px;
  transition: all 0.2s ease;
}

.tech-tag:hover {
  background: rgba(232, 164, 90, 0.12);
  border-color: var(--color-accent);
  color: var(--color-accent);
  transform: translateY(-1px);
}

/* Location */
.location {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.7rem;
  font-size: 0.78rem;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
}

/* Responsive */
@media (max-width: 768px) {
  .experience-item {
    gap: 1rem;
  }

  .card-header {
    flex-direction: column;
    gap: 0.6rem;
  }

  .meta-badges {
    align-items: flex-start;
  }

  .company-logo {
    width: 34px;
    height: 34px;
  }

  .company-logo-fallback {
    width: 34px;
    height: 34px;
    font-size: 0.95rem;
  }

  .experience-card {
    padding: 1.2rem;
  }
}

@media (max-width: 480px) {
  .timeline-track {
    display: none;
  }

  .experience-item {
    gap: 0;
  }
}
</style>
