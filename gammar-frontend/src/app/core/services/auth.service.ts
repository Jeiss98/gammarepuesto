import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, User } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = environment.apiUrl;
    private userSubject = new BehaviorSubject<User | null>(this.getStoredUser());
    user$ = this.userSubject.asObservable();

    constructor(private http: HttpClient, private router: Router) { }

    login(credentials: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/admin/login`, credentials).pipe(
            tap(res => {
                localStorage.setItem('token', res.access_token);
                localStorage.setItem('user', JSON.stringify(res.user));
                this.userSubject.next(res.user);
            })
        );
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/admin/login']);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    /**
     * ✅ Verifica que el token existe Y no está expirado.
     * El JWT tiene 3 partes separadas por punto; la segunda es el payload en base64.
     */
    isLoggedIn(): boolean {
        const token = this.getToken();
        if (!token) return false;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expMs = payload.exp * 1000; // JWT exp está en segundos
            if (Date.now() >= expMs) {
                // Token expirado → limpiar sesión automáticamente
                this.logout();
                return false;
            }
            return true;
        } catch {
            // Token malformado
            this.logout();
            return false;
        }
    }

    private getStoredUser(): User | null {
        const u = localStorage.getItem('user');
        return u ? JSON.parse(u) : null;
    }
}