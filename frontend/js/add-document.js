document.addEventListener('DOMContentLoaded', () => {
  console.log('add-document.js loaded: Initializing document page scripts');

  // Check session
  if (!localStorage.getItem('userInfo')) {
    console.log('No userInfo found, redirecting to landing.html');
    window.location.href = 'landing.html';
    return;
  }

  // Elements
  const modal = document.getElementById('add-doc-modal');
  const openModalBtn = document.getElementById('open-modal-btn');
  const openModalBtnMobile = document.getElementById('open-modal-btn-mobile');
  const closeModalBtn = document.getElementById('close-modal');
  const form = document.getElementById('add-doc-form');
  const cardGrid = document.getElementById('card-grid');
  const formTitle = document.querySelector('.modal-content h1');
  const logoutBtn = document.getElementById('logout-btn');

  // Debug: Check if elements exist
  if (!modal) console.error('Element #add-doc-modal not found');
  if (!openModalBtn) console.error('Element #open-modal-btn not found');
  if (!openModalBtnMobile) console.error('Element #open-modal-btn-mobile not found');
  if (!closeModalBtn) console.error('Element #close-modal not found');
  if (!form) console.error('Element #add-doc-form not found');
  if (!cardGrid) console.error('Element #card-grid not found');
  if (!formTitle) console.error('Element .modal-content h1 not found');
  if (!logoutBtn) console.error('Element #logout-btn not found');

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

  // Load documents from localStorage
  const loadDocuments = () => {
    console.log('Loading documents from localStorage');
    const documents = JSON.parse(localStorage.getItem('documents') || '[]');
    console.log('Documents loaded:', documents);
    cardGrid.innerHTML = '';
    if (documents.length === 0) {
      console.log('No documents found, displaying no-documents message');
      cardGrid.innerHTML = '<p class="no-documents">No documents added yet. Click "Add New Document" to start.</p>';
    } else {
      documents.forEach((doc, index) => {
        console.log(`Adding card for document ${index}:`, doc);
        addDocumentCard(doc, index);
      });
    }
  };

  // Add document card to grid
  const addDocumentCard = (doc, index) => {
    if (!doc.name || !doc.type || !doc.expiry) {
      console.error('Invalid document data:', doc);
      return;
    }
    const card = document.createElement('div');
    card.className = 'doc-card';
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.innerHTML = `
      <h3><i class="fas fa-${doc.type === 'ID' ? 'id-card' : doc.type === 'License' ? 'id-badge' : doc.type === 'Passport' ? 'passport' : 'file-alt'}"></i> ${doc.name}</h3>
      <p>Type: ${doc.type}</p>
      <p>Expires: ${doc.expiry}</p>
      <div class="actions">
        <button class="btn view-btn" data-index="${index}"><i class="fas fa-eye"></i> View</button>
        <button class="btn delete-btn" data-index="${index}"><i class="fas fa-trash"></i> Delete</button>
      </div>
    `;
    cardGrid.appendChild(card);
    console.log(`Card appended for document ${index}: ${doc.name}`);
    setTimeout(() => {
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 100 * cardGrid.children.length);
  };

  // Modal toggle functions
  const openModal = () => {
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      console.log('Modal opened');
    } else {
      console.error('Cannot open modal: modal element is null');
    }
  };

  const closeModal = () => {
    if (modal && form && formTitle) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
      form.reset();
      formTitle.innerHTML = '<i class="fas fa-file-plus"></i> Add New Document';
      localStorage.removeItem('editDocIndex');
      console.log('Modal closed');
    } else {
      console.error('Cannot close modal: modal, form, or formTitle is null');
    }
  };

  // Event listeners for modal
  if (openModalBtn) openModalBtn.addEventListener('click', openModal);
  if (openModalBtnMobile) openModalBtnMobile.addEventListener('click', openModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', e => {
      if (e.target === modal) closeModal();
    });
  }
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) closeModal();
  });

  // Check for edit mode
  const editIndex = localStorage.getItem('editDocIndex');
  if (editIndex !== null) {
    console.log(`Edit mode: Loading document at index ${editIndex}`);
    const documents = JSON.parse(localStorage.getItem('documents') || '[]');
    const doc = documents[parseInt(editIndex)];
    if (doc) {
      const docNameInput = document.getElementById('docName');
      const docTypeInput = document.getElementById('docType');
      const expiryInput = document.getElementById('expiry');
      if (docNameInput && docTypeInput && expiryInput) {
        docNameInput.value = doc.name;
        docTypeInput.value = doc.type;
        expiryInput.value = doc.expiry;
        formTitle.innerHTML = '<i class="fas fa-edit"></i> Edit Document';
        openModal();
        console.log('Edit mode initialized with document:', doc);
      } else {
        console.error('Edit mode failed: Form inputs not found');
      }
    } else {
      console.error(`Edit mode failed: No document found at index ${editIndex}`);
    }
  }

  // Form submission
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      console.log('Form submitted');

      const name = document.getElementById('docName')?.value.trim();
      const type = document.getElementById('docType')?.value;
      const expiry = document.getElementById('expiry')?.value;
      const file = document.getElementById('docFile')?.files[0];

      console.log('Form data:', { name, type, expiry, file: file ? file.name : 'No file' });

      // Validation
      if (!name || !type || !expiry) {
        showNotification('Please fill in all required fields', 'error');
        console.error('Validation failed: Missing required fields');
        return;
      }
      const today = new Date().toISOString().split('T')[0];
      if (expiry < today) {
        showNotification('Expiry date cannot be in the past', 'error');
        console.error('Validation failed: Expiry date is in the past');
        return;
      }
      if (file && file.size > 5 * 1024 * 1024) {
        showNotification('File size must be less than 5MB', 'error');
        console.error('Validation failed: File size exceeds 5MB');
        return;
      }

      const documents = JSON.parse(localStorage.getItem('documents') || '[]');
      const doc = { name, type, expiry };

      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          console.log('FileReader onload: File read successfully');
          doc.file = reader.result;
          saveDocument(doc);
        };
        reader.onerror = () => {
          showNotification('Error reading file', 'error');
          console.error('FileReader error:', reader.error);
        };
        reader.readAsDataURL(file);
      } else {
        console.log('No file uploaded, saving document without file');
        saveDocument(doc);
      }

      function saveDocument(doc) {
        if (editIndex !== null) {
          documents[parseInt(editIndex)] = doc;
          showNotification('Document updated successfully!');
          console.log('Document updated at index', editIndex, ':', doc);
        } else {
          documents.push(doc);
          showNotification('Document added successfully!');
          console.log('Document added:', doc);
        }
        localStorage.setItem('documents', JSON.stringify(documents));
        console.log('Documents saved to localStorage:', documents);
        loadDocuments();
        closeModal();
      }
    });
  } else {
    console.error('Form not found, cannot attach submit listener');
  }

  // Card actions
  if (cardGrid) {
    cardGrid.addEventListener('click', e => {
      const index = e.target.closest('.btn')?.dataset.index;
      if (!index) return;

      console.log(`Card action clicked: index ${index}`);
      const documents = JSON.parse(localStorage.getItem('documents') || '[]');
      if (e.target.closest('.view-btn')) {
        const doc = documents[index];
        if (doc) {
          console.log('Viewing document:', doc);
          const win = window.open('');
          win.document.write(`
            <html>
              <head><title>${doc.name}</title></head>
              <body style="margin: 20px; font-family: 'Poppins', sans-serif;">
                <h1>${doc.name}</h1>
                <p>Type: ${doc.type}</p>
                <p>Expires: ${doc.expiry}</p>
                ${doc.file ? (doc.file.startsWith('data:image') ? `<img src="${doc.file}" style="max-width: 100%;">` : `<a href="${doc.file}" target="_blank">View File</a>`) : '<p>No file uploaded</p>'}
              </body>
            </html>
          `);
        } else {
          console.error('View failed: No document at index', index);
        }
      } else if (e.target.closest('.delete-btn')) {
        if (confirm('Are you sure you want to delete this document?')) {
          console.log('Deleting document at index', index);
          documents.splice(index, 1);
          localStorage.setItem('documents', JSON.stringify(documents));
          loadDocuments();
          showNotification('Document deleted successfully!');
          console.log('Document deleted, updated documents:', documents);
        }
      }
    });
  } else {
    console.error('Card grid not found, cannot attach click listener');
  }

  // Initialize
  console.log('Initializing document page');
  loadDocuments();
});