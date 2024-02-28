<template>
  <div
    class="flex flex-col items-center w-screen h-screen bg-white dark:bg-primaryBlue"
  >
    <div class="max-w-[860px] w-full transition-all h-full">
      <NavBar></NavBar>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import NavBar from "~/components/Layout/NavBar.vue";
</script>
