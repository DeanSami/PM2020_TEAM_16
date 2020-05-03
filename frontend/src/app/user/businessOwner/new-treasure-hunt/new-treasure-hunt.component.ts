import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Place } from '../../../models/places';
import { DogParksService } from 'src/app/admin/services/dog-parks.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-treasure-hunt',
  templateUrl: './new-treasure-hunt.component.html',
  styleUrls: ['./new-treasure-hunt.component.scss'],
})
export class NewTreasureHuntComponent implements OnInit {
  places: Place[];
  constructor(
    private rout: ActivatedRoute,
    private dogParkService: DogParksService
  ) {}

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    start: new FormControl('', [Validators.required]),
    end: new FormControl('', [Validators.required]),
    start_location: new FormControl('', [Validators.required]),
    finish_location: new FormControl('', [Validators.required]),
  });
  mode: any;

  ngOnInit(): void {
    this.places = this.rout.snapshot.data.dogParks;
    console.log(this.places);
  }
}
