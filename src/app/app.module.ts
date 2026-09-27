import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { FormsModule } from '@angular/forms';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth.interceptor';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateLoadComponent } from './load/create-load/create-load.component';
import { LoadListComponent } from './load/load-list/load-list.component';
import { SideBarComponent } from './common/side-bar/side-bar.component';
import { UpdateLoadStatusComponent } from './load/update-load-status/update-load-status.component';
import { EditLoadComponent } from './load/edit-load/edit-load.component';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { CustomerCreateComponent } from './customer/customer-create/customer-create.component';
import { CustomerEditComponent } from './customer/customer-edit/customer-edit.component';
import { CarrierListComponent } from './carrier/carrier-list/carrier-list.component';
import { CarrierCreateComponent } from './carrier/carrier-create/carrier-create.component';
import { CarrierEditComponent } from './carrier/carrier-edit/carrier-edit.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    CreateLoadComponent,
    LoadListComponent,
    SideBarComponent,
    UpdateLoadStatusComponent,
    EditLoadComponent,
    CustomerListComponent,
    CustomerCreateComponent,
    CustomerEditComponent,
    CarrierListComponent,
    CarrierCreateComponent,
    CarrierEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
      {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
