import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login.component')
        .then(m => m.LoginComponent)
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/pages/register/register.component')
        .then(m => m.RegisterComponent)
  },

  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./features/auth/pages/forgot-password/forgot-password.component')
        .then(m => m.ForgotPasswordComponent)
  },

  // 🔥 DASHBOARD DIRECTO
  {
    path: 'dashboard/super-admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/super-admin/super-admin.component')
        .then(m => m.SuperAdminComponent)
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];