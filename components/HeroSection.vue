<template>
  <section class="hero-section" id="home">
    <div class="container">
      <div class="hero-content">
        <h1 class="fade-in">Gustavo<br>Cunha Lacerda</h1>
        <p class="hero-subtitle fade-in">
          <span class="typed-text">{{ displayedText }}</span><span class="cursor">|</span>
        </p>
        <div class="hero-buttons fade-in">
          <a href="#projects" class="btn btn-primary">{{ $t('hero.viewProjects') }}</a>
          <a href="#contact" class="btn btn-outline">{{ $t('hero.contact') }}</a>
          <button
            class="btn btn-accent"
            :disabled="isGenerating"
            :aria-label="$t('hero.downloadCV')"
            @click="generateResume"
          >
            <svg v-if="!isGenerating" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-spinner animate-spin"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
            {{ isGenerating ? $t('hero.generating') : $t('hero.downloadCV') }}
          </button>
          <span v-if="showError" class="download-error-toast" role="alert">
            {{ error }}
          </span>
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
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';

defineProps({
  profileData: { type: Object, required: true }
});

const { t, locale } = useI18n();

// Resume download
const { isGenerating, error, generateResume } = useResumeGenerator();
const showError = ref(false);
let errorTimer = null;

watch(error, (val) => {
  if (errorTimer) clearTimeout(errorTimer);
  if (val) {
    showError.value = true;
    errorTimer = setTimeout(() => {
      showError.value = false;
      error.value = null;
    }, 3000);
  } else {
    showError.value = false;
  }
});

const roles = computed(() => {
  // Use t() with indexed keys — more reliable than tm() across vue-i18n versions
  const result = [];
  for (let i = 0; i < 10; i++) {
    const val = t(`hero.roles[${i}]`);
    // t() returns the key path itself when the key doesn't exist
    if (val === `hero.roles[${i}]`) break;
    result.push(val);
  }
  return result.length > 0
    ? result
    : ['Full Stack Developer', 'Vue.js Enthusiast', 'Problem Solver', 'Open Source Contributor'];
});

const displayedText = ref('');
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let timer = null;

const type = () => {
  const currentRoles = roles.value;
  if (currentRoles.length === 0) return;
  if (roleIndex >= currentRoles.length) roleIndex = 0;

  const current = currentRoles[roleIndex];
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
    roleIndex = (roleIndex + 1) % currentRoles.length;
    delay = 400;
  }

  timer = setTimeout(type, delay);
};

// Reset typing effect when locale changes
watch(locale, () => {
  clearTimeout(timer);
  roleIndex = 0;
  charIndex = 0;
  isDeleting = false;
  displayedText.value = '';
  timer = setTimeout(type, 400);
});

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

.btn-accent {
  background: transparent;
  border-color: var(--color-accent);
  color: var(--color-accent);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-accent:hover {
  background: rgba(232, 164, 90, 0.1);
}

.btn-accent:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.icon-download,
.icon-spinner {
  flex-shrink: 0;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.hero-buttons {
  position: relative;
}

.download-error-toast {
  position: absolute;
  bottom: -2.2rem;
  left: 0;
  background: #dc2626;
  color: #fff;
  font-size: 0.78rem;
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  white-space: nowrap;
  animation: fade-in-out 3s ease forwards;
  pointer-events: none;
}

@keyframes fade-in-out {
  0% { opacity: 0; transform: translateY(-4px); }
  10% { opacity: 1; transform: translateY(0); }
  80% { opacity: 1; }
  100% { opacity: 0; }
}
</style>
