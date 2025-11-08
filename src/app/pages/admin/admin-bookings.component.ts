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
  useOptimized = true;
  savingRoute = false;

  constructor(private bookingService: BookingService) {
    this.load();
  }

  load() {
    this.loading = true;
    this.error = null;
    this.bookingService.adminBookingsForDay(this.date).subscribe({
      next: data => {
        this.items = data;
        if (this.useOptimized) this.fetchAndApplyOptimized();
      },
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

  moveUp(i: number) {
    if (i <= 0) return;
    const tmp = this.items[i-1];
    this.items[i-1] = this.items[i];
    this.items[i] = tmp;
  }

  moveDown(i: number) {
    if (i >= this.items.length - 1) return;
    const tmp = this.items[i+1];
    this.items[i+1] = this.items[i];
    this.items[i] = tmp;
  }

  saveRoute() {
    this.savingRoute = true;
    const ids = this.items.filter(b => (b as any).status === 'APPROVED').map(b => b.id);
    this.bookingService.saveRoute(this.date, ids).subscribe({
      next: () => {},
      error: err => this.error = err.error?.message || 'Error guardando ruta',
      complete: () => this.savingRoute = false
    });
  }

  applyOptimizedOrder(routeIds: number[]) {
    const map = new Map(this.items.map(i => [i.id, i]));
    const ordered: Booking[] = [];
    for (const id of routeIds) { const b = map.get(id); if (b) ordered.push(b); }
    for (const b of this.items) if (!routeIds.includes(b.id)) ordered.push(b);
    this.items = ordered;
  }

  private fetchAndApplyOptimized() {
    // For now request general route (admin scope). Could be filtered by groomer later.
    fetch(`${location.origin}/api/bookings/admin/route?date=${this.date}`, { credentials: 'include' })
      .then(r => r.json()).then((dto: any) => {
        if (dto && Array.isArray(dto.bookingIdsInOrder)) this.applyOptimizedOrder(dto.bookingIdsInOrder);
      }).catch(() => {});
  }
}
