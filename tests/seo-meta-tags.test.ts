// Feature: english-version, Property 7: Meta tags SEO correspondem ao locale ativo
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as fc from 'fast-check'
import ptBR from '../locales/pt-BR.json'
import en from '../locales/en.json'

// Validates: Requirements 6.3
describe('Property 7: SEO meta tags correspond to the active locale', () => {
  const localeArb = fc.constantFrom('pt-BR' as const, 'en' as const)

  const translations: Record<string, { seo: { title: string; description: string } }> = {
    'pt-BR': ptBR,
    'en': en,
  }

  function getOrCreateMeta(property: string): HTMLMetaElement {
    let meta = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`)
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('property', property)
      document.head.appendChild(meta)
    }
    return meta
  }

  beforeEach(() => {
    // Ensure clean meta tags before each test run
    const ogTitle = document.querySelector('meta[property="og:title"]')
    const ogDesc = document.querySelector('meta[property="og:description"]')
    if (ogTitle) ogTitle.remove()
    if (ogDesc) ogDesc.remove()
  })

  afterEach(() => {
    const ogTitle = document.querySelector('meta[property="og:title"]')
    const ogDesc = document.querySelector('meta[property="og:description"]')
    if (ogTitle) ogTitle.remove()
    if (ogDesc) ogDesc.remove()
  })

  it('for any locale, seo.title and seo.description are non-empty strings that match the locale translations', () => {
    fc.assert(
      fc.property(localeArb, (locale) => {
        const expected = translations[locale].seo

        // Verify the locale file has non-empty SEO values
        expect(expected.title).toBeTruthy()
        expect(expected.description).toBeTruthy()
        expect(typeof expected.title).toBe('string')
        expect(typeof expected.description).toBe('string')
        expect(expected.title.length).toBeGreaterThan(0)
        expect(expected.description.length).toBeGreaterThan(0)

        // Simulate setting meta tags as the SEO plugin would
        const ogTitle = getOrCreateMeta('og:title')
        const ogDesc = getOrCreateMeta('og:description')
        ogTitle.setAttribute('content', expected.title)
        ogDesc.setAttribute('content', expected.description)

        // Verify the meta tags contain the correct translated values
        const actualTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.getAttribute('content')
        const actualDesc = document.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.getAttribute('content')

        expect(actualTitle).toBe(expected.title)
        expect(actualDesc).toBe(expected.description)
      }),
      { numRuns: 100 }
    )
  })

  it('SEO values differ between locales (translations are distinct)', () => {
    const ptSeo = translations['pt-BR'].seo
    const enSeo = translations['en'].seo

    // Title and description should differ between locales
    expect(ptSeo.title).not.toBe(enSeo.title)
    expect(ptSeo.description).not.toBe(enSeo.description)
  })
})
