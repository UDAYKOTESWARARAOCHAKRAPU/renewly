import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent:() =>{
            return import('./Pages/home/home.component').then(m => m.HomeComponent)
        }
    },
    {
        path: 'landing',
        loadComponent:() =>{
            return import('./Pages/landing/landing.component').then(m => m.LandingComponent)
        }
    },
];
