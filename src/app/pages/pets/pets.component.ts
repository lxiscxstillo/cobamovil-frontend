import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PetService } from '../../core/services/pet.service';
import { Pet } from '../../core/models/pet.model';
import { HeaderComponent } from '../../shared/header/header.component';

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

  constructor(private petService: PetService) {
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
      next: () => { this.model = { name: '', breed: '', sex: 'M' }; this.load(); },
      error: err => this.error = err.error?.message || 'Error creando mascota'
    });
  }

  remove(id: number) {
    this.petService.delete(id).subscribe({
      next: () => this.load(),
      error: err => this.error = err.error?.message || 'Error eliminando mascota'
    });
  }
}
