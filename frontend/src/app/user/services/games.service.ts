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


  // { owenr_id: ... } - get all games thats owned by user with id ||
  // { id: ... } get all games that are being played by user id
  getGames(params: object): Observable<Games[]> {
    return this.api.get('user/games', params);
  }

  getGamesPlayedById(id: number) {
    return this.api.post('user/games/myGames', {id});
  }
  // REQUEST to finish/stop the game by given game id and user id
  finishGame(GameId: number, UserId: number){
    return this.api.patch('user/games/myGames', {GameId, UserId});
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
}
