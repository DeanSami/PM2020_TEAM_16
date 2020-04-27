import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/users';
import { LocalStorage } from 'ngx-store';
import { ApiProviderService } from '../services/api-provider.service';
import { Router } from '@angular/router';
import { LoginResponse, SmsResponse } from '../models/Responses';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
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

  login() {
    return new Promise((resolve, reject) => {
      if (this.token) {
        this.api.get('user/login').subscribe((response: LoginResponse) => {
          this.loggedIn = true;
          this.currentUser.next(response.user);
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

  sendSms(phone: string) {
    return new Promise((resolve, reject) => {
        this.api.get('user/sendSms').subscribe((response: SmsResponse) => {
          if (response.status) {
            resolve();
          }
          reject();
        }, err => {
          reject(err);
        });
    });
  }

  checkSms(phone: string, code: string) {
    return new Promise((resolve, reject) => {
      this.api.get('user/checkSms').subscribe((response: SmsResponse) => {
        if (response.status) {
          resolve();
        }
        reject();
      }, err => {
        reject(err);
      });
    });
  }

  logout() {
    this.loggedIn = false;
    this.token = null;
    this.currentUser.next(null);
    this.router.navigate(['/main']);
  }
}
