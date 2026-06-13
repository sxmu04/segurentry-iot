import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  template: `
    <h1>Bienvenido</h1>
    <button (click)="logout()">Cerrar sesión</button>
  `
})
export class HomeComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router) {}

  logout() {
    this.auth.logout().then(() => {
      this.router.navigate(['/login'], { replaceUrl: true });
    });
  }

  ngOnInit() {
    // 🔒 evita volver atrás
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, '', window.location.href);
    };
  }
}