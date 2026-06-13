import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  showPassword = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  register() {
    this.auth.register(
      this.email,
      this.password
    )
    .then(() => {
      this.router.navigate(
        ['/home'],
        { replaceUrl: true }
      );
    })
    .catch(err => {
      alert(err.message);
    });
  }

  registerWithGoogle() {
    this.auth.loginWithGoogle()
      .then(() => {
        this.router.navigate(
          ['/home'],
          { replaceUrl: true }
        );
      })
      .catch(err => {
        alert(err.message);
      });
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

  ngOnInit(): void {
    const theme = localStorage.getItem('theme');

    if (theme === 'dark') {
      document.body.classList.add('dark');
    }
  }
}