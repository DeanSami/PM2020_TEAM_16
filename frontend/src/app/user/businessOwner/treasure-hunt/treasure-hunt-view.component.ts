import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {TreasureHuntFormComponent} from "./treasure-hunt-form/treasure-hunt-form.component";
import {MatDialog} from "@angular/material/dialog";
import {Games, Gamestep} from "../../../models/Games";
import {GamesService} from "../../services/games.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import {UserAuthService} from "../../user-auth.service";
import {User} from "../../../models/users";

@Component({
  selector: 'app-treasure-hunt-view',
  templateUrl: './treasure-hunt-view.component.html',
  styleUrls: ['./treasure-hunt-view.component.scss']
})
export class TreasureHuntViewComponent implements OnInit {

  displayedColumns: string[] = ['owner_id', 'name', 'start', 'end', 'start_location', 'finish_location']
  myGames: Games[];
  dataSource: MatTableDataSource<Games>;
  private currentUser: User;
  @Input() dogParks;
  constructor(public dialog: MatDialog,
              private gamesService: GamesService,
              private userAuthService: UserAuthService) { }

              @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  ngOnInit(): void {
    this.userAuthService.currentUser.subscribe(res => this.currentUser = res, err => console.log(err));
      this.gamesService.getGames({owner_id: this.currentUser.id}).subscribe(result => {
        this.myGames = result;
        this.dataSource = new MatTableDataSource<Games>(this.myGames);
        this.dataSource.paginator = this.paginator;
      }, err => console.log(err))
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(TreasureHuntFormComponent, {
      // width: '250px',
      direction: "rtl",
      data: {dogParks: this.dogParks}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
