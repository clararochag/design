import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { Sections } from "./sections";
import { MapCanvas } from "./map";
interface Requirement {
  id: number;
  title: string;
  epic: number;
  state: string;
  active: boolean;
  body: string;
  version?: number;
  relationsSnapshot?: {
    from: number;
    to: number;
    type: string;
    reason: string;
  }[];
  criteria: { given: string; when: string; then: string }[];
  comments: {
    text: string;
    resolved: boolean;
    replies?: string[];
    anchor?: string;
  }[];
}
@Component({
  selector: "app-root",
  standalone: true,
  imports: [FormsModule, Sections, MapCanvas],
  template: `
    <aside class="sidebar">
      <a class="brand" href="#" (click)="go('overview')"
        ><span class="brand-mark">A</span> athena<span class="brand-dot"
          >.</span
        ></a
      >
      <div
        class="workspace"
        role="button"
        tabindex="0"
        (click)="go('projects')"
        (keydown.enter)="go('projects')"
      >
        <span class="workspace-icon">S</span>
        <div>{{ workspaceName }}<small>Plano gratuito</small></div>
        <span>⌄</span>
      </div>
      <div class="nav-label">WORKSPACE</div>
      <button class="nav-item" (click)="go('projects')">
        ▦ <span>Projetos</span><small>01</small>
      </button>
      <div class="nav-label project-label">PROJETO ATUAL</div>
      <div class="project-name">
        <span class="project-icon">◈</span>
        <button (click)="modal = 'switch'">{{ projectName }} ⌄</button>
      </div>
      <nav>
        <button [class.selected]="view === 'overview'" (click)="go('overview')">
          ◫ <span>Visão geral</span></button
        ><button
          [class.selected]="view === 'requirements' || view === 'editor'"
          (click)="go('requirements')"
        >
          ☷ <span>Requisitos</span
          ><small>{{ requirements.length }}</small></button
        ><button [class.selected]="view === 'map'" (click)="go('map')">
          ⌘ <span>Mapa de requisitos</span></button
        ><button [class.selected]="view === 'book'" (click)="go('book')">
          ▤ <span>Livro de requisitos</span>
        </button>
        @for (link of extraNav; track link.id) {
          <button [class.selected]="view === link.id" (click)="go(link.id)">
            {{ link.icon }} <span>{{ link.label }}</span>
          </button>
        }
      </nav>
      <div class="sidebar-bottom">
        <div class="help-card">
          <span>✧</span><strong>Clareza em cada conexão.</strong>
          <p>Organize requisitos. Entenda impactos. Evolua em equipe.</p>
        </div>
        <button class="nav-item" (click)="modal = 'settings'">
          ⚙ <span>Configurações do projeto</span>
        </button>
        <div
          class="profile"
          role="button"
          tabindex="0"
          (click)="go('profile')"
          (keydown.enter)="go('profile')"
        >
          <span class="avatar">CR</span>
          <div>Clara Rocha<small>Owner do projeto</small></div>
          <span>⌄</span>
        </div>
      </div>
    </aside>
    <div class="app">
      <header class="topbar">
        <div>
          {{ workspaceName }} <span>/</span> {{ projectName }} <span>/</span>
          <strong>{{ labels[view] }}</strong>
        </div>
        <div class="top-actions">
          <span class="demo-badge">Protótipo interativo</span
          ><button aria-label="Notificações" (click)="go('notifications')">
            ♧</button
          ><button
            class="avatar small"
            aria-label="Abrir perfil"
            (click)="go('profile')"
          >
            CR
          </button>
        </div>
      </header>
      <main>
        @if (view !== "editor") {
          <div class="page-heading">
            <div>
              <div class="eyebrow">PLATAFORMA ATHENA</div>
              <h1>{{ labels[view] }}<span class="title-dot">.</span></h1>
              <p>{{ descriptions[view] }}</p>
            </div>
            <div class="heading-actions">
              <div class="team">
                <span class="avatar lavender">CR</span
                ><span class="avatar peach">LM</span
                ><span class="avatar green">AC</span
                ><span class="team-more">+2</span>
              </div>
              <button class="button secondary" (click)="modal = 'settings'">
                ⚙ Configurações
              </button>
            </div>
          </div>
          @if (sectionViews.includes(view)) {
            <app-sections
              [page]="view"
              [projectId]="projectId"
              [projectName]="projectName"
              (projectSelected)="switchProject($event)"
              [requirements]="requirements"
              [published]="published"
              (navigate)="go($event)"
              (message)="notify($event)"
              (openRequirement)="open($event)"
            />
          } @else if (view === "overview") {
            <div class="stats">
              <div class="stat">
                <span>Total de requisitos <i>☷</i></span
                ><strong>{{
                  requirements.length.toString().padStart(2, "0")
                }}</strong
                ><small
                  ><b class="purple">Em {{ epics.length }} épicos</b> neste
                  projeto</small
                >
              </div>
              <div class="stat">
                <span>Publicados <i>✓</i></span
                ><strong>{{
                  countState("Publicada").toString().padStart(2, "0")
                }}</strong
                ><small
                  ><b class="green-text">Versões oficiais</b> no livro</small
                >
              </div>
              <div class="stat">
                <span>Aguardando revisão <i>◷</i></span
                ><strong>{{
                  countState("Aguardando revisão").toString().padStart(2, "0")
                }}</strong
                ><small
                  ><b class="orange-text">Precisam da sua atenção</b></small
                >
              </div>
              <div class="stat">
                <span>Rascunhos <i>✎</i></span
                ><strong>{{
                  countState("Rascunho").toString().padStart(2, "0")
                }}</strong
                ><small>Ideias em construção</small>
              </div>
            </div>
            <section class="section-header">
              <div>
                <h2>
                  Épicos <span class="count">{{ epics.length }}</span>
                </h2>
                <p>Grandes objetivos, organizados em pequenas entregas.</p>
              </div>
              <button class="button primary" (click)="newEpic()">
                ＋ Novo épico
              </button>
            </section>
            <div class="filterbar">
              <label class="search"
                >⌕
                <input
                  aria-label="Buscar épicos ou requisitos"
                  placeholder="Buscar épicos ou requisitos..."
                  [(ngModel)]="query"
              /></label>
              <div class="view-switch">
                <button class="active" aria-label="Visualização em cartões">
                  ▦</button
                ><button
                  aria-label="Visualização em lista"
                  (click)="go('requirements')"
                >
                  ☰
                </button>
              </div>
            </div>
            <div class="epic-grid">
              @for (epic of filteredEpics; track epic.id; let i = $index) {
                <article class="epic-card">
                  <div class="epic-top">
                    <span
                      class="epic-symbol"
                      [class.mint]="i % 3 === 1"
                      [class.rose]="i % 3 === 2"
                      >{{ epic.icon }}</span
                    ><span class="epic-code"
                      >EP-{{ epic.id.toString().padStart(2, "0") }}</span
                    ><button
                      class="dots"
                      [attr.aria-label]="'Configurar ' + epic.name"
                      (click)="editEpic(epic)"
                    >
                      ···
                    </button>
                  </div>
                  <h3>{{ epic.name }}</h3>
                  <p class="epic-description">{{ epic.description }}</p>
                  <div class="epic-progress">
                    <div>
                      <span>{{ items(epic.id).length }} requisitos</span
                      ><span>{{ progress(epic.id) }}% publicados</span>
                    </div>
                    <div class="progress-track">
                      <span [style.width.%]="progress(epic.id)"></span>
                    </div>
                  </div>
                  <button class="expand" (click)="toggle(epic.id)">
                    <span
                      ><span class="tiny-folder">▱</span> Histórias de usuário
                      <span class="count">{{
                        items(epic.id).length
                      }}</span></span
                    ><span>{{ expanded.has(epic.id) ? "⌃" : "⌄" }}</span>
                  </button>
                  @if (expanded.has(epic.id)) {
                    <div class="epic-items">
                      @for (r of items(epic.id); track r.id) {
                        <button (click)="open(r)">
                          <span class="req-icon">▧</span
                          ><span
                            ><small
                              >US-{{ r.id.toString().padStart(2, "0") }}</small
                            >{{ r.title }}</span
                          ><i
                            class="state-dot"
                            [class.published]="r.state === 'Publicada'"
                          ></i>
                        </button>
                      } @empty {
                        <p class="empty-small">
                          Seu próximo requisito começa aqui.
                        </p>
                      }
                      <button
                        class="add-inline"
                        (click)="newRequirement(epic.id)"
                      >
                        ＋ Adicionar requisito
                      </button>
                    </div>
                  }
                  <footer>
                    <span
                      ><span class="avatar tiny">{{
                        i % 2 ? "LM" : "CR"
                      }}</span>
                      {{ i % 2 ? "Lucas Martins" : "Clara Rocha" }}</span
                    ><span>Atualizado hoje</span>
                  </footer>
                </article>
              }
              <button class="new-epic-card" (click)="newEpic()">
                <span>＋</span><strong>Um novo objetivo começa aqui</strong
                ><small>Crie um épico e conecte suas ideias.</small
                ><b>Criar novo épico ↗</b>
              </button>
            </div>
            <div class="tip">
              <span>✧</span>
              <p>
                <strong>Uma visão conectada do seu projeto.</strong> Explore o
                mapa para entender como seus requisitos se relacionam.
              </p>
              <button (click)="go('map')">Explorar mapa ↗</button>
            </div>
          } @else if (view === "requirements" || view === "book") {
            <div class="section-header">
              <h2>
                {{
                  view === "book" ? "Versões publicadas" : "Todos os requisitos"
                }}
                <span class="count">{{ visibleRequirements.length }}</span>
              </h2>
              @if (view === "requirements") {
                <button class="button primary" (click)="newRequirement()">
                  ＋ Novo requisito
                </button>
              }
            </div>
            <div class="filterbar">
              <label class="search"
                >⌕
                <input
                  aria-label="Buscar requisitos"
                  placeholder="Buscar por título ou ID..."
                  [(ngModel)]="query" /></label
              ><select
                aria-label="Filtrar situação"
                [(ngModel)]="situationFilter"
              >
                <option>Ativo</option>
                <option>Cancelado</option>
                <option>Todos</option></select
              ><select aria-label="Filtrar épico" [(ngModel)]="epicFilter">
                <option [ngValue]="0">Todos os épicos</option>
                @for (e of epics; track e.id) {
                  <option [ngValue]="e.id">{{ e.name }}</option>
                }</select
              ><select
                aria-label="Filtrar publicação"
                [(ngModel)]="publicationFilter"
              >
                <option value="">Qualquer publicação</option>
                <option value="yes">Com publicação</option>
                <option value="no">Sem publicação</option></select
              ><select aria-label="Filtrar estado" [(ngModel)]="stateFilter">
                <option value="">Todos os estados</option>
                <option>Rascunho</option>
                <option>Aguardando revisão</option>
                <option>Aprovada</option>
                <option>Publicada</option>
              </select>
            </div>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Requisito</th>
                    <th>Épico</th>
                    <th>Situação</th>
                    <th>Candidata</th>
                    <th>Publicação</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  @for (r of visibleRequirements; track r.id) {
                    <tr
                      (click)="open(r, view === 'book')"
                      tabindex="0"
                      (keydown.enter)="open(r, view === 'book')"
                    >
                      <td class="purple">
                        US-{{ r.id.toString().padStart(2, "0") }}
                      </td>
                      <td>
                        <strong>{{
                          view === "book" ? published[r.id].title : r.title
                        }}</strong>
                      </td>
                      <td>
                        {{
                          epicName(
                            view === "book" ? published[r.id].epic : r.epic
                          )
                        }}
                      </td>
                      <td>{{ r.active ? "Ativo" : "Cancelado" }}</td>
                      <td>
                        <span
                          class="badge"
                          [class.success]="
                            view === 'book' || r.state === 'Publicada'
                          "
                          >{{ view === "book" ? "Publicada" : r.state }}</span
                        >
                      </td>
                      <td>
                        {{
                          published[r.id]
                            ? "v" + (published[r.id].version || 1)
                            : "—"
                        }}
                      </td>
                      <td>↗</td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="7" class="empty-small">
                        Nenhum requisito encontrado.
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          } @else if (view === "map") {
            <app-map
              [epics]="epics"
              [projectId]="projectId"
              [requirements]="requirements"
              (open)="open($event)"
            />
          }
        } @else if (current) {
          <div class="editor-heading">
            <button class="back" (click)="go('overview')">
              ← Voltar à visão geral</button
            ><span class="saved">{{ saveStatus }}</span
            ><button
              class="button secondary"
              (click)="panel = panel === 'comments' ? 'details' : 'comments'"
            >
              ☏ Comentários
              <span class="count">{{ current.comments.length }}</span></button
            ><button
              class="button secondary"
              (click)="panel = panel ? '' : 'details'"
            >
              ☷ Detalhes
            </button>
          </div>
          <div class="editor-layout">
            <article class="document">
              <div class="doc-meta">
                <span class="purple"
                  >US-{{ current.id.toString().padStart(2, "0") }}</span
                ><span class="badge">{{ current.state }}</span>
                @if (readonly) {
                  <span class="badge success">Somente leitura</span>
                }
              </div>
              <input
                class="doc-title"
                aria-label="Título do requisito"
                [(ngModel)]="current.title"
                (ngModelChange)="changed()"
                [disabled]="!editable"
              />
              <div class="doc-author">
                <span class="avatar tiny">CR</span> Clara Rocha <span>·</span>
                {{ epicName(current.epic) }}
              </div>
              <div class="toolbar">
                @for (
                  tool of ["B", "I", "U", "≡", "• Lista", "Link", "Tabela"];
                  track tool
                ) {
                  <button
                    [disabled]="!editable"
                    (mousedown)="$event.preventDefault()"
                    (click)="format(tool)"
                  >
                    {{ tool }}
                  </button>
                }
                <span>Texto do requisito</span>
              </div>
              <div
                class="rich-editor"
                role="textbox"
                aria-label="Conteúdo do requisito"
                [attr.contenteditable]="editable"
                [innerHTML]="editorBody"
                (input)="bodyInput($event)"
              ></div>
              <div class="criteria-heading">
                <h2>
                  Critérios de aceite
                  <span class="count">{{ current.criteria.length }}</span>
                </h2>
                @if (editable) {
                  <button class="text-button" (click)="addCriterion()">
                    ＋ Critério
                  </button>
                }
              </div>
              @for (c of current.criteria; track $index; let i = $index) {
                <div class="criterion">
                  <div>
                    <strong>Cenário {{ i + 1 }}</strong>
                    @if (editable) {
                      <button
                        class="text-button danger"
                        (click)="current.criteria.splice(i, 1); changed()"
                      >
                        Remover
                      </button>
                    }
                  </div>
                  @for (field of criterionFields; track field.key) {
                    <label
                      ><span>{{ field.label }}</span
                      ><input
                        [attr.aria-label]="
                          field.label + ' do cenário ' + (i + 1)
                        "
                        [(ngModel)]="c[field.key]"
                        (ngModelChange)="changed()"
                        [disabled]="!editable"
                        placeholder="Descreva este passo do cenário"
                    /></label>
                  }
                </div>
              }
            </article>
            @if (panel) {
              <aside class="details">
                <h3>
                  {{
                    panel === "comments"
                      ? "Comentários"
                      : "Detalhes do requisito"
                  }}
                </h3>
                @if (panel === "details") {
                  <label
                    >Tipo<span class="detail-value"
                      >História de usuário</span
                    ></label
                  ><label
                    >Situação<span class="detail-value">{{
                      current.active ? "Ativo" : "Cancelado"
                    }}</span></label
                  ><label
                    >Estado da candidata<span class="badge">{{
                      current.state
                    }}</span></label
                  ><label
                    >Versão publicada<span class="detail-value">{{
                      published[current.id]
                        ? "v" +
                          (published[current.id].version || 1) +
                          " · Publicada"
                        : "Ainda não publicada"
                    }}</span></label
                  ><label
                    >Épico<select
                      [(ngModel)]="current.epic"
                      (ngModelChange)="changed()"
                      [disabled]="!editable"
                    >
                      @for (e of epics; track e.id) {
                        <option [ngValue]="e.id">{{ e.name }}</option>
                      }
                    </select></label
                  ><label
                    >Responsável<span class="detail-value"
                      ><span class="avatar tiny">CR</span> Clara Rocha</span
                    ></label
                  >
                  @if (readonly) {
                    <h3>Retrato da publicação</h3>
                    @for (l of current.relationsSnapshot || []; track $index) {
                      <p class="local-note">
                        US-{{ l.from }} {{ l.type }} US-{{ l.to }}
                      </p>
                    } @empty {
                      <p class="local-note">
                        Sem relações registradas nesta versão.
                      </p>
                    }
                  }
                  @if (!readonly) {
                    <div class="lifecycle">
                      @if (current.active) {
                        @if (current.state === "Rascunho") {
                          <button
                            class="button primary"
                            (click)="transition('Aguardando revisão')"
                          >
                            Submeter para revisão
                          </button>
                        }
                        @if (current.state === "Aguardando revisão") {
                          <button
                            class="button primary"
                            (click)="transition('Aprovada')"
                          >
                            Aprovar candidata</button
                          ><button
                            class="button secondary"
                            (click)="modal = 'reject'"
                          >
                            Solicitar correções
                          </button>
                        }
                        @if (current.state === "Aprovada") {
                          <button
                            class="button primary"
                            (click)="modal = 'publish'"
                          >
                            Publicar versão
                          </button>
                        }
                        @if (
                          current.state === "Publicada" ||
                          current.state === "Aprovada"
                        ) {
                          <button
                            class="button secondary"
                            (click)="transition('Rascunho')"
                          >
                            Editar nova candidata
                          </button>
                        }
                        <button
                          class="text-button danger"
                          (click)="modal = 'cancel'"
                        >
                          Cancelar requisito
                        </button>
                      } @else {
                        <button class="button primary" (click)="reactivate()">
                          Reativar como rascunho
                        </button>
                      }
                    </div>
                    <p class="local-note">
                      Fluxo demonstrativo local. As permissões e revisões
                      precisam ser validadas pelo backend.
                    </p>
                  }
                } @else {
                  <div class="comment-tabs">
                    <button
                      [class.active]="!resolvedTab"
                      (click)="resolvedTab = false"
                    >
                      Abertos</button
                    ><button
                      [class.active]="resolvedTab"
                      (click)="resolvedTab = true"
                    >
                      Resolvidos
                    </button>
                  </div>
                  @for (c of current.comments; track $index) {
                    @if (c.resolved === resolvedTab) {
                      <div class="comment">
                        <strong>Clara Rocha <small>agora</small></strong>
                        <p>{{ c.text }}</p>
                        @if (c.anchor) {
                          <blockquote>{{ c.anchor }}</blockquote>
                        }
                        @for (reply of c.replies || []; track $index) {
                          <div class="reply">↳ {{ reply }}</div>
                        }
                        @if (!readonly) {
                          <button class="text-button" (click)="replyTo(c)">
                            Responder
                          </button>
                        }
                        <button
                          class="text-button"
                          (click)="c.resolved = !c.resolved; changed()"
                        >
                          {{ c.resolved ? "Reabrir" : "✓ Resolver" }}
                        </button>
                      </div>
                    }
                  }
                  @if (!readonly) {
                    <button class="text-button" (click)="captureSelection()">
                      Associar trecho selecionado
                    </button>
                    @if (commentAnchor) {
                      <blockquote>{{ commentAnchor }}</blockquote>
                    }
                    <textarea
                      aria-label="Novo comentário"
                      [(ngModel)]="commentText"
                      placeholder="Compartilhe uma observação... Use @ para mencionar."
                    ></textarea>
                    @if (commentText.includes("@")) {
                      <div class="mention-list">
                        @for (
                          person of [
                            "Clara Rocha",
                            "Lucas Martins",
                            "Ana Costa",
                          ];
                          track person
                        ) {
                          <button
                            (click)="
                              commentText = commentText.replace(
                                '@',
                                '@' + person + ' '
                              )
                            "
                          >
                            {{ person }}
                          </button>
                        }
                      </div>
                    }
                    <button
                      class="button primary"
                      [disabled]="!commentText.trim()"
                      (click)="addComment()"
                    >
                      Comentar
                    </button>
                  }
                }
              </aside>
            }
          </div>
        }
        <div class="page-footer">
          <span><span class="brand-mark mini">A</span> ATHENA</span
          ><span>Conectando requisitos. Construindo clareza.</span
          ><span>Ambiente de demonstração · Dados locais</span>
        </div>
      </main>
    </div>
    @if (modal) {
      <div
        class="modal-overlay"
        (click)="modal = ''"
        (keydown.escape)="modal = ''"
        tabindex="-1"
      >
        <section
          class="modal"
          role="dialog"
          aria-modal="true"
          [attr.aria-label]="modalTitle"
          (click)="$event.stopPropagation()"
        >
          <button class="close" aria-label="Fechar modal" (click)="modal = ''">
            ×</button
          ><span class="epic-symbol">{{
            modal === "requirement" ? "▧" : "◈"
          }}</span>
          <h2>{{ modalTitle }}</h2>
          <p>
            {{
              modal === "epic"
                ? "Agrupe histórias que compartilham o mesmo objetivo."
                : modal === "requirement"
                  ? "Transforme uma ideia em uma entrega bem definida."
                  : ""
            }}
          </p>
          <form (ngSubmit)="submitModal()">
            @if (modal === "epic" || modal === "requirement") {
              <label
                >{{ modal === "epic" ? "Nome do épico" : "Título do requisito"
                }}<input
                  autofocus
                  required
                  [(ngModel)]="formTitle"
                  name="title"
                  placeholder="Ex.: Gestão de acesso"
              /></label>
              @if (modal === "epic") {
                <label
                  >Descrição <small>(opcional)</small
                  ><textarea
                    [(ngModel)]="formDescription"
                    name="description"
                    placeholder="Qual é o objetivo deste épico?"
                  ></textarea>
                </label>
              } @else {
                <label
                  >Épico<select name="epic" [(ngModel)]="formEpic">
                    @for (e of epics; track e.id) {
                      <option [ngValue]="e.id">{{ e.name }}</option>
                    }
                  </select></label
                ><label>Começar com</label
                ><label class="radio-card"
                  ><input
                    type="radio"
                    name="template"
                    [(ngModel)]="template"
                    value="blank"
                  />Em branco</label
                ><label class="radio-card"
                  ><input
                    type="radio"
                    name="template"
                    [(ngModel)]="template"
                    value="story"
                  />User Story completa
                  <small>Especificação e regras de negócio</small></label
                >
              }
            } @else if (modal === "switch") {
              <p>{{ workspaceName }}</p>
              <button
                type="button"
                class="button secondary full"
                (click)="go('overview'); modal = ''"
              >
                ◈ {{ projectName }} · Owner</button
              ><button
                type="button"
                class="text-button"
                (click)="go('projects'); modal = ''"
              >
                Gerenciar workspaces e projetos ↗
              </button>
            } @else if (modal === "settings") {
              <h3>Pastas e épicos</h3>
              @for (e of epics; track e.id) {
                <div class="settings-row">
                  <span
                    >{{ e.name }}
                    <small>{{ items(e.id).length }} requisitos</small></span
                  ><button
                    type="button"
                    class="text-button"
                    (click)="editEpic(e)"
                  >
                    Renomear</button
                  ><button
                    type="button"
                    class="text-button danger"
                    (click)="deleteEpic(e.id)"
                  >
                    Excluir
                  </button>
                </div>
              }
            } @else if (modal === "reject") {
              <label
                >Justificativa<textarea
                  name="reason"
                  [(ngModel)]="reason"
                  required
                  placeholder="Descreva o que precisa ser corrigido"
                ></textarea>
              </label>
            } @else {
              <p>
                {{
                  modal === "publish"
                    ? "Publicar torna esta versão disponível no Livro de Requisitos. Confirma a publicação?"
                    : modal === "delete"
                      ? "Este épico vazio será excluído. Confirma a exclusão?"
                      : "O requisito sairá dos épicos ativos e do Livro. O histórico local será preservado."
                }}
              </p>
            }
            <div class="modal-actions">
              <button
                type="button"
                class="button secondary"
                (click)="modal = ''"
              >
                {{ modal === "settings" ? "Fechar" : "Cancelar" }}
              </button>
              @if (modal !== "settings" && modal !== "switch") {
                <button
                  class="button primary"
                  type="submit"
                  [disabled]="
                    (modal === 'epic' || modal === 'requirement') &&
                    !formTitle.trim()
                  "
                >
                  {{
                    modal === "epic"
                      ? "Salvar épico"
                      : modal === "requirement"
                        ? "Criar requisito"
                        : "Confirmar"
                  }}
                </button>
              }
            </div>
          </form>
        </section>
      </div>
    }
    @if (toast) {
      <div class="toast" role="status">✓ {{ toast }}</div>
    }
  `,
})
export class App {
  projectId = 1;
  projectName = "Plataforma Athena";
  workspaceName = "Studio workspace";
  get storageKey() {
    return this.projectId === 1
      ? "athena-design-v1"
      : "athena-project-" + this.projectId;
  }
  switchProject(project: any) {
    this.flush();
    this.projectId = project.id;
    this.projectName = project.name;
    this.workspaceName = project.workspace;
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      const d = JSON.parse(saved);
      this.epics = d.epics;
      this.requirements = d.requirements;
      this.published = d.published;
    } else {
      this.epics = [];
      this.requirements = [];
      this.published = {};
    }
    this.current = null;
    this.persist();
    this.go("overview");
  }
  sectionViews = [
    "projects",
    "access",
    "integrations",
    "members",
    "notifications",
    "profile",
    "baselines",
    "reviews",
    "agent",
    "relations",
  ];
  extraNav = [
    { id: "relations", icon: "⇄", label: "Relações" },
    { id: "reviews", icon: "✓", label: "Revisões" },
    { id: "baselines", icon: "◷", label: "Baselines" },
    { id: "integrations", icon: "⊞", label: "Integrações" },
    { id: "members", icon: "♧", label: "Membros" },
    { id: "agent", icon: "✧", label: "Agente MCP" },
    { id: "access", icon: "↪", label: "Telas de acesso" },
  ];
  view = "overview";
  panel = "details";
  query = "";
  stateFilter = "";
  situationFilter = "Ativo";
  epicFilter = 0;
  publicationFilter = "";
  modal = "";
  toast = "";
  current: Requirement | null = null;
  readonly = false;
  editorBody = "";
  saveStatus = "Salvo neste navegador";
  commentAnchor = "";
  commentText = "";
  resolvedTab = false;
  formTitle = "";
  formDescription = "";
  formEpic = 1;
  template = "story";
  editId: number | null = null;
  deleteId = 0;
  reason = "";
  timer: any;
  labels: Record<string, string> = {
    overview: "Visão geral",
    requirements: "Requisitos",
    map: "Mapa de requisitos",
    book: "Livro de requisitos",
    editor: "Editor de requisito",
    projects: "Projetos e workspaces",
    access: "Acesso à plataforma",
    integrations: "Integrações",
    members: "Membros e permissões",
    notifications: "Notificações",
    profile: "Meu perfil",
    baselines: "Baselines",
    reviews: "Central de revisões",
    agent: "Agente e sugestões",
    relations: "Relações",
  };
  descriptions: Record<string, string> = {
    projects: "Organize os espaços e os projetos que dão vida às suas ideias.",
    access: "Uma experiência segura começa com um acesso simples.",
    integrations: "Seu contexto, conectado às ferramentas da equipe.",
    members: "As pessoas certas, com o acesso certo.",
    notifications: "Fique por dentro do que precisa da sua atenção.",
    profile: "Um espaço com a sua identidade.",
    baselines: "Preserve a história de cada entrega.",
    reviews: "Decisões conscientes para requisitos que evoluem.",
    agent: "Assistência com contexto. Decisões nas suas mãos.",
    relations: "Entenda as dependências que conectam seu projeto.",
    overview: "Cada requisito tem um propósito. Aqui, eles se conectam.",
    requirements: "Explore, encontre e acompanhe cada detalhe do seu projeto.",
    map: "Uma perspectiva conectada dos objetivos e histórias do projeto.",
    book: "A fonte de verdade do projeto. Apenas versões publicadas e ativas.",
  };
  criterionFields: { key: "given" | "when" | "then"; label: string }[] = [
    { key: "given", label: "Dado" },
    { key: "when", label: "Quando" },
    { key: "then", label: "Então" },
  ];
  epics = [
    {
      id: 1,
      name: "Autenticação e acesso",
      description:
        "Uma entrada segura e simples para todas as pessoas da plataforma.",
      icon: "⌁",
    },
    {
      id: 2,
      name: "Gestão de projetos",
      description: "Um espaço organizado para transformar ideias em projetos.",
      icon: "▦",
    },
    {
      id: 3,
      name: "Requisitos e documentação",
      description: "Clareza e estrutura para cada etapa da especificação.",
      icon: "▤",
    },
    {
      id: 4,
      name: "Rastreabilidade e relações",
      description: "Conecte requisitos e compreenda o impacto de cada mudança.",
      icon: "⌘",
    },
    {
      id: 5,
      name: "Colaboração e revisão",
      description: "Decisões compartilhadas, contexto e evolução em equipe.",
      icon: "♧",
    },
  ];
  requirements: Requirement[] = [
    ["Criação de conta", 1, "Publicada"],
    ["Autenticação de usuários", 1, "Publicada"],
    ["Recuperação de acesso", 1, "Rascunho"],
    ["Gestão de workspaces", 2, "Publicada"],
    ["Gestão de projetos", 2, "Aguardando revisão"],
    ["Projetos arquivados", 2, "Rascunho"],
    ["Inicialização de requisitos", 3, "Publicada"],
    ["Gestão de épicos", 3, "Aguardando revisão"],
    ["Editor de requisitos", 3, "Rascunho"],
    ["Mapa de requisitos", 4, "Rascunho"],
    ["Relações entre requisitos", 4, "Aguardando revisão"],
    ["Comentários e menções", 5, "Rascunho"],
  ].map((x, i) => ({
    id: i + 1,
    title: x[0] as string,
    epic: x[1] as number,
    state: x[2] as string,
    active: true,
    body:
      "<h2>História de usuário</h2><p>Como membro do projeto, quero " +
      (x[0] as string).toLowerCase() +
      ", para trabalhar com clareza e segurança na plataforma.</p><h2>Especificação</h2><p>A experiência deve ser simples, acessível e manter o contexto do projeto. Todas as ações devem fornecer retorno claro à pessoa usuária.</p><h2>Regras de negócio</h2><ul><li>Respeitar as permissões do membro no projeto.</li><li>Preservar o histórico das alterações.</li></ul>",
    criteria: [
      {
        given: "que sou um membro autorizado do projeto",
        when: "realizo a ação com informações válidas",
        then: "o sistema registra a operação e apresenta a confirmação",
      },
    ],
    comments: [],
  }));
  published: Record<number, Requirement> = {};
  expanded = new Set([1, 2, 3]);
  constructor() {
    try {
      const s = localStorage.getItem("athena-design-v1");
      if (s) {
        const d = JSON.parse(s);
        this.epics = d.epics;
        this.requirements = d.requirements;
        this.published = d.published;
      } else
        this.requirements
          .filter((r) => r.state === "Publicada")
          .forEach((r) => (this.published[r.id] = structuredClone(r)));
    } catch {
      this.notify("Não foi possível restaurar os dados locais.");
    }
  }
  get editable() {
    return (
      !!this.current &&
      !this.readonly &&
      this.current.active &&
      this.current.state === "Rascunho"
    );
  }
  get filteredEpics() {
    return this.epics.filter(
      (e) =>
        !this.query ||
        e.name.toLowerCase().includes(this.query.toLowerCase()) ||
        this.items(e.id).some((r) =>
          r.title.toLowerCase().includes(this.query.toLowerCase()),
        ),
    );
  }
  get visibleRequirements() {
    return this.requirements.filter(
      (r) =>
        (this.view !== "book" || (r.active && this.published[r.id])) &&
        (this.view === "book" ||
          this.situationFilter === "Todos" ||
          r.active === (this.situationFilter === "Ativo")) &&
        (!this.epicFilter || r.epic === this.epicFilter) &&
        (!this.publicationFilter ||
          (this.publicationFilter === "yes") === !!this.published[r.id]) &&
        (!this.stateFilter || r.state === this.stateFilter) &&
        (!this.query ||
          (r.title + " US-" + r.id.toString().padStart(2, "0"))
            .toLowerCase()
            .includes(this.query.toLowerCase())),
    );
  }
  get modalTitle() {
    return (
      {
        epic: this.editId ? "Renomear épico" : "Novo épico",
        requirement: "Novo requisito",
        settings: "Configurações do projeto",
        publish: "Publicar requisito",
        cancel: "Cancelar requisito",
        delete: "Excluir épico",
        reject: "Solicitar correções",
        switch: "Trocar projeto",
      } as Record<string, string>
    )[this.modal];
  }
  items(id: number) {
    return this.requirements.filter((r) => r.epic === id && r.active);
  }
  epicName(id: number) {
    return this.epics.find((e) => e.id === id)?.name || "";
  }
  countState(s: string) {
    return this.requirements.filter(
      (r) =>
        r.active &&
        (s === "Publicada" ? !!this.published[r.id] : r.state === s),
    ).length;
  }
  progress(id: number) {
    const a = this.items(id);
    return a.length
      ? Math.round(
          (a.filter((r) => !!this.published[r.id]).length / a.length) * 100,
        )
      : 0;
  }
  go(v: string) {
    this.flush();
    this.view = v;
    this.query = "";
    this.stateFilter = "";
    this.readonly = false;
  }
  toggle(id: number) {
    this.expanded.has(id) ? this.expanded.delete(id) : this.expanded.add(id);
  }
  open(r: Requirement, read = false) {
    this.flush();
    this.current = read ? structuredClone(this.published[r.id]) : r;
    this.readonly = read;
    this.editorBody = this.current.body;
    this.view = "editor";
    this.panel = "details";
  }
  newEpic() {
    this.editId = null;
    this.formTitle = "";
    this.formDescription = "";
    this.modal = "epic";
  }
  editEpic(e: any) {
    this.editId = e.id;
    this.formTitle = e.name;
    this.formDescription = e.description;
    this.modal = "epic";
  }
  newRequirement(id?: number) {
    if (!this.epics.length) {
      this.notify("Crie um épico primeiro.");
      return;
    }
    this.formTitle = "";
    this.formEpic = id || this.epics[0].id;
    this.modal = "requirement";
  }
  deleteEpic(id: number) {
    if (this.requirements.some((r) => r.epic === id)) {
      this.notify("Este épico possui requisitos e não pode ser excluído.");
      return;
    }
    this.deleteId = id;
    this.modal = "delete";
  }
  submitModal() {
    if (this.modal === "epic") {
      if (!this.formTitle.trim()) return;
      if (this.editId) {
        const e = this.epics.find((e) => e.id === this.editId)!;
        e.name = this.formTitle.trim();
        e.description = this.formDescription;
      } else {
        this.epics.push({
          id: Math.max(0, ...this.epics.map((e) => e.id)) + 1,
          name: this.formTitle.trim(),
          description: this.formDescription,
          icon: "◈",
        });
      }
      this.notify("Épico salvo.");
    } else if (this.modal === "requirement") {
      if (!this.formTitle.trim()) return;
      const r: Requirement = {
        id: Math.max(0, ...this.requirements.map((r) => r.id)) + 1,
        title: this.formTitle.trim(),
        epic: this.formEpic,
        state: "Rascunho",
        active: true,
        body:
          this.template === "story"
            ? "<h2>História de usuário</h2><p>Como [pessoa], quero [objetivo], para [benefício].</p><h2>Especificação</h2><p>Descreva o comportamento esperado.</p><h2>Campos e comportamento</h2><p>Defina os campos e suas validações.</p><h2>Regras de negócio</h2><p>Descreva as regras aplicáveis.</p>"
            : "<p>Comece a escrever seu requisito...</p>",
        criteria: [],
        comments: [],
      };
      this.requirements.push(r);
      this.open(r);
    } else if (this.modal === "delete") {
      this.epics = this.epics.filter((e) => e.id !== this.deleteId);
    } else if (this.modal === "cancel" && this.current) {
      this.current.active = false;
      this.go("requirements");
    } else if (this.modal === "publish" && this.current?.state === "Aprovada") {
      this.current.state = "Publicada";
      try {
        this.current.relationsSnapshot = structuredClone(
          JSON.parse(
            localStorage.getItem(
              this.projectId === 1
                ? "athena-sections-v1"
                : "athena-project-sections-" + this.projectId,
            ) || "{}",
          ).relations || [],
        ).filter(
          (l: any) => l.from === this.current!.id || l.to === this.current!.id,
        );
      } catch {
        this.current.relationsSnapshot = [];
      }
      this.current.version =
        (this.published[this.current.id]?.version || 0) + 1;
      this.published[this.current.id] = structuredClone(this.current);
      this.notify("Versão publicada no Livro.");
    } else if (this.modal === "reject") {
      if (!this.reason.trim()) return;
      this.current!.comments.push({
        text: "Correções solicitadas: " + this.reason,
        resolved: false,
      });
      this.current!.state = "Rascunho";
      this.reason = "";
    }
    this.modal = "";
    this.persist();
  }
  transition(s: string) {
    if (!this.current) return;
    if (
      s === "Aguardando revisão" &&
      (!this.current.title.trim() ||
        this.current.criteria.some(
          (c) => !c.given.trim() || !c.when.trim() || !c.then.trim(),
        ))
    ) {
      this.notify(
        "Preencha o título e todos os campos dos critérios antes de submeter.",
      );
      return;
    }
    this.current.state = s;
    this.persist();
    this.notify(
      s === "Aprovada"
        ? "Candidata aprovada. A publicação é uma ação separada."
        : s === "Rascunho"
          ? "Nova candidata editável. A versão publicada permanece no Livro."
          : "Submissão local concluída. Aguardando revisão.",
    );
  }
  reactivate() {
    if (!this.current) return;
    this.current.active = true;
    this.current.state = "Rascunho";
    delete this.published[this.current.id];
    this.persist();
  }
  changed() {
    this.saveStatus = "Alterações pendentes";
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.persist(), 2000);
  }
  bodyInput(e: Event) {
    if (this.current) {
      this.current.body = (e.target as HTMLElement).innerHTML;
      this.changed();
    }
  }
  format(t: string) {
    if (t === "Link") {
      const url = prompt("URL HTTPS do link");
      if (url) {
        try {
          const parsed = new URL(url);
          if (parsed.protocol === "https:")
            document.execCommand("createLink", false, parsed.href);
          else this.notify("Use um endereço HTTPS.");
        } catch {
          this.notify("Informe um endereço válido.");
        }
      }
      return;
    }
    if (t === "Tabela") {
      document.execCommand(
        "insertHTML",
        false,
        "<table><tr><th>Campo</th><th>Comportamento</th></tr><tr><td>Nome</td><td>Descrição</td></tr></table>",
      );
      return;
    }
    document.execCommand(
      (
        {
          B: "bold",
          I: "italic",
          U: "underline",
          "≡": "justifyLeft",
          "• Lista": "insertUnorderedList",
        } as Record<string, string>
      )[t],
    );
  }
  addCriterion() {
    this.current?.criteria.push({ given: "", when: "", then: "" });
    this.changed();
  }
  addComment() {
    if (!this.commentText.trim()) return;
    this.current?.comments.push({
      text: this.commentText.trim(),
      resolved: false,
      replies: [],
      anchor: this.commentAnchor,
    });
    this.commentText = "";
    this.commentAnchor = "";
    this.persist();
  }
  captureSelection() {
    this.commentAnchor = window.getSelection()?.toString().trim() || "";
    if (!this.commentAnchor)
      this.notify("Selecione um trecho do requisito antes de associá-lo.");
  }
  replyTo(c: any) {
    const reply = prompt("Sua resposta");
    if (reply?.trim()) {
      c.replies = c.replies || [];
      c.replies.push(reply.trim());
      this.persist();
    }
  }
  flush() {
    clearTimeout(this.timer);
    this.persist();
  }
  persist() {
    try {
      localStorage.setItem(
        this.storageKey,
        JSON.stringify({
          epics: this.epics,
          requirements: this.requirements,
          published: this.published,
        }),
      );
      this.saveStatus = "Salvo neste navegador";
    } catch {
      this.saveStatus = "Falha ao salvar";
      this.notify("Armazenamento indisponível. Mantenha esta página aberta.");
    }
  }
  notify(t: string) {
    this.toast = t;
    setTimeout(() => (this.toast = ""), 4500);
  }
}
bootstrapApplication(App).catch(console.error);
