import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateFormatPipe } from '../../pipes/date-format.pipe';

interface Document {
  name: string;
  type: string;
  expiry: string;
  fileData: string; // Base64 string of the uploaded file
}

@Component({
  selector: 'app-add-document',
  standalone: true,
  imports: [CommonModule, DateFormatPipe],
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.css'],
})
export class AddDocumentComponent implements OnInit {
  isModalOpen = false;
  documents: Document[] = [];

  ngOnInit(): void {
    this.loadDocuments();
  }

  openModal(): void {
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.isModalOpen = false;
    document.body.style.overflow = 'auto';
  }

  loadDocuments(): void {
    const storedDocs = JSON.parse(localStorage.getItem('documents') || '[]');
    this.documents = storedDocs;
  }

  saveDocuments(): void {
    localStorage.setItem('documents', JSON.stringify(this.documents));
  }

  addDocument(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const docName = (form.querySelector('#docName') as HTMLInputElement).value;
    const docType = (form.querySelector('#docType') as HTMLSelectElement).value;
    const expiry = (form.querySelector('#expiry') as HTMLInputElement).value;
    const fileInput = form.querySelector('#docFile') as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (!file) {
      alert('Please upload a file');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const fileData = reader.result as string;

      const newDoc: Document = {
        name: docName,
        type: docType,
        expiry: expiry,
        fileData: fileData,
      };

      this.documents.push(newDoc);
      this.saveDocuments();
      this.closeModal();
      form.reset();
    };
    reader.readAsDataURL(file);
  }
  isViewModalOpen = false;
  viewImageData: string | null = null;

  openViewModal(fileData: string): void {
    this.viewImageData = fileData;
    this.isViewModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeViewModal(): void {
    this.isViewModalOpen = false;
    this.viewImageData = null;
    document.body.style.overflow = 'auto';
  }

  deleteDocument(index: number): void {
    this.documents.splice(index, 1);
    this.saveDocuments();
  }

  getIconClass(type: string): string {
    switch (type) {
      case 'ID':
        return 'id-card';
      case 'License':
        return 'id-badge';
      case 'Passport':
        return 'passport';
      default:
        return 'file-alt';
    }
  }
}
