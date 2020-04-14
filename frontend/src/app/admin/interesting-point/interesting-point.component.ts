import { Component, OnInit } from '@angular/core';
import {ConditionType, ConditionTypeTitles, Place} from '../../models/places';
import {MatTableDataSource} from '@angular/material/table';

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
  constructor() { }

  ngOnInit(): void {
  }

}
