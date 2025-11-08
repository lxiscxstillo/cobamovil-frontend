export type ServiceType = 'BATH' | 'HAIRCUT' | 'NAIL_TRIM' | 'FULL_GROOMING';
export type BookingStatus = 'PENDING' | 'APPROVED' | 'ON_ROUTE' | 'COMPLETED' | 'REJECTED';

export interface BookingCreateRequest {
  petId: number;
  serviceType: ServiceType;
  date: string; // ISO date (yyyy-MM-dd)
  time: string; // HH:mm
  groomerId?: number; // selected groomer
  address?: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
}

export interface Booking {
  id: number;
  petId: number;
  petName: string;
  serviceType: ServiceType;
  date: string;
  time: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  status: BookingStatus;
  notes?: string;
}
