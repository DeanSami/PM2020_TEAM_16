import { Component, OnInit } from '@angular/core';
import { ConditionType, ConditionTypeTitles, Place } from '../models/places';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dog-parks',
  templateUrl: './dog-parks.component.html',
  styleUrls: ['./dog-parks.component.scss']
})
export class DogParksComponent implements OnInit {
  conditionType = ConditionType;
  conditionTypeTitle = ConditionTypeTitles;
  displayedColumns: string[] = ['name', 'street', 'neighborhood', 'operator', 'handicapped', 'condition'];
  dataSource: MatTableDataSource<Place>;
  places: Place[];

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(private rout: ActivatedRoute) { }

  ngOnInit(): void {
    this.places = this.rout.snapshot.data.dogParks.place;
    this.dataSource = new MatTableDataSource<Place>(this.places);
  }

}
