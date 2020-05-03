import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UserAuthService } from '../../user/user-auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './userLayout.component.html',
  styleUrls: ['./userLayout.component.scss'],
})
export class UserLayoutComponent implements OnInit {
  opened = true;
  mode = new FormControl('push');

  constructor(private userAuth: UserAuthService) {
    // this.userAuth.login();
  }

  ngOnInit(): void {}
}
