# Project Structure

## Directory Organization

### `/components/`
Vue components for the portfolio sections and UI elements:
- **Section Components**: HeroSection, AboutSection, ExperienceSection, ProjectsSection, ContactSection, FooterSection
- **UI Components**: NavBar, ProjectCard, ExperienceItem
- **Interactive Elements**: SpaceBackground, RubiksCube, MathEasterEgg

### `/assets/css/`
Global styles and SCSS files:
- `main.scss` - Main stylesheet with global styles and variables

### `/data/`
Static JSON data files:
- `linkedin_profile.json` - Professional profile information
- `github_repos.json` - GitHub repository data for projects section

### `/plugins/`
Nuxt plugins for cross-cutting concerns:
- `performance.js` - Performance optimization utilities
- `seo.js` - SEO configuration and meta tag management

### `/public/`
Static assets served directly:
- `favicon.ico` - Site favicon
- `robots.txt` - Search engine crawler instructions

### `/scripts/`
Build and utility scripts:
- `optimize-images.mjs` - Image optimization tooling

### `/server/`
Server-side configuration:
- `tsconfig.json` - TypeScript configuration for server

## Core Architecture

### Application Entry Point
- `app.vue` - Root component orchestrating all sections and loading profile data

### Configuration Files
- `nuxt.config.ts` - Nuxt framework configuration with modules, build settings, and optimization
- `package.json` - Dependencies and npm scripts
- `tsconfig.json` - TypeScript configuration for the project

## Component Relationships
```
app.vue (Root)
├── SpaceBackground (Visual Layer)
├── MathEasterEgg (Interactive Layer)
├── RubiksCube (Interactive Layer)
├── NavBar (Navigation)
├── main (Content Container)
│   ├── HeroSection
│   ├── AboutSection
│   ├── ExperienceSection
│   ├── ProjectsSection
│   │   └── ProjectCard (repeated)
│   └── ContactSection
└── FooterSection
```

## Architectural Patterns
- **Component-Based Architecture**: Modular Vue 3 components with Composition API
- **Single Page Application**: Client-side rendered with SSR disabled
- **Static Site Generation**: Pre-rendered for GitHub Pages deployment
- **Data-Driven Content**: JSON files for profile and project data
- **Plugin System**: Nuxt plugins for performance and SEO concerns
- **Utility-First CSS**: Tailwind CSS with custom SCSS for global styles
