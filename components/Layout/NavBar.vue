<template>
  <Mobile v-if="isMobile()" />
  <Desktop v-if="!isMobile()" />
</template>

<script setup lang="ts">
import Desktop from "./Navbar/desktop.vue";
import Mobile from "./Navbar/mobile.vue";

// const router = useRoute();

// const navigationPages = [
//   { label: "Projetos", route: "projects" },
//   { label: "Sobre Mim", route: "about" },
//   { label: "O que uso?", route: "what-i-use" },
// ] as const;

// const currentPage = computed(() => {
//   return router.name;
// });
</script>
