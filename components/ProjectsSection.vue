<template>
  <section class="projects-section" id="projects">
    <div class="container">
      <div class="section-header fade-in">
        <h2 class="section-title">{{ $t('projects.title') }}</h2>
      </div>

      <!-- Featured / Professional -->
      <div class="category fade-in" v-if="featuredProjects.length">
        <h3 class="category-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          {{ $t('projects.featured') }}
        </h3>
        <div class="featured-grid">
          <FeaturedProjectCard
            v-for="(project, i) in featuredProjects"
            :key="'f-' + i"
            :project="project"
          />
        </div>
      </div>

      <!-- Open Source / GitHub -->
      <div class="category fade-in" v-if="githubProjects.length">
        <h3 class="category-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/>
          </svg>
          {{ $t('projects.openSource') }}
        </h3>
        <div class="projects-grid">
          <ProjectCard
            v-for="(project, i) in githubProjects"
            :key="'g-' + i"
            :project="project"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import ProjectCard from './ProjectCard.vue';
import FeaturedProjectCard from './FeaturedProjectCard.vue';

defineProps({
  featuredProjects: { type: Array, default: () => [] },
  githubProjects: { type: Array, default: () => [] }
});
</script>

<style scoped>
.projects-section {
  padding: 8rem 0;
  position: relative;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.category {
  margin-bottom: 3rem;
}

.category:last-child {
  margin-bottom: 0;
}

.category-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-subtle);
}

.category-title svg {
  color: var(--color-accent-dim);
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
}

@media (max-width: 768px) {
  .projects-section {
    padding: 4rem 0;
  }

  .featured-grid,
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>
