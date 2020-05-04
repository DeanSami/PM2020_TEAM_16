import { Injectable } from '@angular/core';
import {Place, PlacesType} from '../../models/places';
import {ApiProviderService} from '../../services/api-provider.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  constructor(private api: ApiProviderService) { }

  getInterestPoints(): Observable<Place[]> {
    return this.api.get('user/places');
  }

  getDogParks(): Observable<Place[]> {
    return this.api.get('user/places', {type: PlacesType.Dog_garden});
  }
}
