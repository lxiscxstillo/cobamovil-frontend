import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="skeleton" [style.width.%]="widthPct" [style.height.px]="height"></div>
  `,
  styles: [`
  .skeleton{ display:block; background: linear-gradient(90deg,#f1f5f9 25%, #e2e8f0 37%, #f1f5f9 63%);
             background-size:400% 100%; animation: shimmer 1.2s ease-in-out infinite; border-radius:12px }
  @keyframes shimmer{ 0%{ background-position:100% 0 } 100%{ background-position:0 0 } }
  `]
})
export class SkeletonComponent {
  @Input() widthPct = 100;
  @Input() height = 16;
}

