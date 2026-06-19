import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FirestoreService } from '../../core/services/firestore.service';

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
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {

  menuOpen = true;

  accesses: Access[] = [
    { id: '1', name: 'Admin Principal', role: 'Admin', tempAccess: false },
    { id: '2', name: 'Usuario Temporal', role: 'User', tempAccess: true, expirationDate: '2026-06-30' }
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

  editMode = false;

  constructor(private router: Router, private firestoreService: FirestoreService) { }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  ngOnInit() {
    this.firestoreService.getUsers().subscribe(data => {
      this.accesses = data;
    });
  }

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
        this.resetForm();
      });
    } else {
      this.firestoreService.createUser(data).then(() => {
        this.resetForm();
      });
    }
  }

  editAccess(access: Access) {
    this.form = { ...access };
    this.editMode = true;
  }

  deleteAccess(id: string) {
    this.firestoreService.deleteUser(id);
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