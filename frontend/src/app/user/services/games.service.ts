import { Injectable } from '@angular/core';
import { ApiProviderService } from '../../services/api-provider.service';
import { Observable } from 'rxjs';
import { Games } from '../../models/Games';

@Injectable({
  providedIn: 'root',
})
export class GamesService {
  places: Games[] = [];

  constructor(private api: ApiProviderService) {}

  getGames(params?: {owner_id: number}): Observable<Games[]> {
    if (params && params.owner_id) {
      return this.api.get('user/business/games', params);
    } else {
      return this.api.get('user/games');
    }
  }

  getGamesPlayedById(id: number) {
    return this.api.post('user/games/myGames', {id});
  }

  finishGame(GameId: number){
    return this.api.patch('user/games/endgame', {GameId});
  }

  // deleteGame(GameID: number) {
  //   return this.api.delete('user/my_games', {id: GameID});
  // }
  //
  // saveGame(game: Games): Observable<Games> {
  //   return this.api.post('user/my_games', game);
  // }
  //
  updateGame(game: Games): Observable<Games> {
    return this.api.patch('user/games/edit', game);
  }

  createNewGame(game: Games): Observable<Games[]> {
    return this.api.post('user/games/create', game);
  }

  startGame(id: number) {
    return this.api.get('user/games/startGame', {id});
  }

  nextStep(data: {code: string, game_id: number}) {
    return this.api.get('user/games/nextStep', data);
  }
}
