import {Component, Inject, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {Gamestep, Games} from '../../../../models/Games';
import {UserAuthService} from '../../../user-auth.service';
import {GamesService} from '../../../services/games.service';
import {ToastrService} from 'ngx-toastr';
import {Place} from '../../../../models/places';
import {PlacesService} from '../../../services/places.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-new-treasure-hunt',
  templateUrl: './treasure-hunt-form.component.html',
  styleUrls: ['./treasure-hunt-form.component.scss'],
})
export class TreasureHuntFormComponent implements OnInit {
  currentStepNum = 1;
  showSteps = false;
  steps: Gamestep[] = [];
  dogParks: Place[];

  constructor(
    private rout: ActivatedRoute,
    private userAuth: UserAuthService,
    private toastr: ToastrService,
    private gamesService: GamesService,
    private placesService: PlacesService,
    private dialogRef: MatDialogRef<TreasureHuntFormComponent>,
    @Inject(MAT_DIALOG_DATA) public treasureHunt: Games
  ) {
  }

  basicForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    start: new FormControl('', [Validators.required]),
    end: new FormControl('', [Validators.required]),
    start_location: new FormControl('', [Validators.required]),
    finish_location: new FormControl('', [Validators.required]),
  });

  stepsForm = new FormGroup({
    location: new FormControl('', [Validators.required]),
    secret_key: new FormControl('', [Validators.required]),
    description: new FormControl(''),
  });

  mode: any;
  panelOpenState = false;

  ngOnInit(): void {
    this.placesService.getDogParks().subscribe(parks => {
      this.dogParks = parks;
      if (this.treasureHunt) {
        console.log(this.treasureHunt);
        this.basicForm.setValue({
          title: this.treasureHunt.name,
          start: this.treasureHunt.start,
          end: this.treasureHunt.end,
          start_location: this.treasureHunt.start_location,
          finish_location: this.treasureHunt.finish_location
        });
        this.steps = this.treasureHunt.steps;
      }
    }, err => {
      console.log(err);
    });
  }

  findWithAttr(arr, attr, val) {
    for (let i = 0; i < arr.length; i += 1) {
      if (arr[i][attr] === val) {
        return i;
      }
    }
    return -1;
  }

  createNewStep(): Gamestep {
    // tslint:disable-next-line:variable-name one-variable-per-declaration
    const secret_key = this.stepsForm.controls.secret_key.value,
      // tslint:disable-next-line:variable-name
      finish_location = this.stepsForm.controls.location.value,
      description = this.stepsForm.controls.description.value;
    if (!this.stepsForm.valid) {
      this.toastr.error('יש להזין את כל השדות המסומנים');
      return null;
    }

    // tslint:disable-next-line:variable-name
    const place_index = this.findWithAttr(this.dogParks, 'id', finish_location);
    if (place_index > -1) {
      const place = this.dogParks[place_index];
      const name = place.name;
      // tslint:disable-next-line:variable-name
      let start_location = this.basicForm.controls.start_location.value;
      if (this.steps.length > 0) {
        start_location = this.steps[this.steps.length - 1].finish_location;
        this.steps[this.steps.length - 1].finish_location = start_location;
      }
      const step: Gamestep = {
        name,
        secret_key,
        start_location,
        finish_location,
        step_num: this.currentStepNum++,
        description
      };
      this.stepsForm.reset();
      Object.keys(this.stepsForm.controls).forEach(key => {
        this.stepsForm.controls[key].setErrors(null);
      });
      return step;
    } else { return; }
  }

  pushNewStep(): void {
    if (this.steps.length === 0) {
      if (this.basicForm.controls.start_location.value === '') {
        this.toastr.error('יש להזין את כל השדות המסומנים');
        return;
      }
    }
    const newStep = this.createNewStep();
    if (newStep) {
      this.steps.push(newStep);
    }
    this.toastr.success('שלב נוסף בהצלחה');
  }

  removeStep(index: number) {
    this.steps.splice(index, 1);
    this.currentStepNum--;
  }

  date_str(date: Date): string {
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    return y + '-' + m + '-' + d;
  }

  submitGame(): void {
    if (!this.basicForm.valid) {
      this.toastr.error('יש להזין את כל השדות המסומנים');
      return;
    }
    const game: Games = {
      owner_id: this.userAuth.currentUser.getValue().id,
      name: this.basicForm.controls.title.value,
      start: this.date_str(new Date(this.basicForm.controls.start.value)),
      end: this.date_str(new Date(this.basicForm.controls.end.value)),
      start_location: this.basicForm.controls.start_location.value,
      finish_location: this.basicForm.controls.finish_location.value,
      steps: this.steps
    };
    this.gamesService.createNewGame(game).subscribe((res) => {
      this.toastr.success('הפעולה הסתיימה בהצלחה!');
      this.dialogRef.close(game);
      // this.basicForm.reset();
      // Object.keys(this.basicForm.controls).forEach(key => {
      //   this.basicForm.controls[key].setErrors(null);
      // });
      // this.steps = [];
    }, err => {
      this.toastr.error('הפעולה נכשלה!');
      console.log('err', err);
    });
  }

  updateGame(): void {
    if (!this.basicForm.valid) {
      this.toastr.error('יש להזין את כל השדות המסומנים');
      return;
    }
    const game: Games = {
      id: this.treasureHunt.id,
      owner_id: this.userAuth.currentUser.getValue().id,
      name: this.basicForm.controls.title.value,
      start: this.date_str(new Date(this.basicForm.controls.start.value)),
      end: this.date_str(new Date(this.basicForm.controls.end.value)),
      start_location: this.basicForm.controls.start_location.value,
      finish_location: this.basicForm.controls.finish_location.value,
      steps: this.steps
    };
    this.gamesService.updateGame(game).subscribe((res) => {
      this.toastr.success('הפעולה הסתיימה בהצלחה!');
      this.dialogRef.close(res);
    }, err => {
      this.toastr.error('הפעולה נכשלה!');
      console.log('err', err);
    });
  }

  toggleSteps() {
    if (this.steps.length > 0) {
      this.showSteps = !this.showSteps;
    } else {
      this.toastr.error('אין שלבים להציג!');
    }
  }

}
