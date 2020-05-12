import { Injectable } from '@angular/core';
import {Place, PlacesType} from '../../models/places';
import {ApiProviderService} from '../../services/api-provider.service';
import {Observable} from 'rxjs';
import {Games} from "../../models/Game";

@Injectable({
  providedIn: 'root'
})
export class GamesService {

  constructor(private api: ApiProviderService) { }

  createNewGame(game: Games): Observable<Games[]> {
    return this.api.post('user/games/create', game);
  }

  getGames(): Observable<Games[]> {
    return this.api.get('user/games');
  }

}
