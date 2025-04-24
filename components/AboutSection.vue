<template>
  <div class="about-section" id="about">
    <div class="container">
      <h2 class="section-title fade-in">Sobre Mim</h2>
      <div class="about-content fade-in">
        <div class="about-text">
          <p>{{ profileData.summary }}</p>
          <div class="skill-tags">
            <span v-for="(skill, index) in skills" :key="index" class="skill-tag">{{ skill }}</span>
          </div>
        </div>
        <div class="about-image">
          <img :src="profileData.profilePicture" alt="Gustavo Cunha Lacerda" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  profileData: {
    type: Object,
    required: true
  },
  skills: {
    type: Array,
    required: true
  }
});
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
  gap: 3rem;
  align-items: center;
}

.about-text p {
  margin-bottom: 2rem;
  font-size: 1.1rem;
  line-height: 1.8;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.skill-tag {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: rgba(0, 217, 255, 0.1);
  border: 1px solid var(--color-accent);
  border-radius: 20px;
  font-family: var(--font-mono);
  font-size: 0.9rem;
}

.about-image img {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border: 2px solid var(--color-accent);
  transition: all 0.3s ease;
}

.about-image img:hover {
  transform: scale(1.02);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .about-content {
    grid-template-columns: 1fr;
  }
  
  .about-image {
    order: -1;
    max-width: 300px;
    margin: 0 auto 2rem;
  }
}
</style>
