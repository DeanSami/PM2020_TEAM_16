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
    neighborhood: new FormControl('', [Validators.required, Validators.minLength(3)]),
    operator: new FormControl('', [Validators.required, Validators.maxLength(10)]),
    handicapped: new FormControl('', []),
    condition: new FormControl('', [Validators.required, Validators.maxLength(6)]),
    type: new FormControl('', [Validators.required, Validators.maxLength(6)]),
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
    if (this.dialogData) {
      this.form.setValue({
        name: this.dialogData.name,
        SHAPE_Leng: this.dialogData.SHAPE_Leng,
        SHAPE_Area: this.dialogData.SHAPE_Area,
        street: this.dialogData.street,
        house_number: this.dialogData.house_number,
        neighborhood: this.dialogData.neighborhood,
        operator: this.dialogData.operator,
        handicapped: this.dialogData.handicapped,
        condition: this.dialogData.condition,
        type: this.dialogData.condition
      });
      console.log(this.dialogData);
    }
  }
  addInterestingPoint() {
    if (this.form.invalid) {
      this.toastr.error('חובה למלא את כל השדות המסומנים');
      return;
    }
    this.interestingPointService.saveInterestingPoint({
      user_input: {
        name: this.name.value,
        SHAPE_Leng: this.SHAPE_Leng.value,
        SHAPE_Area: this.SHAPE_Area.value,
        street: this.street.value,
        house_number: this.house_number.value,
        neighborhood: this.neighborhood.value,
        operator: this.operator.value,
        handicapped: !!this.handicapped.value,
        condition: this.condition.value,
        type: this.type.value
      }
    }).subscribe((res) => {
      this.toastr.success('הפעולה הסתיימה בהצלחה!');
      this.dialogRef.close(res);
    }, err => {
      this.toastr.error('הפעולה נכשלה!');
      console.log('err', err);
    });
  }

}
