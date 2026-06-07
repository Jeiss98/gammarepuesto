import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Faq } from '../models/faq.model';

@Injectable({
  providedIn: 'root'
})
export class FaqService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  // Públicas
  getAllPublic(): Observable<Faq[]> {
    return this.http.get<Faq[]>(`${this.apiUrl}/public/faqs`);
  }

  // Admin
  getAllAdmin(): Observable<Faq[]> {
    return this.http.get<Faq[]>(`${this.apiUrl}/admin/faqs`);
  }

  create(data: Partial<Faq>): Observable<Faq> {
    return this.http.post<Faq>(`${this.apiUrl}/admin/faqs`, data);
  }

  update(id: number, data: Partial<Faq>): Observable<Faq> {
    return this.http.put<Faq>(`${this.apiUrl}/admin/faqs/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/faqs/${id}`);
  }
}
