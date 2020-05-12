import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AreYouSureDialogComponent } from '../../are-you-sure-dialog/are-you-sure-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { Games } from '../../models/Games';
import { GamesService } from '../services/games.service';

@Component({
  selector: 'app-my-games',
  templateUrl: './my-games.component.html',
  styleUrls: ['./my-games.component.scss']
})
export class MyGamesComponent implements OnInit {
  displayedColumns: string[] = ['name', 'start', 'end', 'start_location', 'finish_location', 'condition', 'action'];
  dataSource: MatTableDataSource<Games>;
  games: Games[];

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(
    private rout: ActivatedRoute,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private gamesService: GamesService
  ) { }

  ngOnInit(): void {
    this.games = this.rout.snapshot.data.games;
    this.dataSource = new MatTableDataSource<Games>(this.games);
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
