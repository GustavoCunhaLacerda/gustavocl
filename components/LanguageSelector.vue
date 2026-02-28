<template>
  <button
    @click="toggleLocale"
    class="lang-selector"
    :aria-label="ariaLabel"
    type="button"
  >
    <span class="lang-code">{{ displayCode }}</span>
  </button>
</template>

<script setup>
const { locale, setLocale, locales } = useI18n()

const otherLocale = computed(() => {
  return locales.value.find(l => l.code !== locale.value) || locales.value[0]
})

const displayCode = computed(() => {
  return otherLocale.value.code === 'en' ? 'EN' : 'PT'
})

const ariaLabel = computed(() => {
  return locale.value === 'pt-BR'
    ? 'Switch to English'
    : 'Mudar para Português'
})

const LOCALE_STORAGE_KEY = 'preferred-locale'

const toggleLocale = () => {
  const newLocale = locale.value === 'pt-BR' ? 'en' : 'pt-BR'
  setLocale(newLocale)
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale)
  } catch {
    // localStorage unavailable (e.g. private browsing) — silently ignore
  }
}
</script>

<style scoped>
.lang-selector {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--color-text-secondary);
  background: none;
  border: 1px solid rgba(232, 164, 90, 0.2);
  border-radius: 3px;
  padding: 0.3rem 0.6rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.lang-selector:hover,
.lang-selector:focus-visible {
  color: var(--color-accent);
  border-color: var(--color-accent);
  outline: none;
}

.lang-code {
  font-weight: 700;
}
</style>
