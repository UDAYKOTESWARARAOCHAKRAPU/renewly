import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
 selector: 'app-profile',
 standalone: true,
 imports: [CommonModule, FormsModule],
 templateUrl: './profile.component.html',
 styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  fullName = '';
  email = '';
  phone = '';
  editing = false;
  ngOnInit() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    this.fullName = userInfo.fullName || '';
    this.email = userInfo.email || '';
    this.phone = localStorage.getItem('mobile') || ''; // Access 'mobile' directly
    this.editing = !this.fullName; // Show form if fullName is empty
  }
  saveProfile() {
    const userInfo = {
      fullName: this.fullName,
      email: this.email,
      mobile: this.phone,
    };
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    this.editing = false;
  }
  editProfile() {
    this.editing = true;
  }
  cancelEdit() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    this.fullName = userInfo.fullName || '';
    this.email = userInfo.email || '';
    this.editing = false;
  }
}