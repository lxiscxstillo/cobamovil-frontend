import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';

type Crumb = { label: string; url: string };

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <nav class="cm-bc" aria-label="Breadcrumb" *ngIf="crumbs.length">
    <ol>
      <li *ngFor="let c of crumbs; let last = last">
        <a *ngIf="!last" [routerLink]="c.url">{{ c.label }}</a>
        <span *ngIf="last" aria-current="page">{{ c.label }}</span>
      </li>
    </ol>
  </nav>
  `,
  styles: [`
  .cm-bc{ border-top:1px solid rgba(155,132,75,.20); border-bottom:1px solid rgba(155,132,75,.12); background:#fff }
  .cm-bc ol{ list-style:none; padding:8px 14px; margin:0; display:flex; gap:8px; align-items:center; flex-wrap:wrap }
  .cm-bc li{ color:#475569; font-size:13px; display:flex; gap:8px; align-items:center }
  .cm-bc li:not(:last-child)::after{ content:'/' ; opacity:.6 }
  .cm-bc a{ color:#1c170d; text-decoration:none }
  .cm-bc a:hover{ text-decoration:underline }
  `]
})
export class BreadcrumbsComponent {
  crumbs: Crumb[] = [];
  private labels: Record<string,string> = {
    'dashboard':'Dashboard',
    'reservar':'Reservar',
    'mis-reservas':'Mis reservas',
    'mis-mascotas':'Mis mascotas',
    'mi-perfil':'Mi perfil',
    'administrador':'Agenda',
    'administrador-peluqueros':'Peluqueros',
    'reports':'Reportes',
    'users':'Usuarios',
    'faq':'Preguntas frecuentes'
  };

  constructor(private router: Router, private route: ActivatedRoute) {
    // Build on navigation end
    this.router.events.subscribe(() => this.build());
    this.build();
  }

  private build(){
    const url = this.router.url.split('?')[0];
    const segs = url.split('/').filter(Boolean);
    // Hide on landing and auth routes
    if (segs.length === 0 || ['iniciar-sesion','registrarse'].includes(segs[0])) {
      this.crumbs = [];
      return;
    }
    const crumbs: Crumb[] = [];
    let acc = '';
    for (const s of segs){
      acc += '/' + s;
      const label = this.labels[s] || this.titleCase(s.replace(/-/g,' '));
      crumbs.push({ label, url: acc });
    }
    this.crumbs = crumbs;
  }

  private titleCase(x: string){
    return x.replace(/\b\w/g, ch => ch.toUpperCase());
  }
}

