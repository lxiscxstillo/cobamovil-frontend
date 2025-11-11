import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BookingService } from '../../core/services/booking.service';
import { BookingCreateRequest, ServiceType } from '../../core/models/booking.model';
import { HeaderComponent } from '../../shared/header/header.component';
import { HttpClient } from '@angular/common/http';
import { Pet } from '../../core/models/pet.model';
import { environment } from '../../../environments/environment';
import { MapPickerComponent } from '../../shared/map-picker/map-picker.component';
import { MapsLoaderService } from '../../core/services/maps-loader.service';
import { GroomerService, GroomerProfile } from '../../core/services/groomer.service';
import { ToastService } from '../../shared/toast/toast.service';

declare const google: any;

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, HeaderComponent, MapPickerComponent],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements AfterViewInit {
  @ViewChild('addressInput') addressInput!: ElementRef<HTMLInputElement>;
  submitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  pets: Pet[] = [];
  groomers: GroomerProfile[] = [];
  pickedLat?: number;
  pickedLng?: number;

  services: { label: string; value: ServiceType }[] = [
    { label: 'Baño', value: 'BATH' },
    { label: 'Corte de pelo', value: 'HAIRCUT' },
    { label: 'Corte de uñas', value: 'NAIL_TRIM' },
    { label: 'Servicio completo', value: 'FULL_GROOMING' },
  ];

  // Wizard state
  currentStep = 1; // 1 Mascota, 2 Servicio, 3 Fecha/hora, 4 Dirección, 5 Peluquero

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private http: HttpClient,
    private mapsLoader: MapsLoaderService,
    private groomerService: GroomerService,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      petId: [null, [Validators.required]],
      serviceType: [null as ServiceType | null, [Validators.required]],
      // For <input type="date"> the control value is a string "YYYY-MM-DD"
      date: [null as unknown as string | Date | null, [Validators.required]],
      time: ['', [Validators.required]],
      address: [''],
      notes: [''],
      groomerId: [null]
    });
    this.loadPets();
    this.loadGroomers();
  }

  ngAfterViewInit(): void {
    try {
      if (typeof window === 'undefined') return;
      this.mapsLoader.load().then(() => {
        const input = this.addressInput?.nativeElement;
        if (!input) return;
        const autocomplete = new google.maps.places.Autocomplete(input, { fields: ['formatted_address','geometry'] });
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          const addr = place?.formatted_address;
          const loc = place?.geometry?.location;
          if (addr) this.form.get('address')?.setValue(addr);
          if (loc) {
            const lat = loc.lat();
            const lng = loc.lng();
            this.pickedLat = lat; this.pickedLng = lng;
          }
        });
      });
    } catch {}
  }

  next() { if (this.isStepValid(this.currentStep)) this.currentStep = Math.min(5, this.currentStep + 1); }
  back() { this.currentStep = Math.max(1, this.currentStep - 1); }
  isStepValid(step: number) {
    switch (step) {
      case 1: return !!this.form.get('petId')?.value;
      case 2: return !!this.form.get('serviceType')?.value;
      case 3: return !!this.form.get('date')?.value && !!this.form.get('time')?.value;
      case 4: return !!(this.form.get('address')?.value || (this.pickedLat && this.pickedLng));
      case 5: return true;
      default: return true;
    }
  }

  submit() {
    if (this.form.invalid) return;
    this.submitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    const v = this.form.value;
    const payload: BookingCreateRequest = {
      petId: Number(v.petId),
      serviceType: v.serviceType!,
      date: this.toIsoDate(v.date!),
      time: v.time!,
      groomerId: v['groomerId'] ? Number((v as any)['groomerId']) : undefined,
      address: v.address || undefined,
      latitude: this.pickedLat,
      longitude: this.pickedLng,
      notes: v.notes || undefined,
    };

    this.bookingService.create(payload).subscribe({
      next: () => {
        this.successMessage = '¡Reserva creada! Pronto confirmaremos tu cita.';
        this.toast.created('Reserva');
        this.form.reset();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al crear la reserva. Inténtalo de nuevo.';
        this.toast.errorFrom(err, 'Error al crear la reserva');
        this.submitting = false;
      },
      complete: () => {
        this.submitting = false;
      }
    });
  }

  private toIsoDate(d: unknown): string {
    // If already a string from <input type="date">, pass through (YYYY-MM-DD)
    if (typeof d === 'string') return d;
    const pad = (n: number) => (n < 10 ? `0${n}` : String(n));
    if (d instanceof Date) {
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    }
    try {
      const dt = new Date(d as any);
      if (!isNaN(dt.getTime())) {
        return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
      }
    } catch {}
    // Fallback: empty string to avoid crashing; caller validates form required
    return '';
  }

  onMapPositionChange(pos: { lat: number; lng: number }) {
    this.pickedLat = pos.lat;
    this.pickedLng = pos.lng;
  }

  get availableTimes(): string[] {
    const out: string[] = [];
    for (let h = 9; h <= 18; h++) {
      for (const m of [0, 30]) {
        out.push(`${('0'+h).slice(-2)}:${('0'+m).slice(-2)}`);
      }
    }
    return out;
  }

  private loadPets() {
    this.http.get<Pet[]>(`${environment.apiUrl}/pets`).subscribe({
      next: data => this.pets = data,
      error: () => {}
    });
  }

  private loadGroomers() {
    this.groomerService.list().subscribe({ next: list => this.groomers = list, error: () => {} });
  }
}





