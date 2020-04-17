import { Component, OnInit } from '@angular/core';
import { AwsS3Service } from '../aws-s3.service';
import { ToastrService } from 'ngx-toastr';
import { UserAuthService } from '../user-auth.service';
import { User, UserGender, UserHobbies } from '../../models/users';


@Component({
    selector: 'app-user-profile-page',
    templateUrl: './user-profile-page.component.html',
    styleUrls: ['./user-profile-page.component.scss']
})

export class UserProfilePageComponent implements OnInit {
  currentUser: User;
  userHobbies = UserHobbies;
  currentPage = 'About';
  edit = false;
  selectedFiles: FileList;

  constructor(
    private uploadService: AwsS3Service,
    private toastr: ToastrService,
    private userService: UserAuthService) { }

  ngOnInit() {
    this.userService.currentUser.subscribe(user => this.currentUser = user);
    this.currentUser = {
      id: 1,
      name: 'דור שושן',
      user_type: 1,
      email: 'dor.shoshan@gmail.com',
      phone: '0546484372',
      avatar: 'avatar1.jpeg',
      deleted: false,
      birthday: '03/12/1993',
      gender: UserGender.Mail,
      hobbies: 4863,
      created_at: '01/01/2020'
    };
  }

  upload() {
    const file = this.selectedFiles.item(0);
    // todo change file name to unique name by userId
    if (file.type.indexOf('image') < 0) {
      this.toastr.error('סוג קובץ לא חוקי');
    }
    this.uploadService.uploadFile(file).then((res) =>  {
        // todo save user avatar
        this.toastr.error('תמונה עודכנה בהצלחה');
      });
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  showPage(page: string) {
      this.currentPage = page;
  }

  checkHobbies(hobby: number) {
    // tslint:disable-next-line:no-bitwise
    return (this.currentUser.hobbies & hobby) > 0;
  }
}
