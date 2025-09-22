import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    canActivate: [authGuard], // ✅ protected
    loadComponent: () => import('./Pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: '',
    loadComponent: () => import('./Pages/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'add-document',
    canActivate: [authGuard], // ✅ protected
    loadComponent: () => import('./Pages/add-document/add-document.component').then(m => m.AddDocumentComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard], // ✅ protected
    loadComponent: () => import('./Pages/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./Pages/login/login.component').then(m => m.LoginComponent)
  }
];
