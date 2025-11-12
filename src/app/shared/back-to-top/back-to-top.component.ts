import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-back-to-top',
  standalone: true,
  imports: [CommonModule],
  template: `
  <button class="btt" *ngIf="visible" (click)="toTop()" aria-label="Volver arriba">
    ↑
  </button>
  `,
  styles: [`
  .btt{ position: fixed; right: 16px; bottom: 80px; width: 40px; height: 40px; border-radius: 999px;
        border: 0; cursor: pointer; background:#e8b83e; color:#1c170d; box-shadow:0 10px 20px rgba(0,0,0,.15);
        font-weight:800 }
  .btt:hover{ filter: brightness(1.05) }
  `]
})
export class BackToTopComponent {
  visible = false;
  private browser: boolean;
  constructor(@Inject(PLATFORM_ID) platformId: object){
    this.browser = isPlatformBrowser(platformId);
    if (this.browser) this.onScroll();
  }
  @HostListener('window:scroll') onScroll(){
    if (!this.browser) return;
    this.visible = (window.scrollY || document.documentElement.scrollTop || 0) > 400;
  }
  toTop(){ if (!this.browser) return; window.scrollTo({ top: 0, behavior: 'smooth' }); }
}

