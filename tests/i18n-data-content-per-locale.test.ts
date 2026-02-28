// Feature: english-version, Property 3: Conteúdo de dados por locale
import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import ptBR from '../locales/pt-BR.json'
import en from '../locales/en.json'

const localeFiles: Record<string, typeof ptBR> = {
  'pt-BR': ptBR,
  en: en,
}

const positionKeys = ['dataprev', 'medware', 'xpbox', 'tcu', 'ifb'] as const
const projectKeys = [
  'calculadoras-medware',
  'moneysuite',
  'simp-tcu',
  'deep-fake-detection',
] as const

const localeArb = fc.constantFrom('pt-BR', 'en')
const positionKeyArb = fc.constantFrom(...positionKeys)
const projectKeyArb = fc.constantFrom(...projectKeys)

// **Validates: Requirements 3.1, 3.3, 3.4, 3.5**
describe('Property 3: Data content per locale', () => {
  it('position title exists and is a non-empty string for every locale and position key', () => {
    fc.assert(
      fc.property(localeArb, positionKeyArb, (locale, key) => {
        const file = localeFiles[locale]
        const title = file.data.positions[key].title
        expect(typeof title).toBe('string')
        expect(title.length).toBeGreaterThan(0)
      }),
      { numRuns: 100 },
    )
  })

  it('position description exists and is a non-empty string for every locale and position key', () => {
    fc.assert(
      fc.property(localeArb, positionKeyArb, (locale, key) => {
        const file = localeFiles[locale]
        const description = file.data.positions[key].description
        expect(typeof description).toBe('string')
        expect(description.length).toBeGreaterThan(0)
      }),
      { numRuns: 100 },
    )
  })

  it('featured project description exists and is a non-empty string for every locale and project key', () => {
    fc.assert(
      fc.property(localeArb, projectKeyArb, (locale, key) => {
        const file = localeFiles[locale]
        const description = file.data.featuredProjects[key].description
        expect(typeof description).toBe('string')
        expect(description.length).toBeGreaterThan(0)
      }),
      { numRuns: 100 },
    )
  })

  it('summary exists and is a non-empty string for every locale', () => {
    fc.assert(
      fc.property(localeArb, (locale) => {
        const file = localeFiles[locale]
        const summary = file.data.summary
        expect(typeof summary).toBe('string')
        expect(summary.length).toBeGreaterThan(0)
      }),
      { numRuns: 100 },
    )
  })

  it('values match the correct locale file for positions', () => {
    fc.assert(
      fc.property(localeArb, positionKeyArb, (locale, key) => {
        const file = localeFiles[locale]
        const expectedTitle = file.data.positions[key].title
        const expectedDesc = file.data.positions[key].description

        if (locale === 'pt-BR') {
          expect(expectedTitle).toBe(ptBR.data.positions[key].title)
          expect(expectedDesc).toBe(ptBR.data.positions[key].description)
        } else {
          expect(expectedTitle).toBe(en.data.positions[key].title)
          expect(expectedDesc).toBe(en.data.positions[key].description)
        }
      }),
      { numRuns: 100 },
    )
  })

  it('values match the correct locale file for featured projects', () => {
    fc.assert(
      fc.property(localeArb, projectKeyArb, (locale, key) => {
        const file = localeFiles[locale]
        const expectedDesc = file.data.featuredProjects[key].description

        if (locale === 'pt-BR') {
          expect(expectedDesc).toBe(ptBR.data.featuredProjects[key].description)
        } else {
          expect(expectedDesc).toBe(en.data.featuredProjects[key].description)
        }
      }),
      { numRuns: 100 },
    )
  })

  it('values match the correct locale file for summary', () => {
    fc.assert(
      fc.property(localeArb, (locale) => {
        const file = localeFiles[locale]
        const expectedSummary = file.data.summary

        if (locale === 'pt-BR') {
          expect(expectedSummary).toBe(ptBR.data.summary)
        } else {
          expect(expectedSummary).toBe(en.data.summary)
        }
      }),
      { numRuns: 100 },
    )
  })
})
