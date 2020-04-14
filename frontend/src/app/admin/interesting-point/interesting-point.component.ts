import { Component, OnInit } from '@angular/core';
import {ConditionType, ConditionTypeTitles, Place} from '../../models/places';
import {MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {InterestingPointService} from '../services/interesting-point.service';

@Component({
  selector: 'app-interesting-point',
  templateUrl: './interesting-point.component.html',
  styleUrls: ['./interesting-point.component.scss']
})
export class InterestingPointComponent implements OnInit {
  conditionType = ConditionType;
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
  }

}
