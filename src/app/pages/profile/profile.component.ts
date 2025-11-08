import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/header/header.component';
import { UserService } from '../../core/services/user.service';

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

  constructor(private userService: UserService) {
  }

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
    this.userService.updateUser(id, { email: this.email || undefined, phone: this.phone || undefined } as any)
      .subscribe({
        next: () => { this.message = 'Datos actualizados'; this.error = null; },
        error: err => { this.error = err.error?.message || 'Error al actualizar'; this.message = null; }
      });
  }
}
