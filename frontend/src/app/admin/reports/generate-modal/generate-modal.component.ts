import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReportsService } from '../../../services/reports.service';
import { AdminReport, GameReport, PlaceReport } from '../../../models/Reports';
import { ConditionTypeTitles, PlaceTypeTitles } from '../../../models/places';

@Component({
  selector: 'app-generate-modal',
  templateUrl: './generate-modal.component.html',
  styleUrls: ['./generate-modal.component.scss']
})
export class GenerateModalComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData,
    private reportService: ReportsService,
    public dialogRef: MatDialogRef<any>
  ) { }
  printHtml = '';
  reportName = '';
  start;
  end;

  ngOnInit(): void {
    switch (this.dialogData.type) {
      case 'games':
        this.reportName = 'דוח משחקים';
        break;
      case 'places':
        this.reportName = 'דוח נקודות עניין';
        break;
      case 'admins':
        this.reportName = 'דוח מנהלים';
        break;
    }
  }

  generateReport() {
    switch (this.dialogData.type) {
      case 'games':
        const gamerows: GameReport[] = [];
        const tmpGames = this.start && this.end ?
          this.dialogData.games.filter(g => new Date(g.created_at) >= this.start && new Date(g.created_at) <= this.end) :
          this.dialogData.games;
        tmpGames.forEach(game => {
          const row = {
            name: game.name,
            start: game.start.split('T')[0],
            end: game.end.split('T')[0],
            owner: game.owner_id + '',
            start_location: '',
            finish_location: '',
            created_at: game.created_at.split('T')[0]
          };
          let idx = this.dialogData.places.findIndex(loc => loc.id === game.start_location);
          if (idx >= 0) {
            row.start_location = this.dialogData.places[idx].name;
          }
          idx = this.dialogData.places.findIndex(loc => loc.id === game.finish_location);
          if (idx >= 0) {
            row.finish_location = this.dialogData.places[idx].name;
          }
          gamerows.push(row);
        });
        const gameColumns = [
          {key: 'name', value: 'שם המשחק'},
          {key: 'start', value: 'זמן התחלה'},
          {key: 'end', value: 'זמן סיום'},
          {key: 'owner', value: 'מנהל המשחק'},
          {key: 'start_location', value: 'מיקום התחלתי'},
          {key: 'finish_location', value: 'מיקום סופי'},
          {key: 'created_at', value: 'תאריך יצירה'}
        ];
        this.printHtml = this.reportService.createReport(gameColumns, gamerows, this.reportName);
        break;
      case 'places':
        const placerows: PlaceReport[] = [];
        const tmpPlaces = this.start && this.end ?
          this.dialogData.places.filter(g => new Date(g.created_at) >= this.start && new Date(g.created_at) <= this.end) :
          this.dialogData.places;
        tmpPlaces.forEach(place => {
          const row = {
            name: place.name,
            type: PlaceTypeTitles[place.type],
            address: place.street + ' ' + place.house_number,
            condition: ConditionTypeTitles[place.condition],
            created_at: place.created_at.split('T')[0]
          };
          placerows.push(row);
        });
        const placeColumns = [
          {key: 'name', value: 'שם המקום'},
          {key: 'type', value: 'סוג המקום'},
          {key: 'address', value: 'כתובת'},
          {key: 'condition', value: 'מצב המקום'},
          {key: 'created_at', value: 'תאריך יצירה'}
        ];
        this.printHtml = this.reportService.createReport(placeColumns, placerows, this.reportName);
        break;
      case 'admins':
        const adminRows: AdminReport[] = [];
        const tmpAdmins = this.start && this.end ?
          this.dialogData.admins.filter(g => new Date(g.created_at) >= this.start && new Date(g.created_at) <= this.end) :
          this.dialogData.admins;
        tmpAdmins.forEach(admin => {
          const row = {
            name: admin.name,
            email: admin.email,
            phone: admin.phone,
            created_at: admin.created_at.split('T')[0]
          };
          adminRows.push(row);
        });
        const adminColumns = [
          {key: 'name', value: 'שם המנהל'},
          {key: 'email', value: 'כתובת אימייל'},
          {key: 'phone', value: 'טלפון'},
          {key: 'created_at', value: 'תאריך יצירה'}
        ];
        this.printHtml = this.reportService.createReport(adminColumns, adminRows, this.reportName);
        break;
    }
    setTimeout(() => document.getElementById('print-button-section').click(), 200);
  }

}
