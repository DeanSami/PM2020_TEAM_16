import { Injectable } from '@angular/core';
import { Place } from '../../models/places';
import { ApiProviderService } from '../../services/api-provider.service';
import { Observable } from 'rxjs';
import {Games} from '../../models/Games';

@Injectable({
  providedIn: 'root'
})
export class GamesService {
  places: Games[] = [];

  constructor(private api: ApiProviderService) { }

  getGames(): Observable<Games[]> {
    return this.api.get('user/my_games');
  }

  deleteGame(GameID: number) {
    return this.api.delete('user/my_games', {id: GameID});
  }

  saveGame(game: Games): Observable<Games> {
    return this.api.post('user/my_games', game);
  }

  updateGame(game: Games): Observable<Games> {
    return this.api.patch('user/my_games', game);
  }
}
