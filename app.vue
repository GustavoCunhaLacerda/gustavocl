<template>
  <div>
    <SpaceBackground />
    <MathEasterEgg />
    <RubiksCube />
    <NavBar />
    
    <main>
      <HeroSection :profileData="profileData" />
      <AboutSection :profileData="profileData" :skills="skills" />
      <ExperienceSection :profileData="profileData" />
      <ProjectsSection :projects="featuredProjects" />
      <ContactSection />
    </main>
    
    <FooterSection />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Componentes
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

// Dados do perfil
const profileData = ref({});
const githubProjects = ref([]);
const featuredProjects = ref([]);

// Lista de habilidades
const skills = [
  'JavaScript', 'TypeScript', 'CSS', 'HTML', 'SASS', 'Tailwind', 
  'Bootstrap', 'JQuery', 'Vue', 'Nuxt', 'React', 'React Native', 
  'C#', '.Net5', 'Python', 'PHP', 'MySQL'
];

// Carregar dados do perfil
const loadProfileData = async () => {
  try {
    const linkedinData = await import('~/data/linkedin_profile.json');
    profileData.value = linkedinData.default;
    
    const githubData = await import('~/data/github_repos.json');
    githubProjects.value = githubData.default;
    
    // Filtrar projetos em destaque (com mais estrelas ou mais recentes)
    featuredProjects.value = githubProjects.value
      .filter(project => project.description || project.stargazers_count > 0)
      .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 6);
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
  }
};

// Animar elementos .fade-in quando entrarem na viewport
const initScrollAnimation = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
};

onMounted(async () => {
  await loadProfileData();
  setTimeout(initScrollAnimation, 300);
});
</script>
