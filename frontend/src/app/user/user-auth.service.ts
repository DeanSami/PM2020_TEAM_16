import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User, UserType } from '../models/users';
import { LocalStorage } from 'ngx-store';
import { ApiProviderService } from '../services/api-provider.service';
import { Router } from '@angular/router';
import { SmsResponse } from '../models/Responses';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  loggedIn = false;
  currentUser = new BehaviorSubject<User>(null);

  // tslint:disable-next-line:variable-name
  @LocalStorage() userToken: string = null;

  get token() {
    return this.userToken;
  }
  set token(token) {
    this.api.userToken = token;
    this.userToken = token;
  }
  constructor(private api: ApiProviderService, private router: Router) {
    this.api.userToken = this.userToken;
  }

  login() {
    // this.token = "2f0863d333f4f0e30b1ddea2d1fa0c20"
    return new Promise((resolve, reject) => {
      if (this.token) {
        this.api.get('user/login').subscribe((response: User) => {
          this.loggedIn = true;
          this.currentUser.next(response);
          resolve(this.loggedIn);
        }, err => {
          this.loggedIn = false;
          this.currentUser.next(null);
          reject(err);
        });
      } else {
        if (this.loggedIn) {
          this.logout();
        }
        reject('err');
      }
    });
  }

  sendSms(data: {phone: string, user_type: UserType}) {
    // this.token = '9c5bdc6363628534ce952b409a8b55bb';
    return new Promise((resolve, reject) => {
        this.api.get('user/sendSms', data).subscribe((response: SmsResponse) => {
          resolve();
        }, err => {
          reject(err);
        });
    });
  }

  checkSms(phone: string, code: string) {
    // this.token = '9c5bdc6363628534ce952b409a8b55bb';
    return new Promise((resolve, reject) => {
      this.api.get('user/checkValidationCode', {phone, code}).subscribe((response: SmsResponse) => {
        if (response.token) {
          this.token = response.token;
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

  editUser(user: User) {
    return this.api.post('user/editUser', user);
  }
}
