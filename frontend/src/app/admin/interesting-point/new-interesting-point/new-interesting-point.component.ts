import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-new-interesting-point',
  templateUrl: './new-interesting-point.component.html',
  styleUrls: ['./new-interesting-point.component.scss']
})
export class NewInterestingPointComponent implements OnInit {

  constructor() { }
  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    SHAPE_Leng: new FormControl('', [Validators.required, Validators.minLength(5)]),
    SHAPE_Area: new FormControl('', [Validators.required, Validators.minLength(5)]),
    street: new FormControl('', []),
    house_number: new FormControl('', [Validators.required, Validators.maxLength(10)]),
    neighborhood: new FormControl('', [Validators.required, Validators.minLength(3)]),
    operator: new FormControl('', [Validators.required, Validators.maxLength(10)]),
    handicapped: new FormControl('', []),
    condition: new FormControl('', [Validators.required, Validators.maxLength(6)]),
    type: new FormControl('', [Validators.required, Validators.maxLength(6)]),
  });
  mode: any;
  ngOnInit(): void {
  }

}
