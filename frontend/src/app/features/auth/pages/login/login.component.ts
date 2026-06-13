import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

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

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const theme = localStorage.getItem('theme');

    if (theme === 'dark') {
      document.body.classList.add('dark');
    }
  }

toggleDarkMode() {
  document.body.classList.toggle('dark');

  if (document.body.classList.contains('dark')) {
    document.body.style.background = 'black';
  } else {
    document.body.style.background = 'white';
  }
}

  login() {
    this.auth.login(this.email, this.password)
      .then(() => {
        this.router.navigate(
          ['/home'],
          { replaceUrl: true }
        );
      })
      .catch(err => alert(err.message));
  }

  loginWithGoogle() {
    this.auth.loginWithGoogle()
      .then(() => {
        this.router.navigate(
          ['/home'],
          { replaceUrl: true }
        );
      })
      .catch(err => alert(err.message));
  }
}