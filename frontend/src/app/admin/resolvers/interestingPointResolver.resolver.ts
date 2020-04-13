import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { delayWhen } from 'rxjs/operators';
import { timer } from 'rxjs';
import { Place } from '../../models/places';
import { DogParksService } from '../services/dog-parks.service';
import { InterestingPointService } from '../services/interesting-point.service';

@Injectable()
export class InterestingPointResolver implements Resolve<Place[]> {

  constructor(private interestingPointService: InterestingPointService) {}

  resolve() {
    const startTime = Date.now();
    return this.interestingPointService.getInterestingPoint().pipe(delayWhen(() => timer(300 + startTime - Date.now())));
  }
}
