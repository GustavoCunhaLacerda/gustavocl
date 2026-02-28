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
  <div :style="{
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#0d0a08',
    color: 'white',
    padding: '64px',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: 'sans-serif'
  }">
    <!-- Top accent bar -->
    <div :style="{
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '6px',
      background: 'linear-gradient(to right, #e8a45a, #d4894a, #e8a45a)'
    }" />

    <!-- Content -->
    <div :style="{ display: 'flex', flexDirection: 'column', gap: '16px' }">
      <p :style="{ color: '#e8a45a', fontSize: '24px', letterSpacing: '2px', opacity: '0.8', margin: '0' }">
        portfolio
      </p>
      <h1 :style="{ fontSize: '72px', fontWeight: 'bold', lineHeight: '1.1', margin: '0' }">
        {{ title }}
      </h1>
      <p :style="{ fontSize: '30px', color: '#ccc', margin: '8px 0 0 0' }">
        {{ description }}
      </p>
    </div>

    <!-- Footer -->
    <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }">
      <p :style="{ fontSize: '20px', color: '#666', fontFamily: 'monospace', margin: '0' }">
        {{ stack }}
      </p>
      <p :style="{ fontSize: '20px', color: '#e8a45a', fontFamily: 'monospace', opacity: '0.6', margin: '0' }">
        gustavolacerda.dev.br
      </p>
    </div>
  </div>
</template>
