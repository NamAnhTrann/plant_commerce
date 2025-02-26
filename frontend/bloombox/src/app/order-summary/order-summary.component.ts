import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { OrderItem } from '../model/orderItemModel';
import { getAuth } from '@firebase/auth';
import { DatabaseService } from '../services/database.service';
import { User } from '../model/userModel';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.css'
})
export class OrderSummaryComponent {
  orderItem: OrderItem | null = null;
  userId:string = '';
  user: User | null = null;
  paymentConfirmed: boolean = false;

  constructor(private db: DatabaseService, private router: Router){}

  ngOnInit(){
    const auth = getAuth();
    auth.onAuthStateChanged((user)=>{
      if(user){
        this.userId = user.uid
        this.listOrderItem(this.userId)
        this.listUserId(this.userId)
        this.checkoutandConfirmPayment()
      } else {
        console.log("User not authenticated")
      }
    })
  }


  listOrderItem(userId: string) {
    this.db.listOrderItemId(userId).then((res) => {
      res?.subscribe((res: any) => {
        console.log("Full API Response:", res); // Log the full response

        this.orderItem = res.orderItems;
        console.log("orderItem fetch:", this.orderItem);
      });
    });
  }

  listUserId(userId:string){
    this.db.getUser(userId).then((res)=>{
      res?.subscribe((res:any)=>{
        console.log("Full API Response:", res); // Log the full response
        this.user = res;
        console.log("User fetch:", this.user);

      })
    })
  }

  checkoutandConfirmPayment() {
    console.log("checkoutandConfirmPayment() is being executed");

    // Extract session_id from the full URL for Angular hash-based routing
    const urlParts = window.location.href.split("?");
    if (urlParts.length > 1) {
        const params = new URLSearchParams(urlParts[1]);
        const sessionId = params.get("session_id");

        console.log("Extracted session_id:", sessionId);  // Debugging line

        if (!sessionId) {
            console.warn("No session ID found in URL. Skipping payment confirmation.");
            return;
        }

        console.log("Session ID found:", sessionId);
        this.confirmPayment(sessionId);
    } else {
        console.warn("No query parameters found in URL.");
    }
}



  confirmPayment(sessionId: string) {
    console.log("Sending session_id to backend:", sessionId);  // Debugging line

    this.db.confirmPayment(sessionId).then((res) => {
      res?.subscribe((res: any) => {
        console.log(res);
        if (res.message === "Payment successful, cart cleared, order completed") {
          this.paymentConfirmed = true;
          this.listOrderItem(this.userId);
        }
      });
    });
  }


  editDetailButton(){
    this.router.navigate(["/user-information", this.userId]);
  }






}
