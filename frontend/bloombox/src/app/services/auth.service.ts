import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, GoogleAuthProvider, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithPopup, User } from 'firebase/auth';
import app from "../firebaseConfig"; // Import from firebaseConfig

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private localUrl = "http://localhost:3030";
  private redirectUrl: string = '/';

  auth = getAuth(app);
  provider = new GoogleAuthProvider();
  uid: string = '';
  user: User | null = null;
  private currentUser: User | null = null;


  constructor(private http: HttpClient, private router: Router) {
    this.listenForAuthChanges();
  }

  setRedirectUrl(url: string) {
    this.redirectUrl = url;
  }
  getRedirectUrl() {
    return this.redirectUrl;
  }


  loginWithGoogle() {
    return signInWithPopup(this.auth, this.provider)
      .then(async (result) => {
        if (!result.user) return '';

        this.user = result.user;
        this.uid = this.user.uid;
        const token = await this.user.getIdToken();

        this.sendFirebaseTokenToBackend(token).subscribe({
          next: (res) => console.log("Token sent to backend:", res),
          error: (err) => console.error("Error sending token to backend:", err)
        });

        return token;
      })
      .catch(error => {
        console.error("Google Login Error:", error);
        return '';
      });
  }

  loginWithEmail(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        await user.reload();

        this.user = user;
        this.uid = user.uid;
        const token = await user.getIdToken();

        this.sendFirebaseTokenToBackend(token).subscribe({
          next: (res) => console.log("Token sent to backend:", res),
          error: (err) => console.error("Error sending token to backend:", err)
        });

        return token;
      })
      .catch(error => {
        console.error("Email Signup Error:", error);
        return '';
      });
  }

  sendFirebaseTokenToBackend(token: string) {
    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }),
    };
    return this.http.post(`${this.localUrl}/verifyFirebaseToken`, {}, httpOptionsWithAuth);
  }

  private listenForAuthChanges() {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser = user;
      if (user) {
        console.log("User session restored:", user);
      } else {
        console.warn("You are not authenticated.");
      }
    });
  }
  async getUserAsync(): Promise<User | null> {
    return new Promise((resolve) => {
      onAuthStateChanged(this.auth, (user) => {
        resolve(user);
      });
    });
  }



  logout() {
    return signOut(this.auth).then(() => {
      this.user = null;
      this.uid = '';
      console.log("User logged out");
      this.router.navigate(['/login']); // Optional: Redirect to login page
    }).catch(error => {
      console.error("Logout Error:", error);
    });
  }
}
