import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TreasureHuntFormComponent } from './treasure-hunt-form/treasure-hunt-form.component';
import { MatDialog } from '@angular/material/dialog';
import { Games } from '../../../models/Games';
import { GamesService } from '../../services/games.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { UserAuthService } from '../../user-auth.service';
import { User } from '../../../models/users';

@Component({
  selector: 'app-treasure-hunt-view',
  templateUrl: './treasure-hunt-view.component.html',
  styleUrls: ['./treasure-hunt-view.component.scss']
})
export class TreasureHuntViewComponent implements OnInit {
  displayedColumns: string[] = ['owner_id', 'name', 'start', 'end', 'start_location', 'finish_location', 'action']
  myGames: Games[];
  dataSource: MatTableDataSource<Games>;
  private currentUser: User;
  @Input() dogParks;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(public dialog: MatDialog,
              private gamesService: GamesService,
              private userAuthService: UserAuthService) { }

  ngOnInit(): void {
    this.userAuthService.currentUser.subscribe(res => this.currentUser = res, err => console.log(err));
    this.gamesService.getGames({owner_id: this.currentUser.id}).subscribe(result => {
        this.myGames = result;
        this.dataSource = new MatTableDataSource<Games>(this.myGames);
        this.dataSource.paginator = this.paginator;
      }, err => console.log(err));
  }

  openCreateDialog(element?: Games): void {
    let idx;
    if (element) {
      idx = this.findWithAttr(this.myGames, 'id', element.id);
    }
    this.dialog.open(TreasureHuntFormComponent, {
      width: '750px',
      direction: 'rtl',
      data: idx >= 0 ? this.myGames[idx] : null
    }).afterClosed().subscribe(result => {
      if (result) {
        if (idx >= 0) {
          this.myGames[this.findWithAttr(this.myGames, 'id', result.id)] = result;
        } else {
          this.myGames.push(result);
        }
        this.dataSource = new MatTableDataSource<Games>(this.myGames);
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  findWithAttr(arr, attr, val) {
    for (let i = 0; i < arr.length; i += 1) {
      if (arr[i][attr] === val) {
        return i;
      }
    }
    return -1;
  }

  // editTreasureHunt() {
  //   const i = this.findWithAttr(this.myGames, 'id', element.id);
  //   console.log('index', i, 'game', this.myGames[i]);
  //   const dialogRef = this.dialog.open(TreasureHuntFormComponent, {
  //     // width: '250px',
  //     direction: 'rtl',
  //     data: this.myGames[i]
  //   });
  //
  //   dialogRef.afterClosed().subscribe(result => {
  //     this.myGames[this.findWithAttr(this.myGames, 'id', result.id)] = result;
  //     this.dataSource = new MatTableDataSource<Games>(this.myGames);
  //     this.dataSource.paginator = this.paginator;
  //     console.log('The dialog was closed');
  //   });
  // }

}
