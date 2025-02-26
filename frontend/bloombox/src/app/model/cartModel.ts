import { Product } from './productModel';


export class Cart {
  _id: string;
  quantity: number;
  items: { productId: Product; quantity: number }[];
  cartUserId: string;

  constructor(){
    this._id = '';
    this.quantity = 1;
    this.items = [];
    this.cartUserId = '';

  }
}
