// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/i18n'
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  i18n: {
    restructureDir: false,
    locales: [
      { code: 'pt-BR', file: 'pt-BR.json', name: 'Português' },
      { code: 'en', file: 'en.json', name: 'English' }
    ],
    defaultLocale: 'pt-BR',
    fallbackLocale: 'pt-BR',
    lazy: true,
    langDir: 'locales/',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: false,
      fallbackLocale: 'pt-BR'
    }
  },
  css: [
    '~/assets/css/main.scss'
  ],
  app: {
    head: {
      title: 'Gustavo Cunha Lacerda | Portfólio',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'description', content: 'Portfólio de Gustavo Cunha Lacerda - Desenvolvedor Full Stack' },
        { name: 'theme-color', content: '#0d0a08' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Work+Sans:wght@300;400;500;600;700&display=swap' }
      ]
    }
  },
  build: {
    transpile: ['three', 'gsap']
  },
  nitro: {
    compressPublicAssets: true,
    minify: true,
    preset: 'static'
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler'
        }
      }
    },
    build: {
      cssMinify: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true
        }
      }
    },
    optimizeDeps: {
      include: ['three', 'gsap']
    }
  },
  ssr: false,
  compatibilityDate: '2025-04-23'
})