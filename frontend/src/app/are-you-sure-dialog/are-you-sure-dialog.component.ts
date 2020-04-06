import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-are-you-sure-dialog',
  templateUrl: './are-you-sure-dialog.component.html',
  styleUrls: ['./are-you-sure-dialog.component.scss']
})
export class AreYouSureDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: { message: string }) { }

  ngOnInit(): void {
  }

}
