import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserType } from './models/users';
import { AuthService } from './admin/services/auth.service';
import { LoginResponse } from './models/Responses';

@Injectable({
  providedIn: 'root'
})

export class AdminGuard implements CanActivate {
  close = true;

  constructor(private adminService: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (!this.adminService.loggedIn) {
        return new Promise<boolean>((resolve, reject) => {
          this.adminService.login().then((res: LoginResponse) => {
            res ? resolve(true) : reject(false);
          }, () => {
            this.router.navigate(['/admin/login']);
          });
        });
      }
      console.log('this.adminService.loggedIn', this.adminService.loggedIn);
      if (this.adminService.loggedIn && this.adminService.currentUser.getValue().user_type === UserType.Admin) {
        return true;
      }
      this.router.navigate(['admin/login']);
  }

}
