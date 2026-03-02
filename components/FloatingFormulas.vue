<template>
  <div class="floating-formulas-container">
    <!-- Floating formula elements -->
    <div
      v-for="formula in formulas"
      :key="formula.id"
      class="floating-formula"
      :style="{
        left: `${formula.x}px`,
        top: `${formula.y}px`,
        '--formula-opacity': activeTooltip === formula.id ? 0.9 : formula.opacity,
      }"
      @mouseenter="formula.hovered = true"
      @mouseleave="formula.hovered = false"
      @click.stop="openTooltip(formula)"
    >
      <span :class="{ hovered: formula.hovered }">{{ formula.text }}</span>
    </div>

    <!-- Tooltip overlay -->
    <Teleport to="body">
      <div
        v-if="tooltipFormula"
        class="tooltip-backdrop"
        @click="closeTooltip"
      >
        <div
          class="tooltip-box"
          :class="{ 'tooltip-visible': tooltipVisible, 'tooltip-hiding': tooltipHiding }"
          :style="tooltipPosition"
          @click.stop
        >
          <p class="tooltip-formula">{{ tooltipFormula.text }}</p>
          <p class="tooltip-explanation">{{ t(tooltipFormula.explanationKey) }}</p>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { MATH_FORMULAS } from '~/utils/mathFormulas'

const { t } = useI18n()

const FORMULA_COUNT = 8
const MIN_OPACITY = 0.15
const MAX_OPACITY = 0.3
const MIN_SPEED = 0.2
const MAX_SPEED = 0.5
const FORMULA_PADDING = 60 // min distance between formulas

interface FloatingFormulaState {
  id: string
  text: string
  explanationKey: string
  x: number
  y: number
  baseX: number
  baseY: number
  speedX: number
  speedY: number
  phaseX: number
  phaseY: number
  opacity: number
  hovered: boolean
}

const formulas = reactive<FloatingFormulaState[]>([])
const activeTooltip = ref<string | null>(null)
const tooltipFormula = ref<FloatingFormulaState | null>(null)
const tooltipVisible = ref(false)
const tooltipHiding = ref(false)
const tooltipPosition = ref<Record<string, string>>({})

let animationFrameId: number | null = null
let startTime = 0

// --- Bounding box overlap detection ---
function hasOverlap(
  x: number,
  y: number,
  placed: Array<{ x: number; y: number }>,
  minDist: number,
): boolean {
  return placed.some(
    p => Math.abs(p.x - x) < minDist && Math.abs(p.y - y) < minDist,
  )
}

function randomInRange(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

function initFormulas() {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const margin = 80
  const placed: Array<{ x: number; y: number }> = []

  const selected = MATH_FORMULAS.slice(0, FORMULA_COUNT)

  for (const mf of selected) {
    let x: number, y: number
    let attempts = 0
    do {
      x = randomInRange(margin, vw - margin)
      y = randomInRange(margin, vh - margin)
      attempts++
    } while (hasOverlap(x, y, placed, FORMULA_PADDING) && attempts < 50)

    placed.push({ x, y })

    formulas.push({
      id: mf.id,
      text: mf.text,
      explanationKey: mf.explanationKey,
      x,
      y,
      baseX: x,
      baseY: y,
      speedX: randomInRange(MIN_SPEED, MAX_SPEED),
      speedY: randomInRange(MIN_SPEED, MAX_SPEED),
      phaseX: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2,
      opacity: randomInRange(MIN_OPACITY, MAX_OPACITY),
      hovered: false,
    })
  }
}

// --- Sinusoidal animation loop ---
function animate(timestamp: number) {
  if (!startTime) startTime = timestamp
  const elapsed = (timestamp - startTime) / 1000 // seconds

  for (const f of formulas) {
    f.x = f.baseX + Math.sin(elapsed * f.speedX * 2 + f.phaseX) * 40
    f.y = f.baseY + Math.cos(elapsed * f.speedY * 2 + f.phaseY) * 30
  }

  animationFrameId = requestAnimationFrame(animate)
}

// --- Tooltip logic ---
function openTooltip(formula: FloatingFormulaState) {
  if (activeTooltip.value === formula.id) {
    closeTooltip()
    return
  }

  tooltipHiding.value = false
  tooltipFormula.value = formula
  activeTooltip.value = formula.id

  // Position tooltip near the formula
  const tooltipX = Math.min(formula.x + 20, window.innerWidth - 320)
  const tooltipY = Math.min(formula.y + 30, window.innerHeight - 160)
  tooltipPosition.value = {
    left: `${Math.max(10, tooltipX)}px`,
    top: `${Math.max(10, tooltipY)}px`,
  }

  nextTick(() => {
    tooltipVisible.value = true
  })
}

function closeTooltip() {
  if (!tooltipFormula.value) return

  tooltipHiding.value = true
  tooltipVisible.value = false

  setTimeout(() => {
    tooltipFormula.value = null
    activeTooltip.value = null
    tooltipHiding.value = false
  }, 300)
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    closeTooltip()
  }
}

onMounted(() => {
  initFormulas()
  animationFrameId = requestAnimationFrame(animate)
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
  }
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.floating-formulas-container {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.floating-formula {
  position: fixed;
  pointer-events: auto;
  cursor: pointer;
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: 0.95rem;
  color: var(--formula-color, rgba(180, 180, 220, 0.8));
  user-select: none;
  white-space: nowrap;
  transition: opacity 300ms ease;
}

.floating-formula span {
  opacity: var(--formula-opacity, 0.2);
  transition: opacity 300ms ease;
}

.floating-formula span.hovered {
  opacity: 0.8;
}

/* Tooltip backdrop */
.tooltip-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
}

/* Tooltip box */
.tooltip-box {
  position: fixed;
  max-width: 300px;
  padding: 12px 16px;
  background: rgba(15, 15, 35, 0.95);
  border: 1px solid rgba(100, 100, 200, 0.3);
  border-radius: 8px;
  color: #e0e0f0;
  font-size: 0.85rem;
  line-height: 1.5;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  transform: scale(0);
  opacity: 0;
  transition: transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 300ms ease;
  z-index: 1001;
}

.tooltip-box.tooltip-visible {
  transform: scale(1);
  opacity: 1;
}

.tooltip-box.tooltip-hiding {
  transform: scale(1);
  opacity: 0;
  transition: opacity 300ms ease;
}

.tooltip-formula {
  font-family: 'Georgia', serif;
  font-size: 1rem;
  margin-bottom: 8px;
  color: #a0a0ff;
}

.tooltip-explanation {
  margin: 0;
  color: #c0c0d0;
}
</style>
