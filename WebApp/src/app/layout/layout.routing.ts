import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { ProfileComponent } from './profile/profile.component';
import { RequestVendorComponent } from './request-vendor/request-vendor.component';
import { AuthGuard } from '../auth-guard.service';
import { UserRequestComponent } from './user-request/user-request.component';
import { HistoryComponent } from './history/history.component';
import { RequestDetailsComponent } from './request-details/request-details.component';
import { BillingComponent } from './billing/billing.component';
import { VendorAnalyticsComponent } from './vendor-analytics/vendor-analytics.component';
import {HistoryDetailsComponent} from './history-details/history-details.component';
import { PaymentComponent } from './payment/payment.component';
import {RequestServicesComponent} from './request-services/request-services.component'


// adding all the routing for routing to the components
const routes: Routes = [
    {
      path:'',
      component:LayoutComponent,
      children:[
        {path: 'Profile', component: ProfileComponent},
        {path: 'RequestVendor', component: RequestVendorComponent,canActivate: [AuthGuard], data:{expectedRole : 'user'}},
        {path: 'UserRequest', component: UserRequestComponent,canActivate: [AuthGuard], data:{expectedRole : 'vendor'}},
        {path: 'history', component: HistoryComponent,canActivate: [AuthGuard], data:{expectedRole : 'user'}},
        {path: 'historyDetails', component: HistoryDetailsComponent,canActivate: [AuthGuard], data:{expectedRole : 'user'}},
        {path: 'pay', component: PaymentComponent,canActivate: [AuthGuard], data:{expectedRole : 'user'}},
        {path: 'RequestDetails', component:RequestDetailsComponent ,canActivate: [AuthGuard], data:{expectedRole : 'vendor'}},
        {path: 'services', component: RequestServicesComponent ,canActivate: [AuthGuard], data:{expectedRole : 'vendor'}},
        {path: 'vendorAnalytics', component: VendorAnalyticsComponent ,canActivate: [AuthGuard], data:{expectedRole : 'vendor'}},
        {path: 'bill', component:BillingComponent ,canActivate: [AuthGuard], data:{expectedRole : 'vendor'}},
        {path: '**', canActivate : [AuthGuard], data: {isRoute : "true"}}
      ],
    },
 ];

 @NgModule({
    imports: [
      RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
  })

export class LayoutRoutingModule { }