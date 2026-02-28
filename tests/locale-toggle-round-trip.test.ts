// Feature: english-version, Property 4: Toggle de locale é round-trip
import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'

/**
 * Pure toggle logic extracted from LanguageSelector.vue:
 *   const newLocale = locale.value === 'pt-BR' ? 'en' : 'pt-BR'
 */
function toggleLocale(current: string): string {
  return current === 'pt-BR' ? 'en' : 'pt-BR'
}

// Validates: Requirements 4.2
describe('Property 4: Locale toggle is a round-trip', () => {
  const localeArb = fc.constantFrom('pt-BR', 'en')

  it('toggling twice returns to the original locale', () => {
    fc.assert(
      fc.property(localeArb, (originalLocale: string) => {
        const afterFirstToggle = toggleLocale(originalLocale)
        const afterSecondToggle = toggleLocale(afterFirstToggle)
        expect(afterSecondToggle).toBe(originalLocale)
      }),
      { numRuns: 100 }
    )
  })
})
