import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

type ServiceItem = {
  icon: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
};

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
      description: 'Baños normales y medicados para el cuidado completo de tu mascota.',
      image: 'https://placehold.co/800x600/E0F2FE/082F49?text=Ba%C3%B1os',
      imageAlt: 'Perro pequeño siendo bañado en casa'
    },
    {
      icon: 'fas fa-spa',
      title: 'Tratamiento para mantos lisos',
      description: 'Tratamientos especializados para mantener el pelaje suave y brillante.',
      image: 'https://placehold.co/800x600/F1F5F9/020617?text=Mantos+lisos',
      imageAlt: 'Perro con pelaje liso cepillado'
    },
    {
      icon: 'fas fa-cut',
      title: 'Peluquería por raza',
      description: 'Cortes especializados según la raza y características de tu perrito.',
      image: 'https://placehold.co/800x600/FEF3C7/78350F?text=Peluquer%C3%ADa+por+raza',
      imageAlt: 'Peluquería canina realizando corte de pelo'
    },
    {
      icon: 'fas fa-paw',
      title: 'Grooming',
      description: 'Retiro de pelito muerto y servicio de aseo completo.',
      image: 'https://placehold.co/800x600/ECFDF3/022C22?text=Grooming+completo',
      imageAlt: 'Perro siendo cepillado sobre la mesa de grooming'
    },
    {
      icon: 'fas fa-scissors',
      title: 'Striping',
      description: 'Técnica con cuchilla a mano para un acabado profesional.',
      image: 'https://placehold.co/800x600/FFF1F2/881337?text=Striping',
      imageAlt: 'Peluquero realizando striping en un perro'
    },
    {
      icon: 'fas fa-hand',
      title: 'Corte de uñas',
      description: 'Corte seguro y profesional para el bienestar de tu mascota.',
      image: 'https://placehold.co/800x600/FEF9C3/854D0E?text=Corte+de+u%C3%B1as',
      imageAlt: 'Mano recortando uñas de un perro'
    },
    {
      icon: 'fas fa-ear-listen',
      title: 'Limpieza de oídos',
      description: 'Limpieza profunda y cuidadosa de los oídos.',
      image: 'https://placehold.co/800x600/EFF6FF/1E3A8A?text=Limpieza+de+o%C3%ADdos',
      imageAlt: 'Dueño revisando las orejas de su perro'
    },
    {
      icon: 'fas fa-tooth',
      title: 'Enjuague bucal',
      description: 'Aplicación de enjuague bucal para mantener higiene dental.',
      image: 'https://placehold.co/800x600/E0F2FE/0F172A?text=Enjuague+bucal',
      imageAlt: 'Perro mostrando sus dientes limpios'
    },
    {
      icon: 'fas fa-gift',
      title: 'Moños y pañoletas',
      description: 'Obsequiamos moños y pañoletas para que luzca hermosa.',
      image: 'https://placehold.co/800x600/FDF2FF/4A044E?text=Mo%C3%B1os+y+pa%C3%B1oletas',
      imageAlt: 'Perro pequeño con moño y pañoleta decorativa'
    }
  ];
}
