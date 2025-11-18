import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

type Testimonial = { quote: string; author: string; subtitle?: string; rating?: number };

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent {
  items: Testimonial[] = [
    { quote: 'El servicio a domicilio fue impecable. Mi perro quedó hermoso y sin estrés.', author: 'Camila R.', subtitle: 'Cliente', rating: 5 },
    { quote: 'Puntuales y muy cariñosos con mi mascota. 100% recomendados.', author: 'Juan P.', subtitle: 'Cliente', rating: 5 },
    { quote: 'Excelente atención y resultado. La comodidad de no salir de casa no tiene precio.', author: 'Laura G.', subtitle: 'Cliente', rating: 5 }
  ];
}

