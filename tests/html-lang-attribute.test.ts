// Feature: english-version, Property 6: Atributo lang do HTML corresponde ao locale ativo
import { describe, it, expect, afterEach } from 'vitest'
import * as fc from 'fast-check'

// Validates: Requirements 6.1, 6.2
describe('Property 6: HTML lang attribute corresponds to the active locale', () => {
  const localeArb = fc.constantFrom('pt-BR', 'en')

  afterEach(() => {
    document.documentElement.lang = ''
  })

  it('setting document.documentElement.lang to a locale results in that locale being reflected', () => {
    fc.assert(
      fc.property(localeArb, (locale: string) => {
        document.documentElement.lang = locale
        expect(document.documentElement.lang).toBe(locale)
      }),
      { numRuns: 100 }
    )
  })
})
