# Documento de Requisitos

## Introdução

Esta feature adiciona ao portfólio de Gustavo Cunha Lacerda um botão de download de currículo em PDF. O PDF é gerado no lado do cliente a partir dos dados já existentes no site (experiência profissional, habilidades, projetos, educação) e dos dados do LinkedIn (certificações e cursos). O currículo segue as melhores práticas de ATS (Applicant Tracking System) — formatação limpa, texto parseável, estrutura semântica com seções padronizadas — e princípios modernos de design de currículos.

## Glossário

- **Gerador_PDF**: Módulo client-side responsável por montar e gerar o arquivo PDF do currículo
- **Botão_Download**: Componente Vue que dispara a geração e download do PDF
- **Dados_Perfil**: Conjunto de dados do site (linkedin_profile.json, featured_projects.json, locales) usados como fonte do currículo
- **Currículo_PDF**: Arquivo PDF gerado contendo o currículo completo e formatado
- **Motor_ATS**: Sistemas automatizados de triagem de currículos usados por recrutadores
- **Locale_Ativo**: Idioma atualmente selecionado no site (en ou pt-BR)

## Requisitos

### Requisito 1: Botão de Download do Currículo

**User Story:** Como visitante do portfólio, eu quero ver um botão de download de currículo na seção Hero, para que eu possa baixar o currículo do Gustavo de forma rápida e direta.

#### Critérios de Aceitação

1. THE Botão_Download SHALL ser exibido na seção Hero, ao lado dos botões existentes ("Ver Projetos" e "Contato")
2. THE Botão_Download SHALL exibir o texto traduzido de acordo com o Locale_Ativo ("Download CV" em inglês, "Baixar Currículo" em pt-BR)
3. THE Botão_Download SHALL exibir um ícone de download ao lado do texto
4. WHEN o visitante clicar no Botão_Download, THE Gerador_PDF SHALL iniciar a geração do Currículo_PDF
5. WHILE o Gerador_PDF estiver processando, THE Botão_Download SHALL exibir um estado de carregamento (spinner ou texto "Gerando...")
6. WHEN a geração do Currículo_PDF for concluída, THE Botão_Download SHALL disparar o download automático do arquivo com o nome "Gustavo_Cunha_Lacerda_CV.pdf"

### Requisito 2: Coleta e Estruturação dos Dados do Currículo

**User Story:** Como visitante do portfólio, eu quero que o currículo contenha todas as informações profissionais relevantes do Gustavo, para que eu tenha uma visão completa do perfil dele.

#### Critérios de Aceitação

1. THE Gerador_PDF SHALL extrair os dados de experiência profissional (cargo, empresa, período, descrição) dos Dados_Perfil
2. THE Gerador_PDF SHALL extrair as habilidades técnicas (skills) dos Dados_Perfil
3. THE Gerador_PDF SHALL extrair os dados de educação (instituição, curso, período, nota) dos Dados_Perfil
4. THE Gerador_PDF SHALL extrair as certificações e cursos (nome, instituição, data) dos Dados_Perfil
5. THE Gerador_PDF SHALL extrair os projetos em destaque (nome, descrição, tecnologias) dos Dados_Perfil
6. THE Gerador_PDF SHALL extrair o resumo profissional dos Dados_Perfil
7. THE Gerador_PDF SHALL utilizar os textos traduzidos de acordo com o Locale_Ativo para todas as seções do currículo
8. THE Gerador_PDF SHALL extrair as informações de contato (localização, LinkedIn, GitHub, e-mail) dos Dados_Perfil

### Requisito 3: Estrutura do PDF Compatível com ATS

**User Story:** Como visitante do portfólio, eu quero que o currículo gerado seja compatível com sistemas ATS, para que o currículo do Gustavo passe por filtros automatizados de recrutamento.

#### Critérios de Aceitação

1. THE Gerador_PDF SHALL organizar o Currículo_PDF nas seguintes seções, nesta ordem: Cabeçalho (nome e contato), Resumo Profissional, Experiência Profissional, Habilidades Técnicas, Educação, Certificações, Projetos em Destaque
2. THE Gerador_PDF SHALL utilizar texto real (não imagens) para todo o conteúdo do Currículo_PDF, garantindo que o Motor_ATS consiga extrair o texto
3. THE Gerador_PDF SHALL utilizar uma fonte padrão sem serifa (como Helvetica ou Arial) no Currículo_PDF
4. THE Gerador_PDF SHALL utilizar uma hierarquia clara de títulos de seção com tamanho de fonte diferenciado (nome: 18-22pt, títulos de seção: 12-14pt, corpo: 10-11pt)
5. THE Gerador_PDF SHALL utilizar formatação simples com linhas separadoras entre seções, sem tabelas complexas, colunas múltiplas, cabeçalhos/rodapés elaborados ou elementos gráficos decorativos
6. THE Gerador_PDF SHALL gerar o Currículo_PDF em formato A4 com margens de 1.5cm a 2.5cm
7. THE Gerador_PDF SHALL listar cada experiência profissional com: cargo em negrito, nome da empresa, período (mês/ano - mês/ano), tipo de contrato e bullet points de realizações
8. THE Gerador_PDF SHALL listar as habilidades técnicas como palavras-chave separadas por vírgula ou em lista simples, facilitando a leitura pelo Motor_ATS

### Requisito 4: Design Moderno e Profissional do PDF

**User Story:** Como visitante do portfólio, eu quero que o currículo tenha um design moderno e profissional, para que cause uma boa impressão visual mantendo a compatibilidade com ATS.

#### Critérios de Aceitação

1. THE Gerador_PDF SHALL utilizar uma paleta de cores sóbria com no máximo 2 cores (preto para texto e uma cor de destaque para títulos de seção e linhas separadoras)
2. THE Gerador_PDF SHALL manter espaçamento consistente entre seções (8-12pt) e entre itens dentro de seções (4-6pt)
3. THE Gerador_PDF SHALL exibir o nome do candidato de forma proeminente no topo do Currículo_PDF
4. THE Gerador_PDF SHALL exibir as informações de contato em uma única linha abaixo do nome, separadas por caractere pipe (|)
5. THE Gerador_PDF SHALL limitar o Currículo_PDF a no máximo 2 páginas
6. THE Gerador_PDF SHALL utilizar bullet points (•) para listar realizações em cada experiência profissional
7. THE Gerador_PDF SHALL exibir as datas de experiência alinhadas à direita na mesma linha do cargo

### Requisito 5: Suporte a Internacionalização (i18n)

**User Story:** Como visitante do portfólio, eu quero que o currículo seja gerado no idioma que estou visualizando o site, para que o conteúdo seja relevante para o meu contexto.

#### Critérios de Aceitação

1. WHEN o Locale_Ativo for "pt-BR", THE Gerador_PDF SHALL gerar o Currículo_PDF com todos os textos em português brasileiro
2. WHEN o Locale_Ativo for "en", THE Gerador_PDF SHALL gerar o Currículo_PDF com todos os textos em inglês
3. THE Gerador_PDF SHALL traduzir os rótulos das seções (Experiência/Experience, Educação/Education, Habilidades/Skills, Certificações/Certifications, Projetos/Projects) de acordo com o Locale_Ativo
4. THE Gerador_PDF SHALL utilizar as descrições de experiência e projetos traduzidas disponíveis nos arquivos de locale
5. THE Gerador_PDF SHALL formatar as datas de acordo com o Locale_Ativo (ex: "Jun 2024" em inglês, "Jun 2024" em pt-BR)

### Requisito 6: Tratamento de Erros na Geração do PDF

**User Story:** Como visitante do portfólio, eu quero ser informado caso ocorra algum erro na geração do currículo, para que eu saiba que algo deu errado e possa tentar novamente.

#### Critérios de Aceitação

1. IF a geração do Currículo_PDF falhar, THEN THE Botão_Download SHALL retornar ao estado normal (não carregando)
2. IF a geração do Currículo_PDF falhar, THEN THE Botão_Download SHALL exibir uma mensagem de erro temporária ao usuário (ex: toast ou tooltip)
3. IF os Dados_Perfil estiverem incompletos (campo obrigatório ausente), THEN THE Gerador_PDF SHALL omitir a seção correspondente e gerar o Currículo_PDF com as seções disponíveis
4. IF a experiência profissional não possuir data de término, THEN THE Gerador_PDF SHALL exibir "Presente" ou "Present" de acordo com o Locale_Ativo
