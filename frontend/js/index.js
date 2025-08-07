document.addEventListener('DOMContentLoaded', () => {
  console.log('index.js loaded: Initializing home page scripts');

  // Check session
  if (!localStorage.getItem('userInfo')) {
    console.log('No userInfo found, redirecting to landing.html');
    window.location.href = 'landing.html';
    return;
  }

  // Elements
  const usernameSpan = document.getElementById('username');
  const cardGrid = document.getElementById('card-grid');
  const validCount = document.getElementById('valid-count');
  const expiringCount = document.getElementById('expiring-count');
  const expiredCount = document.getElementById('expired-count');
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

  // Set username
  if (usernameSpan) {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    usernameSpan.textContent = userInfo.fullName || 'User';
  }

  // Load and filter documents
  const loadDocuments = () => {
    const documents = JSON.parse(localStorage.getItem('documents') || '[]');
    cardGrid.innerHTML = '';
    let valid = 0, expiring = 0, expired = 0;
    const today = new Date();
    const oneMonthFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    documents.forEach((doc, index) => {
      const expiryDate = new Date(doc.expiry);
      const daysDiff = Math.round((expiryDate - today) / (24 * 60 * 60 * 1000));

      if (expiryDate < today) {
        // Expired
        addDocumentCard(doc, index, 'expired', `Expired ${Math.abs(daysDiff)} days ago`);
        expired++;
      } else if (expiryDate <= oneMonthFromNow) {
        // Expiring within 30 days
        addDocumentCard(doc, index, 'soon', `${daysDiff} days remaining`);
        expiring++;
      } else {
        valid++;
      }
    });

    // Update stats
    if (validCount) validCount.textContent = valid;
    if (expiringCount) expiringCount.textContent = expiring;
    if (expiredCount) expiredCount.textContent = expired;

    // Show "No documents" message if none qualify
    if (expiring === 0 && expired === 0) {
      cardGrid.innerHTML = '<p class="no-documents">No documents expiring soon or expired. Add documents to track them.</p>';
    }
  };

  // Add document card
  const addDocumentCard = (doc, index, status, statusText) => {
    const card = document.createElement('div');
    card.className = `doc-card ${status}`;
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.innerHTML = `
      <div class="card-tag ${status}">${status === 'expired' ? 'Expired' : 'Expiring Soon'}</div>
      <h3><i class="fas fa-${doc.type === 'ID' ? 'id-card' : doc.type === 'License' ? 'id-badge' : doc.type === 'Passport' ? 'passport' : 'file-alt'}"></i> ${doc.name}</h3>
      <p><strong>Expires:</strong> ${doc.expiry}</p>
      <p><strong>Type:</strong> ${doc.type}</p>
      <p class="status ${status}">${statusText}</p>
      <div class="card-actions">
        ${status === 'expired' ? '<button class="renew-btn" data-index="' + index + '"><i class="fas fa-sync-alt"></i> Renew</button>' : '<button class="edit-btn" data-index="' + index + '"><i class="fas fa-edit"></i> Edit</button>'}
        <button class="danger delete-btn" data-index="${index}"><i class="fas fa-trash"></i> Delete</button>
      </div>
    `;
    cardGrid.appendChild(card);
    setTimeout(() => {
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 100 * cardGrid.children.length);
  };

  // Card actions
  if (cardGrid) {
    cardGrid.addEventListener('click', e => {
      const index = e.target.closest('.btn')?.dataset.index;
      if (!index) return;

      const documents = JSON.parse(localStorage.getItem('documents') || '[]');
      if (e.target.closest('.edit-btn')) {
        localStorage.setItem('editDocIndex', index);
        window.location.href = 'add-document.html';
      } else if (e.target.closest('.delete-btn')) {
        if (confirm('Are you sure you want to delete this document?')) {
          documents.splice(index, 1);
          localStorage.setItem('documents', JSON.stringify(documents));
          loadDocuments();
          showNotification('Document deleted successfully!');
          console.log('Deleted document at index:', index);
        }
      } else if (e.target.closest('.renew-btn')) {
        localStorage.setItem('editDocIndex', index);
        window.location.href = 'add-document.html';
      }
    });
  }

  // Wave animation
  const wave = document.querySelector('.wave');
  if (wave) {
    setInterval(() => {
      wave.classList.add('waving');
      setTimeout(() => wave.classList.remove('waving'), 1000);
    }, 3000);
  }

  // Initialize
  loadDocuments();
});