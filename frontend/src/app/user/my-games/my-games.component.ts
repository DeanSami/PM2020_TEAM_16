import { Component, OnInit } from '@angular/core';
import { ConditionType, ConditionTypeTitles, Place, PlaceActiveType } from '../../models/places';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AreYouSureDialogComponent } from '../../are-you-sure-dialog/are-you-sure-dialog.component';
// import { NewDogParkComponent } from './new-dog-park/new-dog-park.component';
// import { DogParksService } from '../services/dog-parks.service';
import { ToastrService } from 'ngx-toastr';
import {Games} from '../../models/Game';

@Component({
  selector: 'app-my-games',
  templateUrl: './my-games.component.html',
  styleUrls: ['./my-games.component.scss']
})
export class MyGamesComponent implements OnInit {
  conditionType = ConditionType;
  placeActiveType = PlaceActiveType;
  conditionTypeTitle = ConditionTypeTitles;
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
    private toastr: ToastrService
    //private MyGamesService: MyGamesService
  ) { }

  ngOnInit(): void {
    this.games = this.rout.snapshot.data.games;
    this.dataSource = new MatTableDataSource<Games>(this.games);
  }

  // removeDogPark(dogParkId: number) {
  //   this.dialog.open(AreYouSureDialogComponent, {
  //     width: '250px',
  //   }).afterClosed().subscribe(result => {
  //     if (result) {
  //       this.dogParkService.deleteDogPark(dogParkId).subscribe(() => {
  //         this.dataSource.data = this.dataSource.data.filter(park => park.id !== dogParkId);
  //         this.toastr.success('נמחק בהצלחה');
  //       }, err =>  {
  //         console.log(err);
  //         this.toastr.error('ארעה שגיאה במחיקה');
  //       });
  //     }
  //   });
  // }
  //
  // editDogPark(dogPark: Place) {
  //   this.dialog.open(NewDogParkComponent, {
  //     width: '600px',
  //     data: dogPark
  //   }).afterClosed().subscribe(result => {
  //     if (result) {
  //       const idx = this.dataSource.data.findIndex(park => park.id === result.id);
  //       if (idx >= 0) {
  //         this.dataSource.data[idx] = result;
  //       }
  //       this.dataSource.data = this.dataSource.data;
  //     }
  //   });
  // }
  //
  // shutdown(dogPark: Place) {
  //   this.dialog.open(AreYouSureDialogComponent, {
  //     width: '250px',
  //   }).afterClosed().subscribe(result => {
  //     if (result) {
  //       dogPark.active = dogPark.active === PlaceActiveType.Active ? PlaceActiveType.InActive : PlaceActiveType.Active;
  //       this.dogParkService.updateDogPark(dogPark).subscribe(res => {
  //         const idx = this.dataSource.data.findIndex(park => park.id === res.id);
  //         if (res.active === PlaceActiveType.Active) {
  //           this.toastr.success('נקודת העניין נפתחה בהצלחה');
  //         } else {
  //           this.toastr.success('נקודת העניין נסגרה בהצלחה');
  //         }
  //         if (idx > 0) {
  //           this.dataSource.data[idx].active = res.active;
  //           this.dataSource.data = this.dataSource.data;
  //         }
  //       }, err => {
  //         console.log(err);
  //         this.toastr.error('ארעה שגיאה בעדכון נקודת העניין');
  //       });
  //     }
  //   });
  // }
  //
  // addDogPark() {
  //   this.dialog.open(NewDogParkComponent, {
  //     width: '600px',
  //     data: null
  //   }).afterClosed().subscribe(result => {
  //     if (result) {
  //       this.dataSource.data.push(result);
  //       this.dataSource.data = this.dataSource.data;
  //     }
  //   });
  // }

}
