import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { LoadingService } from '../../loading.service';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loading = false;
  title = 'dogs-project';
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;
  close = true;

  constructor(
    private userService: AuthService,
    private router: Router,
    private loadingService: LoadingService,
    private toastr: ToastrService
  ) {
    loadingService.loading.subscribe(loading => this.loading = loading);
  }

  form = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  get username() {
    return this.form.get('username');
  }

  get password() {
    return this.form.get('password');
  }

  login() {
    this.loadingService.loading.next(true);
    this.userService.login('0666', 'admin').then(() => {

      this.router.navigate(['/admin/dashboard']).then(() => {
        console.log('login');
        setTimeout(() => this.close = true, 400);
      });
    }, () => {
      this.loadingService.loading.next(false);
      this.toastr.error('התחברות נכשלה');
    });
  }

  ngOnInit() {
    this.login();
  }

}
