import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PetService } from '../../core/services/pet.service';
import { Pet } from '../../core/models/pet.model';
import { HeaderComponent } from '../../shared/header/header.component';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { EmptyStateComponent } from '../../shared/empty-state/empty-state.component';
import { ToastService } from '../../shared/toast/toast.service';
import { ModalComponent } from '../../shared/modal/modal.component';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-pets',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, LoaderComponent, EmptyStateComponent, ModalComponent],
  templateUrl: './pets.component.html',
  styleUrls: ['./pets.component.scss']
})
export class PetsComponent {
  items: Pet[] = [];
  loading = false;
  error: string | null = null;

  model: Partial<Pet> = {
    name: '',
    breed: '',
    sex: 'M',
    age: undefined,
    weight: undefined,
    behavior: '',
    healthNotes: '',
    vaccinations: '',
    deworming: '',
    medicalConditions: '',
    lastGroomDate: ''
  };

  // UI state
  showForm = false;
  expandedIds = new Set<number>();
  submittedAdd = false;
  confirmOpen = false;
  private pendingDelete?: Pet;
  private lastDeleted?: Pet;

  @ViewChild('nameInput') nameInput?: ElementRef<HTMLInputElement>;
  @ViewChild('ageInput') ageInput?: ElementRef<HTMLInputElement>;
  @ViewChild('weightInput') weightInput?: ElementRef<HTMLInputElement>;

  constructor(private petService: PetService, private toast: ToastService) {
    this.load();
    // Load draft
    try { const raw = localStorage.getItem('pets.formDraft'); if (raw) this.model = JSON.parse(raw); } catch {}
  }

  load() {
    this.loading = true;
    this.error = null;
    this.petService.list().subscribe({
      next: (data) => (this.items = data),
      error: (err) => (this.error = err?.error?.message || 'Error cargando mascotas'),
      complete: () => (this.loading = false)
    });
  }

  add() {
    this.submittedAdd = true;
    const nameOk = !!(this.model.name && String(this.model.name).trim().length >= 2);
    const ageOk = this.model.age == null || (this.model.age >= 0 && this.model.age <= 30);
    const weightOk = this.model.weight == null || (this.model.weight >= 0 && this.model.weight <= 100);
    if (!(nameOk && ageOk && weightOk)) {
      if (!nameOk) this.nameInput?.nativeElement?.focus();
      else if (!ageOk) this.ageInput?.nativeElement?.focus();
      else if (!weightOk) this.weightInput?.nativeElement?.focus();
      return;
    }

    this.petService.create(this.model).subscribe({
      next: () => {
        this.model = { name: '', breed: '', sex: 'M' };
        this.submittedAdd = false;
        this.load();
        this.toast.created('Mascota');
        try { localStorage.removeItem('pets.formDraft'); } catch {}
      },
      error: (err) => {
        this.error = err?.error?.message || 'Error creando mascota';
        this.toast.errorFrom(err, 'Error');
      }
    });
  }

  openDelete(p: Pet){ this.pendingDelete = p; this.confirmOpen = true; }
  confirmDelete(){
    const p = this.pendingDelete; this.confirmOpen = false; if (!p) return;
    this.lastDeleted = { ...p };
    this.petService.delete(p.id!).subscribe({
      next: () => {
        this.load();
        this.toast.action('info', 'Mascota eliminada', 'Deshacer', () => {
          if (!this.lastDeleted) return;
          const clone = { ...this.lastDeleted } as any; delete clone.id;
          this.petService.create(clone).subscribe({ next: () => this.load() });
        });
      },
      error: (err) => {
        this.error = err?.error?.message || 'Error eliminando mascota';
        this.toast.errorFrom(err, 'Error');
      }
    });
  }
  cancelDelete(){ this.confirmOpen = false; this.pendingDelete = undefined; }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  persistDraft(){
    try { localStorage.setItem('pets.formDraft', JSON.stringify(this.model)); } catch {}
  }

  isExpanded(id?: number): boolean {
    return !!(id && this.expandedIds.has(id));
  }

  toggleExpand(id?: number) {
    if (!id) return;
    if (this.expandedIds.has(id)) this.expandedIds.delete(id);
    else this.expandedIds.add(id);
  }
}

