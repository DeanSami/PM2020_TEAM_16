import { Component, OnInit } from '@angular/core';
import { Games } from '../../models/Games';
import { Place } from '../../models/places';
import { User } from '../../models/users';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { GenerateModalComponent } from './generate-modal/generate-modal.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  games: Games[] = [];
  places: Place[] = [];
  admins: User[] = [];

  constructor(
    private rout: ActivatedRoute,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.places = this.rout.snapshot.data.places;
    this.games = this.rout.snapshot.data.games;
    this.admins = this.rout.snapshot.data.admins;
  }

  gameReport(type: string) {
    this.dialog.open(GenerateModalComponent, {
      width: '400px',
      data: {
        games: this.games,
        places: this.places,
        admins: this.admins,
        type
      }
    });
  }

}
