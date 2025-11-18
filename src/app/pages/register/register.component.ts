import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, NgIf, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  loading = false;
  submitted = false;
  showPassword = false;
  passwordStrength = 0;
  logoSrc: string = environment.logoUrl || '/logo.png';
  private readonly logoFallback = '/logo-fallback.svg';
  private readonly dataUriFallback = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='48' viewBox='0 0 160 48'><rect width='160' height='48' rx='8' fill='%23f4c653'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Poppins, Arial' font-size='18' font-weight='700' fill='%231c170d'>COBA</text></svg>";

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9_-]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{7,20}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm.get('password')?.valueChanges.subscribe((val: string) => {
      this.passwordStrength = this.calcStrength(val || '');
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      const firstInvalid = Object.keys(this.registerForm.controls).find(k => this.registerForm.get(k)?.invalid);
      if (firstInvalid) {
        const el = document.getElementById(firstInvalid);
        if (el) el.focus();
      }
      return;
    }

    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const payload = {
      username: this.registerForm.value.username,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      phone: this.registerForm.value.phone
    };
    this.authService.register(payload).subscribe({
      next: () => {
        this.successMessage = 'Registro exitoso. Te redirigiremos para iniciar sesión.';
        this.toast.created('Cuenta');
        setTimeout(() => this.router.navigate(['/iniciar-sesion']), 1500);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'No pudimos completar el registro. Revisa los datos e inténtalo de nuevo.';
        this.toast.errorFrom(err, 'No pudimos completar el registro.');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  get username() { return this.registerForm.get('username'); }
  get email() { return this.registerForm.get('email'); }
  get phone() { return this.registerForm.get('phone'); }
  get password() { return this.registerForm.get('password'); }

  togglePassword() { this.showPassword = !this.showPassword; }

  private calcStrength(pwd: string): number {
    let strength = 0;
    if (!pwd) return 0;
    if (pwd.length >= 6) strength += 25;
    if (/[A-Z]/.test(pwd)) strength += 20;
    if (/[0-9]/.test(pwd)) strength += 20;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 20;
    if (pwd.length >= 10) strength += 15;
    return Math.min(100, strength);
  }

  onLogoError() {
    if (this.logoSrc !== this.logoFallback) {
      this.logoSrc = this.logoFallback;
    } else {
      this.logoSrc = this.dataUriFallback;
    }
  }
}

