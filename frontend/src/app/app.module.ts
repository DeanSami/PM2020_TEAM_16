import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LoadingService } from './loading.service';
import { MainComponent } from './main/main.component';
import { AdminComponent } from './admin/admin.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SidebarComponent } from './main/sidebar/sidebar.component';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from './shared/shared.module';
import { LoginComponent } from './admin/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    AdminComponent,
    SidebarComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    FlexLayoutModule,
    MatSidenavModule,
    MatMenuModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatButtonModule,
    SharedModule
  ],
  exports: [
    MatSidenavModule,
    MatMenuModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule
  ],
  providers: [
    LoadingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
