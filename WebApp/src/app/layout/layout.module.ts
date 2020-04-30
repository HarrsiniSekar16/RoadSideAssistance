import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MaterialModule } from '../shared/material-module';
import { LayoutRoutingModule } from './layout.routing';
import { ProfileComponent } from './profile/profile.component';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppServiceService, APIInterceptorService } from '../app-service.service';
import {AgmCoreModule} from '@agm/core';

import { RequestVendorComponent } from './request-vendor/request-vendor.component'
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FindVendorComponent } from './find-vendor/find-vendor.component';
import { NavbarComponent } from './navbar/navbar.component';
import { UserRequestComponent } from './user-request/user-request.component';
import { HistoryComponent } from './history/history.component';
import {HistoryDetailsComponent} from './history-details/history-details.component';
import { RequestDetailsComponent } from './request-details/request-details.component';
import { BillingComponent } from './billing/billing.component';
import { VendorAnalyticsComponent } from './vendor-analytics/vendor-analytics.component';
import { ChartModule } from 'angular-highcharts';
import { PaymentComponent } from './payment/payment.component';
import { RequestServicesComponent } from './request-services/request-services.component';

// importing all the required modules for the application

@NgModule({

  declarations: [LayoutComponent, PaymentComponent,ProfileComponent, RequestVendorComponent, FindVendorComponent, NavbarComponent, UserRequestComponent, RequestDetailsComponent, HistoryComponent, HistoryDetailsComponent, BillingComponent, VendorAnalyticsComponent, RequestServicesComponent],

  imports: [
    CommonModule, MaterialModule,LayoutRoutingModule,ReactiveFormsModule,
    FlexLayoutModule.withConfig({useColumnBasisZero: false}), HttpClientModule,FormsModule,ChartModule,
    AgmCoreModule.forRoot({
      apiKey : 'AIzaSyCNH7ZuXjNdXqZFzlpOB0snpBZjoUC5jRo'
    })
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: APIInterceptorService, multi: true },
    ,AppServiceService]
})
export class LayoutModule { }
