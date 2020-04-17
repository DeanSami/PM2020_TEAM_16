import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserLayoutComponent } from './layouts/userLayout/userLayout.component';
import { LoginComponent } from './admin/login/login.component';
import { AdminGuard } from './admin.guard';
import { DogParksResolver } from './admin/resolvers/dogParksResolver.resolver';
import { FullAdminComponent } from './layouts/full-admin/full-admin.component';
import { ADMIN_FULL_ROUTES } from './admin/shared/routes/full-layout.routes';
import { InterestingPointResolver } from './admin/resolvers/interestingPointResolver.resolver';
import { USER_FULL_ROUTES } from './admin/shared/routes/user-layout.routes';


const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: USER_FULL_ROUTES
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    component: FullAdminComponent,
    data: { title: 'full Views' },
    canActivate: [AdminGuard],
    children: ADMIN_FULL_ROUTES
  },
  { path: '**', redirectTo: '/home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    DogParksResolver,
    InterestingPointResolver,
  ]
})
export class AppRoutingModule { }
