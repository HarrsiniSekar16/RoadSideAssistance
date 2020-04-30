import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserServiceService } from 'src/app/shared/user-service.service';
import { AppServiceService } from 'src/app/app-service.service';
import { Iuser, IUserRequest } from 'src/app/interface/IResponse';
import { google } from 'google-maps';
import { Observable, Subscriber, Subject } from 'rxjs';
import { routerTransition } from 'src/app/shared/router-animations';
import { NgxImageGalleryComponent, GALLERY_IMAGE, GALLERY_CONF } from "ngx-image-gallery";
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { BillingElement } from '../billing/billing.component';
import { billingData } from 'src/app/helpers/billingData';
import { MatPaginator } from '@angular/material/paginator';

export interface HistoryDetailsElement {
  desc: string;
  estimatedCost: number;
}

var ELEMENT_DATA: HistoryDetailsElement[] = [];



@Component({
  selector: 'app-history-details',
  templateUrl: './history-details.component.html',
  styleUrls: ['./history-details.component.scss'],
  animations: [routerTransition()]
})

export class HistoryDetailsComponent implements OnInit {
  @Input()
  title: string = "Request Details";
  btnDisabled: boolean = true
  rightBtn: string;
  leftBtn: string = "Back";
  arr: any;
  data: Iuser;
  form: FormGroup;
  lat: any;
  long: any;
  switch: boolean = false;
  address: any;
  i: number = 0;
  expan: boolean = false;
  image: [];
  imag: any;
  desc: string;
  position: number;
  estimatedCost: number;
  totalCost: number;
  state: String;



  //icon: string = 'https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|4286f4';


  displayedColumns: string[] = ['position', 'desc', 'estimatedCost'];

  //data source for table
  dataSource = new MatTableDataSource<HistoryDetailsElement>(ELEMENT_DATA);
  


  constructor(private router: Router, private fb: FormBuilder, private userService: UserServiceService,
    private appservice: AppServiceService) {
    //getting the array from the previous page
    this.arr = this.router.getCurrentNavigation().extras.state.rowData;
    let body = [];
    body.push(this.arr.vendor_id);
    this.appservice.get<Iuser>('US-AU', body).subscribe((res => {
      this.data = res;
      console.log(this.data);
      //form group
      this.form = this.fb.group({
        userid: [this.arr.user_id],
        register_no: [this.arr.register_no],
        message: [this.arr.message],
        description: [this.arr.description],
        companyName: [this.data.companyName]
      });

    }));

    this.state = this.arr.state;
    this.totalCost = this.arr.totalCost;



    console.log(this.arr);
  }


  ngOnInit() {

    //right button state
    this.rightBtn = "Pay";
    if (this.arr.state == "Payment Pending") {
      this.btnDisabled = false;
    } else {
      this.btnDisabled = true;
    }
    
    //load the data source from the array into the table
    if (this.arr.listOfServices.length > 0) {
      this.arr.listOfServices.forEach(element => {
        element.desc;
        element.estimatedCost;
        ELEMENT_DATA.push({ desc: element.desc, estimatedCost: element.estimatedCost });
      });

    }
    console.log(ELEMENT_DATA,this.dataSource)

  }

  /** Gets the total bill of everything transactions. */


  back() {
    this.router.navigate(['/layout/history']);
    ELEMENT_DATA=[];
  }



  outputemitted(x: string) {

    if (this.rightBtn == "Pay" && x == "right") {
      this.pay(this.arr.totalCost);

      //sending the state as paid once the payment is complete
      this.state = "Paid";
      let body = {
        state: this.state
      }
      let ar = [];
      ar.push(this.arr.id);
      this.appservice.put<IUserRequest>('US-VEN', body, ar).subscribe((res => {

      }))

    }
    if (this.leftBtn == "Back" && x == "left") {
      this.back();
      return;
    }
  }

  //sending the total cost to the next paypal payment page
  pay = (totalCost: any) => {
    const navigationExtras: NavigationExtras = { state: { rowData: totalCost } };
    this.router.navigate(['/layout/pay'], navigationExtras);
  }


}
