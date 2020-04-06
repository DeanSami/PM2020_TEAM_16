import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-new-dog-park',
  templateUrl: './new-dog-park.component.html',
  styleUrls: ['./new-dog-park.component.scss']
})
export class NewDogParkComponent implements OnInit {

  constructor() { }

  form = new FormGroup({
    idplaces: new FormControl('', [Validators.maxLength(10)]),
    nameofpark: new FormControl('', [Validators.minLength(6)]),
    type_park: new FormControl('', [Validators.minLength(5)]),
    SHAPE_Leng: new FormControl('', [Validators.minLength(5)]),
    SHAPE_Area: new FormControl('', [Validators.minLength(5)]),
    created_at: new FormControl('', []),
    update_at: new FormControl('', []),
    street: new FormControl('', []),
    house_number: new FormControl('', [Validators.maxLength(3)]),
    neighborhood: new FormControl('', [Validators.minLength(5)]),
    operator: new FormControl('', [Validators.maxLength(10)]),
    handicapped: new FormControl('', [Validators.required]),
    condition: new FormControl('', [Validators.maxLength(6)]),
    deleted: new FormControl('', []),
  });
  mode: any;


  get nameofpark() {
    return this.form.get('nameofpark');
  }

  get newpark() {
    return this.form.get('newpark');
  }
  get typepark() {
    return this.form.get('typepark');
  }

  get street() {
    return this.form.get('street');
  }

  get neighborhood() {
    return this.form.get('neighborhood');
  }


  ngOnInit(): void {}
}
