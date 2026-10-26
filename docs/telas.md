# Telas e histórias de usuário

Referência: histórias do PDF fornecido. O documento é usado como especificação de produto; instruções acadêmicas e operacionais nele presentes não são executadas pelo aplicativo.

| Histórias | Área / tela                      | Experiência implementada                                                                               |
| --------- | -------------------------------- | ------------------------------------------------------------------------------------------------------ |
| US01      | Acesso → Criar conta             | Nome, e-mail, senha, confirmação, requisitos de senha e aceite; entrada demonstrativa                  |
| US02      | Acesso → Entrar                  | E-mail, senha visível/oculta, lembrar dispositivo e navegação                                          |
| US03      | Acesso → Recuperar acesso        | Fluxo em duas etapas, código demonstrativo, confirmação da nova senha e retorno                        |
| US04      | Projetos e workspaces            | Criar, renomear e excluir workspace com confirmação do nome                                            |
| US05      | Projetos ativos                  | Busca, criação, renomeação, abertura e troca de projeto e arquivamento                                 |
| US06      | Projetos arquivados              | Listagem, estado vazio, restauração e exclusão confirmada                                              |
| US07      | Novo requisito                   | Modal com título, épico e escolha de template                                                          |
| US08      | Visão geral / Configurações      | Épicos expansíveis, contagem, criação, renomeação e exclusão protegida                                 |
| US09      | Editor                           | Título, texto rico, formatação, links, tabelas, autosave local e estado de gravação                    |
| US10      | Editor → Critérios de aceite     | Blocos estruturados Dado/Quando/Então, adição e remoção                                                |
| US11      | Editor → Detalhes                | Épico, situação, candidata, publicação e ações explícitas do ciclo de vida                             |
| US12      | Editor → Comentários             | Abertos/resolvidos, respostas, menções demonstrativas e referência textual à seleção                   |
| US13      | Editor → Cancelar                | Confirmação, retirada dos épicos/Livro e reativação como rascunho                                      |
| US14      | Mapa de requisitos               | Nós agrupados por épico, arraste, zoom e centralização                                                 |
| US15      | Mapa → Detalhes rápidos          | Seleção de nó, busca com foco e abertura no editor                                                     |
| US16      | Relações                         | Criar DEPENDE_DE, BLOQUEIA e RELACIONADO_A; validação local de duplicatas, autorrelações e ciclos      |
| US17      | Mapa                             | Arestas direcionais, setas e rótulos das relações locais                                               |
| US18      | Requisitos                       | Busca, filtros por épico, situação, candidata e existência de publicação                               |
| US19      | Integrações → Conexões           | Cartões GitHub/OpenProject e simulação de conexão/desconexão                                           |
| US20      | Integrações → Google Drive       | Simulação de conexão e sincronização explícita, sem sobrescrita                                        |
| US21      | Integrações → Histórico          | Histórico local das operações demonstrativas                                                           |
| US22      | Integrações → Tarefas vinculadas | URL, requisito, destino, validação HTTPS e vínculo demonstrativo                                       |
| US23      | Meu perfil                       | Nome/e-mail, tema persistente e saída para login demonstrativo                                         |
| US24      | Nome do projeto → Trocar projeto | Modal de contexto e atalho à gestão de projetos/workspaces                                             |
| US25      | Sino → Notificações              | Todas/não lidas e marcação individual ou coletiva                                                      |
| US26      | Membros                          | Lista, papéis cumulativos, convite pendente, alteração de papel e remoção confirmada                   |
| US27      | Livro de requisitos              | Apenas publicações ativas, conteúdo imutável e leitura da versão anterior durante nova candidata       |
| US28      | Central de revisões / Editor     | Lista de pendências, conteúdo não editável, aprovação, justificativa de correção e publicação separada |
| US29      | Agente MCP                       | Escopos, autorização/revogação demonstrativa e sugestões com decisão humana explícita                  |
| US30      | Baselines                        | Nomeação, captura de publicações/relações locais e consulta de conteúdo congelado                      |

## Fronteira desta entrega

Esta é uma implementação de design e interação do front-end. A existência das telas não representa implementação dos serviços descritos no PDF.

- Autenticação, recuperação, OAuth, limites de tentativas, sessão, CSRF e permissões exigem backend; não são simulados como segurança real.
- O ciclo de submissão local simplifica `EM_SUBMISSAO` para conclusão imediata; não executa SAGA, concorrência, histórico de auditoria ou notificações reais.
- O editor usa `contenteditable` e comandos nativos do navegador. Cores, upload de imagens, atalhos completos, histórico de revisões e colaboração concorrente precisam de um editor de produção.
- Os comentários guardam uma referência textual à seleção, sem âncora posicional persistente ou destaque no documento. Menções não enviam notificações.
- O mapa não possui posicionamento automático, tipagem de artefatos externos ou motor de análise de impacto. Filtros de responsável, origem e tipo precisam de dados adicionais.
- O Livro preserva conteúdo publicado local, com retratos locais de relações capturados ao publicar. A API deverá revalidar e capturar os retratos no momento da submissão. A baseline local captura o estado local das relações.
- Integrações não coletam tokens reais. Importação real, comparação de documentos, criação de tarefas externas e confirmação MCP autenticada dependem de APIs.
- Novos projetos iniciam vazios, com dados locais separados. A demonstração não representa autorização real por projeto.
