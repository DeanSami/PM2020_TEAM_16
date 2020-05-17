import { Component, Inject, OnInit } from '@angular/core';
import { Businesses, BusinessesType, BusinessesTypeTitles } from '../../../models/businesses';
import {UserAuthService} from '../../user-auth.service';
import {ToastrService} from 'ngx-toastr';
import {BusinessesService} from '../../services/businesses.service';
import { ActivatedRoute } from '@angular/router';
import { GamesService } from '../../services/games.service';
import { PlacesService } from '../../services/places.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-business-info',
  templateUrl: './business-info.component.html',
  styleUrls: ['./business-info.component.scss']
})
export class BusinessInfoComponent implements OnInit {
  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    dog_friendly: new FormControl(''),
    description: new FormControl('', [Validators.required]),
    type: new FormControl('',[Validators.required])
  });

  constructor(
    private rout: ActivatedRoute,
    private userAuth: UserAuthService,
    private toastr: ToastrService,
    private gamesService: GamesService,
    private placesService: PlacesService,
    private businessesService: BusinessesService,
    private dialogRef: MatDialogRef<Businesses>,
    @Inject(MAT_DIALOG_DATA) public myBusinesses: Businesses
  ) { }

  businessesTypeTitles = BusinessesTypeTitles;
  businessesType = BusinessesType;

  ngOnInit(): void {
    if (this.myBusinesses) {
      this.form.setValue({
        name: this.myBusinesses.name,
        phone: this.myBusinesses.phone,
        address: this.myBusinesses.address,
        description: this.myBusinesses.description,
        dog_friendly: this.myBusinesses.dog_friendly,
        type: this.myBusinesses.type,
      });
    }
  }

  save() {
    if (this.form.invalid) {
      this.toastr.error('יש להזין את כל השדות המסומנים');
      return;
    }
    const business: Businesses = {
      owner_id: this.userAuth.currentUser.getValue().id,
      name: this.form.controls.name.value,
      phone: this.form.controls.phone.value,
      address: this.form.controls.address.value,
      description: this.form.controls.description.value,
      dog_friendly: !!this.form.controls.dog_friendly.value,
      type: this.form.controls.type.value,
      image: ''
    };
    if (this.myBusinesses && this.myBusinesses.id) {
      business.id = this.myBusinesses.id;
      this.businessesService.updateBusiness(business).subscribe(() => {
        this.toastr.success('העסק עודכן בהצלחה!');
        this.dialogRef.close(business);
      }, err => {
        this.toastr.error('עדכון נכשל');
        console.log(err);
      });
    } else {
      this.businessesService.createNewBusiness(business).subscribe(() => {
        this.toastr.success('העסק נוצר בהצלחה!');
        this.dialogRef.close(business);
      }, err => {
        this.toastr.error('עדכון נכשל');
        console.log(err);
      });
    }
  }

}
