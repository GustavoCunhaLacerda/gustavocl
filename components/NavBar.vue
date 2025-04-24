<template>
  <nav class="nav" :class="{ 'nav-scrolled': scrolled }">
    <div class="container nav-container">
      <div class="nav-logo">GL</div>
      <div class="nav-links">
        <a href="#home" class="nav-link">Início</a>
        <a href="#about" class="nav-link">Sobre</a>
        <a href="#experience" class="nav-link">Experiência</a>
        <a href="#projects" class="nav-link">Projetos</a>
        <a href="#contact" class="nav-link">Contato</a>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const scrolled = ref(false);

const handleScroll = () => {
  scrolled.value = window.scrollY > 50;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>
