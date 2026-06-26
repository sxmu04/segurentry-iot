import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FirestoreService } from '../../../core/services/firestore.service';

interface Access {
  id: string;
  name: string;
  role: string;
  email?: string;
  document?: string;
  tempAccess: boolean;
  expirationDate?: string;
}

@Component({
  selector: 'app-vigilante',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './vigilante.html',

  styleUrls: ['./vigilante.css']
})
export class VigilanteComponent {

  // =========================
  // VARIABLES
  // =========================

  menuOpen = true;

  // <-- ESTA ES LA VARIABLE QUE TE FALTA
  showForm = false;

  editMode = false;

  accesses: Access[] = [
    {
      id: '1',
      name: 'Admin Principal',
      role: 'Admin',
      tempAccess: false
    },
    {
      id: '2',
      name: 'Usuario Temporal',
      role: 'User',
      tempAccess: true,
      expirationDate: '2026-06-30'
    }
  ];

  form: Access = {
    id: '',
    name: '',
    role: '',
    email: '',
    document: '',
    tempAccess: false,
    expirationDate: ''
  };

  constructor(
    private router: Router,
    private firestoreService: FirestoreService
  ) { }

  // =========================
  // CICLO DE VIDA
  // =========================

  ngOnInit() {

    this.firestoreService.getUsers().subscribe(data => {
      this.accesses = data;
    });

  }

  // =========================
  // SIDEBAR
  // =========================

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  // =========================
  // MODAL
  // =========================

  openForm() {

    this.resetForm();

    this.showForm = true;

  }

  closeForm() {

    this.resetForm();

    this.showForm = false;

  }

  // =========================
  // FORMULARIO
  // =========================

  resetForm() {

    this.form = {
      id: '',
      name: '',
      role: '',
      email: '',
      document: '',
      tempAccess: false,
      expirationDate: ''
    };

    this.editMode = false;

  }

  saveAccess() {

    const data = {

      name: this.form.name,
      email: this.form.email,
      document: this.form.document,
      role: this.form.role,
      tempAccess: this.form.tempAccess,
      expirationDate: this.form.expirationDate || null

    };

    if (this.editMode) {

      this.firestoreService.updateUser(this.form.id, data).then(() => {

        Swal.fire({

          icon: 'success',
          title: 'Usuario actualizado',
          timer: 1500,
          showConfirmButton: false

        });

        this.showForm = false;

        this.resetForm();

      });

    } else {

      this.firestoreService.createUser(data).then(() => {

        Swal.fire({

          icon: 'success',
          title: 'Usuario registrado',
          timer: 1500,
          showConfirmButton: false

        });

        this.showForm = false;

        this.resetForm();

      });

    }

  }

  // =========================
  // EDITAR
  // =========================

  editAccess(access: Access) {

    this.form = { ...access };

    this.editMode = true;

    this.showForm = true;

  }

  // =========================
  // ELIMINAR
  // =========================

  deleteAccess(id: string) {

    Swal.fire({

      title: 'Eliminar usuario',

      text: '¿Desea eliminar este usuario?',

      icon: 'warning',

      showCancelButton: true,

      confirmButtonText: 'Eliminar',

      cancelButtonText: 'Cancelar'

    }).then(result => {

      if (result.isConfirmed) {

        this.firestoreService.deleteUser(id);

        Swal.fire({

          icon: 'success',

          title: 'Usuario eliminado',

          timer: 1500,

          showConfirmButton: false

        });

      }

    });

  }

  // =========================
  // LOGOUT
  // =========================

  logout() {

    Swal.fire({

      title: 'Cerrar sesión',

      text: '¿Seguro que deseas salir?',

      icon: 'question',

      showCancelButton: true,

      confirmButtonText: 'Salir',

      cancelButtonText: 'Cancelar'

    }).then(result => {

      if (result.isConfirmed) {

        this.router.navigate(['/login']);

      }

    });

  }

}