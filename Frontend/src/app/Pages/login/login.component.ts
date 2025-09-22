import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';  // For navigation
import  api  from '../../../api'; // Import the api instance

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

  async sendOtp() {
    if (!/^\d{10}$/.test(this.mobile)) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }
    try {
      const response = await api.post('/auth/send-otp', { phone_number: this.mobile });
      console.log('OTP sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Failed to send OTP. Please try again.');
      return;
    }
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

async verifyOtp() {
  const storedOtp = localStorage.getItem('otp');
  if (!/^\d{6}$/.test(this.otp)) {
    alert('Please enter a valid 6-digit OTP.');
    return;
  }
  try {
    const response = await api.post('/auth/verify-otp', { phone_number: this.mobile, otp: this.otp });
    if (response.status === 200) {
      alert('Login successful!');
      console.log(response)
      localStorage.setItem('token', response.data.access_token); // Store JWT token
      this.router.navigate(['/home']); // Navigate to dashboard
      this.closeModal();
    } 
  }catch(err:any){
    console.error('Error verifying OTP:', err);
    alert(err.response.data);
  }
}
}