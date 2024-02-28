<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <menu class="flex justify-between border-b">
    <div class="flex items-center justify-center">
      <strong class="text-blue-950 animate-pulse">Gustavo</strong> Lacerda
    </div>
    <div>
      <button class="p-2" @click="toggleMenu">
        <Bars3Icon class="w-6 h-6" />
      </button>
    </div>
  </menu>
  <div>
    <div
      v-if="isMenuOpen"
      class="bg-black opacity-25 w-full h-full absolute z-10 inset-0"
      @click="toggleMenu"
    ></div>
    <div
      class="bg-blue-900 rounded-t-xl fixed inset-x-0 bottom-0 z-50 p-4 transition-all duration-300"
      :class="{
        'mb-0': isMenuOpen,
        '-mb-[100%]': !isMenuOpen,
      }"
    >
      <ol class="flex flex-col">
        <li
          v-for="page in navigationPages"
          :key="page.label"
          class="text-base py-4 text-gray-50 transition-all flex items-center gap-2"
          :class="currentPage === page.route && 'text-blue-900 ring-blue-400'"
        >
          <component :is="getNavIcon(page.route)" class="w-5 h-5"></component>
          <NuxtLink :to="page.route">
            {{ page.label }}
          </NuxtLink>
        </li>

        <li>
          <ColorSwitcher />
        </li>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Bars3Icon,
  HomeIcon,
  WrenchIcon,
  UserIcon,
  ComputerDesktopIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/vue/24/outline";
import ColorSwitcher from "~/components/base/ColorSwitcher.vue";

const router = useRoute();

const isMenuOpen = ref<boolean>(false);

const navigationPages = [
  { label: "Início", route: "/" },
  { label: "Projetos", route: "/projects" },
  { label: "Sobre Mim", route: "/about" },
  { label: "O que uso?", route: "/what-i-use" },
] as const;

const currentPage = computed(() => {
  return router.name;
});

function getNavIcon(route: string) {
  switch (route) {
    case "/":
      return HomeIcon;
    case "/projects":
      return WrenchIcon;
    case "/about":
      return UserIcon;
    case "/what-i-use":
      return ComputerDesktopIcon;
    default:
      return QuestionMarkCircleIcon;
  }
}

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}
</script>
