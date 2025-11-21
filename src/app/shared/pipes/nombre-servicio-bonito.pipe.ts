import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nombreServicioBonito',
  standalone: true
})
export class NombreServicioBonitoPipe implements PipeTransform {
  transform(value?: string | null): string {
    if (!value) {
      return 'Servicio de grooming';
    }

    switch (value) {
      case 'FULL_GROOMING':
        return 'Grooming completo';
      case 'BATH':
        return 'Baño';
      case 'HAIRCUT':
        return 'Corte de pelo';
      case 'NAIL_TRIM':
        return 'Corte de uñas';
      default:
        return 'Servicio de grooming';
    }
  }
}

