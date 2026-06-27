import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    private apiUrl = 'http://127.0.0.1:8000/api'; // 🔥 cambia si usas otra ruta

    constructor(private http: HttpClient) { }

    // 📊 Estadísticas generales
    getStats(): Observable<any> {
        return this.http.get(`${this.apiUrl}/stats/`);
    }

    // 👥 Usuarios
    getUsers(): Observable<any> {
        return this.http.get(`${this.apiUrl}/users/`);
    }

    // 🚪 Accesos
    getAccesses(): Observable<any> {
        return this.http.get(`${this.apiUrl}/access/`);
    }

    // 📄 Reportes
    getReports(): Observable<any> {
        return this.http.get(`${this.apiUrl}/reports/`);
    }

    // 👥 CREAR USUARIO
    createUser(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/users/`, data);
    }

    // ✏️ ACTUALIZAR USUARIO
    updateUser(id: string, data: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/users/${id}/`, data);
    }

    // ❌ ELIMINAR USUARIO
    deleteUser(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/users/${id}/`);
    }
}