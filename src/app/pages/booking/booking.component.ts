import { Component } from '@angular/core';
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

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, HeaderComponent],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent {
  submitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  services: { label: string; value: ServiceType }[] = [
    { label: 'Baño', value: 'BATH' },
    { label: 'Corte de pelo', value: 'HAIRCUT' },
    { label: 'Corte de uñas', value: 'NAIL_TRIM' },
    { label: 'Servicio completo', value: 'FULL_GROOMING' },
  ];


  form!: FormGroup;

  constructor(private fb: FormBuilder, private bookingService: BookingService) {
    this.form = this.fb.group({
      petId: [null, [Validators.required]],
      serviceType: [null as ServiceType | null, [Validators.required]],
      date: [null as Date | null, [Validators.required]],
      time: ['', [Validators.required]],
      address: [''],
      notes: ['']
    });
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
      address: v.address || undefined,
      notes: v.notes || undefined,
    };

    this.bookingService.create(payload).subscribe({
      next: () => {
        this.successMessage = '¡Reserva creada! Pronto confirmaremos tu cita.';
        this.form.reset();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al crear la reserva. Inténtalo de nuevo.';
      },
      complete: () => {
        this.submitting = false;
      }
    });
  }

  private toIsoDate(d: Date): string {
    const pad = (n: number) => (n < 10 ? `0${n}` : String(n));
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }
}

