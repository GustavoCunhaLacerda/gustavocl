import { describe, it, expect } from 'vitest'
import en from '../locales/en.json'
import ptBR from '../locales/pt-BR.json'
import { collectResumeData, formatDate, formatContactLine } from '../utils/resume/ResumeDataService'
import type { ContactInfo } from '../utils/resume/types'

const localeFiles: Record<string, Record<string, unknown>> = {
  en,
  'pt-BR': ptBR,
}

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.')
  let current: unknown = obj
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return path
    }
    current = (current as Record<string, unknown>)[key]
  }
  return typeof current === 'string' ? current : path
}

function createT(locale: string): (key: string) => string {
  return (key: string) => getNestedValue(localeFiles[locale] as Record<string, unknown>, key)
}

describe('formatDate', () => {
  it('returns "Present" for year === 0 in English', () => {
    const t = createT('en')
    expect(formatDate(0, 0, 'en', t)).toBe('Present')
  })

  it('returns "Presente" for year === 0 in pt-BR', () => {
    const t = createT('pt-BR')
    expect(formatDate(0, 0, 'pt-BR', t)).toBe('Presente')
  })

  it('formats a valid date in English', () => {
    const t = createT('en')
    expect(formatDate(2024, 6, 'en', t)).toBe('Jun 2024')
  })

  it('formats a valid date in pt-BR', () => {
    const t = createT('pt-BR')
    expect(formatDate(2024, 6, 'pt-BR', t)).toBe('Jun 2024')
  })

  it('formats January correctly in English', () => {
    const t = createT('en')
    expect(formatDate(2023, 1, 'en', t)).toBe('Jan 2023')
  })

  it('formats December correctly in pt-BR', () => {
    const t = createT('pt-BR')
    expect(formatDate(2023, 12, 'pt-BR', t)).toBe('Dez 2023')
  })

  it('formats April differently per locale', () => {
    expect(formatDate(2022, 4, 'en', createT('en'))).toBe('Apr 2022')
    expect(formatDate(2022, 4, 'pt-BR', createT('pt-BR'))).toBe('Abr 2022')
  })
})

describe('formatContactLine', () => {
  it('joins all contact fields with pipe separator', () => {
    const contact: ContactInfo = {
      location: 'Brasília, Brazil',
      email: 'test@example.com',
      linkedin: 'https://linkedin.com/in/test',
      github: 'https://github.com/test',
    }
    expect(formatContactLine(contact)).toBe(
      'Brasília, Brazil | test@example.com | https://linkedin.com/in/test | https://github.com/test'
    )
  })

  it('filters out empty fields', () => {
    const contact: ContactInfo = {
      location: 'Brasília',
      email: '',
      linkedin: 'https://linkedin.com/in/test',
      github: '',
    }
    expect(formatContactLine(contact)).toBe('Brasília | https://linkedin.com/in/test')
  })

  it('returns single field when only one is present', () => {
    const contact: ContactInfo = {
      location: '',
      email: 'test@example.com',
      linkedin: '',
      github: '',
    }
    expect(formatContactLine(contact)).toBe('test@example.com')
  })

  it('returns empty string when all fields are empty', () => {
    const contact: ContactInfo = {
      location: '',
      email: '',
      linkedin: '',
      github: '',
    }
    expect(formatContactLine(contact)).toBe('')
  })
})

describe('collectResumeData', () => {
  it('collects correct name from linkedin profile', () => {
    const data = collectResumeData('en', createT('en'))
    expect(data.name).toBe('Gustavo Cunha Lacerda')
  })

  it('collects headline from linkedin profile', () => {
    const data = collectResumeData('en', createT('en'))
    expect(data.headline).toContain('Full Stack')
  })

  it('collects translated summary for English', () => {
    const data = collectResumeData('en', createT('en'))
    expect(data.summary).toBe(en.data.summary)
  })

  it('collects translated summary for pt-BR', () => {
    const data = collectResumeData('pt-BR', createT('pt-BR'))
    expect(data.summary).toBe(ptBR.data.summary)
  })

  it('collects contact info with correct fields', () => {
    const data = collectResumeData('en', createT('en'))
    expect(data.contact.location).toBe('Brasília, Federal District, Brazil')
    expect(data.contact.email).toBe('gustavolacerda.dev@gmail.com')
    expect(data.contact.linkedin).toBe('https://linkedin.com/in/gustavocunhalacerda')
    expect(data.contact.github).toBe('https://github.com/GustavoCunhaLacerda')
  })

  it('collects all 5 experience entries', () => {
    const data = collectResumeData('en', createT('en'))
    expect(data.experience).toHaveLength(5)
  })

  it('uses translated titles for experience in English', () => {
    const data = collectResumeData('en', createT('en'))
    expect(data.experience[0].title).toBe('Systems Analyst')
    expect(data.experience[1].title).toBe('Full Stack Developer')
  })

  it('uses translated titles for experience in pt-BR', () => {
    const data = collectResumeData('pt-BR', createT('pt-BR'))
    expect(data.experience[0].title).toBe('Analista de sistema')
    expect(data.experience[1].title).toBe('Desenvolvedor full stack')
  })

  it('parses experience descriptions into bullet point arrays', () => {
    const data = collectResumeData('en', createT('en'))
    expect(data.experience[0].description.length).toBeGreaterThan(0)
    data.experience[0].description.forEach((item) => {
      expect(item).not.toMatch(/^- /)
    })
  })

  it('formats experience dates correctly', () => {
    const data = collectResumeData('en', createT('en'))
    // DATAPREV: start Jun 2024, end Present
    expect(data.experience[0].startDate).toBe('Jun 2024')
    expect(data.experience[0].endDate).toBe('Present')
  })

  it('translates employment types', () => {
    const data = collectResumeData('pt-BR', createT('pt-BR'))
    expect(data.experience[0].employmentType).toBe('Tempo integral')
    expect(data.experience[3].employmentType).toBe('Meio período')
  })

  it('collects all skills', () => {
    const data = collectResumeData('en', createT('en'))
    expect(data.skills.length).toBeGreaterThan(0)
    expect(data.skills).toContain('JavaScript')
    expect(data.skills).toContain('Vue.js')
  })

  it('collects education entries', () => {
    const data = collectResumeData('en', createT('en'))
    expect(data.education).toHaveLength(1)
    expect(data.education[0].institution).toContain('IFB')
    expect(data.education[0].grade).toBe('8.67')
  })

  it('collects certification entries with formatted dates', () => {
    const data = collectResumeData('en', createT('en'))
    expect(data.certifications.length).toBeGreaterThan(0)
    expect(data.certifications[0].name).toBe('PHP: criando sua aplicação')
    expect(data.certifications[0].authority).toBe('Alura')
    expect(data.certifications[0].date).toBe('Aug 2024')
  })

  it('collects project entries with translated descriptions', () => {
    const data = collectResumeData('en', createT('en'))
    expect(data.projects).toHaveLength(4)
    expect(data.projects[0].description).toBe(en.data.featuredProjects['calculadoras-medware'].description)
  })

  it('collects project techs', () => {
    const data = collectResumeData('en', createT('en'))
    expect(data.projects[0].techs).toEqual(['.NET 5', 'Nuxt', 'CSS'])
  })
})
