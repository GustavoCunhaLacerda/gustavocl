<template>
  <Teleport to="body">
    <div
      v-if="active"
      ref="overlayRef"
      class="fibonacci-overlay"
      :style="{ opacity: overlayOpacity }"
      @click.stop
      @keydown.escape="startClose"
    >
      <canvas ref="canvasRef" class="fibonacci-canvas" />
      <div class="phi-counter">
        φ ≈ {{ phiDisplay }}
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted, nextTick } from 'vue'
import { FIBONACCI_NUMBERS } from '~/utils/mathFormulas'

interface Props {
  active: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'close'): void }>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const overlayRef = ref<HTMLDivElement | null>(null)
const overlayOpacity = ref(1)
const phiDisplay = ref('1.000')

let animationFrameId: number | null = null
let closeTimer: ReturnType<typeof setTimeout> | null = null
let isClosing = false
let animationStartTime = 0

const TOTAL_DURATION = 4000 // 4 seconds for full spiral
const FADE_OUT_MS = 1000
const SPIRAL_COLOR = '#e8a45a'
const BG_COLOR = 'rgba(0, 0, 0, 0.88)'
const PHI = 1.6180339887

interface FibSquare {
  x: number
  y: number
  size: number
  direction: number // index into DIRECTIONS
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function computeSquares(): FibSquare[] {
  const squares: FibSquare[] = []

  for (let i = 0; i < FIBONACCI_NUMBERS.length; i++) {
    const size = FIBONACCI_NUMBERS[i]!
    const dir = i % 4

    if (i === 0) {
      squares.push({ x: 0, y: 0, size, direction: dir })
    } else if (i === 1) {
      // Second square (size 1) placed to the right of first
      squares.push({ x: 1, y: 0, size, direction: dir })
    } else {

      // Compute bounding box of all previous squares
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
      for (const sq of squares) {
        minX = Math.min(minX, sq.x)
        minY = Math.min(minY, sq.y)
        maxX = Math.max(maxX, sq.x + sq.size)
        maxY = Math.max(maxY, sq.y + sq.size)
      }

      let nx = 0, ny = 0
      switch (dir) {
        case 0: // right
          nx = maxX
          ny = minY
          break
        case 1: // up
          ny = minY - size
          nx = minX
          break
        case 2: // left
          nx = minX - size
          ny = maxY - size
          break
        case 3: // down
          ny = maxY
          nx = maxX - size
          break
      }
      squares.push({ x: nx, y: ny, size, direction: dir })
    }
  }
  return squares
}

function getArcParams(sq: FibSquare): { cx: number; cy: number; startAngle: number; endAngle: number } {
  const { x, y, size, direction } = sq
  // The arc center is at the corner where the spiral continues
  // Direction determines which corner is the arc center
  switch (direction % 4) {
    case 0: // right — arc center at bottom-left of square
      return { cx: x, cy: y + size, startAngle: -Math.PI / 2, endAngle: 0 }
    case 1: // up — arc center at bottom-right
      return { cx: x + size, cy: y + size, startAngle: Math.PI, endAngle: -Math.PI / 2 }
    case 2: // left — arc center at top-right
      return { cx: x + size, cy: y, startAngle: Math.PI / 2, endAngle: Math.PI }
    case 3: // down — arc center at top-left
      return { cx: x, cy: y, startAngle: 0, endAngle: Math.PI / 2 }
    default:
      return { cx: x, cy: y, startAngle: 0, endAngle: Math.PI / 2 }
  }
}

function getNumberPosition(sq: FibSquare): { nx: number; ny: number } {
  // Place number at center of the square
  return {
    nx: sq.x + sq.size / 2,
    ny: sq.y + sq.size / 2,
  }
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  squares: FibSquare[],
  scale: number,
  offsetX: number,
  offsetY: number,
  progress: number, // 0 to 1
) {
  const canvas = ctx.canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Background
  ctx.fillStyle = BG_COLOR
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const totalSteps = squares.length
  const currentStep = progress * totalSteps
  const dpr = window.devicePixelRatio || 1

  for (let i = 0; i < totalSteps; i++) {
    const sq = squares[i]!
    const stepProgress = Math.max(0, Math.min(1, currentStep - i))

    if (stepProgress <= 0) break

    const sx = sq.x * scale + offsetX
    const sy = sq.y * scale + offsetY
    const sSize = sq.size * scale

    // Draw square border (appears first)
    const squareAlpha = Math.min(1, stepProgress * 3) // Fade in quickly
    ctx.strokeStyle = `rgba(232, 164, 90, ${0.25 * squareAlpha})`
    ctx.lineWidth = Math.max(1, 1.5 * dpr)
    ctx.strokeRect(sx, sy, sSize, sSize)

    // Draw number at center of square
    if (stepProgress > 0.2) {
      const numAlpha = Math.min(1, (stepProgress - 0.2) * 2.5)
      const { nx, ny } = getNumberPosition(sq)
      const fontSize = Math.max(10, Math.min(sSize * 0.35, 32 * dpr))
      ctx.font = `${fontSize}px 'JetBrains Mono', 'Fira Code', monospace`
      ctx.fillStyle = `rgba(232, 164, 90, ${0.85 * numAlpha})`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(
        String(FIBONACCI_NUMBERS[i] ?? ''),
        nx * scale + offsetX,
        ny * scale + offsetY,
      )
    }

    // Draw arc (spiral segment) — appears after square
    if (stepProgress > 0.3) {
      const arcProgress = Math.min(1, (stepProgress - 0.3) / 0.7)
      const { cx, cy, startAngle, endAngle } = getArcParams(sq)

      ctx.beginPath()
      const arcCx = cx * scale + offsetX
      const arcCy = cy * scale + offsetY
      const radius = sSize

      // Draw partial arc based on progress
      const angleDiff = endAngle - startAngle
      const currentEnd = startAngle + angleDiff * arcProgress

      ctx.arc(arcCx, arcCy, radius, startAngle, currentEnd, false)
      ctx.strokeStyle = SPIRAL_COLOR
      ctx.lineWidth = Math.max(2, 3 * dpr)
      ctx.lineCap = 'round'
      ctx.stroke()
    }
  }
}

function startAnimation() {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  isClosing = false
  overlayOpacity.value = 1
  phiDisplay.value = '1.000'

  const squares = computeSquares()

  function resize() {
    const dpr = window.devicePixelRatio || 1
    canvas!.width = window.innerWidth * dpr
    canvas!.height = window.innerHeight * dpr
    canvas!.style.width = `${window.innerWidth}px`
    canvas!.style.height = `${window.innerHeight}px`
  }

  resize()
  window.addEventListener('resize', resize)

  // Compute bounding box of all squares
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  for (const sq of squares) {
    minX = Math.min(minX, sq.x)
    minY = Math.min(minY, sq.y)
    maxX = Math.max(maxX, sq.x + sq.size)
    maxY = Math.max(maxY, sq.y + sq.size)
  }

  const totalWidth = maxX - minX
  const totalHeight = maxY - minY

  // Scale to fit viewport with padding
  const padding = 0.15
  const availW = canvas.width * (1 - padding * 2)
  const availH = canvas.height * (1 - padding * 2)
  const scale = Math.min(availW / totalWidth, availH / totalHeight)

  // Center offset
  const offsetX = (canvas.width - totalWidth * scale) / 2 - minX * scale
  const offsetY = (canvas.height - totalHeight * scale) / 2 - minY * scale

  animationStartTime = performance.now()

  function animate(now: number) {
    const elapsed = now - animationStartTime
    const rawProgress = Math.min(1, elapsed / TOTAL_DURATION)
    const progress = easeInOutCubic(rawProgress)

    // Update phi counter
    const phiValue = 1 + (PHI - 1) * rawProgress
    phiDisplay.value = phiValue.toFixed(3)

    drawFrame(ctx!, squares, scale, offsetX, offsetY, progress)

    if (rawProgress < 1 && !isClosing) {
      animationFrameId = requestAnimationFrame(animate)
    } else if (!isClosing) {
      // Animation complete — allow close after a brief pause
      phiDisplay.value = '1.618'
      closeTimer = setTimeout(() => {
        startClose()
      }, 1500)
    }
  }

  animationFrameId = requestAnimationFrame(animate)

  // Store resize handler for cleanup
  ;(canvas as any).__resizeHandler = resize
}

function startClose() {
  if (isClosing) return
  isClosing = true

  // Cancel any pending timers
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }

  // Fade out
  const fadeStart = performance.now()
  function fadeOut(now: number) {
    const elapsed = now - fadeStart
    const progress = Math.min(1, elapsed / FADE_OUT_MS)
    overlayOpacity.value = 1 - progress

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(fadeOut)
    } else {
      cleanup()
      emit('close')
    }
  }
  animationFrameId = requestAnimationFrame(fadeOut)
}

function cleanup() {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
  const canvas = canvasRef.value
  if (canvas && (canvas as any).__resizeHandler) {
    window.removeEventListener('resize', (canvas as any).__resizeHandler)
    delete (canvas as any).__resizeHandler
  }
  isClosing = false
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.active) {
    startClose()
  }
}

watch(() => props.active, async (newVal) => {
  if (newVal) {
    await nextTick()
    overlayRef.value?.focus()
    window.addEventListener('keydown', handleKeydown)
    startAnimation()
  } else {
    cleanup()
    window.removeEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  cleanup()
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.fibonacci-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: all;
  transition: opacity 0.1s linear;
  outline: none;
}

.fibonacci-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.phi-counter {
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: clamp(1.2rem, 3vw, 2.5rem);
  color: #e8a45a;
  text-shadow: 0 0 20px rgba(232, 164, 90, 0.5);
  z-index: 1;
  user-select: none;
  pointer-events: none;
}

@media (max-width: 640px) {
  .phi-counter {
    bottom: 1rem;
    right: 1rem;
  }
}
</style>
