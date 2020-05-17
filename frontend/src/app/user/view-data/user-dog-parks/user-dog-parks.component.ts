import { Component, OnInit } from '@angular/core';
import { ConditionTypeTitles, Place } from '../../../models/places';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-dog-parks',
  templateUrl: './user-dog-parks.component.html',
  styleUrls: ['./user-dog-parks.component.scss']
})
export class UserDogParksComponent implements OnInit {
  dogParks: Place[] = [];
  conditionTypeTitles = ConditionTypeTitles;

  constructor(private rout: ActivatedRoute) { }

  ngOnInit(): void {
    this.dogParks = this.rout.snapshot.data.dogParks;
  }

}
