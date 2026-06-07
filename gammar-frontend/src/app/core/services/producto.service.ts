import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Producto, ProductoForm } from '../models/producto.model';

@Injectable({ providedIn: 'root' })
export class ProductoService {
    private pub = `${environment.apiUrl}/public`;
    private adm = `${environment.apiUrl}/admin`;

    constructor(private http: HttpClient) { }

    // Públicos
    getAll(): Observable<Producto[]> {
        return this.http.get<Producto[]>(`${this.pub}/productos`);
    }

    getBySlug(slug: string): Observable<Producto> {
        return this.http.get<Producto>(`${this.pub}/productos/${slug}`);
    }

    // Admin
    adminGetAll(): Observable<Producto[]> {
        return this.http.get<Producto[]>(`${this.adm}/productos`);
    }

    adminCreate(data: FormData | ProductoForm): Observable<Producto> {
        return this.http.post<Producto>(`${this.adm}/productos`, data);
    }

    adminUpdate(id: number, data: FormData | Partial<ProductoForm>): Observable<Producto> {
        return this.http.put<Producto>(`${this.adm}/productos/${id}`, data);
    }

    uploadFotos(id: number, files: File[]): Observable<{fotos: any[]}> {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('fotos', files[i]);
        }
        return this.http.post<{fotos: any[]}>(`${this.adm}/productos/${id}/fotos`, formData);
    }

    deleteFoto(id: number, fotoId: number): Observable<void> {
        return this.http.delete<void>(`${this.adm}/productos/${id}/fotos/${fotoId}`);
    }

    adminDelete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.adm}/productos/${id}`);
    }
}