import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent {
  images: { src: string; alt: string }[] = [
    { src: 'https://placehold.co/800x600/FEE2E2/7F1D1D?text=Antes+y+despu%C3%A9s', alt: 'Perro feliz después del grooming' },
    { src: 'https://placehold.co/800x600/EEF2FF/1E1B4B?text=Corte+de+pelaje', alt: 'Corte cuidando el manto' },
    { src: 'https://placehold.co/800x600/DCFCE7/166534?text=Ba%C3%B1o+relajante', alt: 'Baño relajante en casa' },
    { src: 'https://placehold.co/800x600/FEF3C7/92400E?text=Servicio+a+domicilio', alt: 'Peluquería a domicilio' },
    { src: 'https://placehold.co/800x600/E0F2FE/0F172A?text=Manto+brillante', alt: 'Manto brillante y sano' },
    { src: 'https://placehold.co/800x600/FDF2FF/4A044E?text=Look+con+pa%C3%B1oleta', alt: 'Perro con pañoleta' }
  ];
}

