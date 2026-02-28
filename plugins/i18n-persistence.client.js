const LOCALE_STORAGE_KEY = 'preferred-locale'
const VALID_LOCALES = ['pt-BR', 'en']
const DEFAULT_LOCALE = 'pt-BR'

export default defineNuxtPlugin((nuxtApp) => {
  const i18n = nuxtApp.$i18n

  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (stored && VALID_LOCALES.includes(stored) && stored !== i18n.locale.value) {
      i18n.setLocale(stored)
    }
  } catch {
    // localStorage unavailable — fall back to default (pt-BR)
  }
})
