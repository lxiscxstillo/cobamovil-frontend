import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Booking, BookingCreateRequest, BookingStatus, ServiceType } from '../models/booking.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private baseUrl = `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient) {}

  create(req: BookingCreateRequest): Observable<Booking> {
    return this.http.post<Booking>(this.baseUrl, req);
  }

  myBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.baseUrl);
  }

  adminBookingsForDay(dateIso: string): Observable<Booking[]> {
    const params = new HttpParams().set('date', dateIso);
    return this.http.get<Booking[]>(`${this.baseUrl}/admin/day`, { params });
  }

  adminOptimizedRoute(dateIso: string, groomerId?: number): Observable<{ date: string; bookingIdsInOrder: number[]; etasMinutes?: number[]; }> {
    let params = new HttpParams().set('date', dateIso);
    if (groomerId) params = params.set('groomerId', groomerId);
    return this.http.get<{ date: string; bookingIdsInOrder: number[]; etasMinutes?: number[]; }>(`${this.baseUrl}/admin/route`, { params });
  }

  adminStartRoute(dateIso: string, groomerId?: number): Observable<{ date: string; bookingIdsInOrder: number[]; etasMinutes?: number[]; }> {
    let params = new HttpParams().set('date', dateIso);
    if (groomerId) params = params.set('groomerId', groomerId);
    return this.http.post<{ date: string; bookingIdsInOrder: number[]; etasMinutes?: number[]; }>(`${this.baseUrl}/route/start`, null, { params });
  }

  updateStatus(id: number, status: BookingStatus): Observable<Booking> {
    const params = new HttpParams().set('status', status);
    return this.http.put<Booking>(`${this.baseUrl}/${id}/status`, null, { params });
  }

  cancel(id: number) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  reschedule(id: number, dateIso: string, time: string, serviceType?: string) {
    let params = new HttpParams().set('date', dateIso).set('time', time);
    if (serviceType) params = params.set('serviceType', serviceType);
    return this.http.put<Booking>(`${this.baseUrl}/${id}/reschedule`, null, { params });
  }

  saveRoute(dateIso: string, bookingIdsInOrder: number[]) {
    const body = { date: dateIso, bookingIdsInOrder } as { date: string; bookingIdsInOrder: number[] };
    return this.http.put<void>(`${this.baseUrl}/admin/route`, body);
  }

  checkAvailability(dateIso: string, time: string, serviceType: ServiceType) {
    let params = new HttpParams().set('date', dateIso).set('time', time).set('serviceType', serviceType);
    return this.http.get<{ available: boolean; message: string; groomerIds: number[] }>(`${this.baseUrl}/availability`, { params });
  }
}
