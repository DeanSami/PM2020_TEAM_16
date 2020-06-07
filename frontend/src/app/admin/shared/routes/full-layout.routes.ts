import { Routes } from '@angular/router';
import { AdminDashboardComponent } from '../../admin-dashboard/admin-dashboard.component';
import { DogParksComponent } from '../../dog-parks/dog-parks.component';
import { DogParksResolver } from '../../resolvers/dogParksResolver.resolver';
import { InterestingPointComponent } from '../../interesting-point/interesting-point.component';
import { InterestingPointResolver } from '../../resolvers/interestingPointResolver.resolver';
import { UserGamesResolverResolver } from '../../../user/resolvers/userGamesResolver.resolver';
import { UserPlacesResolver } from '../../../user/resolvers/userPlaces.resolver';
import { ReportsComponent } from '../../reports/reports.component';
import { BusinessesComponent } from '../../businesses/businesses.component';
import { BusinessesResolver } from '../../resolvers/businessesResolver.resolver';
import { AdminsResolver } from '../../resolvers/adminsResolver.resolver';
import { GamesComponent } from '../../games/games.component';
import { PlayersResolver } from '../../resolvers/playersResolver.resolver';

export const ADMIN_FULL_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/admin/dashboard' },
  { path: 'dashboard', component: AdminDashboardComponent },
  { path: 'dogParks', component: DogParksComponent, resolve: { dogParks: DogParksResolver } },
  { path: 'interestingPoint', component: InterestingPointComponent, resolve: { interestingPoint: InterestingPointResolver } },
  { path: 'businesses', component: BusinessesComponent, resolve: {businesses: BusinessesResolver} },
  { path: 'games', component: GamesComponent, resolve: {games: UserGamesResolverResolver} },
  {
    path: 'reports',
    component: ReportsComponent,
    resolve:
    {
      games: UserGamesResolverResolver,
      places: UserPlacesResolver,
      admins: AdminsResolver,
      // users: PlayersResolver
    }
  },
];
