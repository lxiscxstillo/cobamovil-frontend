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
      image: 'https://images.unsplash.com/photo-1612832809115-9ffda2777867?q=80&w=800&auto=format&fit=crop',
      imageAlt: 'Perro pequeño siendo bañado en casa'
    },
    {
      icon: 'fas fa-spa',
      title: 'Tratamiento para mantos lisos',
      description: 'Tratamientos especializados para mantener el pelaje suave y brillante.',
      image: 'https://images.unsplash.com/photo-1523002117396-4ae5d449c5c2?q=80&w=800&auto=format&fit=crop',
      imageAlt: 'Perro con pelaje liso cepillado'
    },
    {
      icon: 'fas fa-cut',
      title: 'Peluquería por raza',
      description: 'Cortes especializados según la raza y características de tu perrito.',
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop',
      imageAlt: 'Peluquería canina realizando corte de pelo'
    },
    {
      icon: 'fas fa-paw',
      title: 'Grooming',
      description: 'Retiro de pelito muerto y servicio de aseo completo.',
      image: 'https://images.unsplash.com/photo-1623387641168-21a68e23c3df?q=80&w=800&auto=format&fit=crop',
      imageAlt: 'Perro siendo cepillado sobre la mesa de grooming'
    },
    {
      icon: 'fas fa-scissors',
      title: 'Striping',
      description: 'Técnica con cuchilla a mano para un acabado profesional.',
      image: 'https://images.unsplash.com/photo-1619160103442-56cd0b7004c8?q=80&w=800&auto=format&fit=crop',
      imageAlt: 'Peluquero realizando striping en un perro'
    },
    {
      icon: 'fas fa-hand',
      title: 'Corte de uñas',
      description: 'Corte seguro y profesional para el bienestar de tu mascota.',
      image: 'https://images.unsplash.com/photo-1516383607781-913a19294fd1?q=80&w=800&auto=format&fit=crop',
      imageAlt: 'Mano recortando uñas de un perro'
    },
    {
      icon: 'fas fa-ear-listen',
      title: 'Limpieza de oídos',
      description: 'Limpieza profunda y cuidadosa de los oídos.',
      image: 'https://images.unsplash.com/photo-1525253013412-55c1a69a5738?q=80&w=800&auto=format&fit=crop',
      imageAlt: 'Dueño revisando las orejas de su perro'
    },
    {
      icon: 'fas fa-tooth',
      title: 'Enjuague bucal',
      description: 'Aplicación de enjuague bucal para mantener higiene dental.',
      image: 'https://images.unsplash.com/photo-1596496181848-381033fcd9a4?q=80&w=800&auto=format&fit=crop',
      imageAlt: 'Perro mostrando sus dientes limpios'
    },
    {
      icon: 'fas fa-gift',
      title: 'Moños y pañoletas',
      description: 'Obsequiamos moños y pañoletas para que luzca hermosa.',
      image: 'https://images.unsplash.com/photo-1489084917528-a57e68a79a1e?q=80&w=800&auto=format&fit=crop',
      imageAlt: 'Perro pequeño con moño y pañoleta decorativa'
    }
  ];
}

