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
      image: 'https://placehold.co/800x600/FFE7A8/3B2A0A?text=Ahorro+de+tiempo',
      imageAlt: 'Peluquero canino atendiendo a un perro en casa'
    },
    {
      icon: 'fas fa-heart',
      title: 'Bienestar y cuidado',
      description: 'Ambiente tranquilo y seguro para tu mascota, con trato profesional y cariñoso.',
      image: 'https://placehold.co/800x600/FDE1D8/3B2A0A?text=Bienestar+y+cuidado',
      imageAlt: 'Perro feliz siendo acariciado por su dueña'
    },
    {
      icon: 'fas fa-shield-dog',
      title: 'Profesionales certificados',
      description: 'Peluqueros con experiencia y protocolos higiénicos en cada servicio.',
      image: 'https://placehold.co/800x600/E4F0FF/1F2933?text=Profesionales+certificados',
      imageAlt: 'Peluquero canino usando equipo profesional'
    },
    {
      icon: 'fas fa-route',
      title: 'Ruta optimizada',
      description: 'Planificación eficiente para llegar a tiempo y reducir tiempos de espera.',
      image: 'https://placehold.co/800x600/F9EAD4/3B2A0A?text=Ruta+optimizada',
      imageAlt: 'Perro asomado por la ventana de un vehículo'
    }
  ];
}

