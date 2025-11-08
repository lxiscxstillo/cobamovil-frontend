import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { BookingService } from '../../core/services/booking.service';
import { Booking } from '../../core/models/booking.model';

@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './mis-reservas.component.html',
  styleUrls: ['./mis-reservas.component.scss']
})
export class MisReservasComponent {
  loading = false;
  error: string | null = null;
  items: Booking[] = [];

  constructor(private bookingService: BookingService) {
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
}

