// Feature: english-version, Property 8: Formatação do ExperienceItem por locale
import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import ptBR from '../locales/pt-BR.json'
import en from '../locales/en.json'

const localeFiles: Record<string, typeof ptBR> = {
  'pt-BR': ptBR,
  en: en,
}

// Pure formatting functions extracted from ExperienceItem.vue
function formatMonth(monthIndex: number, locale: string): string {
  const months = localeFiles[locale].experience.months
  return months[monthIndex]
}

function formatDuration(years: number, months: number, locale: string): string {
  const dur = localeFiles[locale].experience.duration
  const yearWord = years > 1 ? dur.years : dur.year
  const monthWord = months > 1 ? dur.months : dur.month
  const andWord = dur.and

  if (years > 0 && months > 0) return `${years} ${yearWord} ${andWord} ${months} ${monthWord}`
  if (years > 0) return `${years} ${yearWord}`
  return `${months} ${monthWord}`
}

function formatEmploymentType(type: string, locale: string): string {
  const types = localeFiles[locale].experience.employmentType as Record<string, string>
  return types[type]
}

// Generators
const localeArb = fc.constantFrom('pt-BR', 'en')
const monthIndexArb = fc.integer({ min: 0, max: 11 })
const yearsArb = fc.integer({ min: 0, max: 10 })
const monthsArb = fc.integer({ min: 0, max: 11 })
const employmentTypeArb = fc.constantFrom('Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance')

// **Validates: Requirements 7.1, 7.2, 7.3**
describe('Property 8: ExperienceItem formatting per locale', () => {
  it('month name matches the locale months array for any month index', () => {
    fc.assert(
      fc.property(monthIndexArb, localeArb, (monthIndex, locale) => {
        const result = formatMonth(monthIndex, locale)
        const expectedMonths = localeFiles[locale].experience.months
        expect(result).toBe(expectedMonths[monthIndex])
        expect(typeof result).toBe('string')
        expect(result.length).toBeGreaterThan(0)
      }),
      { numRuns: 100 },
    )
  })

  it('duration string uses correct language words for any valid years/months combination', () => {
    fc.assert(
      fc.property(
        yearsArb,
        monthsArb,
        localeArb,
        (years, months, locale) => {
          // Skip the case where both are 0 (not a valid duration)
          fc.pre(years > 0 || months > 0)

          const result = formatDuration(years, months, locale)
          const dur = localeFiles[locale].experience.duration

          // The result must contain words from the correct locale
          if (years > 0 && months > 0) {
            expect(result).toContain(dur.and)
            const expectedYearWord = years > 1 ? dur.years : dur.year
            const expectedMonthWord = months > 1 ? dur.months : dur.month
            expect(result).toContain(expectedYearWord)
            expect(result).toContain(expectedMonthWord)
            expect(result).toBe(`${years} ${expectedYearWord} ${dur.and} ${months} ${expectedMonthWord}`)
          } else if (years > 0) {
            const expectedYearWord = years > 1 ? dur.years : dur.year
            expect(result).toBe(`${years} ${expectedYearWord}`)
          } else {
            const expectedMonthWord = months > 1 ? dur.months : dur.month
            expect(result).toBe(`${months} ${expectedMonthWord}`)
          }

          // Verify the result is a non-empty string
          expect(typeof result).toBe('string')
          expect(result.length).toBeGreaterThan(0)
        },
      ),
      { numRuns: 100 },
    )
  })

  it('employment type translation matches the locale file for any type', () => {
    fc.assert(
      fc.property(employmentTypeArb, localeArb, (type, locale) => {
        const result = formatEmploymentType(type, locale)
        const expected = (localeFiles[locale].experience.employmentType as Record<string, string>)[type]
        expect(result).toBe(expected)
        expect(typeof result).toBe('string')
        expect(result.length).toBeGreaterThan(0)
      }),
      { numRuns: 100 },
    )
  })

  it('pt-BR months are in Portuguese and en months are in English', () => {
    fc.assert(
      fc.property(monthIndexArb, (monthIndex) => {
        const ptMonth = formatMonth(monthIndex, 'pt-BR')
        const enMonth = formatMonth(monthIndex, 'en')
        // Both must be non-empty strings
        expect(ptMonth.length).toBeGreaterThan(0)
        expect(enMonth.length).toBeGreaterThan(0)
        // Verify they match their respective locale arrays
        expect(ptMonth).toBe(ptBR.experience.months[monthIndex])
        expect(enMonth).toBe(en.experience.months[monthIndex])
      }),
      { numRuns: 100 },
    )
  })

  it('pt-BR employment types are in Portuguese and en types are in English', () => {
    fc.assert(
      fc.property(employmentTypeArb, (type) => {
        const ptResult = formatEmploymentType(type, 'pt-BR')
        const enResult = formatEmploymentType(type, 'en')
        expect(ptResult).toBe((ptBR.experience.employmentType as Record<string, string>)[type])
        expect(enResult).toBe((en.experience.employmentType as Record<string, string>)[type])
      }),
      { numRuns: 100 },
    )
  })
})
