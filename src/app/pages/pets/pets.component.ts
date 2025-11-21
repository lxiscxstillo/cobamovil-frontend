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
import { AiService, PetAiRecommendation } from '../../core/services/ai.service';
import { NombreServicioBonitoPipe } from '../../shared/pipes/nombre-servicio-bonito.pipe';

@Component({
  selector: 'app-pets',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, LoaderComponent, EmptyStateComponent, ModalComponent, NombreServicioBonitoPipe],
  templateUrl: './pets.component.html',
  styleUrls: ['./pets.component.scss']
})
export class PetsComponent {
  items: Pet[] = [];
  loading = false;
  error: string | null = null;

  private readonly NAME_MIN = 2;
  private readonly NAME_MAX = 40;
  private readonly AGE_MIN = 0;
  private readonly AGE_MAX = 30;
  private readonly WEIGHT_MIN = 0;
  private readonly WEIGHT_MAX = 100;

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
  pendingDelete?: Pet;
  private lastDeleted?: Pet;
  recommendations: { [petId: number]: PetAiRecommendation } = {};
  aiLoading: { [petId: number]: boolean } = {};
  overviewLoading = false;
  petsOverviewText: string | null = null;
  normalizeHealthLoading = false;
  normalizeBehaviorLoading = false;

  @ViewChild('nameInput') nameInput?: ElementRef<HTMLInputElement>;
  @ViewChild('ageInput') ageInput?: ElementRef<HTMLInputElement>;
  @ViewChild('weightInput') weightInput?: ElementRef<HTMLInputElement>;

  constructor(private petService: PetService, private aiService: AiService, private toast: ToastService) {
    this.load();
    // Load draft
    try {
      const raw = localStorage.getItem('pets.formDraft');
      if (raw) this.model = JSON.parse(raw);
    } catch {}
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
    const nameLen = this.model.name ? String(this.model.name).trim().length : 0;
    const nameOk = !!(this.model.name && nameLen >= this.NAME_MIN && nameLen <= this.NAME_MAX);
    const ageOk = this.model.age == null || (this.model.age >= this.AGE_MIN && this.model.age <= this.AGE_MAX);
    const weightOk = this.model.weight == null || (this.model.weight >= this.WEIGHT_MIN && this.model.weight <= this.WEIGHT_MAX);
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
        try {
          localStorage.removeItem('pets.formDraft');
        } catch {}
      },
      error: (err) => {
        this.error = err?.error?.message || 'Error creando mascota';
        this.toast.errorFrom(err, 'Error');
      }
    });
  }

  get nameInvalid(): boolean {
    const len = this.model.name ? String(this.model.name).trim().length : 0;
    return !(this.model.name && len >= this.NAME_MIN && len <= this.NAME_MAX);
  }

  get ageInvalid(): boolean {
    if (this.model.age == null || this.model.age === undefined) return false;
    return !(this.model.age >= this.AGE_MIN && this.model.age <= this.AGE_MAX);
  }

  get weightInvalid(): boolean {
    if (this.model.weight == null || this.model.weight === undefined) return false;
    return !(this.model.weight >= this.WEIGHT_MIN && this.model.weight <= this.WEIGHT_MAX);
  }

  openDelete(p: Pet) { this.pendingDelete = p; this.confirmOpen = true; }

  confirmDelete() {
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

  cancelDelete() { this.confirmOpen = false; this.pendingDelete = undefined; }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  persistDraft() {
    try {
      localStorage.setItem('pets.formDraft', JSON.stringify(this.model));
    } catch {}
  }

  isExpanded(id?: number): boolean {
    return !!(id && this.expandedIds.has(id));
  }

  toggleExpand(id?: number) {
    if (!id) return;
    if (this.expandedIds.has(id)) this.expandedIds.delete(id);
    else this.expandedIds.add(id);
  }

  requestAiRecommendation(pet: Pet): void {
    if (!pet || !pet.id) {
      this.toast.error('No se pudo solicitar la recomendación para esta mascota.');
      return;
    }

    const petId = pet.id;
    this.aiLoading[petId] = true;

    this.aiService.getPetRecommendation(petId).subscribe({
      next: (response) => {
        this.recommendations[petId] = response;
        this.aiLoading[petId] = false;
      },
      error: () => {
        this.aiLoading[petId] = false;
        this.toast.error('No se pudo obtener la recomendación en este momento. Inténtalo más tarde.');
      }
    });
  }

  generatePetsOverview() {
    this.overviewLoading = true;
    this.petsOverviewText = null;
    this.aiService.getPetsOverview().subscribe({
      next: (res) => {
        this.petsOverviewText = res.overviewText;
        this.overviewLoading = false;
      },
      error: (err) => {
        this.overviewLoading = false;
        this.toast.errorFrom(err, 'No se pudo generar el resumen de tus mascotas.');
      }
    });
  }

  normalizeHealthNotesWithAI() {
    const raw = this.model.healthNotes || '';
    if (!raw.trim()) {
      this.toast.warn('Escribe primero algo en las notas de salud.');
      return;
    }
    this.normalizeHealthLoading = true;
    this.aiService.normalizeNotes(raw, 'SALUD').subscribe({
      next: (res) => {
        this.normalizeHealthLoading = false;
        this.model.healthNotes = res.normalizedText;
        this.persistDraft();
      },
      error: (err) => {
        this.normalizeHealthLoading = false;
        this.toast.errorFrom(err, 'No se pudo mejorar la descripción de salud.');
      }
    });
  }

  normalizeBehaviorNotesWithAI() {
    const raw = this.model.behavior || '';
    if (!raw.trim()) {
      this.toast.warn('Escribe primero algo en el comportamiento.');
      return;
    }
    this.normalizeBehaviorLoading = true;
    this.aiService.normalizeNotes(raw, 'COMPORTAMIENTO').subscribe({
      next: (res) => {
        this.normalizeBehaviorLoading = false;
        this.model.behavior = res.normalizedText;
        this.persistDraft();
      },
      error: (err) => {
        this.normalizeBehaviorLoading = false;
        this.toast.errorFrom(err, 'No se pudo mejorar la descripción del comportamiento.');
      }
    });
  }
}
