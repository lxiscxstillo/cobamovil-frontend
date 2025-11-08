import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../shared/header/header.component';
import { GroomerService, GroomerProfile } from '../../../core/services/groomer.service';

@Component({
  selector: 'app-admin-groomers',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './admin-groomers.component.html',
  styleUrls: ['./admin-groomers.component.scss']
})
export class AdminGroomersComponent {
  items: GroomerProfile[] = [];
  error: string | null = null;
  model: any = { username: '', email: '', password: '', phone: '', avatarUrl: '', bio: '', specialties: '' };

  constructor(private service: GroomerService) { this.load(); }

  load() {
    this.service.list().subscribe({ next: d => this.items = d, error: e => this.error = e.error?.message || 'Error cargando peluqueros' });
  }

  create() {
    this.service.create(this.model).subscribe({ next: () => { this.model = { username: '', email: '', password: '', phone: '', avatarUrl: '', bio: '', specialties: '' }; this.load(); }, error: e => this.error = e.error?.message || 'Error creando peluquero' });
  }
}

