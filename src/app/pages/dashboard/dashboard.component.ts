import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { BookingService } from '../../core/services/booking.service';
import { Booking, ServiceType, BookingStatus } from '../../core/models/booking.model';
import { AuthService } from '../../core/services/auth.service';
import { AiService } from '../../core/services/ai.service';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  nextBooking: Booking | null = null;
  loadingNext = false;
  errorNext: string | null = null;
  carePlanLoading = false;
  carePlanText: string | null = null;

  constructor(
    private bookingService: BookingService,
    private auth: AuthService,
    private ai: AiService,
    private toast: ToastService
  ) {
    this.loadNext();
  }

  private loadNext() {
    this.loadingNext = true;
    this.errorNext = null;
    this.bookingService.myBookings().subscribe({
      next: (list) => {
        // Filtramos reservas futuras que no estén canceladas ni completadas
        const nowIso = new Date().toISOString().slice(0, 16);
        const upcoming = list.filter(b =>
          (b.date + 'T' + b.time) >= nowIso &&
          b.status !== 'REJECTED' &&
          b.status !== 'COMPLETED'
        );
        const sorted = [...upcoming].sort((a, b) => (a.date + 'T' + a.time).localeCompare(b.date + 'T' + b.time));
        this.nextBooking = sorted[0] || null;
        this.loadingNext = false;
      },
      error: () => {
        this.nextBooking = null;
        this.errorNext = 'No pudimos cargar tu próxima reserva.';
        this.loadingNext = false;
      }
    });
  }

  serviceLabel(type: ServiceType): string {
    switch (type) {
      case 'BATH': return 'Baño';
      case 'HAIRCUT': return 'Corte de pelo';
      case 'NAIL_TRIM': return 'Corte de uñas';
      case 'FULL_GROOMING': return 'Servicio completo';
      default: return String(type);
    }
  }

  statusLabel(status: BookingStatus): string {
    switch (status) {
      case 'PENDING': return 'Pendiente';
      case 'APPROVED': return 'Aprobada';
      case 'ON_ROUTE': return 'En camino';
      case 'COMPLETED': return 'Completada';
      case 'REJECTED': return 'Rechazada';
      default: return String(status);
    }
  }

  isClient(): boolean {
    return this.auth.isClient();
  }

  isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  isGroomer(): boolean {
    return this.auth.isGroomer();
  }

  generateWeeklyCarePlan() {
    this.carePlanLoading = true;
    this.carePlanText = null;
    this.ai.getWeeklyCarePlan().subscribe({
      next: (res) => {
        this.carePlanText = res.planText;
        this.carePlanLoading = false;
      },
      error: (err) => {
        this.carePlanLoading = false;
        this.toast.errorFrom(err, 'No se pudo generar el plan semanal de cuidado.');
      }
    });
  }
}
