<script setup lang="ts">
const {
  title = 'Gustavo Cunha Lacerda',
  description = 'Desenvolvedor Full Stack',
  stack = 'Nuxt · Vue · Three.js · Tailwind CSS · TypeScript'
} = defineProps<{
  title?: string
  description?: string
  stack?: string
}>()
</script>

<template>
  <div class="h-full w-full flex flex-col justify-between bg-[#0d0a08] text-white p-16 relative overflow-hidden">
    <!-- Decorative accent -->
    <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#e8a45a] via-[#d4894a] to-[#e8a45a]" />
    <div class="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#e8a45a] opacity-5" />
    <div class="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-[#e8a45a] opacity-5" />

    <!-- Content -->
    <div class="flex flex-col gap-4 z-10">
      <p class="text-[#e8a45a] text-2xl font-mono tracking-wider opacity-80">portfolio</p>
      <h1 class="text-7xl font-bold leading-tight">{{ title }}</h1>
      <p class="text-3xl text-gray-300 mt-2">{{ description }}</p>
    </div>

    <!-- Stack -->
    <div class="flex items-end justify-between z-10">
      <p class="text-xl text-gray-500 font-mono">{{ stack }}</p>
      <p class="text-xl text-[#e8a45a] font-mono opacity-60">gustavolacerda.com</p>
    </div>
  </div>
</template>
