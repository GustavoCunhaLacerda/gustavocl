// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  css: [
    '~/assets/css/main.scss'
  ],
  app: {
    head: {
      title: 'Gustavo Cunha Lacerda | Portfólio',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Portfólio de Gustavo Cunha Lacerda - Desenvolvedor Full Stack' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
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
