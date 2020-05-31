import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { delayWhen } from 'rxjs/operators';
import { timer } from 'rxjs';
import { AdminService } from '../services/admin.service';
import { Users } from 'aws-sdk/clients/workmail';

@Injectable()
export class AdminsResolver implements Resolve<Users[]> {

  constructor(private adminService: AdminService) {}

  resolve() {
    const startTime = Date.now();
    return this.adminService.getAdmins().pipe(delayWhen(() => timer(300 + startTime - Date.now())));
  }
}
