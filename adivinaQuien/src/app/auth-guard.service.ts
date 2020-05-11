import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router, CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService:AuthService, private router: Router) { }

  canActivate():boolean{
    if(!this.authService.isLoggedIn()){
      this.router.navigateByUrl('/');
      return false;
    }
    return true;
  }
}
