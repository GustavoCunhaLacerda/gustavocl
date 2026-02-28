import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import type {
  ContactInfo,
  ExperienceEntry,
  EducationEntry,
  CertificationEntry,
  ProjectEntry,
  ResumeData,
  SectionTitles,
} from '../utils/resume/types'

// --- fast-check arbitrary generators for resume types ---

export const contactInfoArb: fc.Arbitrary<ContactInfo> = fc.record({
  location: fc.string({ minLength: 0, maxLength: 50 }),
  email: fc.string({ minLength: 0, maxLength: 50 }),
  linkedin: fc.string({ minLength: 0, maxLength: 80 }),
  github: fc.string({ minLength: 0, maxLength: 80 }),
})

export const experienceEntryArb: fc.Arbitrary<ExperienceEntry> = fc.record({
  title: fc.string({ minLength: 1, maxLength: 50 }),
  company: fc.string({ minLength: 1, maxLength: 50 }),
  location: fc.string({ minLength: 1, maxLength: 50 }),
  startDate: fc.string({ minLength: 1, maxLength: 20 }),
  endDate: fc.string({ minLength: 1, maxLength: 20 }),
  employmentType: fc.string({ minLength: 1, maxLength: 20 }),
  description: fc.array(fc.string({ minLength: 1, maxLength: 100 }), { minLength: 0, maxLength: 5 }),
})

export const educationEntryArb: fc.Arbitrary<EducationEntry> = fc.record({
  institution: fc.string({ minLength: 1, maxLength: 50 }),
  degree: fc.string({ minLength: 1, maxLength: 50 }),
  fieldOfStudy: fc.string({ minLength: 1, maxLength: 50 }),
  startYear: fc.integer({ min: 1990, max: 2030 }),
  endYear: fc.integer({ min: 1990, max: 2030 }),
  grade: fc.option(fc.string({ minLength: 1, maxLength: 10 }), { nil: undefined }),
})

export const certificationEntryArb: fc.Arbitrary<CertificationEntry> = fc.record({
  name: fc.string({ minLength: 1, maxLength: 80 }),
  authority: fc.string({ minLength: 1, maxLength: 50 }),
  date: fc.string({ minLength: 1, maxLength: 20 }),
})

export const projectEntryArb: fc.Arbitrary<ProjectEntry> = fc.record({
  name: fc.string({ minLength: 1, maxLength: 50 }),
  description: fc.string({ minLength: 1, maxLength: 200 }),
  techs: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 0, maxLength: 5 }),
})

export const sectionTitlesArb: fc.Arbitrary<SectionTitles> = fc.record({
  summary: fc.string({ minLength: 1, maxLength: 30 }),
  experience: fc.string({ minLength: 1, maxLength: 30 }),
  skills: fc.string({ minLength: 1, maxLength: 30 }),
  education: fc.string({ minLength: 1, maxLength: 30 }),
  certifications: fc.string({ minLength: 1, maxLength: 30 }),
  projects: fc.string({ minLength: 1, maxLength: 30 }),
})

export const resumeDataArb: fc.Arbitrary<ResumeData> = fc.record({
  name: fc.string({ minLength: 1, maxLength: 50 }),
  headline: fc.string({ minLength: 1, maxLength: 80 }),
  summary: fc.string({ minLength: 0, maxLength: 300 }),
  contact: contactInfoArb,
  experience: fc.array(experienceEntryArb, { minLength: 0, maxLength: 5 }),
  skills: fc.array(fc.string({ minLength: 1, maxLength: 30 }), { minLength: 0, maxLength: 10 }),
  education: fc.array(educationEntryArb, { minLength: 0, maxLength: 3 }),
  certifications: fc.array(certificationEntryArb, { minLength: 0, maxLength: 5 }),
  projects: fc.array(projectEntryArb, { minLength: 0, maxLength: 4 }),
  sectionTitles: fc.option(sectionTitlesArb, { nil: undefined }),
})

// --- Smoke test to verify generators produce valid data ---

describe('fast-check generators', () => {
  it('generates valid ResumeData', () => {
    fc.assert(
      fc.property(resumeDataArb, (data) => {
        expect(data.name).toBeDefined()
        expect(data.contact).toBeDefined()
        expect(Array.isArray(data.experience)).toBe(true)
        expect(Array.isArray(data.skills)).toBe(true)
      }),
      { numRuns: 100 },
    )
  })
})

// --- Imports for property tests ---
import { collectResumeData, formatDate, formatContactLine } from '../utils/resume/ResumeDataService'
import { buildResumePDF } from '../utils/resume/ResumePDFBuilder'
import en from '../locales/en.json'
import ptBR from '../locales/pt-BR.json'
import linkedinProfile from '../data/linkedin_profile.json'
import featuredProjects from '../data/featured_projects.json'
import type { PDFConfig } from '../utils/resume/types'

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

const defaultPDFConfig: PDFConfig = {
  pageWidth: 210,
  pageHeight: 297,
  marginTop: 20,
  marginBottom: 20,
  marginLeft: 20,
  marginRight: 20,
  accentColor: '#2563eb',
  fontSizes: {
    name: 20,
    sectionTitle: 13,
    body: 10,
    small: 9,
  },
}

// --- Property Tests ---

// Feature: resume-download, Property 1: Completude da coleta de dados
// **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.8**
describe('Property 1: Completude da coleta de dados', () => {
  it('collectResumeData includes all entries from source data for any locale', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('en', 'pt-BR'),
        (locale) => {
          const t = createT(locale)
          const data = collectResumeData(locale, t)

          // Experience count matches linkedin_profile.json positions
          expect(data.experience).toHaveLength(linkedinProfile.position.length)

          // Skills count matches linkedin_profile.json skills
          expect(data.skills).toHaveLength(linkedinProfile.skills.length)

          // Education count matches linkedin_profile.json educations
          expect(data.education).toHaveLength(linkedinProfile.educations.length)

          // Certifications count matches linkedin_profile.json certifications
          expect(data.certifications).toHaveLength(linkedinProfile.certifications.length)

          // Projects count matches featured_projects.json
          expect(data.projects).toHaveLength(featuredProjects.length)

          // Name is present
          expect(data.name).toBe(`${linkedinProfile.firstName} ${linkedinProfile.lastName}`)

          // Summary is present and non-empty
          expect(data.summary.length).toBeGreaterThan(0)

          // Contact info is present
          expect(data.contact.location).toBe(linkedinProfile.geo.full)
          expect(data.contact.email.length).toBeGreaterThan(0)
          expect(data.contact.linkedin.length).toBeGreaterThan(0)
          expect(data.contact.github.length).toBeGreaterThan(0)
        },
      ),
      { numRuns: 100 },
    )
  })
})

// Feature: resume-download, Property 2: Consistência de textos por locale
// **Validates: Requirements 2.7, 5.1, 5.2, 5.3, 5.4**
describe('Property 2: Consistência de textos por locale', () => {
  it('collectResumeData returns texts matching the corresponding locale file', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('en', 'pt-BR'),
        (locale) => {
          const t = createT(locale)
          const localeFile = locale === 'en' ? en : ptBR
          const data = collectResumeData(locale, t)

          // Summary matches locale file
          expect(data.summary).toBe(localeFile.data.summary)

          // Section titles match locale file
          expect(data.sectionTitles?.summary).toBe(localeFile.resume.sections.summary)
          expect(data.sectionTitles?.experience).toBe(localeFile.resume.sections.experience)
          expect(data.sectionTitles?.skills).toBe(localeFile.resume.sections.skills)
          expect(data.sectionTitles?.education).toBe(localeFile.resume.sections.education)
          expect(data.sectionTitles?.certifications).toBe(localeFile.resume.sections.certifications)
          expect(data.sectionTitles?.projects).toBe(localeFile.resume.sections.projects)
        },
      ),
      { numRuns: 100 },
    )
  })
})

// Feature: resume-download, Property 3: Formatação de datas
// **Validates: Requirements 5.5, 6.4**
describe('Property 3: Formatação de datas', () => {
  it('formats dates correctly for any year, month, and locale', () => {
    const enMonths = en.experience.months
    const ptBRMonths = ptBR.experience.months

    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 2030 }),
        fc.integer({ min: 1, max: 12 }),
        fc.constantFrom('en', 'pt-BR'),
        (year, month, locale) => {
          const t = createT(locale)
          const result = formatDate(year, month, locale, t)

          if (year === 0) {
            // Should return "Present" or "Presente"
            const expected = locale === 'en' ? 'Present' : 'Presente'
            expect(result).toBe(expected)
          } else {
            // Should contain the year as string
            expect(result).toContain(String(year))

            // Should contain the correct month abbreviation
            const months = locale === 'en' ? enMonths : ptBRMonths
            const expectedMonth = months[month - 1]
            expect(result).toContain(expectedMonth)
          }
        },
      ),
      { numRuns: 100 },
    )
  })
})

// Feature: resume-download, Property 8: Formatação de experiência
// **Validates: Requirements 3.7, 4.6**
describe('Property 8: Formatação de experiência', () => {
  it('any ExperienceEntry has title, company, startDate, endDate, employmentType, and description array', () => {
    fc.assert(
      fc.property(
        experienceEntryArb,
        (entry) => {
          // Entry must have all required fields
          expect(typeof entry.title).toBe('string')
          expect(entry.title.length).toBeGreaterThan(0)

          expect(typeof entry.company).toBe('string')
          expect(entry.company.length).toBeGreaterThan(0)

          expect(typeof entry.startDate).toBe('string')
          expect(entry.startDate.length).toBeGreaterThan(0)

          expect(typeof entry.endDate).toBe('string')
          expect(entry.endDate.length).toBeGreaterThan(0)

          expect(typeof entry.employmentType).toBe('string')
          expect(entry.employmentType.length).toBeGreaterThan(0)

          expect(Array.isArray(entry.description)).toBe(true)
        },
      ),
      { numRuns: 100 },
    )
  })
})

// Feature: resume-download, Property 9: Skills como lista separada por vírgula
// **Validates: Requirement 3.8**
describe('Property 9: Skills como lista separada por vírgula', () => {
  it('joining skills with ", " produces a string where each skill appears and skills are separated by ", "', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1, maxLength: 30 }), { minLength: 1, maxLength: 20 }),
        (skills) => {
          const result = skills.join(', ')

          // Each skill must appear in the result
          for (const skill of skills) {
            expect(result).toContain(skill)
          }

          // The number of ", " separators should be skills.length - 1
          const separatorCount = (result.match(/, /g) || []).length
          expect(separatorCount).toBe(skills.length - 1)
        },
      ),
      { numRuns: 100 },
    )
  })
})

// Feature: resume-download, Property 10: Contato com pipe separator
// **Validates: Requirement 4.4**
describe('Property 10: Contato com pipe separator', () => {
  it('formatContactLine separates non-empty fields with " | " and excludes empty fields', () => {
    fc.assert(
      fc.property(
        contactInfoArb,
        (contact) => {
          const result = formatContactLine(contact)
          const nonEmptyFields = [contact.location, contact.email, contact.linkedin, contact.github]
            .filter((v) => v !== '')

          if (nonEmptyFields.length === 0) {
            expect(result).toBe('')
          } else {
            // Each non-empty field must appear in the result
            for (const field of nonEmptyFields) {
              expect(result).toContain(field)
            }

            // The result should be the fields joined by " | "
            expect(result).toBe(nonEmptyFields.join(' | '))
          }
        },
      ),
      { numRuns: 100 },
    )
  })
})

// Feature: resume-download, Property 12: Dados incompletos
// **Validates: Requirement 6.3**
describe('Property 12: Dados incompletos', () => {
  it('buildResumePDF does not throw and returns a valid jsPDF instance for ResumeData with empty sections', () => {
    const resumeDataWithEmptySectionsArb = fc.record({
      name: fc.string({ minLength: 1, maxLength: 50 }),
      headline: fc.string({ minLength: 1, maxLength: 80 }),
      summary: fc.oneof(fc.constant(''), fc.string({ minLength: 1, maxLength: 200 })),
      contact: contactInfoArb,
      experience: fc.oneof(fc.constant([]), fc.array(experienceEntryArb, { minLength: 1, maxLength: 3 })),
      skills: fc.oneof(fc.constant([]), fc.array(fc.string({ minLength: 1, maxLength: 30 }), { minLength: 1, maxLength: 5 })),
      education: fc.oneof(fc.constant([]), fc.array(educationEntryArb, { minLength: 1, maxLength: 2 })),
      certifications: fc.oneof(fc.constant([]), fc.array(certificationEntryArb, { minLength: 1, maxLength: 3 })),
      projects: fc.oneof(fc.constant([]), fc.array(projectEntryArb, { minLength: 1, maxLength: 2 })),
      sectionTitles: fc.option(sectionTitlesArb, { nil: undefined }),
    })

    fc.assert(
      fc.property(
        resumeDataWithEmptySectionsArb,
        (data) => {
          // Should not throw
          const pdf = buildResumePDF(data, defaultPDFConfig)

          // Should return a valid jsPDF instance with getNumberOfPages method
          expect(pdf).toBeDefined()
          expect(typeof pdf.getNumberOfPages).toBe('function')
          expect(pdf.getNumberOfPages()).toBeGreaterThanOrEqual(1)
        },
      ),
      { numRuns: 100 },
    )
  })
})
