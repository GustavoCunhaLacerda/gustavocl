import { ref, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'

export function useKeySequence(
  targetSequence: string[],
  options?: {
    timeout?: number
    ignoreOtherKeys?: boolean
  }
): {
  triggered: Ref<boolean>
  reset: () => void
} {
  const timeout = options?.timeout ?? 3000
  const ignoreOtherKeys = options?.ignoreOtherKeys ?? false

  const triggered = ref(false)
  let progress = 0
  let timer: ReturnType<typeof setTimeout> | null = null

  function clearTimer() {
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
  }

  function resetProgress() {
    progress = 0
    clearTimer()
  }

  function reset() {
    triggered.value = false
    resetProgress()
  }

  function onKeyDown(event: KeyboardEvent) {
    if (triggered.value) return

    const expected = targetSequence[progress]

    if (event.key === expected) {
      progress++
      clearTimer()

      if (progress === targetSequence.length) {
        triggered.value = true
        resetProgress()
      } else {
        timer = setTimeout(resetProgress, timeout)
      }
    } else if (!ignoreOtherKeys) {
      // If the pressed key doesn't match and we're not ignoring other keys,
      // check if it matches the start of the sequence
      resetProgress()
      if (event.key === targetSequence[0]) {
        progress = 1
        timer = setTimeout(resetProgress, timeout)
      }
    }
    // When ignoreOtherKeys is true, simply ignore non-matching keys
  }

  onMounted(() => {
    window.addEventListener('keydown', onKeyDown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown)
    clearTimer()
  })

  return { triggered, reset }
}
