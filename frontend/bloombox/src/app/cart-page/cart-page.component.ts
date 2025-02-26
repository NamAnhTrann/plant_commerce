import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Cart } from '../model/cartModel';
import { DatabaseService } from '../services/database.service';
import { getAuth } from 'firebase/auth';
import { Product } from '../model/productModel';
import Swal from 'sweetalert2';
import { Order } from '../model/orderModel';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css'
})
export class CartPageComponent {

  cart: Cart | null = new Cart(); //single cart
  order: Order | null = null;
  cartId: string = '';
  userId: string = '';

  constructor(private router:Router, private db:DatabaseService, private route:ActivatedRoute){}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id && id.trim() !== '' && id !== 'null' && id !== 'undefined') {
        this.cartId = id;
      } else {
        console.log("Cart ID is invalid or missing.");
        this.cart = new Cart();
      }
    });

    const auth = getAuth();
    auth.onAuthStateChanged((user) => {
      if (user && this.cartId) {
        this.userId = user.uid;
        console.log("User is authenticated:", user);
        console.log("User ID:", user.uid);
        console.log("User Email:", user.email);
        this.listCartId(this.cartId);
        this.listOrder(this.userId)
      } else {
        console.warn("User not authenticated or cartId missing.");
      }
    });
  }

  listCartId(cartId: string) {
    if (!cartId) {
      console.log("No cart ID provided, skipping API call.");
      this.router.navigate(['/']);
      window.location.href = "/list-product";
      return;
    }

    this.db.listCartItem(cartId).then((res) => {
      res?.subscribe((res: any) => {
        if (!res.cart || !res.cart.items || res.cart.items.length === 0)  {
          this.router.navigate(["/list-product"])
          console.log("No cart available, showing empty cart message.");
        } else {
          console.log("Received cart data:", res.cart);
          this.cart = res.cart;
        }
      });
    });
  }


  reduceCartItemQuantity(productId:string){
    this.db.reduceCartQuantity(this.cartId, productId).subscribe((data:any)=>{
      console.log(data);
      Swal.fire({
              icon: 'success',
              title: 'Item remove, please refresh upon landing on the new page',
              text: 'Item has been remove',
              showConfirmButton: false,
              timer: 4000
            });
      this.listCartId(this.cartId)
      this.listOrder(this.userId)
    })
  }

  checkOutButton(userId: string) {
    this.db.checkUserProfile(userId).then((res) => {
      res?.subscribe((res: any) => {
        console.log("Profile check response:", res);

        if (res.isProfileComplete) {
          this.createPayment()
        } else {
          this.router.navigate(["/user-information", userId]);
        }
      });
    }).catch((error) => {
      console.error("Error checking profile:", error);
    });
  }

  createPayment(){
    this.db.createPayment(this.userId).then((res)=>{
      res?.subscribe((res:any)=>{
        window.location.href = res.url
      })
    })

  }



  listOrder(userId:string){
    this.db.listOrderId(userId).then((res)=>{
      res?.subscribe((res:any)=>{
        this.order = res.order
        console.log('order is: ', this.order)
        console.log(res)
      })
    })
  }






}
