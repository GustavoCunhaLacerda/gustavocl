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
      <ProjectsSection :featuredProjects="highlightedProjects" :githubProjects="topGithubProjects" />
      <ContactSection />
    </main>
    
    <FooterSection />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

defineOgImage({
  component: 'Portfolio.takumi',
  title: 'Gustavo Cunha Lacerda',
  description: 'Desenvolvedor Full Stack | Vue · Nuxt · React · .NET · PHP',
  stack: 'Nuxt · Vue 3 · Three.js · GSAP · Tailwind CSS · TypeScript'
});

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
const highlightedProjects = ref([]);
const topGithubProjects = ref([]);

// Lista de habilidades (curada — só o que importa)
const skills = ref([
  'Vue.js', 'Nuxt', 'React', 'React Native',
  'TypeScript', 'JavaScript', 'Node.js',
  'C#', '.NET', 'PHP', 'Python',
  'Tailwind CSS', 'SASS',
  'MySQL', 'REST APIs', 'Git',
  'PyTorch', 'Firebase'
]);

// Carregar dados do perfil
const loadProfileData = async () => {
  try {
    const linkedinData = await import('~/data/linkedin_profile.json');
    profileData.value = linkedinData.default;
    
    const githubData = await import('~/data/github_repos.json');
    githubProjects.value = githubData.default;
    
    // Carregar projetos profissionais em destaque
    const featuredData = await import('~/data/featured_projects.json');
    highlightedProjects.value = featuredData.default;
    
    // Selecionar repos GitHub mais interessantes (com descrição ou estrelas)
    const excludeNames = ['GustavoCunhaLacerda', 'gustavocl', 'area51'];
    topGithubProjects.value = githubProjects.value
      .filter(p => (p.description || p.stargazers_count > 0) && !excludeNames.includes(p.name))
      .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 6);
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
  }
};

onMounted(async () => {
  useTheme().init();
  await loadProfileData();
});
</script>
