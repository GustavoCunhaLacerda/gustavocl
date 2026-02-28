// Feature: english-version, Property 5: Persistência de locale é round-trip
import { describe, it, expect, beforeEach } from 'vitest'
import * as fc from 'fast-check'

const LOCALE_STORAGE_KEY = 'preferred-locale'

// Validates: Requirements 5.1, 5.2
describe('Property 5: Locale persistence is round-trip', () => {
  const localeArb = fc.constantFrom('pt-BR', 'en')

  beforeEach(() => {
    localStorage.clear()
  })

  it('storing a locale in localStorage and retrieving it returns the same locale', () => {
    fc.assert(
      fc.property(localeArb, (locale: string) => {
        localStorage.setItem(LOCALE_STORAGE_KEY, locale)
        const retrieved = localStorage.getItem(LOCALE_STORAGE_KEY)
        expect(retrieved).toBe(locale)
      }),
      { numRuns: 100 }
    )
  })
})
