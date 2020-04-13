import { Routes, RouterModule } from '@angular/router';
import { AdminDashboardComponent } from '../../admin-dashboard/admin-dashboard.component';
import { DogParksComponent } from '../../dog-parks/dog-parks.component';
import { DogParksResolver } from '../../resolvers/dogParksResolver.resolver';
import { InterestingPointComponent } from '../../interesting-point/interesting-point.component';
import { InterestingPointResolver } from '../../resolvers/interestingPointResolver.resolver';

export const ADMIN_FULL_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/admin/dashboard' },
  { path: 'dashboard', component: AdminDashboardComponent },
  { path: 'dogParks', component: DogParksComponent, resolve: { dogParks: DogParksResolver } },
  { path: 'interestingPoint', component: InterestingPointComponent, resolve: { interestingPoint: InterestingPointResolver } },
];
