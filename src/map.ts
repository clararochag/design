import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormsModule } from "@angular/forms";
@Component({
  selector: "app-map",
  standalone: true,
  imports: [FormsModule],
  template: `<div class="filterbar">
      <label class="search"
        >⌕
        <input
          aria-label="Localizar no mapa"
          placeholder="Localizar requisito no mapa..."
          [(ngModel)]="search"
          (ngModelChange)="focusSearch()"
      /></label>
      <div class="map-controls">
        <button
          class="button secondary"
          aria-label="Diminuir zoom"
          (click)="zoom = clamp(zoom - 0.15)"
        >
          −</button
        ><span>{{ (zoom * 100).toFixed(0) }}%</span
        ><button
          class="button secondary"
          aria-label="Aumentar zoom"
          (click)="zoom = clamp(zoom + 0.15)"
        >
          ＋</button
        ><button
          class="button secondary"
          (click)="zoom = 1; offsetX = 0; offsetY = 0"
        >
          Centralizar
        </button>
      </div>
    </div>
    <div class="map-info">
      Arraste o fundo para explorar · Selecione um requisito para consultar ·
      {{ relations.length }} relações oficiais locais
    </div>
    <div
      class="constellation"
      (pointerdown)="start($event)"
      (pointermove)="move($event)"
      (pointerup)="dragging = false"
      (pointercancel)="dragging = false"
    >
      <svg viewBox="0 0 1050 650" aria-label="Mapa de requisitos" role="img">
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#b39bd1" />
          </marker>
        </defs>
        <g
          [attr.transform]="
            'translate(' + offsetX + ' ' + offsetY + ') scale(' + zoom + ')'
          "
        >
          @for (e of epics; track e.id; let i = $index) {
            <rect
              [attr.x]="posEpic(i).x - 20"
              [attr.y]="posEpic(i).y - 36"
              width="290"
              [attr.height]="items(e.id).length * 62 + 80"
              rx="18"
              fill="#faf7ff"
              stroke="#e2d8ef"
              stroke-dasharray="5 4"
            />
            <text
              [attr.x]="posEpic(i).x"
              [attr.y]="posEpic(i).y - 10"
              fill="#9b7cba"
              font-size="12"
              font-weight="600"
            >
              {{ e.name }}
            </text>
          }
          @for (l of relations; track $index) {
            <line
              [attr.x1]="pos(l.from).x + 110"
              [attr.y1]="pos(l.from).y + 22"
              [attr.x2]="pos(l.to).x + 110"
              [attr.y2]="pos(l.to).y + 22"
              stroke="#b39bd1"
              stroke-width="2"
              [attr.marker-end]="
                l.type === 'RELACIONADO_A' ? null : 'url(#arrow)'
              "
            />
            <text
              [attr.x]="(pos(l.from).x + pos(l.to).x) / 2 + 110"
              [attr.y]="(pos(l.from).y + pos(l.to).y) / 2 + 10"
              fill="#9576b4"
              font-size="9"
            >
              {{ l.type }}
            </text>
          }
          @for (r of activeRequirements; track r.id) {
            <g
              class="graph-node"
              role="button"
              tabindex="0"
              [attr.aria-label]="'Detalhes de ' + r.title"
              (pointerdown)="$event.stopPropagation()"
              (click)="selected = r"
              (keydown.enter)="selected = r"
            >
              <rect
                [attr.x]="pos(r.id).x"
                [attr.y]="pos(r.id).y"
                width="250"
                height="45"
                rx="8"
                [attr.fill]="selected?.id === r.id ? '#ece3fa' : 'white'"
                stroke="#d8cae8"
              />
              <text
                [attr.x]="pos(r.id).x + 12"
                [attr.y]="pos(r.id).y + 17"
                fill="#b199c7"
                font-size="9"
              >
                US-{{ r.id.toString().padStart(2, "0") }}
              </text>
              <text
                [attr.x]="pos(r.id).x + 12"
                [attr.y]="pos(r.id).y + 33"
                fill="#80678e"
                font-size="10"
              >
                {{ r.title.slice(0, 36) }}
              </text>
            </g>
          }
        </g>
      </svg>
      @if (selected) {
        <div class="map-preview">
          <button
            class="close"
            aria-label="Fechar detalhes"
            (click)="selected = null"
          >
            ×</button
          ><span class="purple">US-{{ selected.id }}</span>
          <h3>{{ selected.title }}</h3>
          <span class="badge">{{ selected.state }}</span>
          <p>{{ epicName(selected.epic) }}</p>
          <button class="button primary" (click)="open.emit(selected)">
            Abrir requisito ↗
          </button>
        </div>
      }
    </div>`,
})
export class MapCanvas {
  @Input() projectId = 1;
  @Input() epics: any[] = [];
  @Input() requirements: any[] = [];
  @Output() open = new EventEmitter<any>();
  zoom = 1;
  offsetX = 0;
  offsetY = 0;
  dragging = false;
  lastX = 0;
  lastY = 0;
  search = "";
  selected: any = null;
  relations: any[] = [];
  ngOnInit() {
    try {
      this.relations =
        JSON.parse(
          localStorage.getItem(
            this.projectId === 1
              ? "athena-sections-v1"
              : "athena-project-sections-" + this.projectId,
          ) || "{}",
        ).relations || [];
    } catch {}
  }
  get activeRequirements() {
    return this.requirements.filter((r) => r.active);
  }
  items(id: number) {
    return this.activeRequirements.filter((r) => r.epic === id);
  }
  epicName(id: number) {
    return this.epics.find((e) => e.id === id)?.name;
  }
  posEpic(i: number) {
    return { x: 45 + (i % 3) * 345, y: 65 + Math.floor(i / 3) * 310 };
  }
  pos(id: number) {
    const r = this.requirements.find((r) => r.id === id);
    if (!r) return { x: 0, y: 0 };
    const i = this.epics.findIndex((e) => e.id === r.epic);
    const p = this.posEpic(i);
    return {
      x: p.x,
      y: p.y + 10 + this.items(r.epic).findIndex((r) => r.id === id) * 62,
    };
  }
  clamp(v: number) {
    return Math.min(2, Math.max(0.4, v));
  }
  start(e: PointerEvent) {
    this.dragging = true;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }
  move(e: PointerEvent) {
    if (!this.dragging) return;
    this.offsetX += e.clientX - this.lastX;
    this.offsetY += e.clientY - this.lastY;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
  }
  focusSearch() {
    if (!this.search.trim()) return;
    const r = this.activeRequirements.find((r) =>
      (r.title + " US-" + r.id.toString().padStart(2, "0"))
        .toLowerCase()
        .includes(this.search.toLowerCase()),
    );
    if (r) {
      this.selected = r;
      const p = this.pos(r.id);
      this.offsetX = 350 - p.x;
      this.offsetY = 220 - p.y;
      this.zoom = 1;
    }
  }
}
