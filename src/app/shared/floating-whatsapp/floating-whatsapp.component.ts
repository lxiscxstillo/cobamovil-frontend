import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-floating-whatsapp',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './floating-whatsapp.component.html',
  styleUrls: ['./floating-whatsapp.component.scss']
})
export class FloatingWhatsappComponent {
  get href() {
    // Fallback to configured number if present, else sample number
    const raw = (environment as any).whatsappNumber || '573001112233';
    return `https://wa.me/${raw}`;
  }
}
