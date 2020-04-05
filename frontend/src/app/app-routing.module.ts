import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './admin/login/login.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/admin/login' },
  { path: 'main', pathMatch: 'full', component: MainComponent },
  { path: 'admin', pathMatch: 'full', redirectTo: '/admin/login' },
  { path: 'admin/login', component: LoginComponent },
  { path: 'admin/dashboard', component: AdminComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
