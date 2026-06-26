import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})

export class RegisterComponent implements OnInit {

  name = '';
  email = '';
  password = '';
  confirmPassword = '';

  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.body.classList.add('dark');
    }
  }

  toggleDarkMode() {
    document.body.classList.toggle('dark');
    localStorage.setItem(
      'theme',
      document.body.classList.contains('dark')
        ? 'dark'
        : 'light'
    );
  }

  // VALIDAR EMAIL
  isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  async register() {

    if (!this.name.trim()) {
      Swal.fire('Error', 'Ingrese su nombre', 'warning');
      return;
    }

    if (!this.email.trim()) {
      Swal.fire('Error', 'Ingrese un correo electrónico', 'warning');
      return;
    }

    if (!this.isValidEmail(this.email)) {
      Swal.fire('Error', 'Ingrese un correo válido', 'error');
      return;
    }

    if (!this.password) {
      Swal.fire('Error', 'Ingrese una contraseña', 'warning');
      return;
    }

    if (this.password.length < 6) {
      Swal.fire('Error', 'La contraseña debe tener mínimo 6 caracteres', 'warning');
      return;
    }

    if (this.password !== this.confirmPassword) {
      Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
      return;
    }

    try {

      const response: any = await this.apiService.checkProvider(this.email).toPromise();

      if (response.exists && response.provider === "google") {

        Swal.fire({
          icon: "warning",
          title: "Correo registrado",
          text: "Este correo ya fue registrado con Google."
        });

        return;
      }

      await this.auth.register(this.email, this.password);

      Swal.fire({
        title: 'Registro exitoso',
        text: 'Ahora puedes iniciar sesión',
        icon: 'success',
        confirmButtonColor: '#1e88e5'
      });

      this.router.navigate(['/login'], { replaceUrl: true });

    } catch (err: any) {

      let mensaje = "No fue posible crear la cuenta.";

      switch (err.code) {

        case "auth/email-already-in-use":
          mensaje = "Ya existe una cuenta con ese correo.";
          break;

        case "auth/weak-password":
          mensaje = "La contraseña es demasiado débil.";
          break;

        case "auth/invalid-email":
          mensaje = "Correo electrónico inválido.";
          break;

      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: mensaje
      });

    }
  }

  registerWithGoogle() {
    this.auth.loginWithGoogle()
      .then(() => {

        Swal.fire({
          title: 'Cuenta creada con Google',
          icon: 'success',
          confirmButtonColor: '#1e88e5'
        });

        this.router.navigate(['/login'], { replaceUrl: true });

      })
      .catch(err => {

        Swal.fire({
          title: 'Error',
          text: err.message,
          icon: 'error'
        });

      });
  }

}