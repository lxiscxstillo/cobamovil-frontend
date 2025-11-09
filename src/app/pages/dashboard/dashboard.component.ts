import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { BookingService } from '../../core/services/booking.service';
import { Booking } from '../../core/models/booking.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  nextBooking: Booking | null = null;

  constructor(private bookingService: BookingService) {
    this.loadNext();
  }

  private loadNext() {
    this.bookingService.myBookings().subscribe({
      next: list => {
        const sorted = [...list].sort((a, b) => (a.date + 'T' + a.time).localeCompare(b.date + 'T' + b.time));
        const nowIso = new Date().toISOString().slice(0,16);
        this.nextBooking = sorted.find(b => (b.date + 'T' + b.time) >= nowIso) || null;
      },
      error: () => { this.nextBooking = null; }
    });
  }
}
