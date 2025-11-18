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
    { src: '/gallery/dog-1.png', alt: 'Perro feliz después del grooming' },
    { src: '/gallery/dog-2.png', alt: 'Perro durante el baño' },
    { src: '/gallery/dog-3.png', alt: 'Perro con corte de pelaje' },
    { src: '/gallery/dog-4.png', alt: 'Perro recibiendo servicio a domicilio' },
    { src: '/gallery/dog-5.png', alt: 'Perro con pelaje brillante y sano' },
    { src: '/gallery/dog-6.png', alt: 'Perro luciendo pañoleta después del servicio' }
  ];
}

