import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { delayWhen } from 'rxjs/operators';
import { timer } from 'rxjs';
import { Place } from '../../models/places';
import { DogParksService } from '../services/dog-parks.service';

@Injectable()
export class DogParksResolver implements Resolve<Place[]> {

  constructor(private dogParksService: DogParksService) {}

  resolve() {
    const startTime = Date.now();
    return this.dogParksService.getPlaces().pipe(delayWhen(() => timer(300 + startTime - Date.now())));
  }
}
