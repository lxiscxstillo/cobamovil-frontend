export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  user: User;
}
