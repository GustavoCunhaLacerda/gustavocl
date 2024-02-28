<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <menu class="flex justify-between border-b py-3">
    <p
      class="flex gap-2 justify-items-center items-center cursor-pointer dark:text-white"
      @click="navigateTo('/')"
    >
      <strong class="text-blue-950 dark:text-white">Gustavo</strong>
      Lacerda
    </p>
    <div>
      <!-- <ol class="flex gap-3"> -->
      <li v-for="page in navigationPages" :key="page.label">
        <Button as-child>
          <NuxtLink :to="page.route">
            {{ page.label }}
          </NuxtLink>
        </Button>
      </li>

      <li>
        <ColorSwitcher />
      </li>
      <!-- </ol> -->
    </div>
  </menu>
</template>

<script setup lang="ts">
import ColorSwitcher from "~/components/base/ColorSwitcher.vue";

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
