import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
  from: string = new Date(new Date().setDate(new Date().getDate()-7)).toISOString().slice(0,10);
  to: string = new Date().toISOString().slice(0,10);
  loading = false;
  error: string | null = null;
  data: any = null;

  constructor(private http: HttpClient) {
    this.load();
  }

  load() {
    this.loading = true;
    this.error = null;
    const params = new HttpParams().set('from', this.from).set('to', this.to);
    this.http.get(`${environment.apiUrl}/reports/services-summary`, { params }).subscribe({
      next: (d) => this.data = d,
      error: (e) => this.error = e.error?.message || 'Error cargando reportes',
      complete: () => this.loading = false
    });
  }
}

