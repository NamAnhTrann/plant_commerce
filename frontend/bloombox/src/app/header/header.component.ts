import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Cart } from '../model/cartModel';
import { DatabaseService } from '../services/database.service';
import { getAuth } from '@firebase/auth';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
 mobileMenuOpen: boolean = false;
 isScroll: boolean = false;
 isHomePage: boolean = false;
 isErrorPage: boolean = false;
 isLoginPage: boolean = false;
 cartId: string = '';
cart: Cart = new Cart();

 constructor(private router: Router, private db: DatabaseService, private auth:AuthService, private cdr: ChangeDetectorRef){
  this.router.events.subscribe(()=>{
    this.isHomePage = this.router.url === '/';
    this.isErrorPage = this.router.url === "/error-page"
    this.isLoginPage = this.router.url === "/login"
  });
 }

 ngOnInit() {
  this.auth.getUserAsync().then(user=>{
    if (user) {
      this.db.listCartItem(user.uid).then((res) => {
        res?.subscribe((res: any) => {
          if (res?.cart?._id) {
            this.cartId = res.cart._id;
            this.cart = res.cart;
            this.listCartId(this.cartId);
          }
        });
      });
    } else {
      console.warn("You are not authenticated.");
    }
  });
}

  @HostListener("window:scroll", [])
  onWindowScroll(){
    this.isScroll = window.scrollY > 10;
  }

  toggleMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
  listCartId(cartId:string){
    this.db.listCartItem(cartId).then((res)=>{
      res?.subscribe((res:any)=>{
      this.cart = res.cart;
    })
  })

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



