import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

type ServiceItem = { icon: string; title: string; description: string };

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent {
  services: ServiceItem[] = [
    {
      icon: 'fas fa-shower',
      title: 'Baños',
      description: 'Baños normales y medicados para el cuidado completo de tu mascota.'
    },
    {
      icon: 'fas fa-spa',
      title: 'Tratamiento para mantos lisos',
      description: 'Tratamientos especializados para mantener el pelaje suave y brillante.'
    },
    {
      icon: 'fas fa-cut',
      title: 'Peluquería por raza',
      description: 'Cortes especializados según la raza y características de tu perrito.'
    },
    {
      icon: 'fas fa-paw',
      title: 'Grooming',
      description: 'Retiro de pelito muerto y servicio de aseo completo.'
    },
    {
      icon: 'fas fa-scissors',
      title: 'Striping',
      description: 'Técnica con cuchilla a mano para un acabado profesional.'
    },
    {
      icon: 'fas fa-hand',
      title: 'Corte de uñas',
      description: 'Corte seguro y profesional para el bienestar de tu mascota.'
    },
    {
      icon: 'fas fa-ear-listen',
      title: 'Limpieza de oídos',
      description: 'Limpieza profunda y cuidadosa de los oídos.'
    },
    {
      icon: 'fas fa-tooth',
      title: 'Enjuague bucal',
      description: 'Aplicación de enjuague bucal para mantener higiene dental.'
    },
    {
      icon: 'fas fa-gift',
      title: 'Moños y pañoletas',
      description: 'Obsequiamos moños y pañoletas para que luzca hermosa.'
    }
  ];
}

