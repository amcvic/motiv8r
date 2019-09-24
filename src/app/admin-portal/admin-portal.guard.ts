import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminPortalGuard implements CanActivate {
  
  constructor(public authService: AuthService, public router: Router) {}

  canActivate(): boolean {
    if (localStorage.getItem('username') === 'admin') {
      return true;
    }
    this.router.navigate(['dashboard']);
    return false;
  }

}
