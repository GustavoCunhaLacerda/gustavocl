export interface MathFormula {
  id: string
  text: string
  explanationKey: string
  category: 'calculus' | 'algebra' | 'geometry' | 'physics' | 'probability' | 'sequence'
}

export const MATH_FORMULAS: MathFormula[] = [
  { id: 'euler', text: 'e^{iπ} + 1 = 0', explanationKey: 'mathEggs.euler', category: 'algebra' },
  { id: 'gaussian', text: '∫₀^∞ e^{-x²}dx = √π/2', explanationKey: 'mathEggs.gaussian', category: 'calculus' },
  { id: 'fibonacci', text: 'Fₙ = Fₙ₋₁ + Fₙ₋₂', explanationKey: 'mathEggs.fibonacci', category: 'sequence' },
  { id: 'basel', text: 'Σ 1/n² = π²/6', explanationKey: 'mathEggs.basel', category: 'calculus' },
  { id: 'euler-limit', text: 'lim(1+1/n)ⁿ = e', explanationKey: 'mathEggs.eulerLimit', category: 'calculus' },
  { id: 'pythagoras', text: 'a² + b² = c²', explanationKey: 'mathEggs.pythagoras', category: 'geometry' },
  { id: 'maxwell', text: '∇×E = -∂B/∂t', explanationKey: 'mathEggs.maxwell', category: 'physics' },
  { id: 'bayes', text: 'P(A|B) = P(B|A)P(A)/P(B)', explanationKey: 'mathEggs.bayes', category: 'probability' },
  { id: 'golden-ratio', text: 'φ = (1+√5)/2', explanationKey: 'mathEggs.goldenRatio', category: 'algebra' },
  { id: 'quadratic', text: 'x = (-b±√(b²-4ac))/2a', explanationKey: 'mathEggs.quadratic', category: 'algebra' },
]

export const KONAMI_SEQUENCE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
]

export const FIBONACCI_SEQUENCE = ['f', 'i', 'b', 'o', 'n', 'a', 'c', 'c', 'i']

export const FIBONACCI_NUMBERS = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55]
