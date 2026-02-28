import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import en from '../locales/en.json'
import ptBR from '../locales/pt-BR.json'

// Read HeroSection.vue template as raw string for template assertions
const heroTemplate = readFileSync(
  resolve(__dirname, '..', 'components', 'HeroSection.vue'),
  'utf-8'
)

describe('i18n keys for download button', () => {
  describe('key existence', () => {
    it('en.json contains hero.downloadCV', () => {
      expect((en as any).hero.downloadCV).toBeDefined()
    })

    it('en.json contains hero.generating', () => {
      expect((en as any).hero.generating).toBeDefined()
    })

    it('en.json contains resume.error', () => {
      expect((en as any).resume.error).toBeDefined()
    })

    it('pt-BR.json contains hero.downloadCV', () => {
      expect((ptBR as any).hero.downloadCV).toBeDefined()
    })

    it('pt-BR.json contains hero.generating', () => {
      expect((ptBR as any).hero.generating).toBeDefined()
    })

    it('pt-BR.json contains resume.error', () => {
      expect((ptBR as any).resume.error).toBeDefined()
    })
  })

  describe('key values', () => {
    it('en: downloadCV is "Download CV"', () => {
      expect((en as any).hero.downloadCV).toBe('Download CV')
    })

    it('en: generating is "Generating..."', () => {
      expect((en as any).hero.generating).toBe('Generating...')
    })

    it('en: resume.error is correct', () => {
      expect((en as any).resume.error).toBe(
        'Error generating CV. Please try again.'
      )
    })

    it('pt-BR: downloadCV is "Baixar Currículo"', () => {
      expect((ptBR as any).hero.downloadCV).toBe('Baixar Currículo')
    })

    it('pt-BR: generating is "Gerando..."', () => {
      expect((ptBR as any).hero.generating).toBe('Gerando...')
    })

    it('pt-BR: resume.error is correct', () => {
      expect((ptBR as any).resume.error).toBe(
        'Erro ao gerar currículo. Tente novamente.'
      )
    })
  })
})

describe('HeroSection template - download button', () => {
  it('contains btn-accent class on the button', () => {
    expect(heroTemplate).toContain('btn btn-accent')
  })

  it('contains @click="generateResume"', () => {
    expect(heroTemplate).toContain('@click="generateResume"')
  })

  it('uses $t(\'hero.downloadCV\') for button text', () => {
    expect(heroTemplate).toContain("$t('hero.downloadCV')")
  })

  it('uses $t(\'hero.generating\') for loading text', () => {
    expect(heroTemplate).toContain("$t('hero.generating')")
  })

  it('binds isGenerating for disabled state', () => {
    expect(heroTemplate).toContain(':disabled="isGenerating"')
  })

  it('has aria-label bound to downloadCV i18n key', () => {
    expect(heroTemplate).toContain(":aria-label=\"$t('hero.downloadCV')\"")
  })

  it('contains download icon SVG with icon-download class', () => {
    expect(heroTemplate).toContain('class="icon-download"')
  })

  it('contains spinner icon SVG with animate-spin class', () => {
    expect(heroTemplate).toContain('class="icon-spinner animate-spin"')
  })
})
