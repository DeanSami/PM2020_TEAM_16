import { Component, OnInit } from '@angular/core';
import { AwsS3Service } from '../aws-s3.service';
import { ToastrService } from 'ngx-toastr';
import { UserAuthService } from '../user-auth.service';
import { User, UserHobbies, UserType } from '../../models/users';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Place } from '../../models/places';
import { PlacesService } from '../services/places.service';
import { GamesService } from '../services/games.service';
import { Games } from '../../models/Games';
import { BusinessesService } from '../services/businesses.service';
import { Businesses } from '../../models/businesses';


@Component({
  selector: 'app-user-profile-page',
  templateUrl: './user-profile-page.component.html',
  styleUrls: ['./user-profile-page.component.scss']
})

export class UserProfilePageComponent implements OnInit {
  currentUser: User;
  editTmpCurrentUser: User;
  currentHobbies;
  userHobbies = UserHobbies;
  currentPage = 'About';
  edit = false;
  selectedFiles: FileList;
  imageSrc: string | ArrayBuffer;
  userTypes = UserType;
  dogParks: Place[] = [];
  myGames: Games[] = [];
  myBusinesses: Businesses[] = [];

  constructor(
    private placesService: PlacesService,
    private uploadService: AwsS3Service,
    private toastr: ToastrService,
    private userService: UserAuthService,
    private businessService: BusinessesService,
    private gameService: GamesService) { }

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', []),
    gender: new FormControl('', [Validators.required]),
    birthday: new FormControl('', [Validators.required])
  });

  get name() {
    return this.form.get('name');
  }

  get email() {
    return this.form.get('email');
  }

  get gender() {
    return this.form.get('gender');
  }

  get birthday() {
    return this.form.get('birthday');
  }

  ngOnInit() {
    this.userService.currentUser.subscribe(user => {
      this.currentUser = user;
      if (user.user_type === UserType.BusinessOwner) {
        this.gameService.getGames({owner_id: user.id}).subscribe(games => {
          this.myGames = games;
        }, err => {
          console.log(err);
        });
      } else {
        this.gameService.getGamesPlayedById().subscribe(games => {
          this.myGames = games;
        }, err => {
          console.log(err);
        });
      }
      this.placesService.getDogParks().subscribe(parks => {
        this.dogParks = parks;
      }, err => {
        console.log(err);
      });
    });
  }

  upload() {
    return new Promise<boolean>((resolve, reject) => {
      if (this.selectedFiles && this.selectedFiles.item) {
        const file = this.selectedFiles.item(0);
        console.log('file', file);
        const name = this.editTmpCurrentUser.id + 'Avatar.' + file.name.split('.')[file.name.split('.').length - 1];
        if (file.type.indexOf('image') < 0) {
          reject('סוג קובץ לא חוקי');
        }
        this.uploadService.uploadFile(file, name).then((res) =>  {
          this.editTmpCurrentUser.avatar = name;
          resolve();
        }, () => {
          reject('העלאת קובץ נכשלה');
        });
      } else {
        this.editTmpCurrentUser.avatar = '';
        resolve();
      }
    });
  }

  save() {
    this.editTmpCurrentUser = {...this.currentUser};
    this.upload().then(() => {
      this.editTmpCurrentUser.hobbies = 0 +
        (this.currentHobbies.Travelling ?  UserHobbies.Travelling : 0) +
        (this.currentHobbies.Driving ?  UserHobbies.Driving : 0) +
        (this.currentHobbies.Photography ?  UserHobbies.Photography : 0) +
        (this.currentHobbies.Gaming ?  UserHobbies.Gaming : 0) +
        (this.currentHobbies.Music ?  UserHobbies.Music : 0) +
        (this.currentHobbies.Surfing ?  UserHobbies.Surfing : 0) +
        (this.currentHobbies.Foodie ?  UserHobbies.Foodie : 0) +
        (this.currentHobbies.TV ?  UserHobbies.TV : 0) +
        (this.currentHobbies.Shopping ?  UserHobbies.Shopping : 0) +
        (this.currentHobbies.Social ?  UserHobbies.Social : 0) +
        (this.currentHobbies.Reading ?  UserHobbies.Reading : 0) +
        (this.currentHobbies.Sport ?  UserHobbies.Sport : 0) +
        (this.currentHobbies.Computers ?  UserHobbies.Computers : 0) +
        (this.currentHobbies.Camping ?  UserHobbies.Camping : 0);
      this.editTmpCurrentUser.email = this.email.value;
      this.editTmpCurrentUser.name = this.name.value;
      this.editTmpCurrentUser.gender = this.gender.value;
      try {
        this.editTmpCurrentUser.birthday = this.birthday.value.toISOString().split('T')[0];
      } catch {
        this.editTmpCurrentUser.birthday = '';
      }
      this.userService.editUser(this.editTmpCurrentUser).subscribe(result => {
        this.editTmpCurrentUser.avatar = this.editTmpCurrentUser.avatar !== '' ?
          'https://s3-eu-west-1.amazonaws.com/files.doggiehunt/userImages/' + this.editTmpCurrentUser.avatar : this.currentUser.avatar;
        this.userService.currentUser.next(this.editTmpCurrentUser);
        this.toastr.success('משתמש עודכן בהצלחה');
        this.edit = false;
      }, err => {
        this.toastr.error('עדכון משתמש נכשל');
      });
    }, err => {
      this.toastr.error(err);
    });
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
    if (this.selectedFiles.item(0)) {
      const file = this.selectedFiles.item(0);
      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;
      reader.readAsDataURL(file);
    }
  }

  showPage(page: string) {
    this.currentPage = page;
  }

  startEdit() {
    this.form.reset();
    this.currentHobbies = {
      // tslint:disable-next-line:no-bitwise
      Travelling: (this.currentUser.hobbies & UserHobbies.Travelling) > 0,
      // tslint:disable-next-line:no-bitwise
      Driving: (this.currentUser.hobbies & UserHobbies.Driving) > 0,
      // tslint:disable-next-line:no-bitwise
      Photography: (this.currentUser.hobbies & UserHobbies.Photography) > 0,
      // tslint:disable-next-line:no-bitwise
      Gaming: (this.currentUser.hobbies & UserHobbies.Gaming) > 0,
      // tslint:disable-next-line:no-bitwise
      Music: (this.currentUser.hobbies & UserHobbies.Music) > 0,
      // tslint:disable-next-line:no-bitwise
      Surfing: (this.currentUser.hobbies & UserHobbies.Surfing) > 0,
      // tslint:disable-next-line:no-bitwise
      Foodie: (this.currentUser.hobbies & UserHobbies.Foodie) > 0,
      // tslint:disable-next-line:no-bitwise
      TV: (this.currentUser.hobbies & UserHobbies.TV) > 0,
      // tslint:disable-next-line:no-bitwise
      Shopping: (this.currentUser.hobbies & UserHobbies.Shopping) > 0,
      // tslint:disable-next-line:no-bitwise
      Social: (this.currentUser.hobbies & UserHobbies.Social) > 0,
      // tslint:disable-next-line:no-bitwise
      Reading: (this.currentUser.hobbies & UserHobbies.Reading) > 0,
      // tslint:disable-next-line:no-bitwise
      Sport: (this.currentUser.hobbies & UserHobbies.Sport) > 0,
      // tslint:disable-next-line:no-bitwise
      Computers: (this.currentUser.hobbies & UserHobbies.Computers) > 0,
      // tslint:disable-next-line:no-bitwise
      Camping: (this.currentUser.hobbies & UserHobbies.Camping) > 0,
    };
    this.name.setValue(this.currentUser.name);
    let tmpBirthday;
    try {
      tmpBirthday = new Date(this.currentUser.birthday);
    } catch {
      tmpBirthday = new Date();
    }
    if (this.currentUser.birthday) {
      this.birthday.setValue(new Date(this.currentUser.birthday));
    } else {
      this.birthday.setValue(new Date());
    }
    this.gender.setValue(this.currentUser.gender);
    this.email.setValue(this.currentUser.email);
    this.edit = !this.edit;
  }

  checkHobbies(hobby: number) {
    // tslint:disable-next-line:no-bitwise
    return (this.currentUser.hobbies & hobby) > 0;
  }
}
