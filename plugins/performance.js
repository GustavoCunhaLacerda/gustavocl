// Arquivo de otimização de carregamento de recursos
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    // Função para carregar recursos não críticos após o carregamento da página
    const lazyLoadResources = () => {
      // Carregar scripts de terceiros ou recursos adicionais aqui
      // Exemplo: Analytics, fontes adicionais, etc.
      
      // Pré-carregar páginas que o usuário provavelmente visitará
      const prefetchLinks = [
        '/about',
        '/projects',
        '/experience',
        '/contact'
      ];
      
      prefetchLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = href;
        document.head.appendChild(link);
      });
    };

    // Executar após o carregamento da página
    if (document.readyState === 'complete') {
      setTimeout(lazyLoadResources, 1000);
    } else {
      window.addEventListener('load', () => {
        setTimeout(lazyLoadResources, 1000);
      });
    }
    
    // Implementar carregamento lazy de imagens
    nuxtApp.hook('page:finish', () => {
      const lazyImages = document.querySelectorAll('img[loading="lazy"]');
      if ('loading' in HTMLImageElement.prototype) {
        // O navegador suporta lazy loading nativo
        lazyImages.forEach(img => {
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
        });
      } else {
        // Fallback para navegadores que não suportam lazy loading nativo
        const lazyImageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const lazyImage = entry.target;
              if (lazyImage.dataset.src) {
                lazyImage.src = lazyImage.dataset.src;
                lazyImageObserver.unobserve(lazyImage);
              }
            }
          });
        });
        
        lazyImages.forEach(img => {
          lazyImageObserver.observe(img);
        });
      }
    });
  }
});
