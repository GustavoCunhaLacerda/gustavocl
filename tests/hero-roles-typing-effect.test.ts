// Feature: english-version, Property 9: Roles do efeito de digitação por locale
import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import ptBR from '../locales/pt-BR.json'
import en from '../locales/en.json'

const localeFiles: Record<string, typeof ptBR> = {
  'pt-BR': ptBR,
  en: en,
}

const supportedLocales = ['pt-BR', 'en'] as const

// Simulates how HeroSection resolves roles from the locale file via $tm('hero.roles')
function getRolesForLocale(locale: string): string[] {
  const raw = localeFiles[locale].hero.roles
  if (Array.isArray(raw)) {
    return raw.map((item) => (typeof item === 'string' ? item : String(item)))
  }
  return []
}

// Generators
const localeArb = fc.constantFrom(...supportedLocales)

// **Validates: Requirements 7.5**
describe('Property 9: Typing effect roles per locale', () => {
  it('hero.roles exists and is a non-empty array of strings for any locale', () => {
    fc.assert(
      fc.property(localeArb, (locale) => {
        const roles = getRolesForLocale(locale)
        expect(Array.isArray(roles)).toBe(true)
        expect(roles.length).toBeGreaterThan(0)
        for (const role of roles) {
          expect(typeof role).toBe('string')
          expect(role.length).toBeGreaterThan(0)
        }
      }),
      { numRuns: 100 },
    )
  })

  it('roles array matches the values defined in the locale translation file', () => {
    fc.assert(
      fc.property(localeArb, (locale) => {
        const roles = getRolesForLocale(locale)
        const expected = localeFiles[locale].hero.roles
        expect(roles).toEqual(expected)
      }),
      { numRuns: 100 },
    )
  })

  it('each role at any valid index matches the corresponding entry in the locale file', () => {
    fc.assert(
      fc.property(
        localeArb,
        fc.integer({ min: 0, max: 3 }),
        (locale, roleIndex) => {
          const roles = getRolesForLocale(locale)
          fc.pre(roleIndex < roles.length)
          const expected = localeFiles[locale].hero.roles[roleIndex]
          expect(roles[roleIndex]).toBe(expected)
        },
      ),
      { numRuns: 100 },
    )
  })
})
