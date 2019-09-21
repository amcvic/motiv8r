import { Injectable } from '@angular/core';
// import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
// import { Observable } from 'rxjs';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(public auth: AuthService, public router: Router){}

  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['auth']);
      return false;
    }
    return true;
  }
  
}
