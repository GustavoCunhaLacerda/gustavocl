// Arquivo de configuração para otimização de SEO
export default defineNuxtPlugin(() => {
  useHead({
    meta: [
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: 'Gustavo Cunha Lacerda' },
      { property: 'og:title', content: 'Gustavo Cunha Lacerda | Portfólio' },
      { property: 'og:description', content: 'Portfólio de Gustavo Cunha Lacerda - Desenvolvedor Full Stack' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://gustavolacerda.com' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Gustavo Cunha Lacerda | Portfólio' },
      { name: 'twitter:description', content: 'Portfólio de Gustavo Cunha Lacerda - Desenvolvedor Full Stack' },
      { name: 'theme-color', content: '#0d0a08' }
    ],
    link: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }
    ],
    script: [
      {
        innerHTML: `
          // Detectar se o usuário prefere modo escuro
          const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
          document.documentElement.classList.toggle('dark-mode', prefersDarkMode);
          
          // Melhorar performance de animações
          document.documentElement.classList.add('no-fouc');
          window.addEventListener('load', () => {
            document.documentElement.classList.remove('no-fouc');
          });
        `,
        type: 'text/javascript'
      }
    ]
  })
})
