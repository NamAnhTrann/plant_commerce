import { Cart } from "./cartModel";
import { Order } from "./orderModel";
import { Product } from "./productModel";
import { User } from "./userModel";


export class OrderItem{
  _id?: string;
  orderItemCartId: Cart;
  orderItemOrderId: Order;
  orderItemUserId: User;
  cartSnapshot:{productId: Product, quantity:number}[];

  constructor(orderItemCartId: Cart, orderItemOrderId: Order, orderItemUserId: User, cartSnapshot: { productId: Product; quantity: number }[] = []) {
    this.orderItemCartId = orderItemCartId;
    this.orderItemOrderId = orderItemOrderId;
    this.orderItemUserId = orderItemUserId;
    this.cartSnapshot = cartSnapshot;
  }

}
