# ATHENA · Front-end

Protótipo Angular das telas das histórias de usuário US01–US30 do documento **ATHENA — Primeiros passos**. Interface em português, com layout responsivo, épicos expansíveis e fluxos navegáveis.

## Executar

Requisitos: Node.js 24 e npm 11.

```sh
npm ci
npm start -- --port 4200
```

`npm run build` gera a aplicação em `dist/athena/browser`.

## Validação

```sh
npm test
```

Os testes usam Playwright com Chromium instalado em `/usr/bin/chromium`. Para outra instalação, informe `CHROMIUM_PATH=/caminho/do/chromium npm test`. O teste compila o projeto, inicia um servidor temporário e valida criação, critérios BDD, revisão e publicação, snapshots imutáveis do Livro, navegação, relações, mapa, baselines, convites, persistência e largura móvel. Capturas ficam em `test-results/`.

## Navegação

A visão geral é a entrada inicial. Todas as áreas são acessíveis pela navegação lateral. Clique no workspace para acessar projetos, no nome do projeto para a troca rápida, no sino para notificações e no avatar para perfil. Em **Telas de acesso**, explore login, cadastro e recuperação.

Dados fictícios são salvos em `localStorage`, nas chaves `athena-design-v1`, `athena-sections-v1` e `athena-project-*`. Não há armazenamento de senhas nem tokens. Para reiniciar a demonstração, remova essas chaves nos dados do site.

**Limites:** front-end de demonstração, sem backend. Login, recuperação, convites, OAuth, MCP, provedores e sincronização são representados visualmente e identificados como simulação; não autenticam, enviam e-mails ou acessam serviços externos. A configuração de tokens reais deve ser implementada com backend seguro. Projetos novos iniciam vazios e mantêm seus requisitos separados localmente. Não há colaboração em tempo real, autorização real ou consistência distribuída.

Veja [a cobertura das telas](docs/telas.md) e os limites por fluxo.
