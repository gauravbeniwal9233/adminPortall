import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
private  currentUser : BehaviorSubject<any> = new BehaviorSubject<any>(null); // for token
private  isLoggedIn : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

get currentUser$(){
  return this.currentUser.asObservable();
}

get isLoggedIn$(){
  return this.isLoggedIn.asObservable();
}

  constructor(private router: Router) { }

  authLogin(res: any) {
    localStorage.setItem("userDetails", JSON.stringify(res));
    this.router.navigate(['dashboard/default']);
    this.currentUser.next(res);
    this.isLoggedIn.next(true);
  }

  logout(){
    this.currentUser.next(null);
    this.isLoggedIn.next(false);
  }
}
