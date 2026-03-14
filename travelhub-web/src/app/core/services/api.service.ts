import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get<T>(path: string, params: Record<string, string | number> = {}): Observable<T> {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== null && v !== undefined && v !== '') {
        httpParams = httpParams.set(k, String(v));
      }
    });
    return this.http
      .get<T>(`${this.baseUrl}${path}`, { params: httpParams })
      .pipe(timeout(3000), catchError(this.handleError));
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${path}`, body).pipe(catchError(this.handleError));
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${path}`, body).pipe(catchError(this.handleError));
  }

  patch<T>(path: string, body: unknown = {}): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${path}`, body).pipe(catchError(this.handleError));
  }

  private handleError(error: unknown) {
    return throwError(() => error);
  }
}
