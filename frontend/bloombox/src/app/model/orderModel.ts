export class Order {
  _id: string;
  orderSubtotal: number;
  orderTotalAmount: number;
  orderVAT: number;
  orderStatus: 'COMPLETED' | 'PENDING' | "NOT_COMPLETED"
  orderCreatedAt: Date;
  userId: string;

constructor(){
  this._id = '';
  this.orderSubtotal = 0;
  this.orderTotalAmount = 0;
  this.orderVAT = 0;
  this.orderStatus = 'PENDING';
  this.userId = '';
  this.orderCreatedAt = new Date();


}
}
