import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, RouterLink]
})
export class HeaderComponent {
  username: string | null = null;
  logoUrl: string = environment.logoUrl || '/logo.png';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.username = localStorage.getItem('username');
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/iniciar-sesion']);
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }
}
