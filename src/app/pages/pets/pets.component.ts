import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PetService } from '../../core/services/pet.service';
import { Pet } from '../../core/models/pet.model';
import { HeaderComponent } from '../../shared/header/header.component';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-pets',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './pets.component.html',
  styleUrls: ['./pets.component.scss']
})
export class PetsComponent {
  items: Pet[] = [];
  loading = false;
  error: string | null = null;

  model: Partial<Pet> = { name: '', breed: '', sex: 'M', age: undefined, weight: undefined, behavior: '', healthNotes: '', vaccinations: '', deworming: '', medicalConditions: '', lastGroomDate: '' };

  // UI state (visual only)
  showForm = false;
  expandedIds = new Set<number>();

  constructor(private petService: PetService, private toast: ToastService) {
    this.load();
  }

  load() {
    this.loading = true;
    this.error = null;
    this.petService.list().subscribe({
      next: data => this.items = data,
      error: err => this.error = err.error?.message || 'Error cargando mascotas',
      complete: () => this.loading = false
    });
  }

  add() {
    if (!this.model.name) return;
    this.petService.create(this.model).subscribe({
      next: () => { this.model = { name: '', breed: '', sex: 'M' }; this.load(); this.toast.success('Mascota aÃ±adida'); },
      error: err => { this.error = err.error?.message || 'Error creando mascota'; this.toast.errorFrom(err, 'Error'); }
    });
  }

  remove(id: number) {
    this.petService.delete(id).subscribe({
      next: () => { this.load(); this.toast.deleted('Mascota'); },
      error: err => { this.error = err.error?.message || 'Error eliminando mascota'; this.toast.errorFrom(err, 'Error'); }
    });
  }

  toggleForm() { this.showForm = !this.showForm; }
  isExpanded(id?: number): boolean { return !!(id && this.expandedIds.has(id)); }
  toggleExpand(id?: number) {
    if (!id) return;
    if (this.expandedIds.has(id)) this.expandedIds.delete(id); else this.expandedIds.add(id);
  }
}



