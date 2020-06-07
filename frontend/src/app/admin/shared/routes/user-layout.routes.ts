import { Routes } from '@angular/router';
import { UserMainComponent } from '../../../layouts/userLayout/user-main/user-main.component';
import { UserProfilePageComponent } from '../../../user/user-profile/user-profile-page.component';
import { MyGamesComponent } from '../../../user/my-games/my-games.component';
import { UserGuard } from '../../../user.guard';
import { ViewDataComponent } from '../../../user/view-data/view-data.component';
import { UserDogParksResolver } from '../../../user/resolvers/userDogParksResolver.resolver';
import { UserGamesResolverResolver } from '../../../user/resolvers/userGamesResolver.resolver';
import { AllGamesComponent } from '../../../user/view-data/all-games/all-games.component';
import { TreasureHuntViewComponent } from '../../../user/businessOwner/treasure-hunt/treasure-hunt-view.component';
import { UserPlacesResolver } from '../../../user/resolvers/userPlaces.resolver';

export const USER_FULL_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: 'home', component: UserMainComponent },
  { path: 'profile', component: UserProfilePageComponent, canActivate: [UserGuard], resolve: { places: UserPlacesResolver, games: UserGamesResolverResolver } },
  // TODO reset canActivate at 'myGames' path
  { path: 'myGames', component: MyGamesComponent },
  {
    path: 'viewData',
    component: ViewDataComponent,
    resolve: {
      dogParks: UserDogParksResolver
    }
  },
  {
    path: 'games',
    component: AllGamesComponent,
    resolve: {
      games: UserGamesResolverResolver,
      places: UserPlacesResolver
    }
  },
  // {
  //   path: 'newTH',
  //   component: TreasureHuntFormComponent,
  //   resolve: { dogParks: UserDogParksResolver },
  //   canActivate: [UserGuard]
  // },
];
