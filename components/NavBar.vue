<template>
  <nav class="nav" :class="{ 'nav-scrolled': scrolled }">
    <div class="container nav-container">
      <a href="#home" class="nav-logo">GL</a>

      <div class="nav-links" :class="{ 'nav-open': menuOpen }">
        <a v-for="link in links" :key="link.href"
           :href="link.href" class="nav-link"
           :class="{ active: activeSection === link.id }"
           @click="menuOpen = false">
          {{ link.label }}
        </a>
      </div>

      <button class="nav-toggle" :class="{ open: menuOpen }" @click="menuOpen = !menuOpen" aria-label="Menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const scrolled = ref(false);
const menuOpen = ref(false);
const activeSection = ref('home');

const links = [
  { href: '#home', id: 'home', label: 'Início' },
  { href: '#about', id: 'about', label: 'Sobre' },
  { href: '#experience', id: 'experience', label: 'Experiência' },
  { href: '#projects', id: 'projects', label: 'Projetos' },
  { href: '#contact', id: 'contact', label: 'Contato' },
];

const handleScroll = () => {
  scrolled.value = window.scrollY > 50;

  // Detectar seção ativa
  const sections = links.map(l => document.getElementById(l.id)).filter(Boolean);
  for (let i = sections.length - 1; i >= 0; i--) {
    if (window.scrollY >= sections[i].offsetTop - 120) {
      activeSection.value = sections[i].id;
      break;
    }
  }
};

onMounted(() => window.addEventListener('scroll', handleScroll));
onUnmounted(() => window.removeEventListener('scroll', handleScroll));
</script>

<style scoped>
.nav-logo {
  font-family: var(--font-mono);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
  text-decoration: none;
  letter-spacing: 2px;
}

.nav-link.active {
  color: var(--color-accent);
}

.nav-link.active::after {
  width: 100%;
}

/* Botão hamburger */
.nav-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  z-index: 200;
}

.nav-toggle span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--color-text);
  transition: all 0.3s ease;
  transform-origin: center;
}

.nav-toggle.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.nav-toggle.open span:nth-child(2) { opacity: 0; }
.nav-toggle.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

@media (max-width: 768px) {
  .nav-toggle {
    display: flex;
  }

  .nav-links {
    position: fixed;
    inset: 0;
    background: rgba(13, 10, 8, 0.97);
    backdrop-filter: blur(20px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2.5rem;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
    z-index: 150;
  }

  .nav-links.nav-open {
    opacity: 1;
    pointer-events: all;
  }

  .nav-link {
    font-size: 1.3rem;
    letter-spacing: 3px;
  }
}
</style>
