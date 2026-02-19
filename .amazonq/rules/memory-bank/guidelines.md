# Development Guidelines

## Code Quality Standards

### File Organization
- Use descriptive file names matching component/functionality purpose
- Place plugins in `/plugins/` directory with clear naming (e.g., `performance.js`, `seo.js`)
- Configuration files at root level (e.g., `nuxt.config.ts`)
- Separate concerns: performance, SEO, and business logic in dedicated files

### Code Formatting
- Use 2-space indentation consistently
- Include inline comments in Portuguese for complex logic
- Add reference comments for external documentation (e.g., `// https://nuxt.com/docs/api/configuration/nuxt-config`)
- Use descriptive variable names in camelCase
- Maintain consistent spacing around operators and braces

### Naming Conventions
- **Variables**: camelCase (e.g., `lazyLoadResources`, `prefetchLinks`, `lazyImageObserver`)
- **Functions**: camelCase with verb prefixes (e.g., `lazyLoadResources`, `defineNuxtPlugin`)
- **Constants**: camelCase for arrays and objects (e.g., `prefetchLinks`)
- **Files**: kebab-case for plugins (e.g., `performance.js`, `seo.js`)
- **Configuration**: camelCase for properties (e.g., `compressPublicAssets`, `cssMinify`)

### Documentation Standards
- Include file-level comments describing purpose (e.g., `// Arquivo de otimização de carregamento de recursos`)
- Add inline comments for non-obvious logic
- Document configuration sections with clear intent
- Use Portuguese for comments in implementation files

## Semantic Patterns

### Plugin Architecture Pattern
```javascript
// Standard Nuxt plugin structure
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    // Client-side only logic
  }
});
```
**Frequency**: Used in all plugin files (2/2 plugins)

### Client-Side Guard Pattern
```javascript
if (process.client) {
  // Browser-only code
}
```
**Purpose**: Prevent server-side execution of browser-specific code
**Frequency**: Critical pattern in performance.js

### Lazy Loading Pattern
```javascript
const lazyLoadResources = () => {
  // Defer non-critical resource loading
  setTimeout(lazyLoadResources, 1000);
};

if (document.readyState === 'complete') {
  setTimeout(lazyLoadResources, 1000);
} else {
  window.addEventListener('load', () => {
    setTimeout(lazyLoadResources, 1000);
  });
}
```
**Purpose**: Optimize initial page load by deferring non-critical resources
**Frequency**: Core performance optimization pattern

### Intersection Observer Pattern
```javascript
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
```
**Purpose**: Implement viewport-based lazy loading with fallback support
**Frequency**: Standard for image optimization

### Progressive Enhancement Pattern
```javascript
if ('loading' in HTMLImageElement.prototype) {
  // Native lazy loading support
} else {
  // Fallback implementation
}
```
**Purpose**: Feature detection with graceful degradation
**Frequency**: Used for cross-browser compatibility

### Prefetch Link Pattern
```javascript
const prefetchLinks = ['/about', '/projects', '/experience', '/contact'];

prefetchLinks.forEach(href => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
});
```
**Purpose**: Preload likely navigation targets for faster transitions
**Frequency**: Performance optimization technique

### Nuxt Hook Pattern
```javascript
nuxtApp.hook('page:finish', () => {
  // Execute after page rendering completes
});
```
**Purpose**: Lifecycle-aware code execution
**Frequency**: Standard for page-level operations

## Configuration Patterns

### Performance-First Configuration
```javascript
export default defineNuxtConfig({
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
    }
  }
});
```
**Purpose**: Aggressive optimization for production builds
**Frequency**: Standard configuration approach

### SEO Meta Configuration Pattern
```javascript
useHead({
  meta: [
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'Title' },
    { property: 'og:description', content: 'Description' },
    { name: 'twitter:card', content: 'summary_large_image' }
  ]
});
```
**Purpose**: Comprehensive social media and search engine optimization
**Frequency**: Standard SEO setup

### Resource Preconnect Pattern
```javascript
link: [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }
]
```
**Purpose**: Optimize external resource loading
**Frequency**: Used for third-party services

### Inline Script Pattern
```javascript
script: [
  {
    innerHTML: `
      // Critical inline JavaScript
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark-mode', prefersDarkMode);
    `,
    type: 'text/javascript'
  }
]
```
**Purpose**: Execute critical scripts before page render
**Frequency**: Used for FOUC prevention and theme detection

## Best Practices

### Performance Optimization
- Always defer non-critical resources with 1000ms delay
- Implement lazy loading for images with native + fallback support
- Use Intersection Observer for viewport-based loading
- Prefetch likely navigation targets
- Enable asset compression and minification
- Remove console.log statements in production builds
- Transpile heavy libraries (Three.js, GSAP)

### SEO Optimization
- Include comprehensive meta tags (robots, author, Open Graph, Twitter Card)
- Set theme-color for mobile browsers
- Preconnect to external resource domains
- Use semantic HTML structure
- Implement proper title and description tags

### Code Organization
- Separate concerns into dedicated plugins
- Use Nuxt lifecycle hooks appropriately
- Guard client-side code with process.client checks
- Implement progressive enhancement with feature detection
- Keep configuration centralized in nuxt.config.ts

### Static Site Generation
- Disable SSR for client-only applications (`ssr: false`)
- Use Nitro static preset for GitHub Pages deployment
- Optimize dependencies for faster builds
- Implement proper asset optimization pipeline

### Browser Compatibility
- Always provide fallbacks for modern APIs
- Use feature detection over browser detection
- Test lazy loading across browsers
- Ensure graceful degradation for older browsers
