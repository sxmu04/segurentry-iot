import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

interface Access {
  id: number;
  name: string;
  role: string;
  tempAccess: boolean;
  expirationDate?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {

  menuOpen = true;

  accesses: Access[] = [
    { id: 1, name: 'Admin Principal', role: 'Admin', tempAccess: false },
    { id: 2, name: 'Usuario Temporal', role: 'User', tempAccess: true, expirationDate: '2026-06-30' }
  ];

  form: Access = {
    id: 0,
    name: '',
    role: '',
    tempAccess: false,
    expirationDate: ''
  };

  editMode = false;

  constructor(private router: Router) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  resetForm() {
    this.form = {
      id: 0,
      name: '',
      role: '',
      tempAccess: false,
      expirationDate: ''
    };
    this.editMode = false;
  }

  saveAccess() {
    if (!this.form.name || !this.form.role) {
      Swal.fire('Error', 'Completa todos los campos', 'error');
      return;
    }

    if (this.editMode) {
      const index = this.accesses.findIndex(a => a.id === this.form.id);
      this.accesses[index] = { ...this.form };
      Swal.fire('Actualizado', 'Registro actualizado correctamente', 'success');
    } else {
      this.accesses.push({
        ...this.form,
        id: Date.now()
      });
      Swal.fire('Creado', 'Acceso creado correctamente', 'success');
    }

    this.resetForm();
  }

  editAccess(access: Access) {
    this.form = { ...access };
    this.editMode = true;
  }

  deleteAccess(id: number) {
    Swal.fire({
      title: '¿Eliminar?',
      text: 'Este registro será eliminado',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar'
    }).then(result => {
      if (result.isConfirmed) {
        this.accesses = this.accesses.filter(a => a.id !== id);
        Swal.fire('Eliminado', 'Registro eliminado', 'success');
      }
    });
  }

  logout() {
    Swal.fire({
      title: 'Cerrar sesión',
      text: '¿Seguro que deseas salir?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Salir'
    }).then(result => {
      if (result.isConfirmed) {
        this.router.navigate(['/login']);
      }
    });
  }
}