import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'home',
        loadComponent:() =>{
            return import('./Pages/home/home.component').then(m => m.HomeComponent)
        }
    },
    {
        path: '',
        loadComponent:() =>{
            return import('./Pages/landing/landing.component').then(m => m.LandingComponent)
        }
    },
    {
        path: 'add-document',
        loadComponent:() =>{
            return import('./Pages/add-document/add-document.component').then(m => m.AddDocumentComponent)
        }
    },
    {
        path: 'profile',
        loadComponent:() =>{
            return import('./Pages/profile/profile.component').then(m => m.ProfileComponent)
        }
    },
    {
        path: 'login',
        loadComponent:() =>{
            return import('./Pages/login/login.component').then(m => m.LoginComponent)
        }
    }
];
