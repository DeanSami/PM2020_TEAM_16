import { Pipe, PipeTransform } from '@angular/core';
import { Place } from './models/places';

@Pipe({
  name: 'placeNameFromId'
})
export class PlaceNameFromIdPipe implements PipeTransform {

  transform(value: Place, ...args: unknown[]): unknown {
    console.log('value', value);
    return value;
  }

}
