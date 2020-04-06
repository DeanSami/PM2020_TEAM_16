import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { DogParksService } from '../services/dog-parks.service';
import { ConditionType, ConditionTypeTitles, PlacesType } from '../../models/places';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-dog-park',
  templateUrl: './new-dog-park.component.html',
  styleUrls: ['./new-dog-park.component.scss']
})
export class NewDogParkComponent implements OnInit {
  conditionType = ConditionType;
  placesType = PlacesType;
  constructor(private placeService: DogParksService, private router: Router, private toastr: ToastrService) { }

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    type_park: new FormControl('', [Validators.required, Validators.minLength(5)]),
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

  get type_park() {
    return this.form.get('type_park');
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

  ngOnInit(): void { }

  addDogPark() {
    if (this.form.invalid) {
      this.toastr.error('חובה למלא את כל השדות המסומנים');
      return;
    }
    this.placeService.saveDogPark({
      user_input: {
        type: this.type_park.value,
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
