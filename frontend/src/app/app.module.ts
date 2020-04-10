import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LoadingService } from './loading.service';
import { UserLayoutComponent } from './layouts/userLayout/userLayout.component';
import { AdminComponent } from './admin/admin.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiProviderService } from './services/api-provider.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { AreYouSureDialogComponent } from './are-you-sure-dialog/are-you-sure-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { UserHeaderComponent } from './layouts/userLayout/user-header/user-header.component';
import { UserFooterComponent } from './layouts/userLayout/user-footer/user-footer.component';
import { UserMainComponent } from './layouts/userLayout/user-main/user-main.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { AgmCoreModule } from '@agm/core';
import { FullAdminComponent } from './layouts/full-admin/full-admin.component';
import { LoginComponent } from './admin/login/login.component';
import { NewDogParkComponent } from './admin/new-dog-park/new-dog-park.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminSidebarComponent } from './admin/admin-sidebar/admin-sidebar.component';
import { DogParksComponent } from './admin/dog-parks/dog-parks.component';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from './admin/shared/shared.module';
import { AuthService } from './admin/services/auth.service';
import { DogParksResolver } from './admin/resolvers/dogParksResolver.resolver';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelPropagation: false
};

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    UserLayoutComponent,
    AdminComponent,
    AreYouSureDialogComponent,
    UserHeaderComponent,
    UserFooterComponent,
    UserMainComponent,
    FullAdminComponent,
    LoginComponent,
    NewDogParkComponent,
    AdminDashboardComponent,
    AdminSidebarComponent,
    DogParksComponent
  ],
  imports: [
    HttpClientModule,
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
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatSlideToggleModule,
    ToastrModule.forRoot(),
    FormsModule,
    CarouselModule,
    AgmCoreModule.forRoot({
      apiKey: 'YOUR KEY'
    }),
    SharedModule,
    CommonModule,
    StoreModule.forRoot({}),
    NgbModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    PerfectScrollbarModule,
    SharedModule,
  ],
  exports: [
    MatSidenavModule,
    MatMenuModule,
    MatIconModule,
    MatMenuModule,
    MatListModule,
    MatToolbarModule,
    AppRoutingModule
  ],
  providers: [
    AuthService,
    DogParksResolver,
    ApiProviderService,
    LoadingService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
