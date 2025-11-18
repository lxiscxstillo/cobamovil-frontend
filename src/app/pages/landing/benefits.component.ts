import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

type BenefitItem = {
  icon: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
};

@Component({
  selector: 'app-benefits',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './benefits.component.html',
  styleUrls: ['./benefits.component.scss']
})
export class BenefitsComponent {
  benefits: BenefitItem[] = [
    {
      icon: 'fas fa-clock',
      title: 'Ahorro de tiempo',
      description: 'Sin traslados ni esperas. Vamos a tu domicilio en el horario que elijas.',
      image: 'https://images.unsplash.com/photo-1619980294942-1a1e7a67a1a2?q=80&w=800&auto=format&fit=crop',
      imageAlt: 'Peluquero canino atendiendo a un perro en casa'
    },
    {
      icon: 'fas fa-heart',
      title: 'Bienestar y cuidado',
      description: 'Ambiente tranquilo y seguro para tu mascota, con trato profesional y cariñoso.',
      image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=800&auto=format&fit=crop',
      imageAlt: 'Perro feliz siendo acariciado por su dueña'
    },
    {
      icon: 'fas fa-shield-dog',
      title: 'Profesionales certificados',
      description: 'Peluqueros con experiencia y protocolos higiénicos en cada servicio.',
      image: 'https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=800&auto=format&fit=crop',
      imageAlt: 'Peluquero canino usando equipo profesional'
    },
    {
      icon: 'fas fa-route',
      title: 'Ruta optimizada',
      description: 'Planificación eficiente para llegar a tiempo y reducir tiempos de espera.',
      image: 'https://images.unsplash.com/photo-1517840933442-d2d1a05edb75?q=80&w=800&auto=format&fit=crop',
      imageAlt: 'Perro asomado por la ventana de un vehículo'
    }
  ];
}

