import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { ServicesComponent } from './services.component';
import { BenefitsComponent } from './benefits.component';
import { GalleryComponent } from './gallery.component';
import { TestimonialsComponent } from './testimonials.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, ServicesComponent, BenefitsComponent, GalleryComponent, TestimonialsComponent],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  constructor(private title: Title, private meta: Meta) {}

  ngOnInit(): void {
    const title = 'Coba Móvil | Peluquería canina a domicilio';
    const description = 'Servicio profesional de Peluquería canina a domicilio. Agenda en línea, ruta optimizada, atención personalizada y notificaciones por WhatsApp y correo.';

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
  }
}

