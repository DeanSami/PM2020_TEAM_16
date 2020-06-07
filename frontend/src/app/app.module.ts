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
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
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
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminSidebarComponent } from './admin/admin-sidebar/admin-sidebar.component';
import { DogParksComponent } from './admin/dog-parks/dog-parks.component';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
} from 'ngx-perfect-scrollbar';
import { SharedModule } from './admin/shared/shared.module';
import { AuthService } from './admin/services/auth.service';
import { DogParksResolver } from './admin/resolvers/dogParksResolver.resolver';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { InterestingPointComponent } from './admin/interesting-point/interesting-point.component';
import { NewInterestingPointComponent } from './admin/interesting-point/new-interesting-point/new-interesting-point.component';
import { NewDogParkComponent } from './admin/dog-parks/new-dog-park/new-dog-park.component';
import { InterestingPointResolver } from './admin/resolvers/interestingPointResolver.resolver';
import { UserProfilePageComponent } from './user/user-profile/user-profile-page.component';
import { ContentAdminComponent } from './layouts/content-admin/content-admin.component';
import { LoginModalComponent } from './user/login-modal/login-modal.component';
import { RegisterModalComponent } from './user/register-modal/register-modal.component';
import { MyGamesComponent } from './user/my-games/my-games.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TreasureHuntFormComponent } from './user/businessOwner/treasure-hunt/treasure-hunt-form/treasure-hunt-form.component';
import { MatNativeDateModule } from '@angular/material/core';
import {UserDogParksResolver} from './user/resolvers/userDogParksResolver.resolver';
import {MatStepperModule} from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatExpansionModule} from '@angular/material/expansion';
import {GamesService} from './user/services/games.service';
import { BusinessInfoComponent } from './user/businessOwner/business-info/business-info.component';
import { TreasureHuntViewComponent } from './user/businessOwner/treasure-hunt/treasure-hunt-view.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import { BusinessViewComponent } from './user/businessOwner/business-info/business-view/business-view.component';
import { ViewDataComponent } from './user/view-data/view-data.component';
import { UserDogParksComponent } from './user/view-data/user-dog-parks/user-dog-parks.component';
import { PlacesImageModalComponent } from './admin/places-image-modal/places-image-modal.component';
import { PlaceNameFromIdPipe } from './place-name-from-id.pipe';
import { AllGamesComponent } from './user/view-data/all-games/all-games.component';
import { UserGamesResolverResolver } from './user/resolvers/userGamesResolver.resolver';
import { GameInfoModalComponent } from './user/view-data/all-games/game-info-modal/game-info-modal.component';
import { UserPlacesResolver } from './user/resolvers/userPlaces.resolver';
import { NextStepModalComponent } from './user/my-games/next-step-modal/next-step-modal.component';
import { ReportsService } from './services/reports.service';
import { ReportsComponent } from './admin/reports/reports.component';
import {NgxPrintModule} from 'ngx-print';
import { GenerateModalComponent } from './admin/reports/generate-modal/generate-modal.component';
import { BusinessesComponent } from './admin/businesses/businesses.component';
import { BusinessesResolver } from './admin/resolvers/businessesResolver.resolver';
import { AdminsResolver } from './admin/resolvers/adminsResolver.resolver';
import { StepNameFromIdPipe } from './step-name-from-id.pipe';
import { GamesComponent } from './admin/games/games.component';
import { PlayersResolver } from './admin/resolvers/playersResolver.resolver';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelPropagation: false,
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
    DogParksComponent,
    InterestingPointComponent,
    NewInterestingPointComponent,
    UserProfilePageComponent,
    ContentAdminComponent,
    LoginModalComponent,
    RegisterModalComponent,
    MyGamesComponent,
    TreasureHuntFormComponent,
    BusinessInfoComponent,
    TreasureHuntViewComponent,
    BusinessViewComponent,
    ViewDataComponent,
    UserDogParksComponent,
    PlacesImageModalComponent,
    PlaceNameFromIdPipe,
    AllGamesComponent,
    GameInfoModalComponent,
    NextStepModalComponent,
    ReportsComponent,
    GenerateModalComponent,
    BusinessesComponent,
    StepNameFromIdPipe,
    GamesComponent
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
    NgxPrintModule,
    AgmCoreModule.forRoot({
      apiKey: 'YOUR KEY',
    }),
    SharedModule,
    CommonModule,
    StoreModule.forRoot({}),
    NgbModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    PerfectScrollbarModule,
    SharedModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatStepperModule,
    MatRadioModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatPaginatorModule,
  ],
  exports: [
    MatSidenavModule,
    MatMenuModule,
    MatIconModule,
    MatMenuModule,
    MatListModule,
    MatToolbarModule,
    AppRoutingModule,
  ],
  providers: [
    AuthService,
    DogParksResolver,
    InterestingPointResolver,
    BusinessesResolver,
    ApiProviderService,
    LoadingService,
    UserDogParksResolver,
    UserPlacesResolver,
    UserGamesResolverResolver,
    GamesService,
    ReportsService,
    AdminsResolver,
    PlayersResolver
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
