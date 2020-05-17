import { Routes } from '@angular/router';
import { UserMainComponent } from '../../../layouts/userLayout/user-main/user-main.component';
import { UserProfilePageComponent } from '../../../user/user-profile/user-profile-page.component';
import { MyGamesComponent } from '../../../user/my-games/my-games.component';
import { UserGuard } from '../../../user.guard';
import { ViewDataComponent } from '../../../user/view-data/view-data.component';
import { UserDogParksResolver } from '../../../user/resolvers/userDogParksResolver.resolver';

export const USER_FULL_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: 'home', component: UserMainComponent },
  { path: 'profile', component: UserProfilePageComponent, canActivate: [UserGuard] },
  // TODO reset canActivate at 'myGames' path
  { path: 'myGames', component: MyGamesComponent },
  {
    path: 'viewData',
    component: ViewDataComponent,
    resolve: {
      dogParks: UserDogParksResolver
    }
  },
  // {
  //   path: 'newTH',
  //   component: TreasureHuntFormComponent,
  //   resolve: { dogParks: UserDogParksResolver },
  //   canActivate: [UserGuard]
  // },
];
