# Documento de Requisitos — Math Easter Eggs

## Introdução

Este documento especifica os requisitos para a evolução dos easter eggs matemáticos no portfólio Nuxt.js. O componente atual (`MathEasterEgg.vue`) exibe fórmulas como "?" que revelam ao hover e possui um código secreto "math" via teclado. O objetivo é substituí-lo por um conjunto de 5 experiências interativas ricas: chuva de fórmulas estilo Matrix, fórmulas flutuantes com explicações, constelações matemáticas no SpaceBackground, calculadora escondida (terminal minimalista) e espiral de Fibonacci animada.

## Glossário

- **Sistema_EasterEgg**: Conjunto de componentes Vue 3 responsáveis por todas as interações de easter eggs matemáticos no portfólio
- **Chuva_De_Formulas**: Animação estilo Matrix onde equações matemáticas caem verticalmente pela tela
- **Formulas_Flutuantes**: Partículas flutuantes no fundo da página contendo fórmulas matemáticas
- **Tooltip_Animado**: Elemento de interface que aparece ao clicar numa fórmula flutuante, exibindo uma explicação curta com animação de entrada
- **Constelacao_Matematica**: Representação visual de fórmulas como estrelas no SpaceBackground, conectadas por linhas formando constelações
- **SpaceBackground**: Componente Three.js existente que renderiza o fundo espacial com estrelas, nebulosas e sistema solar
- **Terminal_Calculadora**: Console minimalista escondido que avalia expressões matemáticas digitadas pelo usuário
- **Espiral_Fibonacci**: Animação da espiral áurea que se desenha na tela com números de Fibonacci aparecendo ao longo dela
- **Konami_Code**: Sequência de teclas secreta (↑↑↓↓←→←→BA) que ativa a Chuva_De_Formulas
- **Avaliador_Expressoes**: Módulo que interpreta e calcula expressões matemáticas digitadas no Terminal_Calculadora de forma segura (sem uso de eval)

## Requisitos

### Requisito 1: Konami Code com Chuva de Fórmulas (Estilo Matrix)

**User Story:** Como visitante do portfólio, eu quero digitar o Konami Code e ver uma chuva de fórmulas matemáticas caindo pela tela estilo Matrix, para ter uma experiência visual surpreendente e divertida.

#### Critérios de Aceitação

1. WHEN o visitante digita a sequência Konami Code (↑↑↓↓←→←→BA), THE Sistema_EasterEgg SHALL ativar a animação Chuva_De_Formulas em tela cheia
2. WHILE a Chuva_De_Formulas está ativa, THE Sistema_EasterEgg SHALL renderizar equações matemáticas caindo verticalmente em colunas, com velocidades variadas e opacidade decrescente, usando cor verde (#00ff41) sobre fundo semi-transparente escuro
3. WHILE a Chuva_De_Formulas está ativa, THE Sistema_EasterEgg SHALL exibir pelo menos 8 fórmulas matemáticas distintas nas colunas de queda
4. WHEN a animação Chuva_De_Formulas está ativa por 8 segundos OU o visitante pressiona Escape, THE Sistema_EasterEgg SHALL encerrar a animação com um fade-out de 1 segundo
5. THE Sistema_EasterEgg SHALL detectar a sequência Konami Code independentemente de outras teclas pressionadas entre os caracteres da sequência, resetando após 3 segundos de inatividade
6. WHILE a Chuva_De_Formulas está ativa, THE Sistema_EasterEgg SHALL manter a interatividade da página subjacente bloqueada (overlay com pointer-events ativo)

### Requisito 2: Fórmulas Interativas Flutuantes com Explicações ao Clicar

**User Story:** Como visitante do portfólio, eu quero ver fórmulas matemáticas flutuando sutilmente no fundo da página e poder clicar nelas para ver uma explicação elegante, para descobrir curiosidades matemáticas de forma interativa.

#### Critérios de Aceitação

1. THE Formulas_Flutuantes SHALL renderizar pelo menos 6 fórmulas matemáticas como partículas flutuantes posicionadas aleatoriamente no fundo da página, com movimento lento e contínuo
2. THE Formulas_Flutuantes SHALL exibir cada fórmula com opacidade reduzida (entre 0.15 e 0.3) para não interferir na leitura do conteúdo principal
3. WHEN o visitante passa o mouse sobre uma fórmula flutuante, THE Formulas_Flutuantes SHALL aumentar a opacidade da fórmula para 0.8 com uma transição suave de 300ms
4. WHEN o visitante clica em uma fórmula flutuante, THE Sistema_EasterEgg SHALL exibir um Tooltip_Animado com uma explicação curta (máximo 2 frases) da fórmula, com animação de escala (de 0 a 1) em 400ms
5. WHEN o visitante clica fora do Tooltip_Animado ou pressiona Escape, THE Sistema_EasterEgg SHALL fechar o tooltip com animação de fade-out em 300ms
6. THE Formulas_Flutuantes SHALL movimentar cada fórmula em trajetória suave usando interpolação senoidal, com velocidade entre 0.2 e 0.5 pixels por frame
7. THE Formulas_Flutuantes SHALL fornecer explicações nos idiomas suportados (en, pt-BR) usando o sistema i18n existente
8. IF duas fórmulas flutuantes se sobrepõem, THEN THE Formulas_Flutuantes SHALL reposicionar a fórmula mais recente para evitar sobreposição

### Requisito 3: Fórmulas como Constelações no SpaceBackground

**User Story:** Como visitante do portfólio, eu quero ver fórmulas matemáticas aparecendo como estrelas no fundo espacial, conectadas por linhas formando constelações, para integrar a matemática ao tema visual do site.

#### Critérios de Aceitação

1. THE Constelacao_Matematica SHALL renderizar pelo menos 5 fórmulas como pontos luminosos (estrelas) dentro da cena Three.js do SpaceBackground
2. THE Constelacao_Matematica SHALL conectar as estrelas-fórmula com linhas semi-transparentes (opacidade 0.15) formando pelo menos 2 constelações distintas
3. WHEN o visitante passa o mouse próximo (raio de 80px) de uma estrela-fórmula, THE Constelacao_Matematica SHALL aumentar o brilho da estrela e das linhas conectadas com uma animação de glow pulsante
4. WHEN o visitante passa o mouse sobre uma estrela-fórmula, THE Constelacao_Matematica SHALL exibir o texto da fórmula em um label flutuante próximo à estrela
5. THE Constelacao_Matematica SHALL posicionar as constelações em regiões que não conflitem com o sistema solar existente no SpaceBackground
6. WHILE o tema claro está ativo, THE Constelacao_Matematica SHALL adaptar as cores das estrelas e linhas para manter visibilidade (usando tons escuros em vez de luminosos)

### Requisito 4: Calculadora Escondida (Terminal Minimalista)

**User Story:** Como visitante do portfólio, eu quero acessar uma calculadora escondida via atalho de teclado, onde posso digitar expressões matemáticas e ver resultados com animações, para interagir de forma lúdica com a matemática.

#### Critérios de Aceitação

1. WHEN o visitante pressiona Ctrl+Shift+M (ou Cmd+Shift+M no macOS), THE Sistema_EasterEgg SHALL exibir o Terminal_Calculadora com uma animação de slide-in a partir da parte inferior da tela em 400ms
2. THE Terminal_Calculadora SHALL exibir um campo de entrada com estilo de terminal (fonte monoespaçada, fundo escuro, texto verde) e um prompt ">" piscante
3. WHEN o visitante digita uma expressão matemática válida e pressiona Enter, THE Avaliador_Expressoes SHALL calcular o resultado e THE Terminal_Calculadora SHALL exibir o resultado com uma animação de digitação caractere por caractere
4. THE Avaliador_Expressoes SHALL suportar as operações: adição (+), subtração (-), multiplicação (*), divisão (/), potenciação (^), parênteses, e as constantes pi e e
5. IF o visitante digita uma expressão inválida, THEN THE Terminal_Calculadora SHALL exibir uma mensagem de erro estilizada ("Expressão inválida") com cor vermelha
6. THE Avaliador_Expressoes SHALL avaliar expressões de forma segura, sem utilizar eval() ou Function(), usando um parser matemático dedicado
7. WHEN o visitante pressiona Escape ou clica fora do Terminal_Calculadora, THE Sistema_EasterEgg SHALL fechar o terminal com animação de slide-out em 300ms
8. THE Terminal_Calculadora SHALL manter um histórico das últimas 10 expressões avaliadas na sessão, acessível com as setas ↑ e ↓
9. WHEN o visitante digita "help", THE Terminal_Calculadora SHALL exibir uma lista dos operadores e constantes suportados
10. THE Terminal_Calculadora SHALL ser acessível via teclado, com foco automático no campo de entrada ao abrir e retorno do foco ao elemento anterior ao fechar

### Requisito 5: Espiral de Fibonacci Animada

**User Story:** Como visitante do portfólio, eu quero ver uma espiral de Fibonacci animada que se desenha na tela quando ativada, com números aparecendo ao longo dela, para apreciar a beleza visual da sequência.

#### Critérios de Aceitação

1. WHEN o visitante digita a sequência "fibonacci" no teclado, THE Sistema_EasterEgg SHALL ativar a animação Espiral_Fibonacci em um overlay centralizado na tela
2. THE Espiral_Fibonacci SHALL desenhar a espiral áurea progressivamente usando Canvas 2D, completando o desenho em 4 segundos com easing suave
3. WHILE a espiral está sendo desenhada, THE Espiral_Fibonacci SHALL exibir os números de Fibonacci (1, 1, 2, 3, 5, 8, 13, 21, 34, 55) aparecendo sequencialmente nos vértices correspondentes dos quadrados da espiral
4. THE Espiral_Fibonacci SHALL desenhar os quadrados de Fibonacci com bordas semi-transparentes antes de desenhar o arco da espiral em cada seção
5. WHILE a Espiral_Fibonacci está ativa, THE Sistema_EasterEgg SHALL exibir o valor da razão áurea (φ ≈ 1.618) com animação de contagem incremental no canto da tela
6. WHEN a animação Espiral_Fibonacci completa o desenho OU o visitante pressiona Escape, THE Sistema_EasterEgg SHALL permitir o fechamento do overlay com fade-out em 1 segundo
7. THE Espiral_Fibonacci SHALL adaptar o tamanho da espiral ao viewport, mantendo proporções corretas em telas de 320px a 2560px de largura
