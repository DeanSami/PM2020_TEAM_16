import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Games } from '../../../models/Games';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AreYouSureDialogComponent } from '../../../are-you-sure-dialog/are-you-sure-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../models/users';
import { UserAuthService } from '../../user-auth.service';
import { GamesService } from '../../services/games.service';
import { GameInfoModalComponent } from './game-info-modal/game-info-modal.component';

@Component({
  selector: 'app-all-games',
  templateUrl: './all-games.component.html',
  styleUrls: ['./all-games.component.scss']
})
export class AllGamesComponent implements OnInit {
  games: Games[] = [];
  currentUser: User;
  displayedColumns: string[] = ['name', 'start', 'end', 'start_location', 'finish_location', 'owner', 'action'];
  dataSource: MatTableDataSource<Games>;
  expandedElement: Games | null;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private rout: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private userAuth: UserAuthService,
    private gameService: GamesService
  ) {
  }

  ngOnInit(): void {
    this.games = this.rout.snapshot.data.games;
    this.dataSource = new MatTableDataSource<Games>(this.games);
    this.userAuth.currentUser.subscribe(user => this.currentUser = user);
  }

  startGame(game: Games) {
    if (!this.currentUser) {
      this.toastr.error('יש להתחבר בשביל להתחיל משחק');
      return;
    }
    this.dialog.open(AreYouSureDialogComponent, {
      width: '400px',
      data: {message: 'האם אתה בטוח שברצונך להתחיל לשחק במשחק ' + game.name}
    }).afterClosed().subscribe(result => {
      if (result) {
        this.gameService.startGame(game.id).subscribe(res => {
          this.toastr.success('הפעולה הושלמה בהצלחה');
          this.router.navigate(['user/profile']);
        }, err => {
          console.log(err);
          this.toastr.error('התחלת משחק נכשלה');
        });
      }
    }, err => {
      console.log(err);
      this.toastr.error('ארעה שגיאה בהתחלת משחק');
    });
  }

  showInfo(game: Games) {
    if (!game.steps) {
      game.steps = [];
    }
    this.dialog.open(GameInfoModalComponent, {
      width: '600px',
      data: game
    });
  }
}

