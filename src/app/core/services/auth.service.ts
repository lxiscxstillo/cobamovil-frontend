import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  /**
   * Login
   */
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        if (response?.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('username', credentials.username);
          if (response?.id) {
            localStorage.setItem('userId', String(response.id));
          }
          // Persist role returned by backend for UI/guards
          if (response?.role) {
            localStorage.setItem('role', String(response.role));
          }
        }
      })
    );
  }

  /**
   * Register
   */
  register(userData: { username: string; email: string; password: string; phone?: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  /**
   * Logout
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
  }

  /**
   * Get JWT token
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /** Returns current role from storage (ADMIN/GROOMER/USER) */
  getRole(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('role');
  }

  /** True when role is ADMIN or GROOMER */
  isAdmin(): boolean {
    const role = this.getRole();
    return role === 'ADMIN' || role === 'GROOMER';
  }

  /** True only for ADMIN */
  isAdminStrict(): boolean {
    return this.getRole() === 'ADMIN';
  }

  /** True only for GROOMER */
  isGroomer(): boolean {
    return this.getRole() === 'GROOMER';
  }
}
