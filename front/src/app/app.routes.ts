import { Router, Routes } from '@angular/router';
import { LoginComponent } from '../components/auth/login/login.component';
import { inject } from '@angular/core';
import { AuthLayoutComponent } from '../components/auth/auth-layout/auth-layout.component';
import { RegisterComponent } from '../components/auth/register/register.component';
import { HeaderComponent } from '../components/common/header/header.component';
import { ListComponent } from '../components/budgets/list/list.component';
/*
const canActivateDashboard = () => {
  const isLoggedIn = localStorage.getItem('token'); // o un servicio de auth real
  const router = inject(Router);

  if (!isLoggedIn) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};*/
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      /*
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' },*/
    ],
  },

    {
    path: 'crashflow',
    component: HeaderComponent,
    children: [
      { path: 'budget/list', component: ListComponent },

    ],
  },
  { path: '**', redirectTo: 'auth/login' },
];
