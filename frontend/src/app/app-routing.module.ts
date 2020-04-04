import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { AdminComponent } from './admin/admin.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', component: MainComponent },
  { path: 'admin', pathMatch: 'full', component: AdminComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
