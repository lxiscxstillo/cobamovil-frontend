import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastItem } from './toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="cm-toasts">
    <div *ngFor="let t of items" class="cm-toast" [class.succ]="t.type==='success'" [class.err]="t.type==='error'" [class.info]="t.type==='info'" [class.warn]="t.type==='warn'">
      <span class="icon" [innerHTML]="icon(t.type)"></span>
      <span class="msg">{{ t.message }}</span>
      <button class="x" (click)="close(t.id)" aria-label="Cerrar">×</button>
    </div>
  </div>
  `,
  styles: [`
  .cm-toasts{ position: fixed; right: 16px; bottom: 16px; display: grid; gap: 10px; z-index: 9999 }
  .cm-toast{ display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:12px; color:#0f172a; box-shadow:0 10px 30px rgba(2,6,23,.18); background:#fff; border:1px solid #e2e8f0; animation: fadein .2s ease-out }
  .cm-toast.succ{ border-color:#86efac; background:#ecfdf5 }
  .cm-toast.err{ border-color:#fecaca; background:#fef2f2 }
  .cm-toast.info{ border-color:#bae6fd; background:#eff6ff }
  .cm-toast.warn{ border-color:#fde68a; background:#fffbeb }
  .cm-toast .icon{ width:18px; height:18px; display:inline-block }
  .cm-toast .msg{ flex:1; font-size:13px }
  .cm-toast .x{ border:0; background:transparent; cursor:pointer; font-size:16px; opacity:.6 }
  .cm-toast .x:hover{ opacity: 1 }
  @keyframes fadein { from{ opacity:0; transform: translateY(6px)} to{ opacity:1; transform: translateY(0)} }
  `]
})
export class ToastContainerComponent {
  items: ToastItem[] = [];
  constructor(private toasts: ToastService) {
    this.toasts.toasts$.subscribe(t => {
      this.items = [...this.items, t];
      setTimeout(() => this.close(t.id), 3500);
    });
  }
  close(id: number){ this.items = this.items.filter(x => x.id !== id); }
  icon(type: ToastItem['type']){
    const c = encodeURIComponent(type==='success'?'#16a34a':type==='error'?'#ef4444':type==='info'?'#0ea5e9':'#f59e0b');
    if(type==='success') return `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="${decodeURIComponent(c)}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;
    if(type==='error') return `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="${decodeURIComponent(c)}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M15 9 9 15M9 9l6 6"/></svg>`;
    if(type==='warn') return `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="${decodeURIComponent(c)}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="${decodeURIComponent(c)}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`;
  }
}

