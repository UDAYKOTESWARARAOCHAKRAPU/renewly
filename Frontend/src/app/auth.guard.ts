// src/app/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token'); // JWT stored after login

  if (token) {
    return true; // ✅ allow access
  } else {
    router.navigate(['/login']); // ❌ redirect if no token
    return false;
  }
};
