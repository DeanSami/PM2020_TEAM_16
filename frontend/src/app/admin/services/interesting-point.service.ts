import { Injectable } from '@angular/core';
import { ApiProviderService } from '../../services/api-provider.service';
import { Observable } from 'rxjs';
import { Place } from '../../models/places';

@Injectable({
  providedIn: 'root'
})
export class InterestingPointService {
  places: Place[] = [];

  constructor(private api: ApiProviderService) { }

  getInterestingPoint(): Observable<Place[]> {
    return this.api.get('admin/interesting_point');
  }

  deleteInterestingPoint(dogParkId: number) {
    return this.api.delete('admin/interesting_point', {id: dogParkId});
  }

  saveInterestingPoint(park: Place): Observable<Place> {
    return this.api.post('admin/interesting_point', park);
  }

  updateInterestingPoint(park: Place): Observable<Place> {
    return this.api.patch('admin/interesting_point', park);
  }
}
