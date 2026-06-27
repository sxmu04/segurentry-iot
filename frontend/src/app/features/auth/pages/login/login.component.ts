import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';

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
    private router: Router,
    private apiService: ApiService
  ) { }

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

    Swal.fire({
      title: 'Verificando...',
      text: 'Accediendo al sistema',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {

      const userCredential = await this.auth.login(this.email, this.password);

      console.log("LOGIN OK 🔥", userCredential);

      // ⚠️ MUY IMPORTANTE: esperar a Firebase
      const user = userCredential.user;

      if (!user) throw new Error("No user");

      // 🔑 Forzar obtención de token (esto asegura sesión lista)
      await user.getIdToken();

      Swal.close();

      Swal.fire({
        icon: 'success',
        title: 'Bienvenido',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {

        console.log("NAVEGANDO 🚀");

        this.router.navigate(
          ['/dashboard/super-admin'],
          { replaceUrl: true }
        );

      });

    } catch (err: any) {

      Swal.close();

      this.handleError(err);

    } finally {
      this.loading = false;
    }
  }

  async loginWithGoogle() {

    Swal.fire({
      title: 'Conectando con Google...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {

      const result = await this.auth.loginWithGoogle();

      const email = result.user.email!;

      this.apiService.checkProvider(email)
        .subscribe(async (response: any) => {

          if (
            response.exists &&
            response.provider === "password"
          ) {

            await this.auth.logout();

            Swal.fire({
              icon: "warning",
              title: "Correo registrado",
              text: "Este correo ya fue registrado con correo y contraseña."
            });

            return;
          }

          // continuar enviando el token a Django

        });

      // Verificar cómo está registrado ese correo
      const methods = await this.auth.getSignInMethods(email);

      console.log(methods);

      console.log("Métodos de autenticación:", methods);

      // Si el correo SOLO tiene password, bloquear Google
      if (
        methods.includes("password") &&
        !methods.includes("google.com")
      ) {

        await this.auth.logout();

        Swal.fire({
          icon: 'warning',
          title: 'Correo registrado',
          text: 'Este correo ya fue registrado con correo y contraseña. Inicia sesión con tu contraseña.'
        });

        return;
      }

      // Obtener el ID Token
      const idToken = await result.user.getIdToken();

      console.log("TOKEN:", idToken);
      console.log("LONGITUD:", idToken.length);
      console.log("SEGMENTOS:", idToken.split(".").length);

      this.apiService.googleLogin(idToken)
        .subscribe({

          next: (response: any) => {

            Swal.fire({
              icon: 'success',
              title: 'Bienvenido',
              text: 'Inicio de sesión exitoso',
              timer: 1500,
              showConfirmButton: false
            });

            console.log("DJANGO:", response);

            this.router.navigate(
              ['/dashboard/super-admin'],
              { replaceUrl: true }
            );

          },

          error: async (error) => {

            console.error("STATUS:", error.status);
            console.error("BODY:", error.error);
            console.error("HEADERS:", error.headers);

            await this.auth.logout();

            Swal.fire({
              icon: 'error',
              title: 'Error Google Login',
              text: error?.error?.message || 'Error al autenticar con Google'
            });

          }

        });

    } catch (error: any) {

      console.error(error);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error?.message || 'No fue posible iniciar sesión con Google'
      });

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