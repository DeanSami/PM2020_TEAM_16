import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Games } from '../../../../models/Games';

@Component({
  selector: 'app-game-info-modal',
  templateUrl: './game-info-modal.component.html',
  styleUrls: ['./game-info-modal.component.scss']
})
export class GameInfoModalComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: Games) { }

  ngOnInit(): void {
  }

}
