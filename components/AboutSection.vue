<template>
  <section class="about-section" id="about">
    <div class="container">
      <h2 class="section-title fade-in">{{ $t('about.title') }}</h2>
      <div class="about-content fade-in">
        <div class="about-text">
          <p>{{ summary }}</p>
          <div class="skill-tags">
            <span
              v-for="(skill, index) in skills"
              :key="index"
              class="skill-tag"
              :style="{ animationDelay: `${index * 40}ms` }">
              {{ skill }}
            </span>
          </div>
        </div>
        <div class="about-image">
          <div class="image-wrapper">
            <img
              src="/me.png"
              alt="Gustavo Cunha Lacerda"
              loading="lazy" />
            <div class="image-border"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  profileData: { type: Object, required: true },
  skills: { type: Array, required: true }
});

const { getSummary } = useLocaleData();
const summary = computed(() => getSummary());
</script>

<style scoped>
.about-section {
  padding: 8rem 0;
  position: relative;
}

.section-title {
  margin-bottom: 3rem;
  text-align: center;
}

.about-content {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 4rem;
  align-items: center;
}

.about-text p {
  margin-bottom: 2rem;
  font-size: 1.1rem;
  line-height: 1.9;
  color: var(--color-text-secondary);
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.skill-tag {
  display: inline-block;
  padding: 0.35rem 0.85rem;
  background: rgba(232, 164, 90, 0.06);
  border: 1px solid rgba(232, 164, 90, 0.18);
  border-radius: 3px;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--color-text-secondary);
  letter-spacing: 0.5px;
}

.image-wrapper {
  position: relative;
  display: inline-block;
  width: 100%;
}

.image-wrapper img {
  width: 100%;
  border-radius: 50%;
  display: block;
  position: relative;
  z-index: 1;
}

.image-border {
  position: absolute;
  inset: 0;
  border: 5px solid rgba(232, 164, 90, 0.25);
  border-radius: 50%;
  z-index: 0;
}

.image-placeholder {
  width: 100%;
  aspect-ratio: 1;
  background: rgba(232, 164, 90, 0.06);
  border: 1px solid rgba(232, 164, 90, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 2rem;
  color: var(--color-accent);
}

@media (max-width: 768px) {
  .about-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .about-image {
    order: -1;
    max-width: 260px;
    margin: 0 auto;
  }
}
</style>
