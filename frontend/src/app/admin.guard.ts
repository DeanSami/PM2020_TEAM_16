import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { User, UserType } from './models/users';
import { AuthService } from './admin/services/auth.service';
import { LoginResponse } from './models/Responses';

@Injectable({
  providedIn: 'root'
})

export class AdminGuard implements CanActivate {
  currentUser: User;
  userType = UserType;
  close = true;

  constructor(private userService: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (!this.userService.loggedIn) {
        return new Promise<boolean>((resolve, reject) => {
          this.userService.login().then((res: LoginResponse) => res.user ? resolve(true) : reject(false), () => {
            reject(false);
            this.router.navigate(['/login']);
          });
        });
      }
      console.log('this.userService.loggedIn', this.userService.loggedIn);
      if (this.userService.loggedIn && this.userService.currentUser.getValue().user_type === UserType.Admin) {
        return true;
      }
      this.router.navigate(['/login']);
  }

}
