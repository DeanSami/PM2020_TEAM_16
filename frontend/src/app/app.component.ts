import { Component } from '@angular/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { ThemePalette } from '@angular/material/core';
import { LoadingService } from './loading.service';
import { User } from './models/Users';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  loading = true;
  title = 'dogs-project';
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;


  constructor(loadingService: LoadingService) {
      loadingService.loading.subscribe(loading => this.loading = loading);
  }
}
