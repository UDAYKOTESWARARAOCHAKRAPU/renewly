import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Document {
  name: string;
  type: string;
  expiry: string;
  status?: 'valid' | 'soon' | 'expired';
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  username = 'User';
  documents: Document[] = []; // Will only hold expired and soon documents
  validCount = 0;
  expiringCount = 0;
  expiredCount = 0;
  totalCount = 0;

  ngOnInit(): void {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (userInfo && userInfo.fullName) {
      this.username = userInfo.fullName;
    }

    this.loadDocuments();
  }

  loadDocuments() {
    const docs: Document[] = JSON.parse(localStorage.getItem('documents') || '[]');
    let valid = 0, soon = 0, expired = 0;

    const filteredDocs = docs.map(doc => {
      const today = new Date();
      const expiry = new Date(doc.expiry);
      let status: 'valid' | 'soon' | 'expired' = 'valid';

      if (expiry < today) {
        status = 'expired';
        expired++;
      } else if ((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24) <= 7) {
        status = 'soon';
        soon++;
      } else {
        status = 'valid';
        valid++;
      }

      return { ...doc, status };
    }).filter(doc => doc.status !== 'valid'); // Keep only expired and soon documents

    this.documents = filteredDocs;
    this.totalCount = docs.length;
    this.validCount = valid;
    this.expiringCount = soon;
    this.expiredCount = expired;
  }

  getDocIcon(type: string) {
    switch (type) {
      case 'ID': return 'fa-id-card';
      case 'License': return 'fa-id-badge';
      case 'Passport': return 'fa-passport';
      case 'Certificate': return 'fa-file-alt';
      default: return 'fa-file';
    }
  }

  viewDocument(doc: Document) {
    alert(`Viewing document: ${doc.name}`);
    // Implement view logic here
  }

  deleteDocument(index: number) {
    if (confirm('Are you sure you want to delete this document?')) {
      this.documents.splice(index, 1);
      localStorage.setItem('documents', JSON.stringify([...this.documents, ...this.getValidDocuments()]));
      this.loadDocuments();
    }
  }

  private getValidDocuments(): Document[] {
    const docs: Document[] = JSON.parse(localStorage.getItem('documents') || '[]');
    return docs.filter(doc => {
      const today = new Date();
      const expiry = new Date(doc.expiry);
      return expiry >= today && (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24) > 7;
    });
  }
}
