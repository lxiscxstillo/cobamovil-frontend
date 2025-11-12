import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <div class="empty" role="status" aria-live="polite">
    <div class="icon" [innerHTML]="iconSvg" aria-hidden="true"></div>
    <h3 class="title">{{ title }}</h3>
    <p class="desc">{{ description }}</p>
    <button *ngIf="actionLabel && action" class="btn" style="width:auto" (click)="action()">{{ actionLabel }}</button>
    <a *ngIf="link && linkLabel" class="btn" style="width:auto" [routerLink]="link">{{ linkLabel }}</a>
  </div>
  `,
  styles: [`
  .empty{ display:grid; place-items:center; gap:8px; padding:18px; border:1px dashed #e5e7eb; border-radius:12px; color: var(--text-300) }
  .empty .title{ margin:6px 0 0; color: var(--text-100) }
  .empty .desc{ margin:0 0 6px }
  .icon{ width:48px; height:48px }
  `]
})
export class EmptyStateComponent {
  @Input() title = 'Sin registros';
  @Input() description = '';
  @Input() actionLabel?: string;
  @Input() action?: () => void;
  @Input() link?: string;
  @Input() linkLabel?: string;
  @Input() iconSvg: string = `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 4h4"/><path d="M12 2v2"/><path d="M18.5 7a6.5 6.5 0 0 1-13 0"/><path d="M5 22h14a2 2 0 0 0 2-2v-6H3v6a2 2 0 0 0 2 2z"/></svg>`;
}

