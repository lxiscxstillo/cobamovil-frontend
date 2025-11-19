import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Permite acceso a usuarios de staff: ADMIN o PELUQUERO
export const staffGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const role = auth.getRole();
  const isStaff = role === 'ADMIN' || role === 'GROOMER';

  return isStaff
    ? true
    : router.createUrlTree(['/dashboard']);
};

