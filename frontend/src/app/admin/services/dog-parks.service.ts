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

  getDogsPark(): Observable<Place[]> {
    return this.api.get('admin/dog_parks');
  }

  deleteDogPark(dogParkId: number): Observable<boolean> {
    return this.api.delete('admin/dog_parks', {id: dogParkId});
  }

  saveDogPark(park: {user_input: Place}): Observable<Place> {
    return this.api.post('admin/dog_parks', park);
  }

  updateDogPark(park: {user_input: Place}): Observable<Place> {
    return this.api.patch('admin/dog_parks', park);
  }
}
