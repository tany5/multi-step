import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';




@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private angularFireAuth: AngularFireAuth, private router: Router) { }
  isLoggedIn() {
    return !!localStorage.getItem("token")
  }

  /* Sign up */
  signUp(email: string, password: string) : Observable<any>{
    return from(this.angularFireAuth.createUserWithEmailAndPassword(email, password))    
  }

  

  /* Sign out */
  logOut() {
    this.angularFireAuth.signOut();
    localStorage.clear()
    this.router.navigate(['/login'])
  }


  login(email: string, password: string): Observable<any> {
    return from(this.angularFireAuth.signInWithEmailAndPassword(email, password))
  }



}
