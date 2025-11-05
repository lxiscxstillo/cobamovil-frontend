export interface Pet {
  id: number;
  name: string;
  breed?: string;
  sex?: string; // "M" | "F"
  age?: number;
  weight?: number;
  behavior?: string;
  healthNotes?: string;
}

