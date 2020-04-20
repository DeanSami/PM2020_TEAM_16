import { Component, OnInit } from '@angular/core';
import { ConditionType, ConditionTypeTitles, Place, PlaceActiveType } from '../../models/places';
import {MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {InterestingPointService} from '../services/interesting-point.service';
import {AreYouSureDialogComponent} from '../../are-you-sure-dialog/are-you-sure-dialog.component';
import {NewDogParkComponent} from '../dog-parks/new-dog-park/new-dog-park.component';
import {NewInterestingPointComponent} from './new-interesting-point/new-interesting-point.component';

@Component({
  selector: 'app-interesting-point',
  templateUrl: './interesting-point.component.html',
  styleUrls: ['./interesting-point.component.scss']
})
export class InterestingPointComponent implements OnInit {
  conditionType = ConditionType;
  placeActiveType = PlaceActiveType;
  conditionTypeTitle = ConditionTypeTitles;
  displayedColumns: string[] = ['name', 'street', 'neighborhood', 'operator', 'handicapped', 'condition', 'action'];
  dataSource: MatTableDataSource<Place>;
  places: Place[];
  constructor(private rout: ActivatedRoute,
              private dialog: MatDialog,
              private toastr: ToastrService,
              private interestingPointService: InterestingPointService) { }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
    this.places = this.rout.snapshot.data.interestingPoint;
    this.dataSource = new MatTableDataSource<Place>(this.places);
  }

  removeInterestingPoint(interestingPointId: number) {
    this.dialog.open(AreYouSureDialogComponent, {
      width: '250px',
    }).afterClosed().subscribe(result => {
      if (result) {
        this.interestingPointService.deleteInterestingPoint(interestingPointId).subscribe(() => {
          this.dataSource.data = this.dataSource.data.filter(park => park.id !== interestingPointId);
          this.toastr.success('נמחק בהצלחה');
        }, err =>  {
          console.log(err);
          this.toastr.error('ארעה שגיאה במחיקה');
        });
      }
    });
  }

  editInterestingPoint(interestingPoint: Place) {
    this.dialog.open(NewInterestingPointComponent, {
      width: '600px',
      data: interestingPoint
    }).afterClosed().subscribe(result => {
      if (result) {
        const idx = this.dataSource.data.findIndex(park => park.id === result.id);
        if (idx >= 0) {
          this.dataSource.data[idx] = result;
        }
        this.dataSource.data = this.dataSource.data;
      }
    });
  }

  shutdown(interestingPoint: Place) {
    this.dialog.open(AreYouSureDialogComponent, {
      width: '250px',
    }).afterClosed().subscribe(result => {
      if (result) {
        interestingPoint.active = interestingPoint.active === PlaceActiveType.Active ? PlaceActiveType.InActive : PlaceActiveType.Active;
        this.interestingPointService.updateInterestingPoint(interestingPoint).subscribe(res => {
          const idx = this.dataSource.data.findIndex(park => park.id === res.id);
          if (res.active === PlaceActiveType.Active) {
            this.toastr.success('נקודת העניין נפתחה בהצלחה');
          } else {
            this.toastr.success('נקודת העניין נסגרה בהצלחה');
          }
          if (idx > 0) {
            this.dataSource.data[idx].active = res.active;
            this.dataSource.data = this.dataSource.data;
          }
        }, err => {
          console.log(err);
          this.toastr.error('ארעה שגיאה בסגירת נקודת העניין');
        });
      }
    });
  }

  addInterestingPoint() {
    this.dialog.open(NewInterestingPointComponent, {
      width: '600px',
      data: null
    }).afterClosed().subscribe(result => {
      if (result) {
        this.dataSource.data.push(result);
        this.dataSource.data = this.dataSource.data;
      }
    });
  }
}
