import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { PlacesService } from '../services/places.service';
import { ConditionType, PlacesType } from '../../models/places';

@Component({
  selector: 'app-new-dog-park',
  templateUrl: './new-dog-park.component.html',
  styleUrls: ['./new-dog-park.component.scss']
})
export class NewDogParkComponent implements OnInit {
  conditionType = ConditionType;
  constructor(private placeService: PlacesService) { }

  form = new FormGroup({
    name: new FormControl('', [Validators.minLength(6)]),
    type_park: new FormControl('', [Validators.minLength(5)]),
    SHAPE_Leng: new FormControl('', [Validators.minLength(5)]),
    SHAPE_Area: new FormControl('', [Validators.minLength(5)]),
    street: new FormControl('', []),
    house_number: new FormControl('', [Validators.maxLength(3)]),
    neighborhood: new FormControl('', [Validators.minLength(5)]),
    operator: new FormControl('', [Validators.maxLength(10)]),
    handicapped: new FormControl('', [Validators.required]),
    condition: new FormControl('', [Validators.maxLength(6)]),
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



  ngOnInit(): void {}

  addDogPark() {
    this.placeService.saveDogPark({
      type: this.type_park.value,
      name: this.name.value,
      SHAPE_Leng: this.SHAPE_Leng.value,
      SHAPE_Area: this.SHAPE_Area.value,
      street: this.street.value,
      house_number: this.house_number.value,
      neighborhood: this.neighborhood.value,
      operator: this.operator.value,
      handicapped: this.handicapped.value,
      condition: this.condition.value
    }).subscribe((res) => {
      console.log(res);
    });
    console.log();
  }
}
