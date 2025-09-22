import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(public router: Router) {}

  get isLanding(): boolean {
    return this.router.url === '/' || this.router.url === '/login';
  }

logout() {
  localStorage.removeItem('token');
  this.router.navigate(['/login']);
}

}
