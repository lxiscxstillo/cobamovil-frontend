import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

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
  showPassword = false;
  passwordStrength = 0;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
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
    if (this.registerForm.invalid) return;

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
        this.successMessage = '¡Registro exitoso! Redirigiendo para iniciar sesión...';
        setTimeout(() => this.router.navigate(['/iniciar-sesion']), 1500);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Registro fallido. Intenta de nuevo.';
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
}
