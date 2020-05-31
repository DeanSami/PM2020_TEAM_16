import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { delayWhen } from 'rxjs/operators';
import { timer } from 'rxjs';
import { AdminService } from '../services/admin.service';
import { Businesses } from '../../models/businesses';

@Injectable()
export class BusinessesResolver implements Resolve<Businesses[]> {

  constructor(private businessesService: AdminService) {}

  resolve() {
    const startTime = Date.now();
    return this.businessesService.getBusinesses().pipe(delayWhen(() => timer(300 + startTime - Date.now())));
  }
}
