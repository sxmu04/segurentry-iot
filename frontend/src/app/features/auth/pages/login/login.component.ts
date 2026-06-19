import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import Swal from 'sweetalert2';

import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent implements OnInit {

  email = '';
  password = '';

  showPassword = false;
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.body.classList.add("dark");
    }
  }

  toggleDarkMode() {
    document.body.classList.toggle("dark");

    const theme =
      document.body.classList.contains("dark")
        ? "dark"
        : "light";

    localStorage.setItem("theme", theme);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  validateForm(): boolean {

    if (!this.email || !this.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor llena todos los campos'
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(this.email)) {
      Swal.fire({
        icon: 'error',
        title: 'Correo inválido',
        text: 'Ingresa un correo válido'
      });
      return false;
    }

    return true;
  }

  async login() {

    if (!this.validateForm()) return;

    this.loading = true;

    // 🔄 LOADING BONITO
    Swal.fire({
      title: 'Verificando...',
      text: 'Accediendo al sistema',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {

      await this.auth.login(this.email, this.password);

      Swal.fire({
        icon: 'success',
        title: 'Bienvenido',
        text: 'Acceso concedido',
        timer: 1500,
        showConfirmButton: false
      });

      this.router.navigate(['/home'], { replaceUrl: true });

    } catch (err: any) {

      this.handleError(err);

    } finally {
      this.loading = false;
    }
  }

  async loginWithGoogle() {

    this.loading = true;

    Swal.fire({
      title: 'Conectando con Google...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {

      await this.auth.loginWithGoogle();

      Swal.fire({
        icon: 'success',
        title: 'Bienvenido',
        text: 'Inicio de sesión con Google exitoso',
        timer: 1500,
        showConfirmButton: false
      });

      this.router.navigate(['/home'], { replaceUrl: true });

    } catch (err: any) {

      this.handleError(err);

    } finally {
      this.loading = false;
    }
  }

  handleError(error: any) {

    let message = "Error al iniciar sesión";

    switch (error.code) {
      case 'auth/user-not-found':
        message = "Usuario no registrado";
        break;
      case 'auth/wrong-password':
        message = "Contraseña incorrecta";
        break;
      case 'auth/invalid-email':
        message = "Correo inválido";
        break;
    }

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message
    });
  }

}