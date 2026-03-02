export interface ParseResult {
  success: boolean
  value: number
  error?: string
}

type TokenType = 'number' | 'operator' | 'lparen' | 'rparen' | 'constant' | 'unary_minus'

interface Token {
  type: TokenType
  value: string
  numericValue?: number
}

interface OperatorInfo {
  precedence: number
  associativity: 'left' | 'right'
  fn: (a: number, b: number) => number
}

const OPERATORS: Record<string, OperatorInfo> = {
  '+': { precedence: 1, associativity: 'left', fn: (a, b) => a + b },
  '-': { precedence: 1, associativity: 'left', fn: (a, b) => a - b },
  '*': { precedence: 2, associativity: 'left', fn: (a, b) => a * b },
  '/': { precedence: 2, associativity: 'left', fn: (a, b) => a / b },
  '^': { precedence: 3, associativity: 'right', fn: (a, b) => Math.pow(a, b) },
}

const UNARY_MINUS: OperatorInfo = {
  precedence: 4,
  associativity: 'right',
  fn: (_a, b) => -b,
}

const CONSTANTS: Record<string, number> = {
  pi: Math.PI,
  e: Math.E,
}

function tokenize(expression: string): Token[] {
  const tokens: Token[] = []
  let i = 0
  const expr = expression.replace(/\s+/g, '')

  while (i < expr.length) {
    const ch = expr[i]

    // Numbers (including decimals)
    if (ch >= '0' && ch <= '9' || ch === '.') {
      let num = ''
      let hasDot = false
      while (i < expr.length && ((expr[i] >= '0' && expr[i] <= '9') || expr[i] === '.')) {
        if (expr[i] === '.') {
          if (hasDot) throw new Error('Invalid number: multiple decimal points')
          hasDot = true
        }
        num += expr[i]
        i++
      }
      if (num === '.') throw new Error('Invalid number')
      tokens.push({ type: 'number', value: num, numericValue: parseFloat(num) })
      continue
    }

    // Constants (pi, e) — must check before single-char operators
    if (ch >= 'a' && ch <= 'z') {
      let word = ''
      while (i < expr.length && expr[i] >= 'a' && expr[i] <= 'z') {
        word += expr[i]
        i++
      }
      if (word in CONSTANTS) {
        tokens.push({ type: 'constant', value: word, numericValue: CONSTANTS[word] })
      } else {
        throw new Error(`Unknown identifier: ${word}`)
      }
      continue
    }

    // Parentheses
    if (ch === '(') {
      tokens.push({ type: 'lparen', value: '(' })
      i++
      continue
    }
    if (ch === ')') {
      tokens.push({ type: 'rparen', value: ')' })
      i++
      continue
    }

    // Operators
    if (ch in OPERATORS) {
      // Detect unary minus: at start, after operator, or after left paren
      if (ch === '-') {
        const prev = tokens[tokens.length - 1]
        if (!prev || prev.type === 'operator' || prev.type === 'unary_minus' || prev.type === 'lparen') {
          tokens.push({ type: 'unary_minus', value: '~' })
          i++
          continue
        }
      }
      tokens.push({ type: 'operator', value: ch })
      i++
      continue
    }

    throw new Error(`Unexpected character: ${ch}`)
  }

  return tokens
}

function toPostfix(tokens: Token[]): Token[] {
  const output: Token[] = []
  const opStack: Token[] = []

  for (const token of tokens) {
    if (token.type === 'number' || token.type === 'constant') {
      output.push(token)
    } else if (token.type === 'unary_minus') {
      opStack.push(token)
    } else if (token.type === 'operator') {
      const op = OPERATORS[token.value]
      while (opStack.length > 0) {
        const top = opStack[opStack.length - 1]
        if (top.type === 'lparen') break

        const topInfo = top.type === 'unary_minus' ? UNARY_MINUS : OPERATORS[top.value]
        if (!topInfo) break

        if (
          (op.associativity === 'left' && op.precedence <= topInfo.precedence) ||
          (op.associativity === 'right' && op.precedence < topInfo.precedence)
        ) {
          output.push(opStack.pop()!)
        } else {
          break
        }
      }
      opStack.push(token)
    } else if (token.type === 'lparen') {
      opStack.push(token)
    } else if (token.type === 'rparen') {
      while (opStack.length > 0 && opStack[opStack.length - 1].type !== 'lparen') {
        output.push(opStack.pop()!)
      }
      if (opStack.length === 0) {
        throw new Error('Mismatched parentheses')
      }
      opStack.pop() // remove the left paren
    }
  }

  while (opStack.length > 0) {
    const top = opStack.pop()!
    if (top.type === 'lparen') {
      throw new Error('Mismatched parentheses')
    }
    output.push(top)
  }

  return output
}

function evaluatePostfix(postfix: Token[]): number {
  const stack: number[] = []

  for (const token of postfix) {
    if (token.type === 'number' || token.type === 'constant') {
      stack.push(token.numericValue!)
    } else if (token.type === 'unary_minus') {
      if (stack.length < 1) throw new Error('Invalid expression')
      const a = stack.pop()!
      stack.push(-a)
    } else if (token.type === 'operator') {
      if (stack.length < 2) throw new Error('Invalid expression')
      const b = stack.pop()!
      const a = stack.pop()!
      const op = OPERATORS[token.value]
      if (!op) throw new Error(`Unknown operator: ${token.value}`)
      if (token.value === '/' && b === 0) throw new Error('Division by zero')
      stack.push(op.fn(a, b))
    }
  }

  if (stack.length !== 1) throw new Error('Invalid expression')
  return stack[0]
}

export function useExpressionParser(): { evaluate: (expression: string) => ParseResult } {
  const evaluate = (expression: string): ParseResult => {
    try {
      const trimmed = expression.trim()
      if (!trimmed) {
        return { success: false, value: 0, error: 'Empty expression' }
      }
      const tokens = tokenize(trimmed)
      if (tokens.length === 0) {
        return { success: false, value: 0, error: 'Empty expression' }
      }
      const postfix = toPostfix(tokens)
      const result = evaluatePostfix(postfix)

      if (!isFinite(result)) {
        return { success: false, value: 0, error: 'Result is not finite' }
      }

      return { success: true, value: result }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      return { success: false, value: 0, error: message }
    }
  }

  return { evaluate }
}
