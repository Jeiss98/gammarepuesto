import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Categoria, CategoriaForm } from '../models/categoria.model';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
    private pub = `${environment.apiUrl}/public`;
    private adm = `${environment.apiUrl}/admin`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<Categoria[]> {
        return this.http.get<Categoria[]>(`${this.pub}/categorias`);
    }

    adminGetAll(): Observable<Categoria[]> {
        return this.http.get<Categoria[]>(`${this.adm}/categorias`);
    }

    adminCreate(data: CategoriaForm): Observable<Categoria> {
        return this.http.post<Categoria>(`${this.adm}/categorias`, data);
    }

    adminUpdate(id: number, data: Partial<CategoriaForm>): Observable<Categoria> {
        return this.http.put<Categoria>(`${this.adm}/categorias/${id}`, data);
    }

    adminDelete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.adm}/categorias/${id}`);
    }
}