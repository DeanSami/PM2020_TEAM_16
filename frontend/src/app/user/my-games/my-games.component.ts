import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AreYouSureDialogComponent } from '../../are-you-sure-dialog/are-you-sure-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { UserGames } from '../../models/Games';
import { GamesService } from '../services/games.service';
import {UserAuthService} from '../user-auth.service';
import {User} from '../../models/users';
import { NextStepModalComponent } from './next-step-modal/next-step-modal.component';

@Component({
  selector: 'app-my-games',
  templateUrl: './my-games.component.html',
  styleUrls: ['./my-games.component.scss']
})
export class MyGamesComponent implements OnInit {
  displayedColumns: string[] = ['name', 'start', 'end', 'start_location', 'step_id', 'finish_location', 'action'];
  dataSource: MatTableDataSource<UserGames>;
  games: UserGames[];
  displayGames: UserGames[];
  user: User;
  displayDone = false;

  applyFilter(event: Event) {
    // const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(
    private userAuthService: UserAuthService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private gamesService: GamesService
  ) { }

  ngOnInit(): void {
    this.userAuthService.currentUser.subscribe(user => {
      this.user = user;
      this.gamesService.getGamesPlayedById().subscribe(games => {
        this.games = games;
        this.displayTableRows();
      }, err => console.log(err));
    }, err => console.log(err));
  }

  displayTableRows(displayDone = false) {
    this.displayDone = displayDone ? !this.displayDone  : false;
    this.displayGames = this.games.filter(game => !game.finish_at || this.displayDone);
    this.dataSource = new MatTableDataSource<UserGames>(this.displayGames);
  }

  finishGame(GameId: number) {
    this.dialog.open(AreYouSureDialogComponent, {
      width: '250px',
    }).afterClosed().subscribe(result => {
      if (result) {
        this.gamesService.finishGame(GameId).subscribe(() => {
          const idx = this.games.findIndex(game => game.id === GameId);
          if (idx >= 0) {
            this.games[idx].finish_at = new Date().toISOString();
            this.displayDone = !this.displayDone;
            this.displayTableRows(true);
          }
          this.toastr.success('משחק הסתיים בהצלחה');
        }, err =>  {
          console.log(err);
          this.toastr.error('ארעה שגיאה בניסיון לסיים את המשחק');
        });
      }
    });
  }

  nextStepModal(element: UserGames) {
    this.dialog.open(NextStepModalComponent, {
      width: '250px',
      data: element
    }).afterClosed().subscribe(result => {
      if (result &&  result.step_id) {
        element.finish_at = result.finish_at;
        element.step_id = result.step_id;
      }
    });
  }


}
