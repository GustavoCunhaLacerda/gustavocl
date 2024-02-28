<template>
  <div>
    <SunIcon
      v-show="colorMode.preference === 'light'"
      class="theme-icon text-darkGray"
      width="28"
      height="28"
      @click="toggleTheme"
    >
    </SunIcon>
    <MoonIcon
      v-show="colorMode.preference === 'dark'"
      class="theme-icon text-white"
      width="28"
      height="28"
      @click="toggleTheme"
    >
      asdfs
    </MoonIcon>
  </div>
</template>
<script setup>
import { SunIcon, MoonIcon } from "@heroicons/vue/24/outline";

const colorMode = useColorMode();

const toggleTheme = () => {
  colorMode.preference = colorMode.preference === "dark" ? "light" : "dark";
};
</script>
<style scoped>
.theme-icon {
  @apply w-7 h-7 cursor-pointer transition-transform duration-100;
}
.theme-icon:hover {
  @apply scale-125;
}
</style>
