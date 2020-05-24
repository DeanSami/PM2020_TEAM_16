import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { delayWhen } from 'rxjs/operators';
import { timer } from 'rxjs';
import {Games} from '../../models/Games';
import {GamesService} from '../services/games.service';

@Injectable()
export class UserGamesResolverResolver implements Resolve<Games[]> {

  constructor(private gamesService: GamesService) {}

  resolve() {
    const startTime = Date.now();
    return this.gamesService.getGames().pipe(delayWhen(() => timer(300 + startTime - Date.now())));
  }
}
