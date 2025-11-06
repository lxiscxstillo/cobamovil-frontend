import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { HeaderComponent } from '../../shared/header/header.component';
import { FloatingWhatsappComponent } from '../../shared/floating-whatsapp/floating-whatsapp.component';

interface Faq { id: number; question: string; answer: string; }

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FloatingWhatsappComponent],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent {
  loading = true;
  error: string | null = null;
  items: Faq[] = [];

  constructor(private http: HttpClient) {
    this.http.get<Faq[]>(`${environment.apiUrl}/faq`).subscribe({
      next: data => this.items = data,
      error: () => this.error = 'No pudimos cargar las preguntas frecuentes.',
      complete: () => this.loading = false
    });
  }
}
