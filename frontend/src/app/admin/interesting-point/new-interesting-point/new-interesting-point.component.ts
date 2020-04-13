import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ConditionType, Place, PlacesType} from '../../../models/places';
import {InterestingPointService} from '../../services/interesting-point.service';

@Component({
  selector: 'app-new-interesting-point',
  templateUrl: './new-interesting-point.component.html',
  styleUrls: ['./new-interesting-point.component.scss']
})
export class NewInterestingPointComponent implements OnInit {
  conditionType = ConditionType;
  placesType = PlacesType;
  constructor(
    private interestingPointService: InterestingPointService,
    private router: Router,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public dialogData: Place
  ) {
  }
  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    SHAPE_Leng: new FormControl('', [Validators.required, Validators.minLength(5)]),
    SHAPE_Area: new FormControl('', [Validators.required, Validators.minLength(5)]),
    street: new FormControl('', []),
    house_number: new FormControl('', [Validators.required, Validators.maxLength(10)]),

  });
  mode: any;
  get name() {
    return this.form.get('name');
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
  get type(){
    return this.form.get('type');
  }
  ngOnInit(): void {
  }

}
