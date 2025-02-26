export class Contact{
  _id?:string;
  contactFirstName: string;
  contactLastName: string;
  contactPhoneNumber: number | null;
  contactEmail: string;
  contactMessage: string;
  contactQuery: "General_Inquiry" | "Technical_Support" | "Refund";


  constructor(){
    this.contactEmail = '';
    this.contactFirstName = '';
    this.contactLastName = '';
    this.contactPhoneNumber = null ;
    this.contactMessage = '';
    this.contactQuery = "General_Inquiry";
  }
}
