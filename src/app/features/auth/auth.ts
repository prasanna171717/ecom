import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { computed, inject, Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, of, tap } from 'rxjs';
import { AuthResponse, LoginPayload, RegisterPayload, User } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class Auth {


  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private apiUrl = 'http://localhost:3000/users';
  currentUser = signal<User | null>(null);
  token = signal<string | null>(null);
  isAuthenticated = computed(() => !!this.token());
  userRole = computed(() => this.currentUser()?.role || null);

  constructor() {
    this.loadUserFromStorage();
  }


  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private loadUserFromStorage() {
    if (this.isBrowser()) {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (token && user) {
        this.token.set(token);
        this.currentUser.set(JSON.parse(user));
      }
    }
  }

  private saveAuthData(response: AuthResponse) {
    if (this.isBrowser()) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
    }

    this.token.set(response.token);
    this.currentUser.set(response.user);
  }

  logout() {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
    this.token.set(null);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
  
getProfile() {
   const currentUser = this.currentUser();

  if (!currentUser) {
    throw new Error('No active session');
  }

  return this.http.get<User>(`${this.apiUrl}/${currentUser.id}`).pipe(tap(user =>
    this.currentUser.set(user)));
}

updateProfile(data: Partial<User>) {
  const currentUser = this.currentUser();

  if (!currentUser) {
    throw new Error('No active session');
  }

  return this.http.patch<User>(
    `${this.apiUrl}/${currentUser.id}`,
    data
  ).pipe(
    tap(user => {
      this.currentUser.set(user);

      if (this.isBrowser()) {
        localStorage.setItem('user', JSON.stringify(user));
      }
    })
  );
}




register(payload: RegisterPayload) {
  return this.http.post<User>(this.apiUrl, {
    ...payload,
    role: 'user'
  }).pipe(
    map(user => {
      const authResponse: AuthResponse = {
        token: btoa(`${user.email}:${Date.now()}`),
        refreshToken: btoa(`refresh:${user.id}:${Date.now()}`),
        user
      };

      this.saveAuthData(authResponse);

      return authResponse;
    })
  );
}
login(payload: LoginPayload) {
  return this.http.get<User[]>(
    `${this.apiUrl}?email=${payload.email}`
  ).pipe(
    map(users => {
      if (!users.length) {
        throw new Error('Invalid email or password');
      }

      const user = users[0];

      const authResponse: AuthResponse = {
        token: btoa(`${user.email}:${Date.now()}`), // fake token
        refreshToken: btoa(`refresh:${user.id}:${Date.now()}`),
        user
      };

      this.saveAuthData(authResponse);

      return authResponse;
    })
  );
}





  }

