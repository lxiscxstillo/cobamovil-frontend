export interface Pet {
  id: number;
  name: string;
  breed?: string;
  sex?: string; // "M" | "F"
  age?: number;
  weight?: number;
  behavior?: string;
  healthNotes?: string;
  vaccinations?: string;
  deworming?: string;
  medicalConditions?: string;
  lastGroomDate?: string; // yyyy-MM-dd
}
