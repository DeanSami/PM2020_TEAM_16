import { Pipe, PipeTransform } from '@angular/core';
import { PlacesService } from './user/services/places.service';

@Pipe({
  name: 'placeNameFromId'
})
export class PlaceNameFromIdPipe implements PipeTransform {
  constructor(private placeService: PlacesService) {
  }
  transform(value: number, ...args: unknown[]): unknown {
    const idx = this.placeService.places.findIndex(place => place.id === value);
    return idx >= 0 ? this.placeService.places[idx].name : '';
  }
}
