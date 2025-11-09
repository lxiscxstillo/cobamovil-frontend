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

  constructor(private bookingService: BookingService, private toast: ToastService) {
    this.load();
  }

  load() {
    this.loading = true;
    this.error = null;
    this.bookingService.myBookings().subscribe({
      next: d => this.items = d,
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

  mapsUrl(b: Booking): string {
    if (b.latitude && b.longitude) return `https://maps.google.com/?q=${b.latitude},${b.longitude}`;
    if (b.address) return `https://maps.google.com/?q=${encodeURIComponent(b.address)}`;
    return 'https://maps.google.com/';
  }

  doCancel(id: number) {
    this.bookingService.cancel(id).subscribe({
      next: () => { this.toast.success('Reserva cancelada'); this.load(); },
      error: e => this.toast.error(e.error?.message || 'Error al cancelar')
    });
  }

  doReschedule(b: Booking) {
    const r = this.reschedule[b.id] || {};
    if (!r.date || !r.time) { this.toast.error('Selecciona fecha y hora'); return; }
    this.bookingService.reschedule(b.id, r.date, r.time, b.serviceType).subscribe({
      next: () => { this.toast.success('Reserva reprogramada'); this.load(); this.editing.delete(b.id); },
      error: e => this.toast.error(e.error?.message || 'Error al reprogramar')
    });
  }
}
