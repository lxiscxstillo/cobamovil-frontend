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

export interface CareWeekPlan {
  planText: string;
  generatedAt?: string;
}

export interface PetsOverview {
  overviewText: string;
  totalPets?: number;
}

@Injectable({ providedIn: 'root' })
export class AiService {
  private baseUrl = `${environment.apiUrl}/ai`;

  constructor(private http: HttpClient) {}

  getPetRecommendation(petId: number): Observable<PetAiRecommendation> {
    return this.http.get<PetAiRecommendation>(`${this.baseUrl}/pets/${petId}/recommendation`);
  }

  getWeeklyCarePlan(): Observable<CareWeekPlan> {
    return this.http.get<CareWeekPlan>(`${this.baseUrl}/care-week-plan`);
  }

  getPetsOverview(): Observable<PetsOverview> {
    return this.http.get<PetsOverview>(`${this.baseUrl}/pets/overview`);
  }

  normalizeNotes(rawText: string, context: 'SALUD' | 'COMPORTAMIENTO'):
    Observable<{ normalizedText: string }> {
    return this.http.post<{ normalizedText: string }>(
      `${this.baseUrl}/pets/normalize-notes`,
      { rawText, context }
    );
  }
}
