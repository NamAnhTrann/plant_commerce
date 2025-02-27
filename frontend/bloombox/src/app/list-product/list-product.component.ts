import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Product } from '../model/productModel';
import { DatabaseService } from '../services/database.service';
import { FormsModule } from '@angular/forms';
import { Cart } from '../model/cartModel';
import { getAuth } from '@firebase/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-product',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './list-product.component.html',
  styleUrl: './list-product.component.css'
})
export class ListProductComponent {
  product: Product[] = []
    cart: Cart = new Cart();
    productId: string = '';


  constructor(private router:Router, private db:DatabaseService){}

  ngOnInit(){

    const auth = getAuth();
    auth.onAuthStateChanged((user)=>{
    })
    this.listProduct()
  }

  listProduct(){
    this.db.getAllProduct().subscribe((data:any)=>{
      this.product = data;

    })
  }

  viewProduct(productId:string){
    this.router.navigate(["/view-product", productId])
  }
  addToCart(productId: string, cartQuantity:number=1){
    const selectedProduct = this.product.find(product => product._id === productId)
    cartQuantity = 1;
    this.db.addToCart(productId, cartQuantity).then((res)=>{
      res?.subscribe(
        (res)=>{
          console.log("product added", res)
          Swal.fire({
            icon: 'success',
            title: 'Product Added, you can now view your cart on the navigation bar!',
            text: selectedProduct? `${cartQuantity} ${selectedProduct.productName} has been added to your cart.`: `Product ${productId} has been added to your cart`,
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
}
