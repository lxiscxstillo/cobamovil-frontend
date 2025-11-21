import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/header/header.component';
import { UserService } from '../../core/services/user.service';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  email = '';
  phone = '';
  message: string | null = null;
  error: string | null = null;
  emailTouched = false;
  phoneTouched = false;

  constructor(private userService: UserService, private toast: ToastService) {}

  ngOnInit(): void {
    const idStr = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    if (!idStr) return;
    const id = Number(idStr);
    this.userService.getUserById(id).subscribe({
      next: (u: any) => {
        this.email = u?.email || '';
        this.phone = u?.phone || '';
      },
      error: () => {}
    });
  }

  save() {
    const idStr = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    if (!idStr) { this.error = 'No se encontró el usuario.'; return; }
    const id = Number(idStr);
    // Teléfono es opcional al actualizar. Si viene no vacío, validar formato; si vacío, no enviar para mantener el valor actual.
    if (this.phone && !/^\+?[0-9]{7,20}$/.test(this.phone)) {
      this.error = 'Ingresa un teléfono válido (incluye prefijo país, ej: +57).';
      this.message = null;
      return;
    }
    const payload: any = { email: this.email || undefined };
    if (this.phone) payload.phone = this.phone;
    this.userService.updateUser(id, payload)
      .subscribe({
        next: () => {
          this.message = 'Datos actualizados correctamente.';
          this.error = null;
          this.toast.saved('Información de perfil');
        },
        error: err => {
          this.error = err.error?.message || 'Error al actualizar tus datos. Inténtalo de nuevo.';
          this.message = null;
          this.toast.errorFrom(err, 'Error al actualizar tu perfil');
        }
      });
  }

  // Template helpers to avoid regex literals in templates
  isEmailInvalid(): boolean {
    return !this.email || !/.+@.+\..+/.test(this.email);
  }

  isPhoneInvalid(): boolean {
    return !!(this.phone && !/^\+?[0-9]{7,20}$/.test(this.phone));
  }
}

