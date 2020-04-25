import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { LoadingService } from '../../loading.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loading = false;
  title = 'dogs-project';
  close = true;
  rememberMe = true;

  constructor(
    private userService: AuthService,
    private router: Router,
    private loadingService: LoadingService,
    private toastr: ToastrService
  ) {
    loadingService.loading.subscribe(loading => this.loading = loading);
  }

  form = new FormGroup({
    phone: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(15)
    ]),
    pass: new FormControl('',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(50)
      ]),
  });

  get phone() {
    return this.form.get('phone');
  }

  get pass() {
    return this.form.get('pass');
  }

  setLogin() {
    if (this.form.invalid) {
      this.toastr.error('חובה למלא את כל השדות');
      return;
    }
    this.login();
  }

  login() {
    this.loadingService.loading.next(true);
    this.userService.login(this.phone.value, this.pass.value, this.rememberMe).then(() => {
      this.router.navigate(['/admin/dashboard']).then(() => {
        setTimeout(() => this.close = true, 400);
      });
    }, () => {
      this.loadingService.loading.next(false);
      this.toastr.error('התחברות נכשלה');
    });
  }

  ngOnInit() {
  }

}
