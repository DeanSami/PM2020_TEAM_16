import { Injectable } from '@angular/core';
import { Place } from '../../models/places';
import { ApiProviderService } from '../../services/api-provider.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  places: Place[] = [];

  constructor(private api: ApiProviderService) { }

  // getPlaces(): Observable<Place[]> {
  //   return this.api.get
  //
  // }

  saveDogPark(park: Place): Observable<Place> {
    return this.api.post('dog_parks/add', park);
  }
}
