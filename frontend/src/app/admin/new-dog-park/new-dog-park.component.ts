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
    nameofpark: new FormControl('', [Validators.required]),
    newpark: new FormControl('', [Validators.required]),
    type_park: new FormControl('', [Validators.required]),
    street: new FormControl('', []),
    neighborhood: new FormControl('', [Validators.required]),

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
