import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface GroomerProfile {
  id: number;
  userId: number;
  username: string;
  avatarUrl?: string;
  bio?: string;
  specialties?: string;
}

@Injectable({ providedIn: 'root' })
export class GroomerService {
  private baseUrl = `${environment.apiUrl}/groomers`;
  constructor(private http: HttpClient) {}
  list(): Observable<GroomerProfile[]> { return this.http.get<GroomerProfile[]>(this.baseUrl); }
  profile(userId: number): Observable<GroomerProfile> { return this.http.get<GroomerProfile>(`${this.baseUrl}/${userId}`); }
  history(userId: number): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/${userId}/history`); }
  create(data: any): Observable<GroomerProfile> { return this.http.post<GroomerProfile>(`${this.baseUrl}/admin`, data); }
  update(userId: number, data: GroomerProfile): Observable<GroomerProfile> { return this.http.put<GroomerProfile>(`${this.baseUrl}/${userId}/admin`, data); }
}

