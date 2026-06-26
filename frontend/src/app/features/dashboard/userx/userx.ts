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
  selector: 'app-userx',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './userx.html',

  styleUrls: ['./userx.css']
})
export class UserxComponent {

  // =========================
  // VARIABLES
  // =========================

  menuOpen = true;

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