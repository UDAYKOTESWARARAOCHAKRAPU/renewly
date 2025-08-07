document.addEventListener('DOMContentLoaded', () => {
  console.log('profile.js loaded: Initializing profile page scripts');

  // Check session
  if (!localStorage.getItem('userInfo')) {
    console.log('No userInfo found, redirecting to landing.html');
    window.location.href = 'landing.html';
    return;
  }

  // Elements
  const profileView = document.getElementById('profile-view');
  const profileForm = document.getElementById('profile-form');
  const editProfileBtn = document.getElementById('edit-profile-btn');
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  const emptyProfileMessage = document.getElementById('empty-profile-message');
  const fullNameSpan = document.getElementById('fullName');
  const emailSpan = document.getElementById('email');
  const phoneSpan = document.getElementById('phone');
  const fullNameInput = document.getElementById('fullNameInput');
  const emailInput = document.getElementById('emailInput');
  const phoneInput = document.getElementById('phoneInput');
  const logoutBtn = document.getElementById('logout-btn');

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

  // Logout functionality
  if (logoutBtn) {
    logoutBtn.addEventListener('click', e => {
      e.preventDefault();
      localStorage.clear();
      showNotification('Logged out successfully!');
      console.log('User logged out, localStorage cleared');
      setTimeout(() => {
        window.location.href = 'landing.html';
      }, 1000);
    });
  }

  // Load profile data
  const loadProfile = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const isProfileComplete = userInfo.fullName && userInfo.mobile;

    if (isProfileComplete) {
      if (fullNameSpan) fullNameSpan.textContent = userInfo.fullName;
      if (emailSpan) emailSpan.textContent = userInfo.email || 'Not set';
      if (phoneSpan) phoneSpan.textContent = userInfo.mobile;
      if (fullNameInput) fullNameInput.value = userInfo.fullName;
      if (emailInput) emailInput.value = userInfo.email || '';
      if (phoneInput) phoneInput.value = userInfo.mobile;

      profileView.style.display = 'block';
      profileForm.style.display = 'none';
      emptyProfileMessage.style.display = 'none';
    } else {
      profileView.style.display = 'none';
      profileForm.style.display = 'block';
      emptyProfileMessage.style.display = 'block';
      if (phoneInput) phoneInput.value = userInfo.mobile || '';
      if (fullNameInput) fullNameInput.value = '';
      if (emailInput) emailInput.value = '';
    }
  };

  // Toggle edit mode
  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', () => {
      profileView.style.display = 'none';
      profileForm.style.display = 'block';
      emptyProfileMessage.style.display = 'none';
      console.log('Edit profile mode activated');
    });
  }

  if (cancelEditBtn) {
    cancelEditBtn.addEventListener('click', () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const isProfileComplete = userInfo.fullName && userInfo.mobile;
      if (isProfileComplete) {
        profileForm.style.display = 'none';
        profileView.style.display = 'block';
        emptyProfileMessage.style.display = 'none';
      } else {
        profileForm.style.display = 'block';
        profileView.style.display = 'none';
        emptyProfileMessage.style.display = 'block';
      }
      loadProfile();
      console.log('Edit profile mode cancelled');
    });
  }

  // Form submission
  if (profileForm) {
    profileForm.addEventListener('submit', e => {
      e.preventDefault();
      console.log('Profile form submitted');

      const fullName = fullNameInput.value.trim();
      const email = emailInput.value.trim();
      const phone = phoneInput.value.trim();

      // Validation
      if (!fullName || !phone) {
        showNotification('Full Name and Phone are required', 'error');
        return;
      }
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
      }
      if (!/^\d{10}$/.test(phone)) {
        showNotification('Please enter a valid 10-digit phone number', 'error');
        return;
      }

      // Save to localStorage
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      userInfo.fullName = fullName;
      userInfo.email = email;
      userInfo.mobile = phone;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));

      // Update view
      profileForm.style.display = 'none';
      profileView.style.display = 'block';
      emptyProfileMessage.style.display = 'none';
      loadProfile();
      showNotification('Profile updated successfully!');
      console.log('Profile updated:', userInfo);
    });
  }

  // Initialize
  loadProfile();
});