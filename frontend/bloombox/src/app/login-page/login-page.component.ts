import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

  email: string = '';
  password: string = '';
  user: any;
  constructor(private route:ActivatedRoute,private auth: AuthService, private router: Router){}
  ngOnInit() {
    const redirectUrl = this.route.snapshot.queryParams['redirectUrl'];
    if (redirectUrl) {
      this.auth.setRedirectUrl(redirectUrl);
    }
  }

  googleSignup(){
    this.auth.loginWithGoogle().then(()=>{
      console.log("logged in!");
      Swal.fire({
        icon: 'success',
        title: 'You are log in',
        text: 'You are log in',
        showConfirmButton: false,
        timer: 1000
      });
      this.router.navigate(["/list-product"])
    })
  }

  signupWithEmail(){
    this.auth.loginWithEmail(this.email, this.password)
    .then(()=>{
      console.log("Proceed");
      Swal.fire({
        icon: 'success',
        title: 'You are log in',
        text: 'You are log in',
        showConfirmButton: false,
        timer: 1000
      });
      this.router.navigate(["/list-product"])

    })
  }
}
