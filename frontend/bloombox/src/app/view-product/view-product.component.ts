import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatabaseService } from '../services/database.service';
import { Product } from '../model/productModel';
import { Cart } from '../model/cartModel';
import { getAuth } from '@firebase/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-product',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './view-product.component.html',
  styleUrl: './view-product.component.css'
})
export class ViewProductComponent {

  product: Product [] =[];
  cart: Cart = new Cart();
  productId: string = '';

  ngOnInit() {
    const auth = getAuth();
    auth.onAuthStateChanged((user)=>{
      console.log(`user is authenticated ${user}`)
    })


    this.route.paramMap.subscribe(params => {
        const productId = params.get('id')!;
        this.productId = productId;
        this.getProductId(productId);
    });
}

  constructor(private db: DatabaseService, private router: Router, private route:ActivatedRoute){}

  getProductId(productId:string){
    this.db.getProductId(productId).subscribe((data:any)=>{
      this.product = data;
    });
  };

  addToCart(productId: string, cartQuantity:number){
    const selectedProduct = this.product.find(product => product._id === productId)
    this.db.addToCart(productId, cartQuantity).then((res)=>{
      res?.subscribe(
        (res)=>{
          console.log("product added", res)
             Swal.fire({
                      icon: 'success',
                      title: 'Product Added, you can now view your cart on the navigation bar!',
                      text: selectedProduct
                      ? `${cartQuantity} ${selectedProduct.productName} has been added to your cart.`
                      : `Product ${productId} has been added to your cart.`,
                      showConfirmButton: false,
                      timer: 3000
                    }).then(()=>{
                      window.location.reload();

                    });
        },
        (error)=>{
          console.error("Product not added", error)
          Swal.fire({
            icon: 'error',
            title: 'Limited Products :(',
            text: selectedProduct
                      ? ` We only have ${selectedProduct.productQuantity} ${selectedProduct.productName}  left, sorry!`
                      : `Product ${productId} has NOT been added to your cart.`,
            confirmButtonText: 'Try again'
          });

        }
      )
    })
  }

  decreaseQuantity(){
    if(this.cart.quantity > 1){
      this.cart.quantity --
    };

  }

  increaseQuantity(){
    this.cart.quantity++;
  }


}
