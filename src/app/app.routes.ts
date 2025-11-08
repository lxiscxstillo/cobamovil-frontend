import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing/landing.component').then(m => m.LandingComponent)
  },
  // Spanish friendly routes
  { path: 'iniciar-sesion', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'registrarse', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
  { path: 'reservar', loadComponent: () => import('./pages/booking/booking.component').then(m => m.BookingComponent), canActivate: [authGuard] },
  { path: 'mis-mascotas', loadComponent: () => import('./pages/pets/pets.component').then(m => m.PetsComponent), canActivate: [authGuard] },
  { path: 'mi-perfil', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent), canActivate: [authGuard] },
  { path: 'administrador', loadComponent: () => import('./pages/admin/admin-bookings.component').then(m => m.AdminBookingsComponent), canActivate: [authGuard] },
  { path: 'administrador-peluqueros', loadComponent: () => import('./pages/admin/groomers/admin-groomers.component').then(m => m.AdminGroomersComponent), canActivate: [authGuard] },
  {
    path: 'faq',
    loadComponent: () =>
      import('./pages/faq/faq.component').then(m => m.FaqComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  { path: 'panel', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'booking',
    loadComponent: () =>
      import('./pages/booking/booking.component').then(m => m.BookingComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin/admin-bookings.component').then(m => m.AdminBookingsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./pages/reports/reports.component').then(m => m.ReportsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'pets',
    loadComponent: () =>
      import('./pages/pets/pets.component').then(m => m.PetsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./pages/users/users.component').then(m => m.UsersComponent),
    canActivate: [authGuard]
  },
  // Legacy redirects to Spanish slugs
  { path: 'profile', redirectTo: 'mi-perfil', pathMatch: 'full' },
  { path: 'pets', redirectTo: 'mis-mascotas', pathMatch: 'full' },
  { path: 'booking', redirectTo: 'reservar', pathMatch: 'full' },
  { path: 'admin', redirectTo: 'administrador', pathMatch: 'full' },
  { path: 'register', redirectTo: 'registrarse', pathMatch: 'full' },
  { path: 'login', redirectTo: 'iniciar-sesion', pathMatch: 'full' },
  { path: '**', redirectTo: '/iniciar-sesion' }
];

