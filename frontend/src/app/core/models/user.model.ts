export interface User {
  id: number;
  fullName: string;
  email: string;
  role: 'ROLE_USER' | 'ROLE_ADMIN';
}

export interface AuthResponse {
  token: string;
  id: number;
  fullName: string;
  email: string;
  role: 'ROLE_USER' | 'ROLE_ADMIN';
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
