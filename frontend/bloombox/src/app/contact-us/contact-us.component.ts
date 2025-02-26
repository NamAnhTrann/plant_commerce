import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Contact } from '../model/contactModel';
import { DatabaseService } from '../services/database.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {
  contact: Contact[] = []
  contactData: Contact = new Contact()


  constructor(private db:DatabaseService, private router:Router){}

  ngOnInit(){

  }

  addContact(){
    this.db.addContact(this.contactData).subscribe({
      next: (data:any) => {
        console.log(this.contactData);
        console.log(data);
        this.contactData = new Contact(); // Reset form

        Swal.fire({
          icon: 'success',
          title: 'Inquiries Sent!',
          text: 'Your problem has been sent and will be resolved as soon as possible!',
          showConfirmButton: false,
          timer: 3000,
        });
      },
      error: (err) => {
        console.error("Error adding contact:", err);
        Swal.fire({
          icon: 'error',
          title: 'Submission Failed!',
          text: err.error?.message || 'Something went wrong. Please try again later.',
          showConfirmButton: true,
        });
      }
    });
}


}
