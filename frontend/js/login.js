document.addEventListener('DOMContentLoaded', () => {
  console.log('login.js loaded: Initializing login page scripts');

  // Elements
  const mobileForm = document.getElementById('mobile-form');
  const otpForm = document.getElementById('otp-form');
  const otpModal = document.getElementById('otp-modal');
  const closeModalBtn = document.getElementById('close-modal');
  const mobileInput = document.getElementById('mobile');
  const otpInput = document.getElementById('otp');

  // Notification function
  const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
      <span>${message}</span>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  // Modal toggle functions
  const openModal = () => {
    otpModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    console.log('OTP modal opened');
  };

  const closeModal = () => {
    otpModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    otpForm.reset();
    console.log('OTP modal closed');
  };

  // Event listeners for modal
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }
  if (otpModal) {
    otpModal.addEventListener('click', e => {
      if (e.target === otpModal) closeModal();
    });
  }
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && otpModal.classList.contains('active')) closeModal();
  });

  // Mobile form submission
  if (mobileForm) {
    mobileForm.addEventListener('submit', e => {
      e.preventDefault();
      console.log('Mobile form submitted');

      const mobile = mobileInput.value.trim();
      // Validate mobile number (e.g., 10 digits for India)
      if (!/^\d{10}$/.test(mobile)) {
        showNotification('Please enter a valid 10-digit mobile number', 'error');
        return;
      }

      // Simulate OTP generation and storage
      const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
      localStorage.setItem('otp', otp);
      localStorage.setItem('mobile', mobile);
      console.log('Generated OTP:', otp); // For testing; remove in production

      // Simulate OTP sent
      showNotification('OTP sent to your mobile number');
      openModal();
    });
  }

  // OTP form submission
  if (otpForm) {
    otpForm.addEventListener('submit', e => {
      e.preventDefault();
      console.log('OTP form submitted');

      const enteredOtp = otpInput.value.trim();
      const storedOtp = localStorage.getItem('otp');
      const mobile = localStorage.getItem('mobile');

      // Validate OTP
      if (!/^\d{6}$/.test(enteredOtp)) {
        showNotification('Please enter a valid 6-digit OTP', 'error');
        return;
      }

      // Simulate OTP verification
      if (enteredOtp === storedOtp) {
        // Check if user is registered
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        const isRegistered = userInfo.mobile === mobile && userInfo.fullName && userInfo.fullName !== 'User';

        // Initialize or update userInfo
        if (!isRegistered) {
          localStorage.setItem('userInfo', JSON.stringify({ mobile }));
        } else {
          userInfo.mobile = mobile; // Update mobile if needed
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
        }

        localStorage.removeItem('otp');
        localStorage.removeItem('mobile');

        // Redirect to index.html for all users
        showNotification('Login successful!');
        setTimeout(() => {
          window.location.href = 'index.html';
          console.log(`Redirecting to index.html for ${isRegistered ? 'registered' : 'unregistered'} user`);
        }, 1000);
      } else {
        showNotification('Invalid OTP', 'error');
      }
    });
  }
});