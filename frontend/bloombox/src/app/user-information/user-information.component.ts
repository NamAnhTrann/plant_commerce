import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from '../services/database.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../model/userModel';
import { Location } from '../model/locationModel';
import { getAuth } from '@firebase/auth';


@Component({
  selector: 'app-user-information',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-information.component.html',
  styleUrl: './user-information.component.css'
})
export class UserInformationComponent {
  user: User = {} as User;
  userId: string = '';
  constructor(private db:DatabaseService, private route:ActivatedRoute, private router:Router){}

  ngOnInit(){
    const auth = getAuth();
    auth.onAuthStateChanged((user)=>{
    })
    this.route.paramMap.subscribe(params =>{
      const id = params.get('id')!;
      this.userId = id;
      this.fetchUser(id);
    })
  }

  fetchUser(id:string){
    this.db.getUser(id).then((res:any)=>{
      res?.subscribe((res:any)=>{
        this.user = res;
        if (!this.user.userLocation) {
          this.user.userLocation = new Location();
        }
      })
    })


  }

  submitFormButton(){
    this.db.updateUser(this.userId, this.user).then((res:any)=>{
      res?.subscribe((res:any)=>{
        console.log(res)
        this.router.navigate(["/list-product"])
        })

    })
  }

}
