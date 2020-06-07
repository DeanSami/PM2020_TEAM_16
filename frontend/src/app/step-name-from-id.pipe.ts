import { Pipe, PipeTransform } from '@angular/core';
import { PlacesService } from './user/services/places.service';
import { GamesService } from './user/services/games.service';

@Pipe({
  name: 'stepNameFromId'
})
export class StepNameFromIdPipe implements PipeTransform {
  constructor(private gameService: GamesService) {}

  transform(value: number, ...args: unknown[]): unknown {
    let result = '';
    this.gameService.games.forEach(game => {
      game.steps.forEach(step => {
        if (step.id === value) {
          result = step.name;
        }
      });
    });
    return result;
  }

}
