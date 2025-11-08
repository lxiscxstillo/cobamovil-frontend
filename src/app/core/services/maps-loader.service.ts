import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

declare global { interface Window { google?: any; } }

@Injectable({ providedIn: 'root' })
export class MapsLoaderService {
  private loading?: Promise<void>;
  constructor(private http: HttpClient) {}

  load(): Promise<void> {
    if (typeof window === 'undefined') return Promise.resolve();
    if (window.google?.maps) return Promise.resolve();
    if (this.loading) return this.loading;
    this.loading = this.http.get<{ googleMapsApiKey: string }>(`${environment.apiUrl}/config/public`)
      .toPromise()
      .then(cfg => {
        const key = cfg?.googleMapsApiKey || '';
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=places`;
        script.async = true; script.defer = true;
        document.head.appendChild(script);
        return new Promise<void>((resolve) => { script.onload = () => resolve(); });
      });
    return this.loading;
  }
}

