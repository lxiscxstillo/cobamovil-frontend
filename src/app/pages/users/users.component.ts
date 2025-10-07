import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  loading = true;
  error: string | null = null;

  private apiUrl = 'http://localhost:8081/api/users'; // ⚠️ Ajustar según backend

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load users 😢';
        this.loading = false;
      }
    });
  }
}
