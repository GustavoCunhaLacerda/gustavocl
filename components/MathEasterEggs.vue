<template>
  <div>
    <FloatingFormulas />
    <KonamiRain :active="showKonamiRain" @close="onKonamiClose" />
    <CalculatorTerminal :active="showCalculator" @close="onCalculatorClose" />
    <FibonacciSpiral :active="showFibonacci" @close="onFibonacciClose" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useKeySequence } from '~/composables/useKeySequence'
import { KONAMI_SEQUENCE, FIBONACCI_SEQUENCE } from '~/utils/mathFormulas'

const showKonamiRain = ref(false)
const showCalculator = ref(false)
const showFibonacci = ref(false)

const { triggered: konamiTriggered, reset: resetKonami } = useKeySequence(KONAMI_SEQUENCE, {
  timeout: 3000,
  ignoreOtherKeys: true,
})

const { triggered: fibonacciTriggered, reset: resetFibonacci } = useKeySequence(FIBONACCI_SEQUENCE, {
  timeout: 3000,
  ignoreOtherKeys: true,
})

// Watch key sequences to activate overlays
watch(konamiTriggered, (val) => {
  if (val) {
    showKonamiRain.value = true
  }
})

watch(fibonacciTriggered, (val) => {
  if (val) {
    showFibonacci.value = true
  }
})

// Close handlers — reset state and key sequence
function onKonamiClose() {
  showKonamiRain.value = false
  resetKonami()
}

function onCalculatorClose() {
  showCalculator.value = false
}

function onFibonacciClose() {
  showFibonacci.value = false
  resetFibonacci()
}

// Ctrl+Shift+M / Cmd+Shift+M for calculator
function onGlobalKeydown(e: KeyboardEvent) {
  if (e.key === 'M' && e.shiftKey && (e.ctrlKey || e.metaKey)) {
    e.preventDefault()
    showCalculator.value = !showCalculator.value
  }
}

onMounted(() => {
  window.addEventListener('keydown', onGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onGlobalKeydown)
})
</script>
