import { Injectable } from '@angular/core';
import { Place } from '../../models/places';
import { ApiProviderService } from '../../services/api-provider.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DogParksService {
  places: Place[] = [];

  constructor(private api: ApiProviderService) { }

  getPlaces(): Observable<Place[]> {
    return this.api.get('admin/dog_parks/get');

  }

  saveDogPark(park: {user_input: Place}): Observable<Place> {
    return this.api.post('admin/dog_parks/add', park);
  }
}
