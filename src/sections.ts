import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormsModule } from "@angular/forms";
@Component({
  selector: "app-sections",
  standalone: true,
  imports: [FormsModule],
  template: `
    @if (page === "access") {
      <div class="access-layout">
        <div class="access-art">
          <span class="epic-symbol">A</span>
          <h2>Grandes produtos<br />começam com<br /><em>clareza.</em></h2>
          <p>Um lugar para conectar requisitos, pessoas e decisões.</p>
          <div class="orbit">
            <span>Ideia</span><span>Contexto</span><span>Requisito</span
            ><span>Entrega</span>
          </div>
        </div>
        <div class="access-form">
          <div class="tabs">
            <button [class.active]="auth === 'login'" (click)="auth = 'login'">
              Entrar</button
            ><button
              [class.active]="auth === 'register'"
              (click)="auth = 'register'"
            >
              Criar conta
            </button>
          </div>
          <h2>{{ authTitles[auth] }}</h2>
          <p>Explore a experiência ATHENA em modo de demonstração.</p>
          <form (ngSubmit)="authSubmit()">
            @if (auth === "register") {
              <label
                >Nome completo<input
                  name="name"
                  required
                  [(ngModel)]="name"
                  autocomplete="name"
              /></label>
            }
            @if (auth !== "reset") {
              <label
                >E-mail<input
                  name="email"
                  type="email"
                  required
                  [(ngModel)]="email"
                  autocomplete="email"
                  placeholder="voce@empresa.com"
              /></label>
            }
            @if (auth === "reset") {
              <p>
                Se houver uma conta com esse e-mail, enviaremos as instruções.
                Neste protótipo, nenhum e-mail é enviado.
              </p>
              <label
                >Código de demonstração<input
                  name="code"
                  pattern="[0-9]{6}"
                  maxlength="6"
                  required
                  [(ngModel)]="code"
                  placeholder="123456"
              /></label>
            }
            @if (auth !== "recover") {
              <label
                >Senha
                <div class="password">
                  <input
                    name="password"
                    [type]="showPassword ? 'text' : 'password'"
                    required
                    [minlength]="auth === 'login' ? 1 : 8"
                    [(ngModel)]="password"
                    autocomplete="new-password"
                  /><button
                    type="button"
                    (click)="showPassword = !showPassword"
                  >
                    {{ showPassword ? "Ocultar" : "Mostrar" }}
                  </button>
                </div></label
              >
              @if (auth !== "login") {
                <ul class="password-rules">
                  <li [class.valid]="password.length >= 8">
                    Ao menos 8 caracteres
                  </li>
                  <li [class.valid]="strongPassword">
                    Maiúscula, minúscula, número e símbolo
                  </li>
                </ul>
                <label
                  >Confirmar senha<input
                    name="confirm"
                    type="password"
                    required
                    [(ngModel)]="confirmation"
                /></label>
                @if (confirmation && confirmation !== password) {
                  <p class="danger">As senhas precisam ser iguais.</p>
                }
              }
            }
            @if (auth === "register") {
              <label class="check-label"
                ><input
                  type="checkbox"
                  name="terms"
                  required
                  [(ngModel)]="terms"
                />
                Aceito os termos e a política de privacidade da
                demonstração.</label
              >
            }
            @if (auth === "login") {
              <div class="between">
                <label class="check-label"
                  ><input
                    type="checkbox"
                    name="remember"
                    [(ngModel)]="remember"
                  />
                  Lembrar dispositivo</label
                ><button
                  type="button"
                  class="text-button"
                  (click)="auth = 'recover'"
                >
                  Esqueci minha senha
                </button>
              </div>
            }
            <button class="button primary full">
              {{
                auth === "login"
                  ? "Entrar na demonstração"
                  : auth === "register"
                    ? "Criar conta de demonstração"
                    : auth === "recover"
                      ? "Continuar recuperação"
                      : "Redefinir na demonstração"
              }}
            </button>
            @if (auth === "recover" || auth === "reset") {
              <button
                type="button"
                class="text-button"
                (click)="auth = 'login'"
              >
                ← Voltar para entrar
              </button>
              @if (auth === "reset") {
                <button
                  type="button"
                  class="text-button"
                  (click)="auth = 'recover'"
                >
                  Usar outro e-mail</button
                ><button
                  type="button"
                  class="text-button"
                  (click)="
                    message.emit('Simulação: nenhum código foi enviado.')
                  "
                >
                  Reenviar código
                </button>
              }
            }
          </form>
          <small class="local-note"
            >Sem autenticação real. Não use sua senha verdadeira.</small
          >
        </div>
      </div>
    } @else if (page === "projects") {
      <div class="project-workspace-bar">
        <select
          aria-label="Workspace atual"
          [(ngModel)]="workspace"
          (ngModelChange)="save()"
        >
          @for (w of workspaces; track w) {
            <option>{{ w }}</option>
          }</select
        ><button class="text-button" (click)="dialog = 'workspace'; value = ''">
          ＋ Workspace</button
        ><button
          class="text-button"
          (click)="dialog = 'renameWorkspace'; value = workspace"
        >
          Renomear</button
        ><button
          class="text-button danger"
          (click)="dialog = 'deleteWorkspace'; value = ''"
        >
          Excluir workspace
        </button>
      </div>
      <div class="section-header">
        <div class="tabs">
          <button [class.active]="!archived" (click)="archived = false">
            Projetos ativos</button
          ><button [class.active]="archived" (click)="archived = true">
            Arquivados
          </button>
        </div>
        <button class="button primary" (click)="dialog = 'project'; value = ''">
          ＋ Novo projeto
        </button>
      </div>
      <label class="search"
        >⌕
        <input
          aria-label="Buscar projeto"
          [(ngModel)]="search"
          placeholder="Buscar projeto..."
      /></label>
      <div class="catalog-grid">
        @for (p of filteredProjects; track p.id) {
          <article class="feature-card">
            <span class="epic-symbol">◈</span
            ><span class="badge right">{{
              p.archived ? "Arquivado" : "Ativo"
            }}</span>
            <h3>{{ p.name }}</h3>
            <p>{{ p.workspace }} · Owner</p>
            <div class="card-actions">
              @if (!p.archived) {
                <button class="button primary" (click)="selectProject(p)">
                  Abrir projeto ↗</button
                ><button
                  class="text-button"
                  (click)="
                    editingProject = p.id;
                    dialog = 'renameProject';
                    value = p.name
                  "
                >
                  Renomear</button
                ><button
                  class="text-button"
                  (click)="p.archived = true; save()"
                >
                  Arquivar
                </button>
              } @else {
                <button
                  class="button secondary"
                  (click)="p.archived = false; save()"
                >
                  Restaurar</button
                ><button
                  class="text-button danger"
                  (click)="
                    editingProject = p.id; dialog = 'deleteProject'; value = ''
                  "
                >
                  Excluir permanentemente
                </button>
              }
            </div>
          </article>
        } @empty {
          <div class="feature-empty">
            ◇
            <h3>
              Nenhum projeto {{ archived ? "arquivado" : "encontrado" }} neste
              workspace.
            </h3>
            <p>Organize um novo espaço para as ideias da sua equipe.</p>
          </div>
        }
      </div>
    } @else if (page === "integrations") {
      <div class="tabs">
        <button
          [class.active]="integrationTab === 'connections'"
          (click)="integrationTab = 'connections'"
        >
          Conexões</button
        ><button
          [class.active]="integrationTab === 'history'"
          (click)="integrationTab = 'history'"
        >
          Histórico de sincronização</button
        ><button
          [class.active]="integrationTab === 'tasks'"
          (click)="integrationTab = 'tasks'"
        >
          Tarefas vinculadas
        </button>
      </div>
      @if (integrationTab === "connections") {
        <div class="notice">
          Conexões demonstrativas. Nenhuma credencial é solicitada ou enviada a
          provedores.
        </div>
        <div class="catalog-grid">
          @for (i of integrations; track i.name) {
            <article class="feature-card">
              <span class="integration-logo">{{ i.icon }}</span
              ><span class="badge right" [class.success]="i.connected">{{
                i.connected ? "Simulação ativa" : "Desconectado"
              }}</span>
              <h3>{{ i.name }}</h3>
              <p>{{ i.description }}</p>
              <button class="button secondary" (click)="connect(i)">
                {{ i.connected ? "Desconectar simulação" : "Simular conexão" }}
              </button>
              @if (i.connected && i.name === "Google Drive") {
                <button class="text-button" (click)="sync()">
                  ↻ Sincronizar exemplo
                </button>
              }
            </article>
          }
        </div>
      } @else if (integrationTab === "history") {
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Origem</th>
                <th>Operação</th>
                <th>Resultado</th>
              </tr>
            </thead>
            <tbody>
              @for (h of history; track $index) {
                <tr>
                  <td>{{ h.date }}</td>
                  <td>{{ h.source }}</td>
                  <td>{{ h.action }}</td>
                  <td>
                    <span class="badge">{{ h.result }}</span>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="4" class="empty-small">
                    Nenhuma sincronização realizada. Conecte a simulação do
                    Google Drive.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      } @else {
        <div class="section-header">
          <p>Vínculos demonstrativos com issues de tarefas externas.</p>
          <button class="button primary" (click)="dialog = 'task'; value = ''">
            ＋ Vincular tarefa
          </button>
        </div>
        @for (t of tasks; track $index) {
          <div class="activity-row">
            <span>↗</span>
            <div>
              <strong>{{ t.url }}</strong
              ><small
                >US-{{ t.requirement }} · Vínculo local não verificado no
                provedor</small
              >
            </div>
          </div>
        } @empty {
          <div class="feature-empty">
            <h3>Nenhuma tarefa vinculada</h3>
            <p>
              Conecte uma simulação de destino para experimentar este fluxo.
            </p>
          </div>
        }
      }
    } @else if (page === "members") {
      <div class="section-header">
        <div>
          <h2>Pessoas que constroem juntas</h2>
          <p>Os papéis são atribuídos por projeto.</p>
        </div>
        <button class="button primary" (click)="dialog = 'invite'; value = ''">
          ＋ Convidar membro
        </button>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Membro</th>
              <th>Papel</th>
              <th>Acesso</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            @for (m of members; track m.email) {
              <tr>
                <td>
                  <strong>{{ m.name }}</strong
                  ><small class="block">{{ m.email }}</small>
                </td>
                <td>
                  @if (m.role === "Owner") {
                    <span class="badge">Owner · Você</span>
                  } @else {
                    <select
                      aria-label="Papel do membro"
                      [(ngModel)]="m.role"
                      (ngModelChange)="save()"
                    >
                      @for (role of roles; track role) {
                        <option>{{ role }}</option>
                      }
                    </select>
                  }
                </td>
                <td>
                  <span class="badge" [class.success]="m.accepted">{{
                    m.accepted ? "Ativo" : "Convite pendente"
                  }}</span>
                </td>
                <td>
                  @if (m.role !== "Owner") {
                    <button
                      class="text-button danger"
                      (click)="pendingMember = m.email; dialog = 'removeMember'"
                    >
                      Remover
                    </button>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      <div class="notice">
        Convites locais não enviam e-mails e não concedem acesso real. Owner só
        pode ser atribuído por transferência confirmada.
      </div>
    } @else if (page === "notifications") {
      <div class="section-header">
        <div class="tabs">
          <button [class.active]="!unreadOnly" (click)="unreadOnly = false">
            Todas</button
          ><button [class.active]="unreadOnly" (click)="unreadOnly = true">
            Não lidas
          </button>
        </div>
        <button class="button secondary" (click)="readAll()">
          Marcar todas como lidas
        </button>
      </div>
      @for (n of notifications; track n.id) {
        @if (!unreadOnly || !n.read) {
          <div class="activity-row" [class.unread]="!n.read">
            <span class="epic-symbol">{{ n.icon }}</span>
            <div>
              <strong>{{ n.title }}</strong>
              <p>{{ n.text }}</p>
              <small>Hoje · {{ projectName }}</small>
            </div>
            <button class="text-button" (click)="n.read = !n.read; save()">
              {{ n.read ? "Marcar como não lida" : "Marcar como lida" }}
            </button>
          </div>
        }
      }
    } @else if (page === "profile") {
      <div class="profile-grid">
        <section class="feature-card">
          <span class="avatar large">{{
            profileName.slice(0, 2).toUpperCase()
          }}</span>
          <h3>Seu perfil</h3>
          <form
            (ngSubmit)="
              save(); message.emit('Preferências salvas neste navegador.')
            "
          >
            <label
              >Nome<input
                name="profileName"
                [(ngModel)]="profileName"
                required /></label
            ><label
              >E-mail<input
                name="profileEmail"
                type="email"
                [(ngModel)]="profileEmail"
                required /></label
            ><button class="button primary">Salvar alterações</button>
          </form>
        </section>
        <section class="feature-card">
          <span class="epic-symbol">☼</span>
          <h3>Preferências</h3>
          <p>Deixe a experiência do seu jeito.</p>
          <label class="check-label"
            ><input
              type="checkbox"
              [(ngModel)]="dark"
              (ngModelChange)="applyTheme()"
            />
            Modo escuro</label
          ><button
            class="button secondary"
            (click)="page = 'access'; auth = 'login'; navigate.emit('access')"
          >
            Sair da demonstração
          </button>
          <p class="local-note">
            Nenhuma sessão autenticada é criada neste protótipo.
          </p>
        </section>
      </div>
    } @else if (page === "baselines") {
      <div class="section-header">
        <div>
          <h2>Marcos que preservam o contexto</h2>
          <p>Snapshots locais de versões publicadas e relações.</p>
        </div>
        <button
          class="button primary"
          (click)="dialog = 'baseline'; value = ''"
        >
          ＋ Criar baseline
        </button>
      </div>
      <div class="catalog-grid">
        @for (b of baselines; track b.id) {
          <article class="feature-card">
            <span class="epic-symbol">◷</span
            ><span class="badge right">Imutável</span>
            <h3>{{ b.name }}</h3>
            <p>{{ b.date }} · {{ b.items.length }} versões publicadas</p>
            <button class="text-button" (click)="selectedBaseline = b">
              Consultar snapshot ↗
            </button>
          </article>
        } @empty {
          <div class="feature-empty">
            <h3>Seu primeiro marco começa aqui.</h3>
            <p>
              Publique requisitos e crie uma baseline para preservar esse
              escopo.
            </p>
          </div>
        }
      </div>
      @if (selectedBaseline) {
        <section class="feature-card">
          <h3>{{ selectedBaseline.name }}</h3>
          @for (r of selectedBaseline.items; track r.id) {
            <details>
              <summary>US-{{ r.id }} · {{ r.title }}</summary>
              <div class="rich-editor" [innerHTML]="r.body"></div>
            </details>
          }
          <p class="local-note">
            Retrato de relações:
            {{ selectedBaseline.relations.length }} conexões.
          </p>
        </section>
      }
    } @else if (page === "reviews") {
      <div class="notice">
        A revisão usa o conteúdo submetido, bloqueado para edição. Aprovação e
        publicação são ações separadas.
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Lote</th>
              <th>Requisito</th>
              <th>Estado</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            @for (r of requirements; track r.id) {
              @if (
                r.active &&
                (r.state === "Aguardando revisão" || r.state === "Aprovada")
              ) {
                <tr>
                  <td>REV-{{ r.id }}</td>
                  <td>{{ r.title }}</td>
                  <td>
                    <span class="badge">{{ r.state }}</span>
                  </td>
                  <td>
                    <button
                      class="text-button"
                      (click)="openRequirement.emit(r)"
                    >
                      Analisar snapshot ↗
                    </button>
                  </td>
                </tr>
              }
            }
          </tbody>
        </table>
      </div>
    } @else if (page === "agent") {
      <div class="notice">
        Assistência externa via MCP. As sugestões abaixo são exemplos estáticos,
        sem geração por IA.
      </div>
      <div class="profile-grid">
        <section class="feature-card">
          <span class="epic-symbol">✧</span>
          <h3>Seu agente, com contexto.</h3>
          <p>
            Selecione os projetos e os escopos que deseja delegar. Permissões do
            agente não ampliam seu papel.
          </p>
          <label
            >Projeto<select>
              <option>{{ projectName }}</option>
            </select></label
          >
          @for (scope of scopes; track scope.name) {
            <label class="check-label"
              ><input type="checkbox" [(ngModel)]="scope.enabled" />{{
                scope.name
              }}
              <small>{{ scope.description }}</small></label
            >
          }
          <button
            class="button primary"
            (click)="agentConnected = !agentConnected; save()"
          >
            {{
              agentConnected
                ? "Revogar autorização local"
                : "Simular autorização OAuth"
            }}
          </button>
          <p class="local-note">
            {{
              agentConnected
                ? "Autorização demonstrativa ativa. Nenhum agente conectado."
                : "Nenhuma autorização ativa."
            }}
          </p>
        </section>
        <section class="feature-card">
          <h3>Sugestões para revisão humana</h3>
          @for (s of suggestions; track s.id) {
            <div class="suggestion">
              <span class="badge">{{ s.state }}</span>
              <h4>{{ s.title }}</h4>
              <p>{{ s.reason }}</p>
              <small
                >Evidência de exemplo: critérios de acesso · Similaridade não
                representa probabilidade de correção.</small
              >
              @if (s.state === "Pendente") {
                <div class="card-actions">
                  <button
                    class="button secondary"
                    (click)="selectedSuggestion = s; dialog = 'suggestion'"
                  >
                    Avaliar sugestão</button
                  ><button
                    class="text-button"
                    (click)="s.state = 'Rejeitada'; save()"
                  >
                    Rejeitar
                  </button>
                </div>
              }
            </div>
          }
        </section>
      </div>
    } @else if (page === "relations") {
      <div class="section-header">
        <div>
          <h2>Conexões com significado</h2>
          <p>
            Relações direcionais e associativas entre requisitos do projeto.
          </p>
        </div>
        <button
          class="button primary"
          (click)="dialog = 'relation'; value = ''"
        >
          ＋ Nova relação
        </button>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Origem</th>
              <th>Relação</th>
              <th>Destino</th>
              <th>Justificativa</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            @for (l of relations; track $index; let i = $index) {
              <tr>
                <td>US-{{ l.from }}</td>
                <td>
                  <span class="badge">{{ l.type }}</span>
                </td>
                <td>US-{{ l.to }}</td>
                <td>{{ l.reason }}</td>
                <td>
                  <button
                    class="text-button danger"
                    (click)="relations.splice(i, 1); save()"
                  >
                    Remover
                  </button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="5" class="empty-small">
                  Nenhuma relação oficial cadastrada.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      <div class="notice">
        Autorrelações, duplicações e ciclos de precedência são bloqueados nesta
        demonstração.
      </div>
    }
    @if (dialog) {
      <div class="modal-overlay">
        <section
          class="modal"
          role="dialog"
          aria-modal="true"
          [attr.aria-label]="dialogTitles[dialog]"
        >
          <button class="close" aria-label="Fechar" (click)="dialog = ''">
            ×</button
          ><span class="epic-symbol">◈</span>
          <h2>{{ dialogTitles[dialog] }}</h2>
          <form (ngSubmit)="submit()">
            @if (dialog === "relation") {
              <label
                >Origem<select name="from" [(ngModel)]="from">
                  @for (r of requirements; track r.id) {
                    <option [ngValue]="r.id">
                      US-{{ r.id }} · {{ r.title }}
                    </option>
                  }
                </select></label
              ><label
                >Relação<select name="type" [(ngModel)]="relationType">
                  <option>DEPENDE_DE</option>
                  <option>BLOQUEIA</option>
                  <option>RELACIONADO_A</option>
                </select></label
              ><label
                >Destino<select name="to" [(ngModel)]="to">
                  @for (r of requirements; track r.id) {
                    <option [ngValue]="r.id">
                      US-{{ r.id }} · {{ r.title }}
                    </option>
                  }
                </select></label
              ><label
                >Justificativa<textarea
                  required
                  name="reason"
                  [(ngModel)]="value"
                ></textarea>
              </label>
            } @else if (dialog === "suggestion") {
              <p>
                Confirmar esta sugestão apenas a marca como aceita localmente.
                Cadastre a relação oficial na área Relações após avaliar o
                contexto.
              </p>
              <h3>{{ selectedSuggestion?.title }}</h3>
            } @else if (dialog === "removeMember") {
              <p>Remover {{ pendingMember }} da lista local de membros?</p>
            } @else {
              <label
                >{{
                  dialog === "invite"
                    ? "E-mail do convite"
                    : dialog === "task"
                      ? "URL da issue"
                      : dialog.startsWith("delete")
                        ? "Digite o nome exato para confirmar"
                        : "Nome"
                }}<input
                  name="value"
                  required
                  [(ngModel)]="value"
                  [type]="
                    dialog === 'invite'
                      ? 'email'
                      : dialog === 'task'
                        ? 'url'
                        : 'text'
                  "
              /></label>
              @if (dialog.startsWith("delete")) {
                <p class="local-note">
                  Confirme:
                  {{
                    dialog === "deleteWorkspace"
                      ? workspace
                      : projectToDelete?.name
                  }}. Arquivos em serviços conectados não serão removidos.
                </p>
              }
              @if (dialog === "invite") {
                <label
                  >Papel<select name="role" [(ngModel)]="inviteRole">
                    @for (r of roles; track r) {
                      <option>{{ r }}</option>
                    }
                  </select></label
                >
              }
              @if (dialog === "task") {
                <label
                  >Requisito<select
                    name="taskRequirement"
                    [(ngModel)]="taskRequirement"
                  >
                    @for (r of requirements; track r.id) {
                      <option [ngValue]="r.id">
                        US-{{ r.id }} · {{ r.title }}
                      </option>
                    }
                  </select></label
                ><label
                  >Destino<select
                    name="taskProvider"
                    [(ngModel)]="taskProvider"
                  >
                    @for (i of integrations; track i.name) {
                      @if (i.connected && i.name !== "Google Drive") {
                        <option>{{ i.name }}</option>
                      }
                    }
                  </select></label
                >
              }
            }
            <div class="modal-actions">
              <button
                type="button"
                class="button secondary"
                (click)="dialog = ''"
              >
                Cancelar</button
              ><button class="button primary">Confirmar</button>
            </div>
          </form>
        </section>
      </div>
    }
  `,
})
export class Sections {
  @Input() page = "projects";
  @Input() projectId = 1;
  @Input() projectName = "Plataforma Athena";
  @Input() requirements: any[] = [];
  @Input() published: Record<number, any> = {};
  @Output() message = new EventEmitter<string>();
  @Output() navigate = new EventEmitter<string>();
  @Output() openRequirement = new EventEmitter<any>();
  @Output() projectSelected = new EventEmitter<any>();
  auth = "login";
  name = "";
  email = "";
  password = "";
  confirmation = "";
  code = "";
  terms = false;
  remember = false;
  showPassword = false;
  authTitles: Record<string, string> = {
    login: "Bem-vinda de volta.",
    register: "Seu próximo projeto começa aqui.",
    recover: "Vamos recuperar seu acesso.",
    reset: "Crie uma nova senha.",
  };
  workspace = "Studio workspace";
  workspaces = ["Studio workspace"];
  projects = [
    {
      id: 1,
      name: "Plataforma Athena",
      workspace: "Studio workspace",
      archived: false,
    },
    {
      id: 2,
      name: "Pesquisa exploratória",
      workspace: "Studio workspace",
      archived: true,
    },
  ];
  archived = false;
  search = "";
  dialog = "";
  value = "";
  editingProject = 1;
  integrationTab = "connections";
  profileName = "Clara Rocha";
  profileEmail = "clara@exemplo.com";
  dark = false;
  unreadOnly = false;
  inviteRole = "Editor";
  pendingMember = "";
  taskProvider = "GitHub";
  taskRequirement = 1;
  from = 1;
  to = 2;
  relationType = "DEPENDE_DE";
  agentConnected = false;
  roles = ["Leitor", "Repórter", "Editor", "Aprovador", "Mantenedor"];
  members = [
    {
      name: "Clara Rocha",
      email: "clara@exemplo.com",
      role: "Owner",
      accepted: true,
    },
    {
      name: "Lucas Martins",
      email: "lucas@exemplo.com",
      role: "Editor",
      accepted: true,
    },
    {
      name: "Ana Costa",
      email: "ana@exemplo.com",
      role: "Aprovador",
      accepted: true,
    },
  ];
  integrations = [
    {
      name: "GitHub",
      icon: "GH",
      description:
        "Conecte requisitos a issues e ao contexto técnico da sua equipe.",
      connected: false,
    },
    {
      name: "OpenProject",
      icon: "OP",
      description:
        "Aproxime suas especificações do planejamento e das entregas.",
      connected: false,
    },
    {
      name: "Google Drive",
      icon: "△",
      description:
        "Importe contexto e compare mudanças sem sobrescrever publicações.",
      connected: false,
    },
  ];
  history: any[] = [];
  tasks: any[] = [];
  baselines: any[] = [];
  selectedBaseline: any = null;
  relations: any[] = [];
  selectedSuggestion: any = null;
  suggestions = [
    {
      id: 1,
      title: "Recuperação de acesso depende de autenticação",
      reason:
        "Os dois requisitos compartilham regras de identificação de conta e validação de acesso.",
      state: "Pendente",
    },
  ];
  scopes = [
    { name: "athena:read", description: "Consultar contexto", enabled: true },
    { name: "athena:write", description: "Propor e editar", enabled: false },
    { name: "athena:approve", description: "Decidir revisão", enabled: false },
    { name: "athena:publish", description: "Publicar versão", enabled: false },
    {
      name: "athena:admin",
      description: "Administrar projeto",
      enabled: false,
    },
  ];
  notifications = [
    {
      id: 1,
      icon: "◷",
      title: "Há candidatas aguardando revisão",
      text: "Confira o conteúdo submetido antes de registrar sua decisão.",
      read: false,
    },
    {
      id: 2,
      icon: "✧",
      title: "Bem-vinda ao ATHENA",
      text: "Seu espaço para conectar requisitos e construir clareza está pronto.",
      read: false,
    },
  ];
  dialogTitles: Record<string, string> = {
    workspace: "Novo workspace",
    renameWorkspace: "Renomear workspace",
    deleteWorkspace: "Excluir workspace",
    project: "Novo projeto",
    renameProject: "Renomear projeto",
    deleteProject: "Excluir projeto",
    invite: "Convidar membro",
    removeMember: "Remover membro",
    task: "Vincular tarefa existente",
    baseline: "Criar baseline",
    relation: "Nova relação",
    suggestion: "Confirmar decisão humana",
  };
  constructor() {
    try {
      const s = JSON.parse(
        localStorage.getItem("athena-sections-v1") || "null",
      );
      if (s) {
        for (const key of this.savedKeys) {
          if (s[key] !== undefined) (this as any)[key] = s[key];
        }
      }
      this.applyTheme(false);
    } catch {}
  }
  savedKeys = [
    "workspace",
    "workspaces",
    "projects",
    "members",
    "integrations",
    "history",
    "tasks",
    "baselines",
    "relations",
    "notifications",
    "suggestions",
    "scopes",
    "agentConnected",
    "profileName",
    "profileEmail",
    "dark",
  ];
  get filteredProjects() {
    return this.projects.filter(
      (p) =>
        p.workspace === this.workspace &&
        p.archived === this.archived &&
        p.name.toLowerCase().includes(this.search.toLowerCase()),
    );
  }
  get projectToDelete() {
    return this.projects.find((p) => p.id === this.editingProject);
  }
  get strongPassword() {
    return (
      /[A-Z]/.test(this.password) &&
      /[a-z]/.test(this.password) &&
      /[0-9]/.test(this.password) &&
      /[^A-Za-z0-9]/.test(this.password)
    );
  }
  authSubmit() {
    if (this.auth === "recover") {
      this.auth = "reset";
      return;
    }
    if (
      this.auth !== "login" &&
      (this.password !== this.confirmation || !this.strongPassword)
    ) {
      this.message.emit("Confira a confirmação e os requisitos da senha.");
      return;
    }
    if (this.auth === "reset") {
      this.auth = "login";
      this.password = "";
      this.confirmation = "";
      this.message.emit(
        "Redefinição demonstrada. Nenhuma senha real foi alterada.",
      );
      return;
    }
    this.password = "";
    this.confirmation = "";
    this.navigate.emit("projects");
    this.message.emit("Modo de demonstração aberto.");
  }
  selectProject(p: any) {
    this.projectSelected.emit(p);
    this.navigate.emit("overview");
  }
  ngOnInit() {
    if (this.projectId !== 1) {
      this.members = [
        {
          name: this.profileName,
          email: this.profileEmail,
          role: "Owner",
          accepted: true,
        },
      ];
      this.integrations.forEach((i) => (i.connected = false));
      this.history = [];
      this.tasks = [];
      this.baselines = [];
      this.relations = [];
      this.notifications = [];
      this.suggestions = [];
      this.agentConnected = false;
      try {
        const data = JSON.parse(
          localStorage.getItem("athena-project-sections-" + this.projectId) ||
            "{}",
        );
        for (const key of this.savedKeys.filter(
          (k) => !this.globalKeys.includes(k),
        )) {
          if (data[key] !== undefined) (this as any)[key] = data[key];
        }
      } catch {}
    }
  }
  globalKeys = [
    "workspace",
    "workspaces",
    "projects",
    "profileName",
    "profileEmail",
    "dark",
  ];
  applyTheme(persist = true) {
    document.documentElement.classList.toggle("dark", this.dark);
    if (persist) this.save();
  }
  save() {
    try {
      const d: any = {};
      this.savedKeys.forEach((k) => (d[k] = (this as any)[k]));
      if (this.projectId === 1) {
        localStorage.setItem("athena-sections-v1", JSON.stringify(d));
      } else {
        localStorage.setItem(
          "athena-project-sections-" + this.projectId,
          JSON.stringify(d),
        );
        const shared = JSON.parse(
          localStorage.getItem("athena-sections-v1") || "{}",
        );
        for (const key of this.globalKeys) shared[key] = d[key];
        localStorage.setItem("athena-sections-v1", JSON.stringify(shared));
      }
    } catch {
      this.message.emit("Falha ao salvar preferências locais.");
    }
  }
  connect(i: any) {
    i.connected = !i.connected;
    this.history.unshift({
      date: new Date().toLocaleString("pt-BR"),
      source: i.name,
      action: i.connected
        ? "Conexão demonstrativa"
        : "Desconexão demonstrativa",
      result: "Simulado",
    });
    this.save();
  }
  sync() {
    this.history.unshift({
      date: new Date().toLocaleString("pt-BR"),
      source: "Google Drive",
      action: "Comparação de documento de exemplo",
      result: "Sem alterações · Simulado",
    });
    this.save();
    this.message.emit(
      "Simulação concluída. Nenhum arquivo externo foi acessado.",
    );
  }
  readAll() {
    this.notifications.forEach((n) => (n.read = true));
    this.save();
  }
  submit() {
    let v = this.value.trim();
    if (this.dialog === "removeMember") {
      this.members = this.members.filter((m) => m.email !== this.pendingMember);
    } else if (this.dialog === "suggestion") {
      this.selectedSuggestion.state = "Aceita localmente";
    } else if (this.dialog === "relation") {
      if (!this.addRelation(v)) return;
    } else {
      if (!v) return;
      if (this.dialog === "workspace") {
        if (this.workspaces.includes(v)) {
          this.message.emit("Já existe um workspace com esse nome.");
          return;
        }
        this.workspaces.push(v);
        this.workspace = v;
      } else if (this.dialog === "renameWorkspace") {
        if (this.workspaces.includes(v) && v !== this.workspace) {
          this.message.emit("Nome já utilizado.");
          return;
        }
        this.projects
          .filter((p) => p.workspace === this.workspace)
          .forEach((p) => (p.workspace = v));
        this.workspaces = this.workspaces.map((w) =>
          w === this.workspace ? v : w,
        );
        this.workspace = v;
      } else if (this.dialog === "deleteWorkspace") {
        if (v !== this.workspace) {
          this.message.emit("Digite o nome exato do workspace.");
          return;
        }
        this.projects = this.projects.filter(
          (p) => p.workspace !== this.workspace,
        );
        this.workspaces = this.workspaces.filter((w) => w !== this.workspace);
        this.workspace = this.workspaces[0] || "";
      } else if (this.dialog === "project" || this.dialog === "renameProject") {
        if (!this.workspace) {
          this.message.emit("Crie um workspace primeiro.");
          return;
        }
        if (
          this.projects.some(
            (p) =>
              p.workspace === this.workspace &&
              p.name === v &&
              !(
                this.dialog === "renameProject" && p.id === this.editingProject
              ),
          )
        ) {
          this.message.emit("Nome de projeto já utilizado.");
          return;
        }
        if (this.dialog === "project")
          this.projects.push({
            id: Math.max(0, ...this.projects.map((p) => p.id)) + 1,
            name: v,
            workspace: this.workspace,
            archived: false,
          });
        else this.projectToDelete!.name = v;
      } else if (this.dialog === "deleteProject") {
        if (v !== this.projectToDelete?.name) {
          this.message.emit("Digite o nome exato do projeto.");
          return;
        }
        this.projects = this.projects.filter(
          (p) => p.id !== this.editingProject,
        );
      } else if (this.dialog === "invite") {
        if (this.members.some((m) => m.email === v)) {
          this.message.emit("Este e-mail já está na lista.");
          return;
        }
        this.members.push({
          name: v.split("@")[0],
          email: v,
          role: this.inviteRole,
          accepted: false,
        });
      } else if (this.dialog === "task") {
        const destination = this.integrations.find(
          (i) => i.name === this.taskProvider && i.connected,
        );
        if (!destination) {
          this.message.emit(
            "Nenhum destino autorizado. Ative uma simulação em Integrações.",
          );
          return;
        }
        let u: URL;
        try {
          u = new URL(v);
        } catch {
          this.message.emit("Informe uma URL válida.");
          return;
        }
        if (
          u.protocol !== "https:" ||
          (this.taskProvider === "GitHub" &&
            (u.hostname !== "github.com" ||
              !/^\/[^/]+\/[^/]+\/issues\/\d+$/.test(u.pathname)))
        ) {
          this.message.emit(
            "Use uma URL HTTPS de issue válida para o destino.",
          );
          return;
        }
        this.tasks.push({
          url: v,
          requirement: this.taskRequirement,
          provider: this.taskProvider,
        });
      } else if (this.dialog === "baseline") {
        const items = this.requirements
          .filter((r) => r.active && this.published[r.id])
          .map((r) => structuredClone(this.published[r.id]));
        if (!items.length) {
          this.message.emit(
            "Publique ao menos um requisito antes de criar uma baseline.",
          );
          return;
        }
        this.baselines.push({
          id: Date.now(),
          name: v,
          date: new Date().toLocaleDateString("pt-BR"),
          items,
          relations: structuredClone(this.relations),
        });
      }
    }
    this.save();
    this.dialog = "";
    this.value = "";
    this.message.emit("Alteração salva na demonstração local.");
  }
  addRelation(reason: string) {
    if (this.from === this.to) {
      this.message.emit("Um requisito não pode se relacionar consigo mesmo.");
      return false;
    }
    const associative = this.relationType === "RELACIONADO_A";
    const edge = (f: number, t: number, k: string) =>
      k === "BLOQUEIA" ? [t, f] : [f, t];
    const [a, b] = edge(this.from, this.to, this.relationType);
    if (
      this.relations.some((l) => {
        const [c, d] = edge(l.from, l.to, l.type);
        return associative
          ? l.type === "RELACIONADO_A" &&
              ((a === c && b === d) || (a === d && b === c))
          : l.type !== "RELACIONADO_A" && a === c && b === d;
      })
    ) {
      this.message.emit("Esta relação já existe.");
      return false;
    }
    if (!associative) {
      const graph = new Map<number, number[]>();
      for (const l of this.relations.filter(
        (l) => l.type !== "RELACIONADO_A",
      )) {
        const [c, d] = edge(l.from, l.to, l.type);
        graph.set(c, [...(graph.get(c) || []), d]);
      }
      const seen = new Set<number>();
      const reaches = (x: number): boolean => {
        if (x === a) return true;
        if (seen.has(x)) return false;
        seen.add(x);
        return (graph.get(x) || []).some(reaches);
      };
      if (reaches(b)) {
        this.message.emit("Esta relação criaria um ciclo de precedência.");
        return false;
      }
    }
    this.relations.push({
      from: this.from,
      to: this.to,
      type: this.relationType,
      reason,
    });
    return true;
  }
}
