import { Injectable } from '@angular/core';
import { ApiProviderService } from '../../services/api-provider.service';
import { Observable } from 'rxjs';
import { Businesses } from '../../models/businesses';
import { Users } from 'aws-sdk/clients/workmail';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private api: ApiProviderService) { }

  getBusinesses(): Observable<Businesses[]> {
    return this.api.get('admin/businesses');
  }

  getAdmins(): Observable<Users[]> {
    return this.api.get('admin/getAdmins');
  }
}
