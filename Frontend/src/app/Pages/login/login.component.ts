import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';  // For navigation

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  mobile: string = '';
  otp: string = '';

  constructor(private router: Router) {}

  sendOtp() {
    if (!/^\d{10}$/.test(this.mobile)) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem('otp', otp);
    localStorage.setItem('mobile', this.mobile);  // Keep storing mobile for later use
    console.log('Generated OTP:', otp); // For testing only, remove in production
    alert('OTP sent to ' + this.mobile);
    this.openModal();
  }

  openModal() {
    const modal = document.getElementById('otp-modal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal() {
    const modal = document.getElementById('otp-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }

verifyOtp() {
  const storedOtp = localStorage.getItem('otp');
  if (!/^\d{6}$/.test(this.otp)) {
    alert('Please enter a valid 6-digit OTP.');
    return;
  }
  if (this.otp === storedOtp) {
    // OTP verified, clear only the OTP
    localStorage.removeItem('otp');

    // Store mobile in userInfo object
    const userInfo = {
      mobile: this.mobile,
      fullName: '',   // empty initially
      email: ''       // empty initially
    };
    localStorage.setItem('userInfo', JSON.stringify(userInfo));

    alert('Login successful!');
    this.router.navigate(['/home']);
  } else {
    alert('Invalid OTP. Please try again.');
  }
}

}
