import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateLoadComponent } from './load/create-load/create-load.component';
import { LoadListComponent } from './load/load-list/load-list.component';
import { UpdateLoadStatusComponent } from './load/update-load-status/update-load-status.component';
import { EditLoadComponent } from './load/edit-load/edit-load.component';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { CustomerCreateComponent } from './customer/customer-create/customer-create.component';
import { CustomerEditComponent } from './customer/customer-edit/customer-edit.component';
import { CarrierListComponent } from './carrier/carrier-list/carrier-list.component';
import { CarrierCreateComponent } from './carrier/carrier-create/carrier-create.component';
import { CarrierEditComponent } from './carrier/carrier-edit/carrier-edit.component';
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
  path: 'loads/edit/:id',
  component: EditLoadComponent,
  canActivate: [AuthGuard]
},
{
  path: 'loads/update-status',
  component: UpdateLoadStatusComponent
},
{
  path: 'customers',
  component: CustomerListComponent,
  canActivate: [AuthGuard]
},
{
  path: 'customers/create',
  component: CustomerCreateComponent,
  canActivate: [AuthGuard]
},
{
  path: 'customers/edit/:id',
  component: CustomerEditComponent,
  canActivate: [AuthGuard]
},
{
  path: 'carriers',
  component: CarrierListComponent,
  canActivate: [AuthGuard]
},
{
  path: 'carriers/create',
  component: CarrierCreateComponent,
  canActivate: [AuthGuard]
},
{
  path: 'carriers/edit/:id',
  component: CarrierEditComponent,
  canActivate: [AuthGuard]
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
