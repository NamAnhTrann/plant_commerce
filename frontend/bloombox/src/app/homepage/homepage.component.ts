import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatabaseService } from '../services/database.service';
import { Product } from '../model/productModel';
import { FormsModule } from '@angular/forms';
import { getAuth } from '@firebase/auth';
import { Cart } from '../model/cartModel';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
  mobileMenuOpen: boolean = false;
  isScroll: boolean = false;
  product: Product [] = [];
  cartId: string = '';
  cart: Cart = new Cart();

  constructor(private db:DatabaseService, private router:Router, private auth:AuthService){}


  ngOnInit() {
    this.getProduct();
  }

  getProduct(){
    this.db.getAllProduct().subscribe((data:any)=>{
      this.product = data.filter((plant:any) => ["Snake Plant", "Fiddle Leaf Fig", "Bonsai Tree", "Peace Lily"].includes(plant.productName))
    }); //filtering out specfic plants
  }

  viewProduct(productId:string){
    this.router.navigate(["/view-product", productId])
  }

  listCartId(cartId:string){
    this.db.listCartItem(cartId).then((res)=>{
      res?.subscribe((res:any)=>{
      this.cart = res.cart;
    })
  })

  }



  @HostListener("window:scroll", [])
  onWindowScroll(){
    this.isScroll = window.scrollY > 50;
  }



  toggleMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  logout(){
    this.auth.logout();
    Swal.fire({
                icon: 'success',
                title: 'Logged Out!',
                text: "You are log out",
                showConfirmButton: false,
                timer: 3000
              });
  }


}
