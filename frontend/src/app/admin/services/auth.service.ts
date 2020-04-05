import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalStorage } from 'ngx-store';
import { ApiProviderService } from '../../services/api-provider.service';
import { Router } from '@angular/router';
import { User } from '../../models/users';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn = false;
  currentUser = new BehaviorSubject<User>(null);

  // tslint:disable-next-line:variable-name
  @LocalStorage() _token: string = null;
  get token() {
    return this._token;
  }
  set token(token) {
    this.api.token = token;
    this._token = token;
  }

  constructor(private api: ApiProviderService, private router: Router) { }

  login(username?: string, password?: string) {
    return new Promise((resolve, reject) => {
      if (username && password) {
        this.api.post('users/login', { username, password }).subscribe((response: { user: User, token: string }) => {
          this.loggedIn = true;
          this.token = response.token;
          this.currentUser.next(response.user);
          resolve(this.loggedIn);
        }, err => {
          this.logout();
          reject(err);
        });
      } else if (this.token) {
        this.api.get('users/check').subscribe((user: User) => {
          this.loggedIn = true;
          this.currentUser.next(user);
          resolve(this.loggedIn);
        }, err => {
          this.loggedIn = false;
          this.currentUser.next(null);
          reject(err);
        });
      } else {
        this.logout();
        reject('err');
      }
    });
  }

  logout() {
    this.loggedIn = false;
    this.token = null;
    this.currentUser.next(null);
    this.router.navigate(['/login']);
  }
}
