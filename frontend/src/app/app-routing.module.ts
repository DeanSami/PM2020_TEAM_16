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
import { ContentAdminComponent } from './layouts/content-admin/content-admin.component';
import { ADMIN_CONTENT_ROUTES } from './admin/shared/routes/content-layout.routes';
import { UserGuard } from './user.guard';


const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    canActivate: [UserGuard],
    children: USER_FULL_ROUTES
  },
  {
    path: 'admin',
    component: FullAdminComponent,
    data: { title: 'full Views' },
    canActivate: [AdminGuard],
    children: ADMIN_FULL_ROUTES
  },
  {
    path: 'admin',
    component: ContentAdminComponent,
    data: { title: 'full Views' },
    children: ADMIN_CONTENT_ROUTES
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
