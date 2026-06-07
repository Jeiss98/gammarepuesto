import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Servicio, ServicioForm } from '../models/servicio.model';

@Injectable({ providedIn: 'root' })
export class ServicioService {
    private pub = `${environment.apiUrl}/public/servicios`;
    private adm = `${environment.apiUrl}/admin/servicios`;

    constructor(private http: HttpClient) { }

    // Public
    getAll(): Observable<Servicio[]> {
        return this.http.get<Servicio[]>(this.pub);
    }

    // Admin
    adminGetAll(): Observable<Servicio[]> {
        return this.http.get<Servicio[]>(this.adm);
    }

    adminCreate(data: ServicioForm): Observable<Servicio> {
        return this.http.post<Servicio>(this.adm, data);
    }

    adminUpdate(id: number, data: Partial<ServicioForm>): Observable<Servicio> {
        return this.http.put<Servicio>(`${this.adm}/${id}`, data);
    }

    adminDelete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.adm}/${id}`);
    }
}