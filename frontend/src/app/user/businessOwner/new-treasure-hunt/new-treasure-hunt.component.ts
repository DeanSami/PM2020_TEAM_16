import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Place } from '../../../models/places';
import { ActivatedRoute } from '@angular/router';
import {Gamestep, Games} from '../../../models/Games';

@Component({
  selector: 'app-new-treasure-hunt',
  templateUrl: './new-treasure-hunt.component.html',
  styleUrls: ['./new-treasure-hunt.component.scss'],
})
export class NewTreasureHuntComponent implements OnInit {
  places: Place[];
  currentStep = 1;
  currentLocation: number;
  currentHint: number;
  steps: Gamestep[] = [];
  constructor(
    private rout: ActivatedRoute,
  ) {}

  basicForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    start: new FormControl('', [Validators.required]),
    end: new FormControl('', [Validators.required]),
    start_location: new FormControl('', [Validators.required]),
    finish_location: new FormControl('', [Validators.required]),
  });

  stepsForm = new FormGroup({
    location: new FormControl('', [Validators.required]),
    hint: new FormControl('', [Validators.required])
  });

  mode: any;

  ngOnInit(): void {
    this.places = this.rout.snapshot.data.dogParks;
  }

  createNewStep(): void {
    let startLocation = -1;
    if (!isNaN(this.basicForm.controls.start_location.value)) {
      startLocation = this.basicForm.controls.start_location.value;
    }
    this.steps.push({
      finish_location: this.currentLocation,
      secret_key: this.currentHint,
      start_location: startLocation,
      step_num: this.currentStep++});
    this.currentLocation = undefined;
    this.currentHint = undefined;
  }

  removeStep(index: number) {
    this.steps.splice(index, 1);
  }

  submitGame(): void {
    console.log(this.steps);
  }

}
