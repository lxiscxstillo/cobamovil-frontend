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
import { Router } from '@angular/router';

declare const google: any;

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    HeaderComponent,
    MapPickerComponent
  ],
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
  submitted = false;
  noPetsMessage: string | null = null;
  availabilityMessage: string | null = null;
  availabilityOk: boolean | null = null;
  availableGroomerIds: number[] | null = null;

  services: { label: string; value: ServiceType }[] = [
    { label: 'Baño', value: 'BATH' },
    { label: 'Corte de pelo', value: 'HAIRCUT' },
    { label: 'Corte de uñas', value: 'NAIL_TRIM' },
    { label: 'Servicio completo', value: 'FULL_GROOMING' }
  ];

  // Wizard state
  // 1 Fecha/hora, 2 Mascota, 3 Servicio, 4 Dirección, 5 Peluquero
  currentStep = 1;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private http: HttpClient,
    private mapsLoader: MapsLoaderService,
    private groomerService: GroomerService,
    private toast: ToastService,
    private router: Router
  ) {
    this.form = this.fb.group({
      petId: [null, [Validators.required]],
      serviceType: [null as ServiceType | null, [Validators.required]],
      // For <input type="date"> the control value is a string "YYYY-MM-DD"
      date: [null as unknown as string | Date | null, [Validators.required]],
      time: ['', [Validators.required]],
      address: [''],
      notes: ['', [Validators.required, Validators.maxLength(300)]],
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
        const autocomplete = new google.maps.places.Autocomplete(input, { fields: ['formatted_address', 'geometry'] });
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          const addr = place?.formatted_address;
          const loc = place?.geometry?.location;
          if (addr) this.form.get('address')?.setValue(addr);
          if (loc) {
            const lat = loc.lat();
            const lng = loc.lng();
            this.pickedLat = lat;
            this.pickedLng = lng;
          }
        });
      });
    } catch {}
  }

  next() {
    if (this.isStepValid(this.currentStep)) this.currentStep = Math.min(5, this.currentStep + 1);
  }

  back() {
    this.currentStep = Math.max(1, this.currentStep - 1);
  }

  goToStep(target: number) {
    if (target < 1 || target > 5) return;
    if (target <= this.currentStep) {
      this.currentStep = target;
      return;
    }
    // Intento de ir hacia adelante: validamos pasos previos
    this.submitted = true;
    for (let step = 1; step < target; step++) {
      if (!this.isStepValid(step)) {
        return;
      }
    }
    this.currentStep = target;
  }

  isStepValid(step: number) {
    switch (step) {
      case 1: {
        const d = this.form.get('date')?.value;
        const t = this.form.get('time')?.value;
        const hasDateTime = !!d && !!t;
        // FIX: combinamos fecha + hora en un Date local para comparar correctamente contra "ahora"
        const candidate = hasDateTime ? this.buildLocalDateTime(d, t) : null;
        const notPast = !!candidate && candidate.getTime() >= Date.now();
        return hasDateTime && notPast && this.availabilityOk !== false;
      }
      case 2:
        return !!this.form.get('petId')?.value;
      case 3:
        return !!this.form.get('serviceType')?.value;
      case 4:
        return !!(this.form.get('address')?.value || (this.pickedLat && this.pickedLng));
      case 5:
        return true;
      default:
        return true;
    }
  }

  private isFutureDate(d: unknown): boolean {
    try {
      const str = typeof d === 'string' ? d : this.toIsoDate(d);
      if (!str) return false;
      const today = new Date();
      const dt = new Date(str + 'T00:00:00');
      // allow booking from today  (>= today). Change to > for strictly future
      return dt.setHours(0, 0, 0, 0) >= new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    } catch {
      return false;
    }
  }

  submit() {
    this.submitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      const firstInvalid = Object.keys(this.form.controls).find(key => this.form.get(key)?.invalid);
      if (firstInvalid) {
        const el = document.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
          `[formControlName="${firstInvalid}"]`
        );
        if (el) el.focus();
      }
      return;
    }
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
      notes: v.notes!
    };

    this.bookingService.create(payload).subscribe({
      next: () => {
        this.successMessage = '¡Reserva creada! Pronto confirmaremos tu cita.';
        this.toast.created('Reserva');
        this.form.reset();
      },
      error: err => {
        this.errorMessage = err.error?.message || 'Error al crear la reserva. Inténtalo de nuevo.';
        this.toast.errorFrom(err, 'Error al crear la reserva');
        this.submitting = false;
      },
      complete: () => {
        this.submitting = false;
      }
    });
    // FIX: si la reserva se crea correctamente, redirigimos al dashboard
    setTimeout(() => {
      if (this.successMessage) {
        this.router.navigate(['/dashboard']);
      }
    }, 0);
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

  private buildLocalDateTime(d: unknown, t: string): Date | null {
    // FIX: evitamos construir Date desde string ISO (UTC); usamos componentes locales año/mes/día/hora/minuto
    const dateStr = typeof d === 'string' ? d : this.toIsoDate(d);
    if (!dateStr || !t) return null;
    const [yearStr, monthStr, dayStr] = dateStr.split('-');
    const [hourStr, minuteStr] = t.split(':');
    const year = Number(yearStr);
    const month = Number(monthStr);
    const day = Number(dayStr);
    const hour = Number(hourStr);
    const minute = Number(minuteStr);
    if (!year || !month || !day || isNaN(hour) || isNaN(minute)) return null;
    return new Date(year, month - 1, day, hour, minute, 0, 0);
  }

  onMapPositionChange(pos: { lat: number; lng: number }) {
    this.pickedLat = pos.lat;
    this.pickedLng = pos.lng;
  }

  get availableTimes(): string[] {
    const out: string[] = [];
    for (let h = 9; h <= 18; h++) {
      for (const m of [0, 30]) {
        out.push(`${('0' + h).slice(-2)}:${('0' + m).slice(-2)}`);
      }
    }
    return out;
  }

  formatTime12h(t: string): string {
    const [hStr, mStr] = t.split(':');
    let h = Number(hStr);
    const suffix = h >= 12 ? 'p. m.' : 'a. m.';
    if (h === 0) h = 12;
    if (h > 12) h = h - 12;
    return `${h}:${mStr} ${suffix}`;
  }

  isTimeDisabled(t: string): boolean {
    const d = this.form.get('date')?.value;
    if (!d) return false;
    // FIX: deshabilitar horas pasadas usando la combinación fecha+hora en horario local
    const candidate = this.buildLocalDateTime(d, t);
    if (!candidate) return false;
    return candidate.getTime() < Date.now();
  }

  onDateInputChange(value: string) {
    this.form.get('date')?.setValue(value);
    this.validateDateAndAvailability();
  }

  selectTime(value: string) {
    this.form.get('time')?.setValue(value);
    this.validateDateAndAvailability();
  }

  private validateDateAndAvailability() {
    this.availabilityMessage = null;
    this.availabilityOk = null;
    const d = this.form.get('date')?.value;
    const t = this.form.get('time')?.value;
    if (!d || !t) return;
    // FIX: validamos que la fecha+hora completas no estén en el pasado antes de consultar disponibilidad
    const candidate = this.buildLocalDateTime(d, t);
    if (!candidate) return;
    if (candidate.getTime() < Date.now()) {
      this.availabilityMessage = 'No puedes seleccionar una hora pasada del día de hoy.';
      this.availabilityOk = false;
      this.availableGroomerIds = null;
      return;
    }
    const dateIso = typeof d === 'string' ? d : this.toIsoDate(d);
    this.bookingService.checkAvailability(dateIso, t, 'FULL_GROOMING').subscribe({
      next: resp => {
        this.availabilityMessage = resp.message;
        this.availabilityOk = resp.available;
        this.availableGroomerIds = resp.groomerIds || [];
      },
      error: () => {
        this.availabilityMessage = 'No pudimos validar la disponibilidad. Intenta de nuevo.';
        this.availabilityOk = false;
        this.availableGroomerIds = null;
      }
    });
  }

  private loadPets() {
    this.http.get<Pet[]>(`${environment.apiUrl}/pets`).subscribe({
      next: data => {
        this.pets = data;
        if (!data.length) {
          this.noPetsMessage = 'Aún no tienes mascotas registradas. Agrega una antes de continuar.';
        }
      },
      error: () => {
        this.noPetsMessage = 'No pudimos cargar tus mascotas.';
      }
    });
  }

  private loadGroomers() {
    this.groomerService.list().subscribe({
      next: list => (this.groomers = list),
      error: () => {}
    });
  }
}
