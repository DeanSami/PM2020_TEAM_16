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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './admin/services/auth.service';
import { ApiProviderService } from './services/api-provider.service';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NewDogParkComponent } from './admin/new-dog-park/new-dog-park.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { AdminSidebarComponent } from './admin/admin-sidebar/admin-sidebar.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DogParksComponent } from './dog-parks/dog-parks.component';
import { MatTableModule } from '@angular/material/table';
import { DogParksResolver } from './admin/resolvers/dogParksResolver.resolver';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    AdminComponent,
    SidebarComponent,
    LoginComponent,
    NewDogParkComponent,
    AdminDashboardComponent,
    AdminSidebarComponent,
    DogParksComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
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
    MatTableModule,
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatSlideToggleModule,
    ToastrModule.forRoot(),
  ],
  exports: [
    MatSidenavModule,
    MatMenuModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule
  ],
  providers: [
    AuthService,
    ApiProviderService,
    LoadingService,
    DogParksResolver
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
