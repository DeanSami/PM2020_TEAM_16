import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginResponse } from './models/Responses';
import { UserAuthService } from './user/user-auth.service';

@Injectable({
  providedIn: 'root'
})

export class UserGuard implements CanActivate {
  close = true;

  constructor(private userService: UserAuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
      if (!this.userService.loggedIn) {
        return new Promise<boolean>(resolve => {
          this.userService.login().then((res: LoginResponse) => {
            if (res) {
              this.userService.currentUser.next(res.user);
            } else {
              this.userService.currentUser.next(null);
            }
            resolve(true);
          }, () => {
            this.userService.currentUser.next(null);
            resolve(true);
          });
        });
      }
      return true;
  }

}
