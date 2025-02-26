
import { Location } from "./locationModel";

export class User {
  _id: string;
  userEmail:string;
  userFirstName: string;
  userLastName: string;
  userPhoneNumber: number;
  userLocation: Location | null;
  userCreatedAt: Date;


  constructor(){
    this._id = '';
    this.userLocation = null;
    this.userEmail = '';
    this.userFirstName = '';
    this.userLastName = '';
    this.userPhoneNumber = 0;
    this.userCreatedAt = new Date();

  }
}
