import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Pet } from '../models/pet.model';

@Injectable({ providedIn: 'root' })
export class PetService {
  private baseUrl = `${environment.apiUrl}/pets`;
  constructor(private http: HttpClient) {}
  list(): Observable<Pet[]> { return this.http.get<Pet[]>(this.baseUrl); }
  create(p: Partial<Pet>): Observable<Pet> { return this.http.post<Pet>(this.baseUrl, p); }
  update(id: number, p: Partial<Pet>): Observable<Pet> { return this.http.put<Pet>(`${this.baseUrl}/${id}`, p); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.baseUrl}/${id}`); }
}

