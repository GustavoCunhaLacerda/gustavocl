# Tarefas de Implementação: Resume Download

## 1. Configuração e Dependências
- [x] 1.1 Instalar a dependência `jspdf` no projeto (`npm install jspdf`)
- [x] 1.2 Adicionar as chaves i18n necessárias em `locales/en.json` (`hero.downloadCV`, `hero.generating`, `resume.sections.*`, `resume.present`, `resume.error`)
- [x] 1.3 Adicionar as chaves i18n necessárias em `locales/pt-BR.json` (mesmas chaves em português)

## 2. Serviço de Coleta de Dados (ResumeDataService)
- [x] 2.1 Criar o arquivo `utils/resume/types.ts` com as interfaces `ResumeData`, `ContactInfo`, `ExperienceEntry`, `EducationEntry`, `CertificationEntry`, `ProjectEntry` e `PDFConfig`
- [x] 2.2 Criar o arquivo `utils/resume/ResumeDataService.ts` com a função `collectResumeData(locale, t)` que coleta e estrutura dados de `linkedin_profile.json`, `featured_projects.json` e arquivos de locale
- [x] 2.3 Implementar a função `formatDate(year, month, locale, t)` dentro do `ResumeDataService.ts` para formatar datas com meses traduzidos e tratamento de "Present"/"Presente"
- [x] 2.4 Implementar a função `formatContactLine(contact)` que formata as informações de contato separadas por pipe (|)

## 3. Builder do PDF (ResumePDFBuilder)
- [x] 3.1 Criar o arquivo `utils/resume/ResumePDFBuilder.ts` com a função `buildResumePDF(data, config)` que inicializa o jsPDF com configuração A4 (210x297mm), margens de 20mm e fonte Helvetica
- [x] 3.2 Implementar a renderização do cabeçalho (nome em 20pt, linha de contato com pipe separator)
- [x] 3.3 Implementar a renderização da seção de Resumo Profissional
- [x] 3.4 Implementar a renderização da seção de Experiência Profissional (cargo em negrito, empresa, período alinhado à direita, tipo de contrato, bullet points •)
- [x] 3.5 Implementar a renderização da seção de Habilidades Técnicas (lista separada por vírgula)
- [x] 3.6 Implementar a renderização das seções de Educação, Certificações e Projetos em Destaque
- [x] 3.7 Implementar gerenciamento de paginação (quebra de página automática, limite de 2 páginas)
- [x] 3.8 Implementar linhas separadoras entre seções e cor de destaque para títulos de seção

## 4. Composable useResumeGenerator
- [x] 4.1 Criar o arquivo `composables/useResumeGenerator.ts` com o composable que gerencia `isGenerating`, `error` e a função `generateResume()`
- [x] 4.2 Implementar o fluxo completo: coleta de dados → construção do PDF → download com nome "Gustavo_Cunha_Lacerda_CV.pdf"
- [x] 4.3 Implementar tratamento de erros com try/catch/finally (reset de isGenerating, mensagem de erro traduzida)

## 5. Integração no HeroSection
- [x] 5.1 Adicionar o botão de download no `HeroSection.vue` dentro de `div.hero-buttons`, com ícone de download, texto traduzido e estado de carregamento (spinner)
- [x] 5.2 Conectar o botão ao composable `useResumeGenerator` e implementar feedback visual de erro (toast/tooltip temporário)

## 6. Testes Unitários
- [x] 6.1 Criar `tests/resume-data-service.test.ts` com testes unitários para `collectResumeData` (dados reais do site, verificação de campos obrigatórios)
- [x] 6.2 Criar `tests/resume-pdf-builder.test.ts` com testes unitários para `buildResumePDF` (fonte Helvetica, formato A4, paleta de cores, nome do arquivo)
- [x] 6.3 Criar `tests/resume-download-button.test.ts` com testes unitários para o botão de download (renderização, estado de carregamento, chaves i18n)

## 7. Testes de Propriedade (fast-check)
- [x] 7.1 Criar `tests/resume-properties.test.ts` com geradores fast-check para `ResumeData`, `ExperienceEntry`, `ContactInfo` e demais tipos
- [x] 7.2 Implementar Property 1: Completude da coleta de dados — para qualquer dados de perfil gerados, `collectResumeData` deve incluir todas as entradas
- [x] 7.3 Implementar Property 2: Consistência de textos por locale — para qualquer locale, textos devem vir do arquivo de locale correto
- [x] 7.4 Implementar Property 3: Formatação de datas — para qualquer data e locale, formato correto com tratamento de "Presente"
- [x] 7.5 Implementar Property 8: Formatação de experiência — para qualquer experiência, saída deve conter cargo, empresa, período e bullet points
- [x] 7.6 Implementar Property 9: Skills como lista separada por vírgula — para qualquer conjunto de skills
- [x] 7.7 Implementar Property 10: Contato com pipe separator — para qualquer conjunto de contatos
- [x] 7.8 Implementar Property 12: Dados incompletos — para qualquer ResumeData com seções vazias, PDF deve ser gerado sem erros
``