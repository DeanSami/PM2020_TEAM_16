import { Injectable } from '@angular/core';
import { ApiProviderService } from '../../services/api-provider.service';
import { Observable } from 'rxjs';
import {Businesses} from "../../models/businesses";

@Injectable({
  providedIn: 'root'
})
export class BusinessesService {
  places: Businesses[] = [];

  constructor(private api: ApiProviderService) { }

  getBusinesses(): Observable<Businesses[]> {
    return this.api.get('user/business');
  }

  getBusiness(id: number): Observable<Businesses> {
    return this.api.post('user/business', {id: id})
  }

  updateBusiness(business: Businesses): Observable<Businesses> {
    return this.api.patch('user/business/edit', business);
  }

  createNewBusiness(business: Businesses): Observable<Businesses[]> {
    return this.api.post('user/business/create', business);
  }


}
