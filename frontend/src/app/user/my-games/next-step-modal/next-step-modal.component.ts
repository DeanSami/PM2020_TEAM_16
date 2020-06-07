import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserGames } from '../../../models/Games';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GamesService } from '../../services/games.service';

@Component({
  selector: 'app-next-step-modal',
  templateUrl: './next-step-modal.component.html',
  styleUrls: ['./next-step-modal.component.scss']
})
export class NextStepModalComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: UserGames,
    private toastr: ToastrService,
    private gameService: GamesService,
    public dialogRef: MatDialogRef<any>,
  ) { }

  form = new FormGroup({
    code: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(15)
    ])
  });

  get code() {
    return this.form.get('code');
  }

  ngOnInit(): void {
  }

  nextStep() {
    if (this.form.invalid) {
      this.toastr.error('חובה למלא קוד אימות לשלב');
      return;
    }
    const data = {
      game_id: this.dialogData.game_id,
      secret_key: this.code.value
    };
    this.gameService.nextStep(data).subscribe(result => {
      if (result.finish_at) {
        this.toastr.success('כל הכבוד! סיימת את המשחק בהצלחה');
      } else {
        this.toastr.success('כל הכבוד! אתה מועבר לשלב הבא');
      }
      this.dialogRef.close(result);
    }, err => {
      this.toastr.error('הקוד שאוזן שגוי');
    });
  }

}
