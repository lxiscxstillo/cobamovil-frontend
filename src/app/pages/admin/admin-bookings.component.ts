import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Booking, BookingStatus } from '../../core/models/booking.model';
import { BookingService } from '../../core/services/booking.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { MapRouteComponent } from '../../shared/map-route/map-route.component';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, MapRouteComponent],
  templateUrl: './admin-bookings.component.html',
  styleUrls: ['./admin-bookings.component.scss']
})
export class AdminBookingsComponent {
  date: string = new Date().toISOString().slice(0, 10);
  loading = false;
  error: string | null = null;
  items: Booking[] = [];

  constructor(private bookingService: BookingService) {
    this.load();
  }

  load() {
    this.loading = true;
    this.error = null;
    this.bookingService.adminBookingsForDay(this.date).subscribe({
      next: data => this.items = data,
      error: err => this.error = err.error?.message || 'Error cargando reservas',
      complete: () => this.loading = false
    });
  }

  changeStatus(b: Booking, status: BookingStatus) {
    this.bookingService.updateStatus(b.id, status).subscribe({
      next: updated => {
        const idx = this.items.findIndex(x => x.id === updated.id);
        if (idx >= 0) this.items[idx] = updated;
      },
      error: err => this.error = err.error?.message || 'Error actualizando estado'
    });
  }

  get routePoints() {
    return this.items
      .filter(b => (b as any).latitude != null && (b as any).longitude != null)
      .map(b => ({ lat: (b as any).latitude as number, lng: (b as any).longitude as number, label: `${b.time} - ${b.petName}` }));
  }
}
