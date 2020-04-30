import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BillingElement } from '../billing/billing.component';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserServiceService } from 'src/app/shared/user-service.service';
import { AppServiceService } from 'src/app/app-service.service';
import { Iuser } from 'src/app/interface/IResponse';
import { HistoryDetailsElement } from '../history-details/history-details.component';
import { routerTransition } from 'src/app/shared/router-animations';

export interface DetailsElement {
  desc: string;
  estimatedCost: number;
}

var ELEMENT_DATA: DetailsElement[] = [];

@Component({
  selector: 'app-request-services',
  templateUrl: './request-services.component.html',
  styleUrls: ['./request-services.component.scss'],
  animations: [routerTransition()]
})

export class RequestServicesComponent implements OnInit {
  @Input()
  title: string = "Service Details";
  btnDisabled: boolean = true
  leftBtn: string = "Back";
  arr: any;
  data: Iuser;
  form: FormGroup;
  i: number = 0;
  desc: string;
  position: number;
  estimatedCost: number;
  totalCost: number;


  displayedColumns: string[] = ['position', 'desc', 'estimatedCost'];
  dataSource = new MatTableDataSource<DetailsElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private router: Router, private fb: FormBuilder, private userService: UserServiceService,
    private appservice: AppServiceService) {
    this.arr = this.router.getCurrentNavigation().extras.state.rowData;
    this.totalCost = this.arr.totalCost;
    
  }


  ngOnInit() {
    this.arr.listOfServices.forEach(element => {
      element.desc;
      element.estimatedCost;
      ELEMENT_DATA.push({ desc: element.desc, estimatedCost: element.estimatedCost });
    });
    ELEMENT_DATA=[];
  }

  //method to navigate to the back page
  back() {
    this.router.navigate(['/layout/RequestDetails'], { state: { rowData: this.arr } });

    this.dataSource.paginator = this.paginator;
  }



  // method to emit the values clicked on the button
  outputemitted(x: string) {
    if (this.leftBtn === "Back" && x == "left") {
      this.back();
      return;
    }
  }

}
