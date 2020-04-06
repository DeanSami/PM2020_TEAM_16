import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './admin/login/login.component';
import {NewDogParkComponent} from './admin/new-dog-park/new-dog-park.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminGuard } from './admin.guard';
import { DogParksComponent } from './admin/dog-parks/dog-parks.component';
import { DogParksResolver } from './admin/resolvers/dogParksResolver.resolver';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/main' },
  { path: 'main', pathMatch: 'full', component: MainComponent },
  // { path: 'admin', pathMatch: 'full', redirectTo: '/admin/login' },
  { path: 'login', component: LoginComponent },
  { path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: '/admin/dashboard' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'dogParks', component: DogParksComponent, resolve: { dogParks: DogParksResolver } },
    ]
  },
  { path: '**', redirectTo: '/main'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    DogParksResolver
  ]
})
export class AppRoutingModule { }
