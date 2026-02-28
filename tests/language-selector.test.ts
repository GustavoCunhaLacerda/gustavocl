import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, computed } from 'vue'
import LanguageSelector from '../components/LanguageSelector.vue'

// Validates: Requirements 4.1, 4.4, 4.5

// Mock state shared between useI18n and tests
let mockLocale: ReturnType<typeof ref<string>>
let mockSetLocale: ReturnType<typeof vi.fn>
let mockLocales: ReturnType<typeof ref>

// Stub Nuxt auto-imports as globals
vi.stubGlobal('computed', computed)
vi.stubGlobal('useI18n', () => ({
  locale: mockLocale,
  locales: mockLocales,
  setLocale: mockSetLocale,
}))

function setup(initialLocale = 'pt-BR') {
  mockLocale = ref(initialLocale)
  mockLocales = ref([
    { code: 'pt-BR', name: 'Português' },
    { code: 'en', name: 'English' },
  ])
  mockSetLocale = vi.fn((newLocale: string) => {
    mockLocale.value = newLocale
  })

  return mount(LanguageSelector)
}

describe('LanguageSelector', () => {
  describe('Rendering', () => {
    it('renders a button element with type="button"', () => {
      const wrapper = setup('pt-BR')
      const button = wrapper.find('button')
      expect(button.exists()).toBe(true)
      expect(button.attributes('type')).toBe('button')
    })

    it('renders the lang-code span inside the button', () => {
      const wrapper = setup('pt-BR')
      const span = wrapper.find('.lang-code')
      expect(span.exists()).toBe(true)
    })
  })

  describe('Active language indication (Req 4.4)', () => {
    it('displays "EN" when active locale is pt-BR', () => {
      const wrapper = setup('pt-BR')
      expect(wrapper.find('.lang-code').text()).toBe('EN')
    })

    it('displays "PT" when active locale is en', () => {
      const wrapper = setup('en')
      expect(wrapper.find('.lang-code').text()).toBe('PT')
    })
  })

  describe('Accessibility (Req 4.5)', () => {
    it('has aria-label "Switch to English" when locale is pt-BR', () => {
      const wrapper = setup('pt-BR')
      expect(wrapper.find('button').attributes('aria-label')).toBe('Switch to English')
    })

    it('has aria-label "Mudar para Português" when locale is en', () => {
      const wrapper = setup('en')
      expect(wrapper.find('button').attributes('aria-label')).toBe('Mudar para Português')
    })

    it('is a native button element (keyboard accessible by default)', () => {
      const wrapper = setup('pt-BR')
      const button = wrapper.find('button')
      expect(button.exists()).toBe(true)
      // Native <button> elements are focusable and activatable via Enter/Space
    })
  })

  describe('Toggle behavior', () => {
    it('calls setLocale with "en" when clicked from pt-BR', async () => {
      const wrapper = setup('pt-BR')
      await wrapper.find('button').trigger('click')
      expect(mockSetLocale).toHaveBeenCalledWith('en')
    })

    it('calls setLocale with "pt-BR" when clicked from en', async () => {
      const wrapper = setup('en')
      await wrapper.find('button').trigger('click')
      expect(mockSetLocale).toHaveBeenCalledWith('pt-BR')
    })
  })
})
