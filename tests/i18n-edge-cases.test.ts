// Unit tests for i18n edge cases
// Validates: Requirements 2.2, 5.3, 7.4, 7.6
import { describe, it, expect, beforeEach } from 'vitest'
import ptBR from '../locales/pt-BR.json'
import en from '../locales/en.json'

const LOCALE_STORAGE_KEY = 'preferred-locale'

// Validates: Requirement 5.3
describe('Default locale when localStorage is empty (Requirement 5.3)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns null when no preferred-locale key exists in localStorage', () => {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
    expect(stored).toBeNull()
  })

  it('nuxt.config.ts defines pt-BR as the defaultLocale fallback', async () => {
    const { readFileSync } = await import('fs')
    const { resolve } = await import('path')
    const config = readFileSync(resolve(__dirname, '..', 'nuxt.config.ts'), 'utf-8')
    expect(config).toContain("defaultLocale: 'pt-BR'")
  })

  it('detectBrowserLanguage fallbackLocale is pt-BR', async () => {
    const { readFileSync } = await import('fs')
    const { resolve } = await import('path')
    const config = readFileSync(resolve(__dirname, '..', 'nuxt.config.ts'), 'utf-8')
    expect(config).toMatch(/detectBrowserLanguage[\s\S]*?fallbackLocale:\s*'pt-BR'/)
  })
})

// Validates: Requirement 7.4
describe('"Present"/"Presente" for current positions (Requirement 7.4)', () => {
  it('pt-BR locale has experience.present set to "Presente"', () => {
    expect(ptBR.experience.present).toBe('Presente')
  })

  it('en locale has experience.present set to "Present"', () => {
    expect(en.experience.present).toBe('Present')
  })

  it('both locales have a non-empty experience.present value', () => {
    expect(ptBR.experience.present.length).toBeGreaterThan(0)
    expect(en.experience.present.length).toBeGreaterThan(0)
  })
})

// Validates: Requirement 7.6
describe('"Research"/"Pesquisa" for research projects (Requirement 7.6)', () => {
  it('pt-BR locale has projects.research set to "Pesquisa"', () => {
    expect(ptBR.projects.research).toBe('Pesquisa')
  })

  it('en locale has projects.research set to "Research"', () => {
    expect(en.projects.research).toBe('Research')
  })

  it('both locales have a non-empty projects.research value', () => {
    expect(ptBR.projects.research.length).toBeGreaterThan(0)
    expect(en.projects.research.length).toBeGreaterThan(0)
  })
})

// Validates: Requirement 2.2
describe('pt-BR.json content matches current Portuguese texts (Requirement 2.2)', () => {
  describe('Navigation labels', () => {
    it('nav.home is "Início"', () => {
      expect(ptBR.nav.home).toBe('Início')
    })

    it('nav.about is "Sobre"', () => {
      expect(ptBR.nav.about).toBe('Sobre')
    })

    it('nav.experience is "Experiência"', () => {
      expect(ptBR.nav.experience).toBe('Experiência')
    })

    it('nav.projects is "Projetos"', () => {
      expect(ptBR.nav.projects).toBe('Projetos')
    })

    it('nav.contact is "Contato"', () => {
      expect(ptBR.nav.contact).toBe('Contato')
    })
  })

  describe('Hero section', () => {
    it('hero.viewProjects is "Ver Projetos"', () => {
      expect(ptBR.hero.viewProjects).toBe('Ver Projetos')
    })

    it('hero.contact is "Contato"', () => {
      expect(ptBR.hero.contact).toBe('Contato')
    })
  })

  describe('About section', () => {
    it('about.title is "Sobre Mim"', () => {
      expect(ptBR.about.title).toBe('Sobre Mim')
    })
  })

  describe('Experience section', () => {
    it('experience.title is "Experiência"', () => {
      expect(ptBR.experience.title).toBe('Experiência')
    })

    it('experience.present is "Presente"', () => {
      expect(ptBR.experience.present).toBe('Presente')
    })

    it('experience.expandMore is "Ver mais"', () => {
      expect(ptBR.experience.expandMore).toBe('Ver mais')
    })

    it('experience.expandLess is "Ver menos"', () => {
      expect(ptBR.experience.expandLess).toBe('Ver menos')
    })

    it('experience.months has 12 Portuguese month abbreviations', () => {
      expect(ptBR.experience.months).toEqual([
        'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
        'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
      ])
    })

    it('experience.duration words are in Portuguese', () => {
      expect(ptBR.experience.duration.year).toBe('ano')
      expect(ptBR.experience.duration.years).toBe('anos')
      expect(ptBR.experience.duration.month).toBe('mês')
      expect(ptBR.experience.duration.months).toBe('meses')
      expect(ptBR.experience.duration.and).toBe('e')
    })

    it('experience.employmentType values are in Portuguese', () => {
      expect(ptBR.experience.employmentType['Full-time']).toBe('Tempo integral')
      expect(ptBR.experience.employmentType['Part-time']).toBe('Meio período')
      expect(ptBR.experience.employmentType['Contract']).toBe('Contrato')
      expect(ptBR.experience.employmentType['Internship']).toBe('Estágio')
      expect(ptBR.experience.employmentType['Freelance']).toBe('Freelance')
    })
  })

  describe('Projects section', () => {
    it('projects.featured is "Destaques"', () => {
      expect(ptBR.projects.featured).toBe('Destaques')
    })

    it('projects.openSource is "Open Source"', () => {
      expect(ptBR.projects.openSource).toBe('Open Source')
    })

    it('projects.research is "Pesquisa"', () => {
      expect(ptBR.projects.research).toBe('Pesquisa')
    })
  })

  describe('Contact section', () => {
    it('contact.title is "Vamos conversar?"', () => {
      expect(ptBR.contact.title).toBe('Vamos conversar?')
    })

    it('contact.sendEmail is "Enviar e-mail"', () => {
      expect(ptBR.contact.sendEmail).toBe('Enviar e-mail')
    })
  })

  describe('Footer section', () => {
    it('footer.easterEggHint contains "math" and "cubo mágico"', () => {
      expect(ptBR.footer.easterEggHint).toContain('math')
      expect(ptBR.footer.easterEggHint).toContain('cubo mágico')
    })
  })
})
