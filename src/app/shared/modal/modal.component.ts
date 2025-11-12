import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="cm-overlay" *ngIf="open" (click)="onBackdrop($event)"></div>
  <div class="cm-dialog" *ngIf="open" role="dialog" aria-modal="true" [attr.aria-labelledby]="titleId" [attr.aria-describedby]="descId">
    <h3 class="cm-title" [id]="titleId">{{ title }}</h3>
    <p class="cm-desc" [id]="descId">{{ message }}</p>
    <div class="cm-actions">
      <button class="btn ghost" (click)="cancel.emit()">{{ cancelLabel || 'Cancelar' }}</button>
      <button class="btn" (click)="confirm.emit()">{{ confirmLabel || 'Confirmar' }}</button>
    </div>
  </div>
  `,
  styles: [`
  .cm-overlay{ position: fixed; inset:0; background: rgba(0,0,0,.35); backdrop-filter: blur(2px); z-index: 40; }
  .cm-dialog{ position: fixed; inset: 0; display:grid; place-items:center; z-index: 41; }
  .cm-dialog{ pointer-events:none }
  .cm-dialog > *{ pointer-events: auto }
  .cm-dialog{ animation: fade .15s ease-out }
  @keyframes fade{ from{ opacity:0; transform: translateY(4px)} to{ opacity:1; transform: none} }
  .cm-dialog .cm-title{ margin:0 0 6px; font-weight:800; color:#1c170d }
  .cm-dialog .cm-desc{ margin:0 0 14px; color:#475569 }
  .cm-dialog{ padding:18px; width:min(92vw,480px); border-radius:14px; background:#fff; border:1px solid rgba(155,132,75,.22); box-shadow:0 10px 30px rgba(0,0,0,.14) }
  .cm-actions{ display:flex; gap:10px; justify-content:flex-end }
  .btn{ padding:10px 14px; border-radius:10px; border:0; cursor:pointer; color:#1c170d; background:#e8b83e; font-weight:700 }
  .btn.ghost{ background:#f8fafc; border:1px solid #e2e8f0; color:#334155 }
  `]
})
export class ModalComponent {
  @Input() open = false;
  @Input() title = '';
  @Input() message = '';
  @Input() confirmLabel?: string;
  @Input() cancelLabel?: string;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  titleId = 'cm-title-' + Math.random().toString(36).slice(2);
  descId = 'cm-desc-' + Math.random().toString(36).slice(2);

  @HostListener('document:keydown.escape') onEsc(){ if (this.open) this.cancel.emit(); }
  onBackdrop(e: MouseEvent){ e.stopPropagation(); this.cancel.emit(); }
}

