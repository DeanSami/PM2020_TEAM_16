import { Component, OnInit } from '@angular/core';
import { ConditionTypeTitles, Place, PlacesType, PlaceTypeTitles } from '../../../models/places';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-dog-parks',
  templateUrl: './user-dog-parks.component.html',
  styleUrls: ['./user-dog-parks.component.scss']
})
export class UserDogParksComponent implements OnInit {
  dogParks: Place[] = [];
  conditionTypeTitles = ConditionTypeTitles;
  placeType = PlacesType;
  placeTypeTitles = PlaceTypeTitles;
  currentType = PlacesType.Dog_garden;

  constructor(private rout: ActivatedRoute) { }

  ngOnInit(): void {
    this.dogParks = this.rout.snapshot.data.dogParks.filter(park => park.type === this.currentType);
  }

  applyFilter() {
    this.dogParks = this.rout.snapshot.data.dogParks.filter(park => park.type === this.currentType);
  }

}
