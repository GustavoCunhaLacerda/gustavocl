<template>
  <Teleport to="body">
    <canvas
      v-if="active"
      ref="canvasRef"
      class="konami-rain-canvas"
      :style="{ opacity: canvasOpacity }"
      @click.stop
    />
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted, nextTick } from 'vue'
import { MATH_FORMULAS } from '~/utils/mathFormulas'

interface Props {
  active: boolean
}

interface Column {
  x: number
  y: number
  speed: number
  formulaIndex: number
  charIndex: number
  trail: { char: string; y: number; opacity: number }[]
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'close'): void }>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const canvasOpacity = ref(1)

let animationFrameId: number | null = null
let autoCloseTimer: ReturnType<typeof setTimeout> | null = null
let fadeOutTimer: ReturnType<typeof setTimeout> | null = null
let columns: Column[] = []
let ctx: CanvasRenderingContext2D | null = null

const FONT_SIZE = 16
const GREEN = '#00ff41'
const BG_COLOR = 'rgba(0, 0, 0, 0.9)'
const AUTO_CLOSE_MS = 8000
const FADE_OUT_MS = 1000
const MIN_FORMULAS = 8

// Get at least 8 distinct formula texts
const formulaTexts = MATH_FORMULAS.slice(0, Math.max(MIN_FORMULAS, MATH_FORMULAS.length)).map(f => f.text)

function initColumns(width: number): Column[] {
  const columnCount = Math.floor(width / (FONT_SIZE * 1.2))
  const cols: Column[] = []

  for (let i = 0; i < columnCount; i++) {
    cols.push(createColumn(i, columnCount, width, true))
  }
  return cols
}

function createColumn(index: number, totalColumns: number, width: number, initialSpawn: boolean): Column {
  const formulaIndex = index % formulaTexts.length
  const x = (index / totalColumns) * width + FONT_SIZE / 2
  const speed = 1.5 + Math.random() * 3.5 // varied speeds between 1.5 and 5
  const y = initialSpawn ? -(Math.random() * 500) : -FONT_SIZE // stagger initial positions

  return {
    x,
    y,
    speed,
    formulaIndex,
    charIndex: 0,
    trail: [],
  }
}

function animate() {
  if (!ctx || !canvasRef.value) return

  const canvas = canvasRef.value
  const { width, height } = canvas

  // Semi-transparent background to create trail fade effect
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
  ctx.fillRect(0, 0, width, height)

  ctx.font = `${FONT_SIZE}px monospace`

  for (const col of columns) {
    const formula = formulaTexts[col.formulaIndex] ?? formulaTexts[0]!
    const char = formula[col.charIndex % formula.length] ?? '?'

    // Add new trail character
    col.trail.push({ char, y: col.y, opacity: 1 })

    // Draw all trail characters with decreasing opacity
    for (let i = col.trail.length - 1; i >= 0; i--) {
      const t = col.trail[i]!
      t.opacity -= 0.015
      if (t.opacity <= 0) {
        col.trail.splice(i, 1)
        continue
      }
      ctx.fillStyle = `rgba(0, 255, 65, ${t.opacity})`
      ctx.fillText(t.char, col.x, t.y)
    }

    // Draw the leading character brighter
    ctx.fillStyle = GREEN
    ctx.fillText(char, col.x, col.y)

    // Advance position
    col.y += col.speed * 2
    col.charIndex++

    // Reset column when it goes off screen
    if (col.y > height + 100 && col.trail.length === 0) {
      col.y = -FONT_SIZE
      col.charIndex = 0
      col.formulaIndex = Math.floor(Math.random() * formulaTexts.length)
      col.speed = 1.5 + Math.random() * 3.5
    }
  }

  animationFrameId = requestAnimationFrame(animate)
}

function startRain() {
  const canvas = canvasRef.value
  if (!canvas) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  ctx = canvas.getContext('2d')
  if (!ctx) return

  // Fill initial background
  ctx.fillStyle = BG_COLOR
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  columns = initColumns(canvas.width)
  canvasOpacity.value = 1

  animationFrameId = requestAnimationFrame(animate)

  // Auto-close after 8 seconds
  autoCloseTimer = setTimeout(() => {
    triggerClose()
  }, AUTO_CLOSE_MS)
}

function triggerClose() {
  if (fadeOutTimer) return // already fading

  // Clear auto-close timer if still pending
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer)
    autoCloseTimer = null
  }

  // Start fade-out
  canvasOpacity.value = 0

  fadeOutTimer = setTimeout(() => {
    cleanup()
    emit('close')
  }, FADE_OUT_MS)
}

function cleanup() {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer)
    autoCloseTimer = null
  }
  if (fadeOutTimer) {
    clearTimeout(fadeOutTimer)
    fadeOutTimer = null
  }
  columns = []
  ctx = null
}

function onKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.active) {
    triggerClose()
  }
}

function onResize() {
  const canvas = canvasRef.value
  if (!canvas || !ctx) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  ctx.fillStyle = BG_COLOR
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  columns = initColumns(canvas.width)
}

watch(() => props.active, async (isActive) => {
  if (isActive) {
    await nextTick()
    startRain()
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', onResize)
  } else {
    cleanup()
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('resize', onResize)
  }
})

onUnmounted(() => {
  cleanup()
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('resize', onResize)
})
</script>

<style scoped>
.konami-rain-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  pointer-events: all;
  transition: opacity 1s ease-out;
}
</style>
