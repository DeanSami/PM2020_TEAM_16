import { Component, Inject, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { DogParksService } from '../services/dog-parks.service';
import { ConditionType, Place, PlacesType } from '../../models/places';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-new-dog-park',
  templateUrl: './new-dog-park.component.html',
  styleUrls: ['./new-dog-park.component.scss']
})
export class NewDogParkComponent implements OnInit {
  conditionType = ConditionType;
  placesType = PlacesType;
  constructor(
    private dogParkService: DogParksService,
    private router: Router,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public dialogData: Place
  ) {
  }

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    type: new FormControl('', [Validators.required, Validators.minLength(5)]),
    SHAPE_Leng: new FormControl('', [Validators.required, Validators.minLength(5)]),
    SHAPE_Area: new FormControl('', [Validators.required, Validators.minLength(5)]),
    street: new FormControl('', []),
    house_number: new FormControl('', [Validators.required, Validators.maxLength(10)]),
    neighborhood: new FormControl('', [Validators.required, Validators.minLength(3)]),
    operator: new FormControl('', [Validators.required, Validators.maxLength(10)]),
    handicapped: new FormControl('', []),
    condition: new FormControl('', [Validators.required, Validators.maxLength(6)]),
  });
  mode: any;


  get name() {
    return this.form.get('name');
  }

  get type() {
    return this.form.get('type');
  }

  get SHAPE_Leng() {
    return this.form.get('SHAPE_Leng');
  }

  get SHAPE_Area() {
    return this.form.get('SHAPE_Area');
  }

  get street() {
    return this.form.get('street');
  }

  get house_number() {
    return this.form.get('house_number');
  }

  get neighborhood() {
    return this.form.get('neighborhood');
  }

  get operator() {
    return this.form.get('operator');
  }

  get handicapped() {
    return this.form.get('handicapped');
  }

  get condition() {
    return this.form.get('condition');
  }

  ngOnInit(): void {
    if (this.dialogData) {
      this.form.setValue({
        name: this.dialogData.name,
        type: this.dialogData.type,
        SHAPE_Leng: this.dialogData.SHAPE_Leng,
        SHAPE_Area: this.dialogData.SHAPE_Area,
        street: this.dialogData.street,
        house_number: this.dialogData.house_number,
        neighborhood: this.dialogData.neighborhood,
        operator: this.dialogData.operator,
        handicapped: this.dialogData.handicapped,
        condition: this.dialogData.condition
      });
      console.log(this.dialogData);
    }
  }

  addDogPark() {
    if (this.form.invalid) {
      this.toastr.error('חובה למלא את כל השדות המסומנים');
      return;
    }
    this.dogParkService.saveDogPark({
      user_input: {
        type: this.type.value,
        name: this.name.value,
        SHAPE_Leng: this.SHAPE_Leng.value,
        SHAPE_Area: this.SHAPE_Area.value,
        street: this.street.value,
        house_number: this.house_number.value,
        neighborhood: this.neighborhood.value,
        operator: this.operator.value,
        handicapped: !!this.handicapped.value,
        condition: this.condition.value
      }
    }).subscribe((res) => {
      this.toastr.success('הפעולה הסתיימה בהצלחה');
      this.router.navigate(['/admin/dogParks']);
    }, err => {
      this.toastr.error('הפעולה נכשלה');
      console.log('err', err);
    });
  }
}
