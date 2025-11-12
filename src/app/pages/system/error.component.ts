import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <div class="page-center">
    <div class="card stack-lg" style="max-width:560px; text-align:center;">
      <h2>Ocurrió un error</h2>
      <p class="muted">Intenta nuevamente más tarde.</p>
      <a class="btn" style="width:auto" routerLink="/">Volver al inicio</a>
    </div>
  </div>
  `
})
export class ErrorComponent {}

