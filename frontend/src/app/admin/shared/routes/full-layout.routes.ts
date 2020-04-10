import { Routes, RouterModule } from '@angular/router';
import { AdminDashboardComponent } from '../../admin-dashboard/admin-dashboard.component';
import { DogParksComponent } from '../../dog-parks/dog-parks.component';
import { DogParksResolver } from '../../resolvers/dogParksResolver.resolver';

export const ADMIN_FULL_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/admin/dashboard' },
  { path: 'dashboard', component: AdminDashboardComponent },
  { path: 'dogParks', component: DogParksComponent, resolve: { dogParks: DogParksResolver } },
];
