<template>
  <Teleport to="body">
    <Transition name="terminal-slide" @after-leave="onAfterLeave">
      <div
        v-if="active"
        class="terminal-overlay"
        @click.self="emitClose"
        @keydown.escape="emitClose"
      >
        <div class="terminal-container" @click.stop>
          <div class="terminal-header">
            <span class="terminal-title">math-terminal</span>
            <button class="terminal-close-btn" @click="emitClose" aria-label="Close terminal">×</button>
          </div>
          <div ref="outputRef" class="terminal-output">
            <div
              v-for="(entry, idx) in outputLines"
              :key="idx"
              class="terminal-line"
            >
              <span v-if="entry.type === 'input'" class="terminal-prompt">&gt; </span>
              <span
                :class="{
                  'terminal-text': entry.type === 'input' || entry.type === 'result',
                  'terminal-error': entry.type === 'error',
                  'terminal-help': entry.type === 'help',
                }"
              >{{ entry.text }}</span>
            </div>
            <div v-if="typingText !== null" class="terminal-line">
              <span class="terminal-text terminal-typing">{{ typingDisplay }}</span>
            </div>
          </div>
          <div class="terminal-input-row">
            <span class="terminal-prompt blink">&gt; </span>
            <input
              ref="inputRef"
              v-model="currentInput"
              class="terminal-input"
              type="text"
              :placeholder="t('mathEggs.calculator.placeholder')"
              autocomplete="off"
              spellcheck="false"
              @keydown="onKeydown"
            />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useExpressionParser } from '~/composables/useExpressionParser'

interface Props {
  active: boolean
}

interface OutputLine {
  text: string
  type: 'input' | 'result' | 'error' | 'help'
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'close'): void }>()

const { t } = useI18n()
const { evaluate } = useExpressionParser()

const inputRef = ref<HTMLInputElement | null>(null)
const outputRef = ref<HTMLDivElement | null>(null)

const currentInput = ref('')
const outputLines = ref<OutputLine[]>([])
const history = ref<string[]>([])
const historyIndex = ref(-1)

// Typing animation state
const typingText = ref<string | null>(null)
const typingDisplay = ref('')
let typingTimer: ReturnType<typeof setTimeout> | null = null

// Focus management
let previousActiveElement: HTMLElement | null = null

const MAX_HISTORY = 10
const TYPING_SPEED_MS = 30

function emitClose() {
  emit('close')
}

function scrollToBottom() {
  nextTick(() => {
    if (outputRef.value) {
      outputRef.value.scrollTop = outputRef.value.scrollHeight
    }
  })
}

function addOutputLine(text: string, type: OutputLine['type']) {
  outputLines.value.push({ text, type })
  scrollToBottom()
}

function animateTyping(text: string, type: OutputLine['type']) {
  clearTypingAnimation()
  typingText.value = text
  typingDisplay.value = ''
  let i = 0

  function typeNext() {
    if (i < text.length) {
      typingDisplay.value += text[i]
      i++
      scrollToBottom()
      typingTimer = setTimeout(typeNext, TYPING_SPEED_MS)
    } else {
      // Animation done — move to output lines
      typingText.value = null
      typingDisplay.value = ''
      addOutputLine(text, type)
    }
  }

  typeNext()
}

function clearTypingAnimation() {
  if (typingTimer) {
    clearTimeout(typingTimer)
    typingTimer = null
  }
  // If there was an ongoing animation, finalize it
  if (typingText.value !== null) {
    addOutputLine(typingText.value, 'result')
    typingText.value = null
    typingDisplay.value = ''
  }
}

function handleSubmit() {
  const expr = currentInput.value.trim()
  if (!expr) return

  // Clear any ongoing typing animation
  clearTypingAnimation()

  // Add to history
  history.value.push(expr)
  if (history.value.length > MAX_HISTORY) {
    history.value.shift()
  }
  historyIndex.value = -1

  // Show input line
  addOutputLine(expr, 'input')
  currentInput.value = ''

  // Handle "help" command
  if (expr.toLowerCase() === 'help') {
    const helpText = t('mathEggs.calculator.help')
    addOutputLine(helpText, 'help')
    return
  }

  // Evaluate expression
  const result = evaluate(expr)
  if (result.success) {
    const formatted = formatNumber(result.value)
    animateTyping(`= ${formatted}`, 'result')
  } else {
    addOutputLine(t('mathEggs.calculator.invalidExpression'), 'error')
  }
}

function formatNumber(value: number): string {
  // Show integers as integers, decimals with reasonable precision
  if (Number.isInteger(value)) return value.toString()
  // Up to 10 decimal places, trim trailing zeros
  return parseFloat(value.toFixed(10)).toString()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault()
    handleSubmit()
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    navigateHistory(-1)
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    navigateHistory(1)
  } else if (e.key === 'Escape') {
    e.preventDefault()
    emitClose()
  }
}

function navigateHistory(direction: number) {
  if (history.value.length === 0) return

  if (historyIndex.value === -1) {
    // Starting navigation
    if (direction === -1) {
      historyIndex.value = history.value.length - 1
    } else {
      return // Can't go forward from no history
    }
  } else {
    const newIndex = historyIndex.value + direction
    if (newIndex < 0 || newIndex >= history.value.length) {
      // Out of bounds — clear to empty
      historyIndex.value = -1
      currentInput.value = ''
      return
    }
    historyIndex.value = newIndex
  }

  currentInput.value = history.value[historyIndex.value] ?? ''
}

function onAfterLeave() {
  // Restore focus to previous element
  if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
    previousActiveElement.focus()
    previousActiveElement = null
  }
}

// Watch active prop for focus management
watch(() => props.active, (isActive) => {
  if (isActive) {
    // Save current focus
    previousActiveElement = document.activeElement as HTMLElement | null
    // Auto-focus input
    nextTick(() => {
      inputRef.value?.focus()
    })
  } else {
    clearTypingAnimation()
  }
})

onUnmounted(() => {
  clearTypingAnimation()
})
</script>

<style scoped>
/* Slide transition */
.terminal-slide-enter-active {
  transition: transform 400ms cubic-bezier(0.16, 1, 0.3, 1), opacity 400ms ease;
}
.terminal-slide-leave-active {
  transition: transform 300ms cubic-bezier(0.7, 0, 0.84, 0), opacity 300ms ease;
}
.terminal-slide-enter-from,
.terminal-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
.terminal-slide-enter-to,
.terminal-slide-leave-from {
  transform: translateY(0);
  opacity: 1;
}

.terminal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
}

.terminal-container {
  width: 100%;
  max-width: 600px;
  height: 400px;
  background: #1a1a2e;
  border-top: 2px solid #00ff41;
  border-radius: 8px 8px 0 0;
  display: flex;
  flex-direction: column;
  font-family: 'Fira Code', 'Cascadia Code', 'JetBrains Mono', 'Consolas', monospace;
  box-shadow: 0 -4px 30px rgba(0, 255, 65, 0.15);
}

.terminal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: #0f0f23;
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid rgba(0, 255, 65, 0.1);
}

.terminal-title {
  color: #00ff41;
  font-size: 12px;
  opacity: 0.7;
}

.terminal-close-btn {
  background: none;
  border: none;
  color: #00ff41;
  font-size: 18px;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 200ms;
  padding: 0 4px;
  line-height: 1;
}
.terminal-close-btn:hover {
  opacity: 1;
}

.terminal-output {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  scrollbar-width: thin;
  scrollbar-color: #00ff41 #1a1a2e;
}
.terminal-output::-webkit-scrollbar {
  width: 4px;
}
.terminal-output::-webkit-scrollbar-track {
  background: #1a1a2e;
}
.terminal-output::-webkit-scrollbar-thumb {
  background: rgba(0, 255, 65, 0.3);
  border-radius: 2px;
}

.terminal-line {
  margin-bottom: 4px;
  line-height: 1.5;
  font-size: 14px;
  white-space: pre-wrap;
  word-break: break-all;
}

.terminal-prompt {
  color: #00ff41;
  user-select: none;
}

.terminal-text {
  color: #00ff41;
}

.terminal-error {
  color: #ff4444;
}

.terminal-help {
  color: #00ff41;
  opacity: 0.8;
}

.terminal-typing {
  border-right: 2px solid #00ff41;
  animation: cursor-blink 0.7s step-end infinite;
}

.terminal-input-row {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-top: 1px solid rgba(0, 255, 65, 0.1);
  background: #0f0f23;
}

.terminal-input-row .terminal-prompt.blink {
  animation: cursor-blink 1s step-end infinite;
}

.terminal-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #00ff41;
  font-family: inherit;
  font-size: 14px;
  caret-color: #00ff41;
}
.terminal-input::placeholder {
  color: rgba(0, 255, 65, 0.3);
}

@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
