# Plano de Implementação: Versão em Inglês (i18n)

## Visão Geral

Implementação incremental de internacionalização no portfólio Nuxt 3 usando `@nuxtjs/i18n`. Cada tarefa constrói sobre a anterior, começando pela infraestrutura do módulo, passando pelos arquivos de tradução, componentes atualizados, e finalizando com SEO e testes.

## Tarefas

- [x] 1. Instalar e configurar o módulo @nuxtjs/i18n
  - [x] 1.1 Instalar o pacote `@nuxtjs/i18n` via npm
    - Adicionar `@nuxtjs/i18n` como dependência do projeto
    - _Requisitos: 1.1_

  - [x] 1.2 Configurar o módulo i18n no `nuxt.config.ts`
    - Adicionar `@nuxtjs/i18n` ao array `modules`
    - Configurar `locales` com `pt-BR` (padrão) e `en`, cada um apontando para seu arquivo JSON
    - Definir `defaultLocale: 'pt-BR'`, `fallbackLocale: 'pt-BR'`, `lazy: true`, `langDir: 'locales/'`, `strategy: 'no_prefix'`
    - Configurar `detectBrowserLanguage` com `useCookie: false`
    - _Requisitos: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Criar arquivos de tradução para conteúdo estático
  - [x] 2.1 Criar `locales/pt-BR.json` com todas as chaves de tradução
    - Incluir chaves para: `nav` (Início, Sobre, Experiência, Projetos, Contato), `hero` (botões e roles), `about` (título), `experience` (título, subtítulo, present, expandMore/Less, months, duration, employmentType), `projects` (título, featured, openSource, research), `contact` (título, texto, sendEmail), `footer` (easterEggHint), `seo` (title, description)
    - Manter os textos atuais em português sem alteração
    - _Requisitos: 2.1, 2.2_

  - [x] 2.2 Criar `locales/en.json` com traduções em inglês
    - Traduzir todas as chaves do `pt-BR.json` para inglês
    - Incluir meses em inglês (Jan, Feb, Mar...), durações (year/years, month/months, and), tipos de emprego (Full-time, Part-time, Contract, Internship, Freelance)
    - _Requisitos: 2.3, 2.4_

  - [x] 2.3 Escrever teste de propriedade para completude das chaves
    - **Propriedade 1: Completude das chaves de tradução**
    - **Valida: Requisitos 2.1, 2.3**

- [x] 3. Adicionar traduções de conteúdo de dados (JSON)
  - [x] 3.1 Adicionar chaves `data` nos arquivos de tradução para conteúdo dinâmico
    - Adicionar em `pt-BR.json`: `data.summary`, `data.positions.{key}.title`, `data.positions.{key}.description`, `data.featuredProjects.{key}.description` com os textos originais em português
    - Adicionar em `en.json`: as mesmas chaves com traduções em inglês
    - Usar mapeamento de chaves: dataprev, medware, xpbox, tcu, ifb para posições; calculadoras-medware, moneysuite, simp-tcu, deep-fake-detection para projetos
    - _Requisitos: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 3.2 Criar composable `composables/useLocaleData.ts`
    - Implementar funções: `getProjectDescription(projectKey)`, `getPositionTitle(positionKey)`, `getPositionDescription(positionKey)`, `getSummary()`
    - Usar `useI18n()` para acessar `t()` e `locale`
    - _Requisitos: 3.1, 3.2, 3.3, 3.4_

  - [x] 3.3 Escrever teste de propriedade para conteúdo de dados por locale
    - **Propriedade 3: Conteúdo de dados por locale**
    - **Valida: Requisitos 3.1, 3.3, 3.4, 3.5**

- [x] 4. Checkpoint — Verificar infraestrutura i18n
  - Garantir que o módulo i18n carrega corretamente, os arquivos de tradução são válidos e o composable funciona. Perguntar ao usuário se há dúvidas.

- [x] 5. Criar componente LanguageSelector e integrar na NavBar
  - [x] 5.1 Criar `components/LanguageSelector.vue`
    - Implementar botão que alterna entre `pt-BR` e `en` usando `setLocale()` do `@nuxtjs/i18n`
    - Exibir o código do idioma alternativo (EN quando ativo pt-BR, PT quando ativo en)
    - Adicionar `aria-label` dinâmico descritivo e suporte a navegação por teclado
    - Estilizar com classes consistentes ao design do site
    - _Requisitos: 4.1, 4.2, 4.4, 4.5_

  - [x] 5.2 Integrar LanguageSelector na `components/NavBar.vue`
    - Adicionar o componente na NavBar ao lado dos links de navegação (desktop)
    - Adicionar o componente dentro do menu mobile (hamburger) junto aos links
    - Substituir as labels hardcoded dos links por chamadas `$t('nav.home')`, `$t('nav.about')`, etc.
    - _Requisitos: 4.1, 4.3, 8.1, 8.2, 8.3_

  - [x] 5.3 Escrever testes unitários para LanguageSelector
    - Testar renderização correta, indicação de idioma ativo, acessibilidade (aria-label, teclado)
    - _Requisitos: 4.1, 4.4, 4.5_

  - [x] 5.4 Escrever teste de propriedade para toggle de locale round-trip
    - **Propriedade 4: Toggle de locale é round-trip**
    - **Valida: Requisito 4.2**

- [x] 6. Atualizar componentes para usar traduções ($t)
  - [x] 6.1 Atualizar `components/HeroSection.vue`
    - Substituir textos dos botões por `$t('hero.viewProjects')` e `$t('hero.contact')`
    - Substituir array `roles` hardcoded por `$tm('hero.roles')` do i18n, reativo ao locale
    - _Requisitos: 2.1, 7.5_

  - [x] 6.2 Atualizar `components/AboutSection.vue`
    - Substituir título por `$t('about.title')`
    - Usar `useLocaleData().getSummary()` para o resumo profissional
    - _Requisitos: 2.1, 3.2_

  - [x] 6.3 Atualizar `components/ExperienceSection.vue` e `components/ExperienceItem.vue`
    - Substituir título e subtítulo por `$t('experience.title')` e `$t('experience.subtitle', { years })`
    - Substituir array `months` hardcoded por `$tm('experience.months')`
    - Substituir mapa `translateType` por lookup em `$t('experience.employmentType.*')`
    - Substituir lógica de duração para usar chaves `$t('experience.duration.*')`
    - Substituir "Presente" por `$t('experience.present')`
    - Substituir "Ver mais"/"Ver menos" por `$t('experience.expandMore')`/`$t('experience.expandLess')`
    - Usar `useLocaleData()` para títulos e descrições de posições traduzidos
    - _Requisitos: 2.1, 3.3, 3.4, 7.1, 7.2, 7.3, 7.4_

  - [x] 6.4 Atualizar `components/ContactSection.vue`
    - Substituir título, parágrafo e botão por `$t('contact.title')`, `$t('contact.text')`, `$t('contact.sendEmail')`
    - _Requisitos: 2.1_

  - [x] 6.5 Atualizar `components/FooterSection.vue`
    - Substituir dica do easter egg por `$t('footer.easterEggHint')`
    - _Requisitos: 2.1_

  - [x] 6.6 Atualizar `components/ProjectsSection.vue` e `components/FeaturedProjectCard.vue`
    - Substituir títulos de categoria por `$t('projects.featured')`, `$t('projects.openSource')`
    - Substituir "Pesquisa" por `$t('projects.research')` no FeaturedProjectCard
    - Usar `useLocaleData().getProjectDescription()` para descrições de projetos em destaque
    - _Requisitos: 2.1, 3.1, 7.6_

  - [x] 6.7 Escrever teste de propriedade para formatação do ExperienceItem por locale
    - **Propriedade 8: Formatação do ExperienceItem por locale**
    - **Valida: Requisitos 7.1, 7.2, 7.3**

  - [x] 6.8 Escrever teste de propriedade para roles do efeito de digitação por locale
    - **Propriedade 9: Roles do efeito de digitação por locale**
    - **Valida: Requisito 7.5**

- [x] 7. Checkpoint — Verificar troca de idioma nos componentes
  - Garantir que todos os componentes exibem textos traduzidos ao alternar idioma, sem recarregamento de página. Perguntar ao usuário se há dúvidas.

- [x] 8. Implementar persistência de preferência de idioma
  - [x] 8.1 Configurar persistência via localStorage
    - Salvar locale selecionado no localStorage ao trocar idioma
    - Recuperar locale do localStorage ao inicializar o app
    - Usar `pt-BR` como fallback quando localStorage estiver vazio ou indisponível
    - _Requisitos: 5.1, 5.2, 5.3_

  - [x] 8.2 Escrever teste de propriedade para persistência round-trip
    - **Propriedade 5: Persistência de locale é round-trip**
    - **Valida: Requisitos 5.1, 5.2**

- [x] 9. Atualizar plugin SEO para suporte i18n
  - [x] 9.1 Atualizar `plugins/seo.js` para reagir ao locale ativo
    - Usar `useI18n()` para obter locale e traduções de SEO
    - Atualizar `document.documentElement.lang` dinamicamente conforme locale ativo
    - Atualizar `og:title`, `og:description`, `twitter:title`, `twitter:description` com valores traduzidos via `$t('seo.title')` e `$t('seo.description')`
    - Adicionar tags `<link rel="alternate" hreflang="pt-BR">` e `<link rel="alternate" hreflang="en">`
    - _Requisitos: 6.1, 6.2, 6.3, 6.4_

  - [x] 9.2 Escrever teste de propriedade para atributo lang do HTML
    - **Propriedade 6: Atributo lang do HTML corresponde ao locale ativo**
    - **Valida: Requisitos 6.1, 6.2**

  - [x] 9.3 Escrever teste de propriedade para meta tags SEO
    - **Propriedade 7: Meta tags SEO correspondem ao locale ativo**
    - **Valida: Requisito 6.3**

  - [x] 9.4 Escrever testes unitários para tags hreflang alternate
    - Verificar presença de `<link rel="alternate" hreflang="pt-BR">` e `<link rel="alternate" hreflang="en">`
    - _Requisitos: 6.4_

- [x] 10. Testes de fallback e edge cases
  - [x] 10.1 Escrever teste de propriedade para fallback em chaves ausentes
    - **Propriedade 2: Fallback para pt-BR em chaves ausentes**
    - **Valida: Requisito 2.4**

  - [x] 10.2 Escrever testes unitários para edge cases
    - Testar locale padrão quando localStorage está vazio (Requisito 5.3)
    - Testar "Present"/"Presente" para posições atuais (Requisito 7.4)
    - Testar "Research"/"Pesquisa" para projetos de pesquisa (Requisito 7.6)
    - Testar conteúdo do `pt-BR.json` corresponde aos textos atuais (Requisito 2.2)
    - _Requisitos: 2.2, 5.3, 7.4, 7.6_

- [x] 11. Checkpoint final — Garantir que todos os testes passam
  - Garantir que todos os testes passam, verificar que a troca de idioma funciona em todos os componentes e resoluções. Perguntar ao usuário se há dúvidas.

## Notas

- Tarefas marcadas com `*` são opcionais e podem ser puladas para um MVP mais rápido
- Cada tarefa referencia requisitos específicos para rastreabilidade
- Checkpoints garantem validação incremental
- Testes de propriedade validam propriedades universais de corretude (fast-check + Vitest)
- Testes unitários validam exemplos específicos e edge cases
