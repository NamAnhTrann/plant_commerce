
export class Location {
  _id: string;
  locationStreet: string;
  locationCity: string;
  locationState: string;
  locationCountry: string;
  locationPostCode: number;

  constructor(){
    this._id = '';
    this.locationCity = '';
    this.locationStreet = '';
    this.locationState = '';
    this.locationCountry = '';
    this.locationPostCode = 0;
  }
}
