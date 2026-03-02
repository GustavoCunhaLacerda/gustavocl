# Plano de Implementação: Math Easter Eggs

## Visão Geral

Substituir o componente monolítico `MathEasterEgg.vue` por um sistema de 5 experiências interativas matemáticas, construído com composables reutilizáveis, dados centralizados e componentes Vue 3 independentes orquestrados por `MathEasterEggs.vue`.

## Tasks

- [x] 1. Criar infraestrutura compartilhada (dados e composables)
  - [x] 1.1 Criar `utils/mathFormulas.ts` com fórmulas, sequências e constantes
    - Definir interface `MathFormula` e array `MATH_FORMULAS` com pelo menos 10 fórmulas
    - Exportar `KONAMI_SEQUENCE`, `FIBONACCI_SEQUENCE` e `FIBONACCI_NUMBERS`
    - _Requisitos: 1.3, 2.1, 5.3_

  - [x] 1.2 Criar composable `composables/useKeySequence.ts`
    - Aceitar `targetSequence: string[]` e `options: { timeout?: number, ignoreOtherKeys?: boolean }`
    - Retornar `{ triggered: Ref<boolean>, reset: () => void }`
    - Registrar listener de keydown no onMounted, remover no onUnmounted
    - Resetar progresso após timeout (default 3000ms) de inatividade
    - Ignorar teclas fora da sequência quando `ignoreOtherKeys` é true
    - _Requisitos: 1.1, 1.5, 5.1_

  - [ ]* 1.3 Escrever testes unitários para `useKeySequence`
    - Testar detecção completa da sequência Konami Code
    - Testar reset por timeout de inatividade
    - Testar que teclas intermediárias são ignoradas quando `ignoreOtherKeys` é true
    - _Requisitos: 1.1, 1.5_

  - [x] 1.4 Criar composable `composables/useExpressionParser.ts`
    - Implementar tokenizer para números, operadores (`+`, `-`, `*`, `/`, `^`), parênteses e constantes (`pi`, `e`)
    - Implementar Shunting-Yard algorithm para converter infix para postfix
    - Implementar avaliador de pilha postfix
    - Retornar `{ evaluate: (expr: string) => ParseResult }` com `ParseResult = { success, value, error? }`
    - Não usar `eval()`, `Function()` ou `new Function()`
    - _Requisitos: 4.4, 4.6_

  - [ ]* 1.5 Escrever testes para `useExpressionParser`
    - **Propriedade 1: Operações aritméticas básicas produzem resultados corretos**
    - **Valida: Requisitos 4.4, 4.6**
    - Testar precedência de operadores e associatividade
    - Testar constantes `pi` e `e`
    - Testar expressões inválidas retornam `success: false`
    - _Requisitos: 4.4, 4.5, 4.6_

  - [x] 1.6 Adicionar chaves i18n em `locales/pt-BR.json` e `locales/en.json`
    - Adicionar bloco `mathEggs` com explicações das 10 fórmulas em ambos os idiomas
    - Adicionar sub-bloco `mathEggs.calculator` com `help`, `invalidExpression` e `placeholder`
    - _Requisitos: 2.7, 4.5, 4.9_

- [x] 2. Checkpoint — Verificar infraestrutura base
  - Garantir que todos os testes passam, perguntar ao usuário se houver dúvidas.

- [x] 3. Implementar Chuva de Fórmulas (Konami Code) e Orquestrador
  - [x] 3.1 Criar `components/KonamiRain.vue`
    - Receber prop `active: boolean`, emitir evento `close`
    - Criar canvas fullscreen com fundo `rgba(0,0,0,0.9)` e `pointer-events: all`
    - Renderizar colunas de fórmulas caindo em verde `#00ff41` com velocidades variadas e opacidade decrescente
    - Usar pelo menos 8 fórmulas distintas de `mathFormulas.ts`
    - Auto-encerrar após 8 segundos ou ao pressionar Escape, com fade-out de 1 segundo
    - Limpar canvas e animationFrame no onUnmounted
    - _Requisitos: 1.1, 1.2, 1.3, 1.4, 1.6_

  - [x] 3.2 Criar `components/MathEasterEggs.vue` (orquestrador)
    - Usar `useKeySequence` para detectar Konami Code e sequência "fibonacci"
    - Montar `KonamiRain`, `FloatingFormulas`, `CalculatorTerminal`, `FibonacciSpiral` com v-if controlado por estado reativo
    - Detectar `Ctrl+Shift+M` / `Cmd+Shift+M` para ativar calculadora
    - _Requisitos: 1.1, 4.1, 5.1_

  - [x] 3.3 Atualizar `app.vue` para usar `MathEasterEggs` em vez de `MathEasterEgg`
    - Substituir import e uso de `MathEasterEgg` por `MathEasterEggs`
    - _Requisitos: 1.1_

  - [ ]* 3.4 Escrever testes unitários para `KonamiRain.vue`
    - Testar que o canvas é criado quando `active` é true
    - Testar que o evento `close` é emitido ao pressionar Escape
    - _Requisitos: 1.4, 1.6_

- [x] 4. Implementar Fórmulas Flutuantes
  - [x] 4.1 Criar `components/FloatingFormulas.vue`
    - Renderizar ≥6 fórmulas com `position: fixed`, opacidade entre 0.15 e 0.3
    - Movimento senoidal contínuo (0.2–0.5 px/frame) via `requestAnimationFrame`
    - Hover: opacidade → 0.8 com transição CSS de 300ms
    - Click: tooltip com explicação i18n, animação scale 0→1 em 400ms
    - Click fora ou Escape: fechar tooltip com fade-out 300ms
    - Detecção de sobreposição de bounding boxes ao posicionar
    - Usar `useI18n()` para textos das explicações
    - _Requisitos: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_

  - [ ]* 4.2 Escrever testes unitários para `FloatingFormulas.vue`
    - Testar que pelo menos 6 fórmulas são renderizadas
    - Testar que tooltip aparece ao clicar numa fórmula
    - Testar que tooltip fecha ao pressionar Escape
    - _Requisitos: 2.1, 2.4, 2.5_

- [x] 5. Implementar Constelações Matemáticas no SpaceBackground
  - [x] 5.1 Criar `utils/mathConstellations.ts`
    - Exportar função `addMathConstellations(scene, camera, renderer)` que retorna `{ constellations, update, dispose, updateTheme }`
    - Criar ≥5 estrelas-fórmula como `THREE.Points` com glow
    - Conectar com `THREE.Line` semi-transparentes (opacidade 0.15) em ≥2 constelações
    - Implementar hover via raycaster (raio 80px): glow pulsante na estrela e linhas conectadas
    - Exibir label flutuante com texto da fórmula no hover direto
    - Posicionar constelações evitando região do sistema solar (x>50, y<0, z<-100)
    - Implementar `updateTheme(isLight)` para adaptar cores ao tema claro
    - _Requisitos: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [x] 5.2 Integrar `mathConstellations` no `SpaceBackground.vue`
    - Chamar `addMathConstellations` após `initThree`
    - Chamar `update(mouseX, mouseY)` no loop `animate`
    - Chamar `dispose()` no `onUnmounted`
    - Observar mudanças de tema e chamar `updateTheme`
    - _Requisitos: 3.1, 3.5, 3.6_

  - [ ]* 5.3 Escrever testes unitários para `mathConstellations.ts`
    - Testar que pelo menos 5 estrelas e 2 constelações são criadas
    - Testar que `dispose` remove objetos da cena
    - _Requisitos: 3.1, 3.2_

- [x] 6. Checkpoint — Verificar componentes visuais
  - Garantir que todos os testes passam, perguntar ao usuário se houver dúvidas.

- [x] 7. Implementar Calculadora Terminal
  - [x] 7.1 Criar `components/CalculatorTerminal.vue`
    - Receber prop `active: boolean`, emitir evento `close`
    - Slide-in de baixo em 400ms, slide-out em 300ms (CSS transitions)
    - Estilo terminal: fonte monoespaçada, fundo escuro, texto verde `#00ff41`, prompt `>` piscante
    - Usar `useExpressionParser` para avaliar expressões ao pressionar Enter
    - Animação de digitação caractere por caractere no resultado
    - Expressão inválida: mensagem em vermelho usando chave i18n `mathEggs.calculator.invalidExpression`
    - Comando "help": exibir lista de operadores usando chave i18n `mathEggs.calculator.help`
    - Histórico das últimas 10 expressões, navegável com ↑↓
    - Escape ou click fora: emitir `close`
    - Foco automático no input ao abrir, restaurar foco anterior ao fechar
    - _Requisitos: 4.1, 4.2, 4.3, 4.5, 4.7, 4.8, 4.9, 4.10_

  - [ ]* 7.2 Escrever testes unitários para `CalculatorTerminal.vue`
    - Testar que input recebe foco ao montar com `active: true`
    - Testar que expressão válida exibe resultado
    - Testar que expressão inválida exibe mensagem de erro
    - Testar navegação de histórico com setas ↑↓
    - _Requisitos: 4.3, 4.5, 4.8, 4.10_

- [x] 8. Implementar Espiral de Fibonacci
  - [x] 8.1 Criar `components/FibonacciSpiral.vue`
    - Receber prop `active: boolean`, emitir evento `close`
    - Overlay centralizado com Canvas 2D
    - Desenhar espiral áurea progressivamente em 4 segundos com easing suave
    - Desenhar quadrados de Fibonacci com bordas semi-transparentes antes do arco
    - Exibir números (1,1,2,3,5,8,13,21,34,55) nos vértices dos quadrados
    - Exibir razão áurea (φ ≈ 1.618) com animação de contagem incremental no canto
    - Escape ou fim da animação: fade-out de 1 segundo, emitir `close`
    - Responsivo: adaptar tamanho ao viewport (320px a 2560px)
    - _Requisitos: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

  - [ ]* 8.2 Escrever testes unitários para `FibonacciSpiral.vue`
    - Testar que canvas é criado quando `active` é true
    - Testar que evento `close` é emitido ao pressionar Escape
    - _Requisitos: 5.6_

- [x] 9. Checkpoint final — Verificar integração completa
  - Garantir que todos os testes passam, perguntar ao usuário se houver dúvidas.

## Notas

- Tasks marcadas com `*` são opcionais e podem ser puladas para um MVP mais rápido
- Cada task referencia requisitos específicos para rastreabilidade
- Checkpoints garantem validação incremental
- O projeto usa Vitest com happy-dom e fast-check já está disponível como dependência
- Todos os componentes são client-only (SPA) — não precisam de SSR
