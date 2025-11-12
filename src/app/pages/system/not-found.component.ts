import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <div class="page-center">
    <div class="card stack-lg" style="max-width:560px; text-align:center;">
      <h2>404 — Página no encontrada</h2>
      <p class="muted">La página que buscas no existe o fue movida.</p>
      <a class="btn" style="width:auto" routerLink="/">Volver al inicio</a>
    </div>
  </div>
  `
})
export class NotFoundComponent {}

