import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { delayWhen } from 'rxjs/operators';
import { timer } from 'rxjs';
import {Businesses} from "../../models/businesses";
import {BusinessesService} from "../services/businesses.service";

@Injectable()
export class UserBusinessResolver implements Resolve<Businesses[]> {

  constructor(private businessService: BusinessesService) {}

  resolve() {
    const startTime = Date.now();
    return this.businessService.getBusinesses().pipe(delayWhen(() => timer(300 + startTime - Date.now())));
  }
}
