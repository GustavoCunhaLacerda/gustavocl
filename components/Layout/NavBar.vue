<template>
  <menu class="flex justify-between border-b py-3">
    <div>
      <strong class="text-blue-950 animate-pulse">Gustavo</strong> Lacerda
    </div>
    <div>
      <ol class="flex gap-3">
        <li v-for="page in navigationPages" :key="page.label">
          <NuxtLink
            :to="page.route"
            class="text-sm text-gray-900 hover:text-blue-900 transition-all"
            :class="currentPage === page.route && 'text-blue-900 ring-blue-400'"
          >
            {{ page.label }}
          </NuxtLink>
        </li>
      </ol>
    </div>
  </menu>
</template>

<script setup lang="ts">
const router = useRoute();

const navigationPages = [
  { label: "Projetos", route: "projects" },
  { label: "Sobre Mim", route: "about" },
  { label: "O que uso?", route: "what-i-use" },
] as const;

const currentPage = computed(() => {
  return router.name;
});
</script>
