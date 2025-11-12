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
    { src: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=800&auto=format&fit=crop', alt: 'Perro feliz después del grooming' },
    { src: 'https://images.unsplash.com/photo-1568640347023-a6161c59b98e?q=80&w=800&auto=format&fit=crop', alt: 'Corte cuidando el manto' },
    { src: 'https://images.unsplash.com/photo-1619980296991-0f19042c1cdf?q=80&w=800&auto=format&fit=crop', alt: 'Baño relajante en casa' },
    { src: 'https://images.unsplash.com/photo-1598133894008-7c6a58d1b82b?q=80&w=800&auto=format&fit=crop', alt: 'Peluquería a domicilio' },
    { src: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=800&auto=format&fit=crop', alt: 'Manto brillante y sano' },
    { src: 'https://images.unsplash.com/photo-1593134257782-e89567b7718a?q=80&w=800&auto=format&fit=crop', alt: 'Perro con pañoleta' }
  ];
}

