// Arquivo de configuração para otimização de SEO com suporte i18n
export default defineNuxtPlugin((nuxtApp) => {
  const i18n = nuxtApp.$i18n
  const locale = i18n.locale
  const t = i18n.t.bind(i18n)

  // Reactive SEO meta tags that update when locale changes
  useHead({
    htmlAttrs: {
      lang: () => locale.value
    },
    meta: [
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: 'Gustavo Cunha Lacerda' },
      { property: 'og:title', content: () => t('seo.title') },
      { property: 'og:description', content: () => t('seo.description') },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://gustavolacerda.com' },
      { property: 'og:image', content: 'https://gustavolacerda.com/me.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: () => t('seo.title') },
      { name: 'twitter:description', content: () => t('seo.description') },
      { name: 'twitter:image', content: 'https://gustavolacerda.com/me.png' },
      { name: 'theme-color', content: '#0d0a08' }
    ],
    link: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      { rel: 'alternate', hreflang: 'pt-BR', href: 'https://gustavolacerda.com' },
      { rel: 'alternate', hreflang: 'en', href: 'https://gustavolacerda.com' }
    ],
    script: []
  })

  // Set lang attribute directly and watch for changes
  if (import.meta.client) {
    document.documentElement.lang = locale.value
    watch(locale, (newLocale) => {
      document.documentElement.lang = newLocale
    })
  }
})
