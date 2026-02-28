// Arquivo de otimização de carregamento de recursos
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
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
