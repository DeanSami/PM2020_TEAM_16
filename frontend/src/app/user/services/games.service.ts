import { Injectable } from '@angular/core';
import { ApiProviderService } from '../../services/api-provider.service';
import { Observable } from 'rxjs';
import { Game } from '../../models/Games';

@Injectable({
  providedIn: 'root'
})
export class GamesService {
  places: Game[] = [];

  constructor(private api: ApiProviderService) { }

  getGames(): Observable<Game[]> {
    return this.api.get('user/my_games');
  }

  deleteGame(GameID: number) {
    return this.api.delete('user/my_games', {id: GameID});
  }

  saveGame(game: Game): Observable<Game> {
    return this.api.post('user/my_games', game);
  }

  updateGame(game: Game): Observable<Game> {
    return this.api.patch('user/my_games', game);
  }

  createNewGame(game: Games): Observable<Games[]> {
    return this.api.post('user/games/create', game);
  }


}
