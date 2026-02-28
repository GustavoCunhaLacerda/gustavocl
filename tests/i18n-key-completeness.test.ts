// Feature: english-version, Property 1: Completude das chaves de tradução
import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import ptBR from '../locales/pt-BR.json'
import en from '../locales/en.json'

/**
 * Recursively extracts all keys from a nested object, returning dot-separated paths.
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

// Validates: Requirements 2.1, 2.3
describe('Property 1: Translation key completeness', () => {
  const ptBRKeys = extractKeys(ptBR as Record<string, unknown>)

  it('every key in pt-BR.json must also exist in en.json', () => {
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
