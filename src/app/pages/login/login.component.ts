import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, NgIf, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  loading = false;
  showPassword = false;
  submitted = false;
  logoSrc: string = environment.logoUrl || '/logo.png';
  private readonly logoFallback = '/logo-fallback.svg';
  private readonly dataUriFallback = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='48' viewBox='0 0 160 48'><rect width='160' height='48' rx='8' fill='%23f4c653'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Poppins, Arial' font-size='18' font-weight='700' fill='%231c170d'>COBA</text></svg>";

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      const first = Object.keys(this.loginForm.controls).find(k => this.loginForm.get(k)?.invalid);
      if (first) {
        const el = document.getElementById(first);
        if (el) el.focus();
      }
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        localStorage.setItem('username', this.loginForm.value.username);
        this.toast.ok('Bienvenido');
        // Reemplaza la entrada de login en el historial para que "Atrás" vuelva a la landing (u origen), no al formulario.
        this.router.navigate(['/dashboard'], { replaceUrl: true });
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Usuario o contraseña incorrectos. Revisa tus datos e inténtalo de nuevo.';
        this.toast.errorFrom(err, 'No pudimos iniciar sesión. Revisa usuario y contraseña.');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onLogoError() {
    if (this.logoSrc !== this.logoFallback) {
      this.logoSrc = this.logoFallback;
    } else {
      this.logoSrc = this.dataUriFallback;
    }
  }
}
