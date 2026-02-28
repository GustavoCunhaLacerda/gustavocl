// Feature: english-version, Property 2: Fallback para pt-BR em chaves ausentes
import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import ptBR from '../locales/pt-BR.json'
import en from '../locales/en.json'

/**
 * Recursively extracts all leaf keys from a nested object, returning dot-separated paths.
 * Arrays are treated as leaf values (not recursed into).
 */
function extractKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const keys: string[] = []
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    const value = obj[key]
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      keys.push(...extractKeys(value as Record<string, unknown>, fullKey))
    } else {
      keys.push(fullKey)
    }
  }
  return keys
}

/**
 * Resolves a dot-separated key path against a nested object.
 * Returns undefined if the key does not exist.
 */
function resolveKey(obj: Record<string, unknown>, keyPath: string): unknown {
  const parts = keyPath.split('.')
  let current: unknown = obj
  for (const part of parts) {
    if (current === null || typeof current !== 'object') return undefined
    current = (current as Record<string, unknown>)[part]
  }
  return current
}

// Validates: Requirement 2.4
describe('Property 2: Fallback to pt-BR on missing keys', () => {
  const ptBRKeys = extractKeys(ptBR as Record<string, unknown>)

  it('nuxt.config.ts must have fallbackLocale set to pt-BR', () => {
    const configContent = readFileSync(
      resolve(__dirname, '..', 'nuxt.config.ts'),
      'utf-8'
    )
    expect(configContent).toContain("fallbackLocale: 'pt-BR'")
  })

  it('every leaf value in pt-BR.json must be a non-empty string or a non-empty array (so fallback always provides content)', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...ptBRKeys),
        (key: string) => {
          const value = resolveKey(ptBR as Record<string, unknown>, key)
          if (Array.isArray(value)) {
            expect(value.length).toBeGreaterThan(0)
          } else {
            expect(typeof value).toBe('string')
            expect((value as string).trim().length).toBeGreaterThan(0)
          }
        }
      ),
      { numRuns: Math.max(100, ptBRKeys.length) }
    )
  })

  it('every key in pt-BR.json must also exist in en.json (ensuring fallback is only needed for truly missing keys)', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...ptBRKeys),
        (key: string) => {
          const enValue = resolveKey(en as Record<string, unknown>, key)
          expect(enValue).not.toBeUndefined()
        }
      ),
      { numRuns: Math.max(100, ptBRKeys.length) }
    )
  })
})
