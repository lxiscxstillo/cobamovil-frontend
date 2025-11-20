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
    this.error = null;
    this.service.list().subscribe({
      next: d => this.items = d,
      error: e => this.error = e.error?.message || 'No pudimos cargar la lista de peluqueros. Inténtalo de nuevo.'
    });
  }

  create() {
    this.error = null;
    this.service.create(this.model).subscribe({
      next: () => {
        this.model = { username: '', email: '', password: '', phone: '', avatarUrl: '', bio: '', specialties: '' };
        this.load();
      },
      error: e => this.error = e.error?.message || 'No pudimos crear el peluquero. Revisa los datos e inténtalo de nuevo.'
    });
  }

  delete(g: GroomerProfile) {
    if (!confirm(`¿Seguro que quieres eliminar al peluquero "${g.username}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    this.error = null;
    this.service.delete(g.userId).subscribe({
      next: () => this.load(),
      error: e => this.error = e.error?.message || 'No pudimos eliminar el peluquero. Inténtalo de nuevo.'
    });
  }
}

