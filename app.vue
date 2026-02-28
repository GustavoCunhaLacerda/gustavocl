<template>
  <div>
    <ClientOnly>
      <SpaceBackground />
      <MathEasterEgg />
      <RubiksCube />
    </ClientOnly>
    <NavBar />
    
    <main>
      <HeroSection :profileData="profileData" />
      <AboutSection :profileData="profileData" :skills="skills" />
      <ExperienceSection :profileData="profileData" />
      <ProjectsSection :featuredProjects="highlightedProjects" :githubProjects="topGithubProjects" />
      <ContactSection />
    </main>
    
    <FooterSection />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

defineOgImage({
  component: 'Portfolio',
  title: 'Gustavo Cunha Lacerda',
  description: 'Desenvolvedor Full Stack | Vue · Nuxt · React · .NET · PHP',
  stack: 'Nuxt · Vue 3 · Three.js · GSAP · Tailwind CSS · TypeScript'
});

import SpaceBackground from '~/components/SpaceBackground.vue';
import MathEasterEgg from '~/components/MathEasterEgg.vue';
import RubiksCube from '~/components/RubiksCube.vue';
import NavBar from '~/components/NavBar.vue';
import HeroSection from '~/components/HeroSection.vue';
import AboutSection from '~/components/AboutSection.vue';
import ExperienceSection from '~/components/ExperienceSection.vue';
import ProjectsSection from '~/components/ProjectsSection.vue';
import ContactSection from '~/components/ContactSection.vue';
import FooterSection from '~/components/FooterSection.vue';

import linkedinJson from '~/data/linkedin_profile.json';
import githubJson from '~/data/github_repos.json';
import featuredJson from '~/data/featured_projects.json';

const profileData = ref(linkedinJson);
const highlightedProjects = ref(featuredJson);

const skills = ref([
  'Vue.js', 'Nuxt', 'React', 'React Native',
  'TypeScript', 'JavaScript', 'Node.js',
  'C#', '.NET', 'PHP', 'Python',
  'Tailwind CSS', 'SASS',
  'MySQL', 'REST APIs', 'Git',
  'PyTorch', 'Firebase'
]);

const excludeNames = ['GustavoCunhaLacerda', 'gustavocl', 'area51'];
const topGithubProjects = ref(
  githubJson
    .filter(p => (p.description || p.stargazers_count > 0) && !excludeNames.includes(p.name))
    .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 6)
);

onMounted(() => {
  useTheme().init();
});
</script>
