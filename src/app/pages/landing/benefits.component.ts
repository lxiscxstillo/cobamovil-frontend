import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

type BenefitItem = {
  icon: string;
  title: string;
  description: string;
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
      description: 'Sin traslados ni esperas. Vamos a tu domicilio en el horario que elijas.'
    },
    {
      icon: 'fas fa-heart',
      title: 'Bienestar y cuidado',
      description: 'Ambiente tranquilo y seguro para tu mascota, con trato profesional y cariñoso.'
    },
    {
      icon: 'fas fa-shield-dog',
      title: 'Profesionales certificados',
      description: 'Peluqueros con experiencia y protocolos higiénicos en cada servicio.'
    },
    {
      icon: 'fas fa-route',
      title: 'Ruta optimizada',
      description: 'Planificación eficiente para llegar a tiempo y reducir tiempos de espera.'
    }
  ];
}

