# Documento de Requisitos — Versão em Inglês (i18n)

## Introdução

Este documento descreve os requisitos para adicionar suporte a internacionalização (i18n) ao portfólio pessoal construído com Nuxt 3, permitindo que o site seja exibido em Português (idioma padrão) e Inglês. O objetivo é alcançar recrutadores e empresas internacionais, mantendo a experiência atual para visitantes brasileiros.

## Glossário

- **Sistema_i18n**: Módulo de internacionalização integrado ao Nuxt 3 responsável por gerenciar traduções, detecção de idioma e troca de locale
- **Locale**: Identificador de idioma (ex: `pt-BR`, `en`)
- **Seletor_de_Idioma**: Componente de interface que permite ao visitante alternar entre os idiomas disponíveis
- **Arquivo_de_Tradução**: Arquivo JSON contendo os pares chave-valor de tradução para um locale específico
- **NavBar**: Componente de navegação principal do site
- **SEO_Plugin**: Plugin existente que configura meta tags Open Graph, Twitter Card e demais metadados de SEO
- **Conteúdo_Estático**: Textos fixos presentes nos componentes Vue (labels, títulos, botões, parágrafos)
- **Conteúdo_de_Dados**: Textos provenientes dos arquivos JSON de dados (featured_projects.json, linkedin_profile.json)

## Requisitos

### Requisito 1: Configuração do módulo i18n no Nuxt

**User Story:** Como desenvolvedor, eu quero integrar um módulo de i18n ao projeto Nuxt 3, para que o site suporte múltiplos idiomas de forma estruturada.

#### Critérios de Aceitação

1. THE Sistema_i18n SHALL registrar os locales `pt-BR` (padrão) e `en` na configuração do Nuxt
2. THE Sistema_i18n SHALL carregar os Arquivos_de_Tradução correspondentes ao locale ativo
3. THE Sistema_i18n SHALL definir `pt-BR` como locale padrão (fallback)
4. WHEN o projeto é compilado, THE Sistema_i18n SHALL incluir as traduções de ambos os locales no bundle final

### Requisito 2: Arquivos de tradução para conteúdo estático

**User Story:** Como desenvolvedor, eu quero organizar todas as strings traduzíveis em arquivos de tradução separados por idioma, para que a manutenção e adição de novos textos seja simples.

#### Critérios de Aceitação

1. THE Arquivo_de_Tradução SHALL conter chaves para todos os textos estáticos dos componentes: NavBar (Início, Sobre, Experiência, Projetos, Contato), HeroSection (botões "Ver Projetos", "Contato"), AboutSection (título "Sobre Mim"), ExperienceSection (título, subtítulo, labels de duração e tipo de emprego), ContactSection (título, parágrafo, botão "Enviar e-mail"), FooterSection (dica do easter egg) e ProjectsSection (títulos de categoria "Destaques", "Open Source")
2. THE Arquivo_de_Tradução para `pt-BR` SHALL conter os textos atuais em português sem alteração de conteúdo
3. THE Arquivo_de_Tradução para `en` SHALL conter traduções equivalentes em inglês para todas as chaves existentes no arquivo `pt-BR`
4. WHEN uma chave de tradução não existir no locale ativo, THE Sistema_i18n SHALL exibir o valor correspondente do locale `pt-BR` (fallback)

### Requisito 3: Tradução do conteúdo de dados (JSON)

**User Story:** Como visitante internacional, eu quero ver as descrições de projetos e experiências profissionais em inglês, para que eu compreenda o portfólio sem barreira de idioma.

#### Critérios de Aceitação

1. WHEN o locale ativo for `en`, THE Sistema_i18n SHALL exibir versões em inglês das descrições dos projetos em destaque (featured_projects.json)
2. WHEN o locale ativo for `en`, THE Sistema_i18n SHALL exibir uma versão em inglês do resumo profissional (summary) do linkedin_profile.json
3. WHEN o locale ativo for `en`, THE Sistema_i18n SHALL exibir versões em inglês das descrições de cada posição profissional (position.description) do linkedin_profile.json
4. WHEN o locale ativo for `en`, THE Sistema_i18n SHALL exibir os títulos de cargo (position.title) traduzidos para inglês
5. WHEN o locale ativo for `pt-BR`, THE Sistema_i18n SHALL exibir os dados originais em português sem modificação

### Requisito 4: Seletor de idioma na interface

**User Story:** Como visitante do site, eu quero poder alternar entre português e inglês, para que eu visualize o conteúdo no idioma de minha preferência.

#### Critérios de Aceitação

1. THE Seletor_de_Idioma SHALL ser exibido na NavBar de forma visível e acessível
2. WHEN o visitante clicar no Seletor_de_Idioma, THE Sistema_i18n SHALL alternar o locale ativo entre `pt-BR` e `en`
3. WHEN o locale for alterado, THE Sistema_i18n SHALL atualizar todos os textos da página sem recarregamento completo (client-side)
4. THE Seletor_de_Idioma SHALL indicar visualmente qual idioma está ativo no momento
5. THE Seletor_de_Idioma SHALL ser acessível via teclado e possuir atributos aria-label descritivos

### Requisito 5: Persistência da preferência de idioma

**User Story:** Como visitante recorrente, eu quero que o site lembre meu idioma preferido, para que eu não precise selecionar o idioma toda vez que acesso o portfólio.

#### Critérios de Aceitação

1. WHEN o visitante selecionar um idioma, THE Sistema_i18n SHALL armazenar a preferência no localStorage do navegador
2. WHEN o visitante retornar ao site, THE Sistema_i18n SHALL carregar o locale previamente armazenado no localStorage
3. IF nenhuma preferência estiver armazenada, THEN THE Sistema_i18n SHALL utilizar o locale padrão `pt-BR`

### Requisito 6: SEO e meta tags por idioma

**User Story:** Como dono do portfólio, eu quero que as meta tags de SEO reflitam o idioma ativo, para que mecanismos de busca indexem corretamente cada versão do site.

#### Critérios de Aceitação

1. WHEN o locale ativo for `pt-BR`, THE SEO_Plugin SHALL definir o atributo `lang="pt-BR"` no elemento HTML e meta tags com conteúdo em português
2. WHEN o locale ativo for `en`, THE SEO_Plugin SHALL definir o atributo `lang="en"` no elemento HTML e meta tags com conteúdo em inglês
3. THE SEO_Plugin SHALL incluir meta tags `og:title` e `og:description` traduzidas conforme o locale ativo
4. THE SEO_Plugin SHALL incluir tags `<link rel="alternate" hreflang="pt-BR">` e `<link rel="alternate" hreflang="en">` para indicar versões alternativas aos mecanismos de busca

### Requisito 7: Tradução de elementos dinâmicos e formatação

**User Story:** Como visitante, eu quero que textos dinâmicos como datas, durações e tipos de emprego sejam exibidos no idioma correto, para que a experiência seja consistente.

#### Critérios de Aceitação

1. WHEN o locale ativo for `en`, THE ExperienceItem SHALL exibir os nomes dos meses em inglês (Jan, Feb, Mar, etc.)
2. WHEN o locale ativo for `en`, THE ExperienceItem SHALL exibir durações em inglês (ex: "1 year and 3 months" em vez de "1 ano e 3 meses")
3. WHEN o locale ativo for `en`, THE ExperienceItem SHALL exibir tipos de emprego em inglês (ex: "Full-time" em vez de "Tempo integral")
4. WHEN o locale ativo for `en`, THE ExperienceItem SHALL exibir "Present" em vez de "Presente" para posições atuais
5. WHEN o locale ativo for `en`, THE HeroSection SHALL exibir os roles do efeito de digitação em inglês
6. WHEN o locale ativo for `en`, THE FeaturedProjectCard SHALL exibir "Research" em vez de "Pesquisa" para projetos do tipo research

### Requisito 8: Responsividade do seletor de idioma

**User Story:** Como visitante mobile, eu quero que o seletor de idioma funcione corretamente em telas pequenas, para que eu consiga trocar o idioma em qualquer dispositivo.

#### Critérios de Aceitação

1. WHILE a tela tiver largura menor que 768px, THE Seletor_de_Idioma SHALL ser exibido dentro do menu mobile (hamburger) junto aos links de navegação
2. WHILE a tela tiver largura maior ou igual a 768px, THE Seletor_de_Idioma SHALL ser exibido na NavBar ao lado dos links de navegação
3. THE Seletor_de_Idioma SHALL manter funcionalidade e legibilidade em todas as resoluções de tela
