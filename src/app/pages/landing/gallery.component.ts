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
    { src: 'https://place-puppy.com/800x600', alt: 'Perro feliz después del grooming' },
    { src: 'https://place-puppy.com/800x601', alt: 'Perro con corte de pelaje' },
    { src: 'https://place-puppy.com/800x602', alt: 'Perro durante el baño relajante' },
    { src: 'https://place-puppy.com/800x603', alt: 'Perro recibiendo servicio a domicilio' },
    { src: 'https://place-puppy.com/800x604', alt: 'Perro con pelaje brillante y sano' },
    { src: 'https://place-puppy.com/800x605', alt: 'Perro luciendo pañoleta después del servicio' }
  ];
}

