import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Place } from '../../../models/places';
import { ActivatedRoute } from '@angular/router';
import {Gamestep, Game} from '../../../models/Games';
import {UserAuthService} from '../../user-auth.service';
import {InterestingPointService} from '../../../admin/services/interesting-point.service';
import {GamesService} from '../../services/games.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-new-treasure-hunt',
  templateUrl: './new-treasure-hunt.component.html',
  styleUrls: ['./new-treasure-hunt.component.scss'],
})
export class NewTreasureHuntComponent implements OnInit {
  places: Place[];
  currentStepNum = 1;
  currentStep = this.initStep();
  steps: Gamestep[] = [];
  constructor(
    private rout: ActivatedRoute,
    private userAuth: UserAuthService,
    private toastr: ToastrService,
    private GamesService: GamesService
  ) {}

  basicForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
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
  panelOpenState = false;

  ngOnInit(): void {
    this.places = this.rout.snapshot.data.dogParks;
    this.currentStep = this.initStep();
  }

  initStep(): Gamestep {
    return {
      name: '',
      secret_key: undefined,
      start_location: NaN,
      finish_location: NaN,
      step_num: NaN,
      description: ''
    }
  }

  findWithAttr(arr, attr, val) {
    for (var i = 0; i < arr.length; i += 1) {
      if (arr[i][attr] === val) {
        return i;
      }
    }
    return -1;
  }

  createNewStep(): Gamestep {
    //
    // name: new FormControl('', [Validators.required]),
    //   start: new FormControl('', [Validators.required]),
    //   end: new FormControl('', [Validators.required]),
    //   start_location: new FormControl('', [Validators.required]),
    //   finish_location: new FormControl('', [Validators.required]),
    let title = this.basicForm.controls.title.value,
      secret_key = this.currentStep.secret_key,
      finish_location =this.currentStep.finish_location,
      description = this.currentStep.description
    let raw_gamestep: Gamestep = this.initStep();
    if (secret_key == raw_gamestep.secret_key || finish_location == raw_gamestep.finish_location) {
      this.toastr.error('יש להזין את כל השדות הדרושים לצעד');
      return null;
    }

    let place_index = this.findWithAttr(this.places, 'id', this.currentStep.finish_location)
    if (place_index > -1) {
      let place = this.places[place_index];
      let name = place.name;
      let start_location = this.basicForm.controls.start_location.value
      if (this.steps.length > 0) {
        start_location = this.steps[this.steps.length - 1].finish_location
        this.steps[this.steps.length - 1].finish_location = start_location
      }
      let step: Gamestep = {
        name: name,
        secret_key: secret_key,
        start_location: start_location,
        finish_location: finish_location,
        step_num: this.currentStepNum++,
        description: description
      };
      this.currentStep = this.initStep()
      return step;
    } else return;
  }

  pushNewStep(): void {
    if (this.steps.length == 0) {
      if (this.basicForm.controls.start_location.value == '') {
        this.toastr.error('יש להזין את כל השדות הבסיסיים למשחק');
        return;
      }
    }
    let newStep = this.createNewStep();
    if (newStep == null) return;
    this.steps.push(newStep);
  }

  removeStep(index: number) {
    this.steps.splice(index, 1);
    this.currentStepNum--;
  }

  date_str(date: Date): string {
    let y = date.getFullYear();
    let m = date.getMonth();
    let d = date.getDate();
    return y + '-' + m + '-' + d;
  }

  submitGame(): void {
    if (this.basicForm.controls.title.value == '' || this.basicForm.controls.finish_location.value == '') {
      this.toastr.error('יש להזין את כל השדות הבסיסיים למשחק');
      return;
    }
    let game: Game = {
      owner_id: this.userAuth.currentUser.getValue().id,
      name: this.basicForm.controls.title.value,
      start: this.date_str(new Date(this.basicForm.controls.start.value)),
      end: this.date_str(new Date(this.basicForm.controls.end.value)),
      start_location: this.basicForm.controls.start_location.value,
      finish_location: this.basicForm.controls.finish_location.value,
      steps: this.steps
    }
    this.GamesService.createNewGame(game).subscribe((res) => {
      this.toastr.success('הפעולה הסתיימה בהצלחה!');
    }, err => {
      this.toastr.error('הפעולה נכשלה!');
      console.log('err', err);
    });
  }

}
