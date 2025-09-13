import { Component } from '@angular/core';


@Component({
  selector: 'app-footer',

  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  socialIcons = {
    instagram: 'images/instagram.png',
    facebook: 'images/facebook.png',
    twitter: 'images/twitter.png',
    whatsapp: 'images/whatsapp.png'
  };
}
