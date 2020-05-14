import { Routes } from '@angular/router';
import { UserMainComponent } from '../../../layouts/userLayout/user-main/user-main.component';
import { UserProfilePageComponent } from '../../../user/user-profile/user-profile-page.component';
import { MyGamesComponent } from '../../../user/my-games/my-games.component';
import { TreasureHuntFormComponent } from 'src/app/user/businessOwner/treasure-hunt/treasure-hunt-form/treasure-hunt-form.component';
import { UserDogParksResolver } from '../../../user/resolvers/userDogParksResolver.resolver';
import { UserGuard } from '../../../user.guard';
import {
  BusinessInfoComponent,
} from "../../../user/businessOwner/business-info/business-info.component";

export const USER_FULL_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: 'home', component: UserMainComponent },
  { path: 'profile', component: UserProfilePageComponent, canActivate: [UserGuard] },
  // TODO reset canActivate at 'myGames' path
  { path: 'myGames', component: MyGamesComponent },
  // {
  //   path: 'newTH',
  //   component: TreasureHuntFormComponent,
  //   resolve: { dogParks: UserDogParksResolver },
  //   canActivate: [UserGuard]
  // },
];
