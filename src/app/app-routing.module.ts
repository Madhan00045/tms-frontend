import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateLoadComponent } from './load/create-load/create-load.component';
import { LoadListComponent } from './load/load-list/load-list.component';
import { UpdateLoadStatusComponent } from './load/update-load-status/update-load-status.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
    {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
  path: 'loads/create',
  component: CreateLoadComponent,
  canActivate: [AuthGuard]
  },
  {
  path: 'loads',
  component: LoadListComponent,
  canActivate: [AuthGuard]
},
{
  path: 'loads/update-status',
  component: UpdateLoadStatusComponent
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
