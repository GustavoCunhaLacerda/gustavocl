# Technology Stack

## Core Framework
- **Nuxt 3** (v3.16.2) - Vue.js meta-framework for SSG/SPA
- **Vue 3** (v3.5.13) - Progressive JavaScript framework with Composition API
- **Vue Router** (v4.5.0) - Official routing library

## Styling & UI
- **Tailwind CSS** (v6.13.2 via @nuxtjs/tailwindcss) - Utility-first CSS framework
- **SASS** (v1.87.0) - CSS preprocessor for custom styles
- **Google Fonts** - Space Mono and Work Sans font families

## Animation & 3D Graphics
- **GSAP** (v3.12.7) - Professional-grade animation library
- **Three.js** (v0.176.0) - 3D graphics library for WebGL

## Build Tools & Configuration
- **TypeScript** - Type-safe JavaScript with .ts configuration
- **Vite** - Fast build tool (integrated with Nuxt 3)
- **Terser** - JavaScript minification
- **Nitro** - Nuxt server engine with static preset

## Development Dependencies
- **Sharp** (v0.34.1) - Image optimization library
- **gh-pages** (v6.3.0) - GitHub Pages deployment utility

## Development Commands

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
# Starts server on http://localhost:3000
```

### Production Build
```bash
npm run build
# Builds optimized production bundle
```

### Static Site Generation
```bash
npm run generate
# Generates static files in .output/public
```

### Preview Production Build
```bash
npm run preview
# Preview generated static site locally
```

### Deployment
```bash
npm run deploy
# Generates static site and deploys to GitHub Pages
```

### Post-Install
```bash
npm run postinstall
# Runs nuxt prepare (automatic after npm install)
```

## Build Configuration Highlights
- **SSR**: Disabled (client-side only)
- **Target**: Static site generation
- **Minification**: Terser with console.log removal in production
- **Asset Compression**: Enabled via Nitro
- **CSS Minification**: Enabled
- **Transpilation**: Three.js and GSAP transpiled for compatibility
- **Optimization**: Dependencies pre-bundled for faster dev startup
