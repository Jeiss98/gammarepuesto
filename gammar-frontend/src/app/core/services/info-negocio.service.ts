import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { InfoNegocio, InfoNegocioForm } from '../models/info-negocio.model';

@Injectable({ providedIn: 'root' })
export class InfoNegocioService {
    private pub = `${environment.apiUrl}/public/info-negocio`;
    private adm = `${environment.apiUrl}/admin/info-negocio`;

    constructor(private http: HttpClient) { }

    // Public
    get(): Observable<InfoNegocio> {
        return this.http.get<InfoNegocio>(this.pub);
    }

    // Admin
    adminGet(): Observable<InfoNegocio> {
        return this.http.get<InfoNegocio>(this.adm);
    }

    adminUpdate(data: Partial<InfoNegocioForm>): Observable<InfoNegocio> {
        return this.http.put<InfoNegocio>(this.adm, data);
    }
}