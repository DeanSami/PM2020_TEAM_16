import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AreYouSureDialogComponent } from '../../are-you-sure-dialog/are-you-sure-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { Games } from '../../models/Games';
import { GamesService } from '../services/games.service';
import {UserAuthService} from "../user-auth.service";
import {User} from "../../models/users";

@Component({
  selector: 'app-my-games',
  templateUrl: './my-games.component.html',
  styleUrls: ['./my-games.component.scss']
})
export class MyGamesComponent implements OnInit {
  displayedColumns: string[] = ['name', 'start', 'end', 'start_location', 'finish_location', 'action'];
  dataSource: MatTableDataSource<Games>;
  games: Games[];
  user: User;

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
      this.gamesService.getGamesPlayedById(this.user.id).subscribe(games => {
        this.games = games;
        this.dataSource = new MatTableDataSource<Games>(this.games);
      }, err => console.log(err));
    }, err => console.log(err));

  }

  // finishGame(GameId: number) {
  //   this.dialog.open(AreYouSureDialogComponent, {
  //     width: '250px',
  //   }).afterClosed().subscribe(result => {
  //     if (result) {
  //       this.gamesService.finishGame(GameId).subscribe(() => {
  //         this.dataSource.data = this.dataSource.data.filter(game => game.id !== GameId);
  //         this.toastr.success('נמחק בהצלחה');
  //       }, err =>  {
  //         console.log(err);
  //         this.toastr.error('ארעה שגיאה במחיקה');
  //       });
  //     }
  //   });
  // }


}
