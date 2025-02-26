import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth } from '@firebase/auth';
import { User } from '../model/userModel';


const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private localUrl = "http://localhost:3030"

  constructor(private http:HttpClient, private router:Router) { }


  getCurrentUser() {
    const user = getAuth().currentUser;
    if (!user) {
        console.error("User not authenticated");
        this.router.navigate(['/login'])
        return Promise.reject(null);
    }

    return user.getIdToken().then((token) => {
        return {
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }),
        };
    });
}


  getAllProduct(){
    return this.http.get(`${this.localUrl}/get/all/product/api`, httpOptions)
  }
  getProductId(productId:string){
    return this.http.get(`${this.localUrl}/get/specific/product/api/${productId}`, httpOptions)
  }

  addToCart(productId: string, cartQuantity: number) {
    return this.getCurrentUser()?.then((httpOptionsWithAuth) => {
        const body = { productId, cartQuantity };
        return this.http.post(`${this.localUrl}/add/to/cart/api/`, body, httpOptionsWithAuth);
    }).catch(error => {
        console.error(" Error fetching user token:", error);
    });
}

listCartItem(cartId: string) {
  return this.getCurrentUser()?.then((httpOptionsWithAuth) => {
    return this.http.get(`${this.localUrl}/list/cart/api/${cartId}`, httpOptionsWithAuth);
  }).catch(error => {
    console.error("Error fetching cart:", error);
  });
}

checkUserProfile(userId:string){
  return this.getCurrentUser()?.then((httpOptionsWithAuth)=>{
    return this.http.get(`${this.localUrl}/get/check/user/profile/api/${userId}`, httpOptionsWithAuth)
  }).catch ((err)=>{
    console.error("Error happened", err)
  });
}

updateUser(userId: string, userData: User) {
  return this.getCurrentUser()?.then((httpOptionsWithAuth) => {
    const { userFirstName, userLastName, userPhoneNumber, userLocation } = userData;

    const updatedData = {
      userFirstName,
      userLastName,
      userPhoneNumber,
      locationStreet: userLocation?.locationStreet,
      locationCity: userLocation?.locationCity,
      locationState: userLocation?.locationState,
      locationCountry: userLocation?.locationCountry,
      locationPostCode: userLocation?.locationPostCode,
    };

    console.log("Sending updated data:", updatedData); // 🔍 Debugging log

    return this.http.put(`${this.localUrl}/update/user/detail/api/${userId}`, updatedData, httpOptionsWithAuth);
  }).catch((err) => {
    console.error("Error updating user", err);
  });
}


getUser(userId:string){
  return this.getCurrentUser()?.then((httpOptionsWithAuth)=>{
    return this.http.get(`${this.localUrl}/get/user/api/`,httpOptionsWithAuth )
  })
}


reduceCartQuantity(cartId: string, productId: string) {
  const body = { productId };
  return this.http.delete(`${this.localUrl}/reduce/cart/item/api/${cartId}`, {
    body: body
  });
}

addContact(contactData:any){
  console.log(contactData)
  return this.http.post(`${this.localUrl}/add/contact/api`, contactData, httpOptions);
}



//order section
listOrderId(userId:string){
  return this.getCurrentUser()?.then((httpOptionsWithAuth)=>{
    return this.http.get(`${this.localUrl}/get/order/api/`, httpOptionsWithAuth)
  })
}

//list order items
listOrderItemId(userId:string){
  return this.getCurrentUser()?.then((httpOptionsWithAuth)=>{
    return this.http.get(`${this.localUrl}/list/order/item/api/`, httpOptionsWithAuth)
  })
}

createPayment(userId:string){
  return this.getCurrentUser()?.then((httpOptionsWithAuth)=>{
    return this.http.post(`${this.localUrl}/create/payment/api/`, {}, httpOptionsWithAuth)
  })
}


confirmPayment(sessionId: string) {
  return this.getCurrentUser()?.then((httpOptionsWithAuth) => {
    const body = { session_id: sessionId };
    return this.http.post(`${this.localUrl}/get/confirm/payment/api/`, body, httpOptionsWithAuth);
  }).catch((error) => {
    console.error("Error confirming payment:", error);
  });
}




}
