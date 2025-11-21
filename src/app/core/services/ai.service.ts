import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PetAiRecommendation {
  petId: number;
  petName: string;
  recommendedServiceType?: string | null;
  recommendedFrequency?: string | null;
  advice: string;
}

@Injectable({ providedIn: 'root' })
export class AiService {
  private baseUrl = `${environment.apiUrl}/ai`;

  constructor(private http: HttpClient) {}

  getPetRecommendation(petId: number): Observable<PetAiRecommendation> {
    return this.http.get<PetAiRecommendation>(`${this.baseUrl}/pets/${petId}/recommendation`);
  }
}

