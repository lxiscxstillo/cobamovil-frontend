import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { BookingService } from '../../core/services/booking.service';
import { Booking } from '../../core/models/booking.model';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './mis-reservas.component.html',
  styleUrls: ['./mis-reservas.component.scss']
})
export class MisReservasComponent {
  loading = false;
  error: string | null = null;
  items: Booking[] = [];
  expanded = new Set<number>();
  editing = new Set<number>();
  reschedule: Record<number, { date?: string; time?: string }> = {};
  rescheduleError: Record<number, string | null> = {};

  constructor(private bookingService: BookingService, private toast: ToastService) {
    this.load();
  }

  load() {
    this.loading = true;
    this.error = null;
    this.bookingService.myBookings().subscribe({
      next: d => {
        const now = new Date();
        const nowIso = now.toISOString().slice(0, 16);
        // Solo mostramos reservas futuras que no estén canceladas
        this.items = d.filter(b => (b.date + 'T' + b.time) >= nowIso && b.status !== 'REJECTED');
      },
      error: e => this.error = e.error?.message || 'Error cargando reservas',
      complete: () => this.loading = false
    });
  }

  toggleExpand(id: number) {
    if (this.expanded.has(id)) this.expanded.delete(id); else this.expanded.add(id);
  }
  isExpanded(id: number) { return this.expanded.has(id); }

  toggleEdit(id: number) {
    if (this.editing.has(id)) this.editing.delete(id); else this.editing.add(id);
  }
  isEditing(id: number) { return this.editing.has(id); }

  canModify(b: Booking): boolean {
    // Solo se pueden cancelar o reprogramar citas que aún están pendientes
    return b.status === 'PENDING';
  }

  mapsUrl(b: Booking): string {
    if (b.latitude && b.longitude) return `https://maps.google.com/?q=${b.latitude},${b.longitude}`;
    if (b.address) return `https://maps.google.com/?q=${encodeURIComponent(b.address)}`;
    return 'https://maps.google.com/';
  }

  doCancel(b: Booking) {
    if (!this.canModify(b)) {
      this.toast.warn('Esta cita ya fue aceptada por el peluquero, por lo tanto ya no puede ser modificada.');
      return;
    }
    this.bookingService.cancel(b.id).subscribe({
      next: () => { this.toast.canceled('Reserva'); this.load(); },
      error: e => this.toast.errorFrom(e, 'No pudimos cancelar la reserva. Inténtalo de nuevo.')
    });
  }

  doReschedule(b: Booking) {
    if (!this.canModify(b)) {
      this.toast.warn('Esta cita ya fue aceptada por el peluquero, por lo tanto ya no puede ser modificada.');
      return;
    }
    const r = this.reschedule[b.id] || {};
    this.rescheduleError[b.id] = null;
    if (!r.date || !r.time) {
      this.rescheduleError[b.id] = 'Selecciona fecha y hora para reprogramar.';
      this.toast.warn('Selecciona fecha y hora');
      return;
    }
    const nowIso = new Date().toISOString().slice(0, 16);
    const candidateIso = `${r.date}T${r.time}`;
    if (candidateIso < nowIso) {
      this.rescheduleError[b.id] = 'No puedes seleccionar una fecha anterior a la actual.';
      this.toast.warn(this.rescheduleError[b.id]!);
      return;
    }
    this.bookingService.checkAvailability(r.date, r.time, b.serviceType).subscribe({
      next: (resp) => {
        if (!resp.available) {
          this.rescheduleError[b.id] = resp.message || 'Ese horario no est� disponible. Elige otro.';
          this.toast.warn(this.rescheduleError[b.id]!);
          return;
        }
        this.bookingService.reschedule(b.id, r.date!, r.time!, b.serviceType).subscribe({
          next: () => {
            this.toast.reprogrammed('Reserva');
            this.load();
            this.editing.delete(b.id);
            this.rescheduleError[b.id] = null;
          },
          error: e => this.toast.errorFrom(e, 'Error al reprogramar')
        });
      },
      error: (e) => {
        this.rescheduleError[b.id] = 'No pudimos validar la disponibilidad. Intenta de nuevo.';
        this.toast.errorFrom(e, 'Error al validar disponibilidad');
      }
    });
  }
}




