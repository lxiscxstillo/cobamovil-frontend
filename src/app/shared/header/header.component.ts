import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, RouterLink, BreadcrumbsComponent]
})
export class HeaderComponent {
  username: string | null = null;
  logoSrc: string = environment.logoUrl || '/logo.png';
  private readonly logoFallback = '/logo-fallback.svg';
  private readonly dataUriFallback =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='48' viewBox='0 0 160 48'><rect width='160' height='48' rx='8' fill='%23f4c653'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Poppins, Arial' font-size='18' font-weight='700' fill='%231c170d'>COBA</text></svg>";

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Estado UI: menú responsive en móviles
  isMenuOpen = false;

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.username = localStorage.getItem('username');
    }
  }

  onLogoError() {
    // first fallback to static svg in public, then data URI
    if (this.logoSrc !== this.logoFallback) {
      this.logoSrc = this.logoFallback;
    } else {
      this.logoSrc = this.dataUriFallback;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/iniciar-sesion']);
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isAdminStrict(): boolean {
    return this.authService.isAdminStrict();
  }

  isGroomer(): boolean {
    return this.authService.isGroomer();
  }

  isClient(): boolean {
    return this.authService.isClient();
  }

  // Toggle del menú para vista móvil
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
