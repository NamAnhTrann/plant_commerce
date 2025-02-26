export class Product {
  _id: string;
  productName: string;
  productDescription: string;
  productPrice: number;
  productQuantity: number;
  productCreatedAt: Date;
  productCategory: string;
  productImage: string;

  constructor(){
    this._id = '';
    this.productName = '';
    this.productDescription = '';
    this.productPrice = 0;
    this.productQuantity = 0;
    this.productCreatedAt = new Date();
    this.productCategory = '';
    this.productImage = '';

  }
}
