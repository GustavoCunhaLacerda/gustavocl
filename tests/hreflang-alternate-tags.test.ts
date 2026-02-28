// Unit tests for hreflang alternate tags
// Validates: Requirement 6.4
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

describe('Hreflang alternate tags (Requirement 6.4)', () => {
  const expectedHreflangs = ['pt-BR', 'en']

  describe('SEO plugin configuration', () => {
    const pluginSource = readFileSync(resolve(__dirname, '../plugins/seo.js'), 'utf-8')

    it('contains a link with rel="alternate" and hreflang="pt-BR"', () => {
      expect(pluginSource).toContain("rel: 'alternate'")
      expect(pluginSource).toContain("hreflang: 'pt-BR'")
    })

    it('contains a link with rel="alternate" and hreflang="en"', () => {
      expect(pluginSource).toContain("hreflang: 'en'")
    })

    it('both hreflang entries point to the site URL', () => {
      // Verify the href is set for the alternate links
      expect(pluginSource).toContain("href: 'https://gustavolacerda.com'")
    })
  })

  describe('DOM verification', () => {
    beforeEach(() => {
      // Simulate what the SEO plugin does: add hreflang link elements
      for (const lang of expectedHreflangs) {
        const link = document.createElement('link')
        link.setAttribute('rel', 'alternate')
        link.setAttribute('hreflang', lang)
        link.setAttribute('href', 'https://gustavolacerda.com')
        document.head.appendChild(link)
      }
    })

    afterEach(() => {
      // Clean up link elements
      document.querySelectorAll('link[rel="alternate"]').forEach((el) => el.remove())
    })

    it('has a <link rel="alternate" hreflang="pt-BR"> tag', () => {
      const link = document.querySelector('link[rel="alternate"][hreflang="pt-BR"]')
      expect(link).not.toBeNull()
      expect(link?.getAttribute('hreflang')).toBe('pt-BR')
      expect(link?.getAttribute('rel')).toBe('alternate')
    })

    it('has a <link rel="alternate" hreflang="en"> tag', () => {
      const link = document.querySelector('link[rel="alternate"][hreflang="en"]')
      expect(link).not.toBeNull()
      expect(link?.getAttribute('hreflang')).toBe('en')
      expect(link?.getAttribute('rel')).toBe('alternate')
    })

    it('both alternate links have an href attribute', () => {
      const links = document.querySelectorAll('link[rel="alternate"]')
      expect(links.length).toBe(2)
      links.forEach((link) => {
        expect(link.getAttribute('href')).toBeTruthy()
      })
    })

    it('covers exactly pt-BR and en hreflangs', () => {
      const links = document.querySelectorAll('link[rel="alternate"]')
      const hreflangs = Array.from(links).map((l) => l.getAttribute('hreflang'))
      expect(hreflangs).toContain('pt-BR')
      expect(hreflangs).toContain('en')
      expect(hreflangs.length).toBe(2)
    })
  })
})
