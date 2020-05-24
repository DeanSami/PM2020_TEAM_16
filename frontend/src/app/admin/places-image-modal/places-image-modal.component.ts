import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConditionTypeTitles, Place } from '../../models/places';
import { AwsS3Service } from '../../user/aws-s3.service';
import { ToastrService } from 'ngx-toastr';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-places-image-modal',
  templateUrl: './places-image-modal.component.html',
  styleUrls: ['./places-image-modal.component.scss']
})
export class PlacesImageModalComponent implements OnInit {
  currentPlace: Place;
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;
  loading = false;
  icon: string ;
  image: string;
  selectedFilesIcon: FileList;
  selectedFilesImage: FileList;
  imageSrcIcon: string | ArrayBuffer;
  imageSrcImage: string | ArrayBuffer;
  conditionTypeTitles = ConditionTypeTitles;

  constructor(
    private dialogRef: MatDialogRef<Place>,
    @Inject(MAT_DIALOG_DATA) public dialogData: Place,
    private uploadService: AwsS3Service,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.currentPlace = this.dialogData;
    if (this.currentPlace.icon === '') {
      this.icon = 'https://s3-eu-west-1.amazonaws.com/files.doggiehunt/places/icon-default.png';
    } else {
      this.icon = 'https://s3-eu-west-1.amazonaws.com/files.doggiehunt/places/' + this.currentPlace.icon;
    }
    if (this.currentPlace.image === '') {
      this.image = 'https://s3-eu-west-1.amazonaws.com/files.doggiehunt/places/image-default.jpg';
    } else {
      this.image = 'https://s3-eu-west-1.amazonaws.com/files.doggiehunt/places/' + this.currentPlace.image;
    }
  }

  uploadImage() {
    this.loading = true;
    this.upload(0).then(() => {
      this.upload(1).then(() => {
        this.toastr.success('הפעולה הושלמה בהצלחה');
        this.loading = false;
        this.dialogRef.close(this.currentPlace);
      }, err => {
        this.toastr.error(err);
        this.loading = false;
      });
    }, (err) => {
      this.toastr.error(err);
      this.loading = false;
    });
  }

  selectFile(event, type) {
    if (type === 0) {
      this.selectedFilesIcon = event.target.files;
      if (this.selectedFilesIcon.item(0)) {
        const file = this.selectedFilesIcon.item(0);
        const reader = new FileReader();
        reader.onload = e => this.imageSrcIcon = reader.result;
        reader.readAsDataURL(file);
      }
    } else {
      this.selectedFilesImage = event.target.files;
      if (this.selectedFilesImage.item(0)) {
        const file = this.selectedFilesImage.item(0);
        const reader = new FileReader();
        reader.onload = e => this.imageSrcImage = reader.result;
        reader.readAsDataURL(file);
      }
    }
  }

  upload(type) {
    return new Promise<boolean>((resolve, reject) => {
      if ((type === 0 && this.selectedFilesIcon && this.selectedFilesIcon.item) ||
          (type === 1 && this.selectedFilesImage && this.selectedFilesImage.item)) {
        const file = type === 0 ? this.selectedFilesIcon.item(0) : this.selectedFilesImage.item(0);
        console.log('file', file);
        const name = (type === 0 ? 'icon' : 'image') + this.currentPlace.id + '.' + file.name.split('.')[file.name.split('.').length - 1];
        if (file.type.indexOf('image') < 0) {
          reject('סוג קובץ לא חוקי');
        }
        this.uploadService.uploadFile(file, name, 'places/').then((res) => {
          if (type === 0) {
            this.currentPlace.icon = name;
            this.icon = name;
          } else {
            this.currentPlace.image = name;
            this.image = name;
          }
          resolve();
        }, () => {
          reject('העלאת קובץ נכשלה');
        });
      } else {
        resolve();
      }
    });
  }

}
