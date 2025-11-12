import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="loader" role="status" [attr.aria-label]="label || 'Cargando'" aria-live="polite">
    <span class="spin" aria-hidden="true"></span>
    <span class="txt" *ngIf="label">{{ label }}</span>
  </div>
  `,
  styles: [`
  .loader{ display:flex; align-items:center; gap:10px; justify-content:center; padding:12px; color: var(--text-300) }
  .spin{ width:18px; height:18px; border-radius:50%; border:3px solid rgba(0,0,0,.1); border-top-color:#e8b83e; animation: rot 0.8s linear infinite }
  .txt{ font-size:14px }
  @keyframes rot{ to{ transform: rotate(360deg)} }
  `]
})
export class LoaderComponent { @Input() label?: string }

