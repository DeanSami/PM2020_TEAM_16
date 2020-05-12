import { Routes } from '@angular/router';
import { UserMainComponent } from '../../../layouts/userLayout/user-main/user-main.component';
import { UserProfilePageComponent } from '../../../user/user-profile/user-profile-page.component';
import { MyGamesComponent } from '../../../user/my-games/my-games.component';
import { NewTreasureHuntComponent } from 'src/app/user/businessOwner/new-treasure-hunt/new-treasure-hunt.component';
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
  {
    path: 'newTH',
    component: NewTreasureHuntComponent,
    resolve: { dogParks: UserDogParksResolver },
    canActivate: [UserGuard]
  },
  {
    path: 'BusinessInfo',
    component: BusinessInfoComponent,
    canActivate: [UserGuard]
  },
];
