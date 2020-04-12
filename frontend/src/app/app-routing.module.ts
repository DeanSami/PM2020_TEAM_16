import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserLayoutComponent } from './layouts/userLayout/userLayout.component';
import { LoginComponent } from './admin/login/login.component';
import { AdminGuard } from './admin.guard';
import { DogParksResolver } from './admin/resolvers/dogParksResolver.resolver';
import { UserMainComponent } from './layouts/userLayout/user-main/user-main.component';
import { FullAdminComponent } from './layouts/full-admin/full-admin.component';
import { ADMIN_FULL_ROUTES } from './admin/shared/routes/full-layout.routes';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/main/home' },
  {
    path: 'main',
    component: UserLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: '/main/home' },
      { path: 'home', component: UserMainComponent },
    ]
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    component: FullAdminComponent,
    data: { title: 'full Views' },
    canActivate: [AdminGuard],
    children: ADMIN_FULL_ROUTES
  },
  { path: '**', redirectTo: '/main/home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    DogParksResolver
  ]
})
export class AppRoutingModule { }
