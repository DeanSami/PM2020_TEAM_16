import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { UserAuthService } from '../../../user/user-auth.service';
import { User } from '../../../models/users';
import { AreYouSureDialogComponent } from '../../../are-you-sure-dialog/are-you-sure-dialog.component';
import { PlaceActiveType } from '../../../models/places';
import { MatDialog } from '@angular/material/dialog';
import { LoginModalComponent } from '../../../user/login-modal/login-modal.component';
import { RegisterModalComponent } from '../../../user/register-modal/register-modal.component';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.scss']
})
  export class UserHeaderComponent implements OnInit {
  currentUser: User;
  constructor(@Inject(DOCUMENT) public document,
              private userAuth: UserAuthService,
              private dialog: MatDialog
  ) {
    this.userAuth.currentUser.subscribe(user => {
      this.currentUser = user;
      console.log('user', this.currentUser);
    });
  }

  ngOnInit(): void {
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'nearest'});
  }

  login() {
    this.dialog.open(LoginModalComponent, {
      width: '250px',
    }).afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
      }
    });
  }

  register() {
    this.dialog.open(RegisterModalComponent, {
      width: '250px',
    }).afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

}
