import { Component, OnInit, ViewChild, EventEmitter, Input } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import { Router, NavigationExtras } from '@angular/router';
import { routerTransition } from 'src/app/shared/router-animations';
import { billingData } from '../../helpers/billingData';
import {MatPaginator} from '@angular/material/paginator';
import { AppServiceService } from 'src/app/app-service.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatCheckboxChange} from '@angular/material/checkbox';
import { IUserRequest } from 'src/app/interface/IResponse';
import { MatDialog} from '@angular/material/dialog';
import { DialogPassword} from '../../shared/dialog-components/dialog.component';


//Bill Interface
export interface BillingElement {
  desc: string;
  position: number;
  estimatedCost: number;
}

const ELEMENT_DATA: BillingElement[] = [];
let FINAL_BILL: BillingElement[] = [];


@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
  animations: [routerTransition()]
})

export class BillingComponent implements OnInit {

  @Input()
  title: string = "Billing Service";
  leftBtn: string = "Back";
  arr: any;
  i: number = 0;
  rightBtn: string = "Send Invoice";
  btnDisabled : boolean = true;

  displayedColumns: string[] = ['position', 'desc', 'estimatedCost','select'];
  footerColumns: string[] = ['desc', 'estimatedCost'];
  dataSource = new MatTableDataSource<BillingElement>(ELEMENT_DATA);
  finalBill = new MatTableDataSource<BillingElement>(FINAL_BILL);
  selection = new SelectionModel<BillingElement>(true, []);
  
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  

  constructor(private router: Router, private appService: AppServiceService,public dialog: MatDialog) { 
  this.arr = this.router.getCurrentNavigation().extras.state.rowData;
  }

  ngOnInit(): void {
    billingData.data.forEach(e => {
      ELEMENT_DATA.push({position: ++this.i, desc: e.desc, estimatedCost: e.repair.total_cost});
    })
    // console.log(this.dataSource);
    // console.log(this.getTotalCost());
    this.dataSource.paginator = this.paginator;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(x:String) {
    this.isAllSelected() ? this.selection.clear():this.dataSource.data.forEach(row => this.selection.select(row));
  }

  //Selects bill based on Checkbox selected
  isSomeSelected(x:MatCheckboxChange,row?: BillingElement) {
    
    this.selection.toggle(row)
    if(x.checked===true){
      FINAL_BILL.push(row);
    }
    if(x.checked==false){
      FINAL_BILL.splice(FINAL_BILL.findIndex(v => v.position === row.position), 1);
    }

    if(Number(this.getTotalCost())!=0){
       this.btnDisabled = false;
    }
    else{
      this.btnDisabled = true;
    }

  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: BillingElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  /** Gets the total bill of everything transactions. */
  getTotalCost() {
    return this.finalBill.filteredData.map(t => t.estimatedCost).reduce((acc, value) => acc + value, 0);
  }


  //Button function to get back
  back() {
    FINAL_BILL = [];
    this.router.navigate(['/layout/RequestDetails'], { state: { rowData:this.arr }});
  }

  //Checkout Function For Invoice Generation
  checkout() {
     // console.log("List Of Services");
     let i =0;
     debugger
     let listOfServices = [];
      this.finalBill.filteredData.forEach(e => {
        listOfServices.push(e.desc);
      });
      // console.log("Total Cost : " + this.getTotalCost());
      // console.log("User Details Info : ");
      let totalCost = this.getTotalCost().toString();
      let body = {
        "listOfServices": this.finalBill.filteredData,
        "totalCost": totalCost,
        "state" : "Payment Pending"
      }
      // console.log(typeof(totalCost));
      let ar = [];
      ar.push(this.arr.id);
      this.appService.put<IUserRequest>('US-VEN', body, ar).subscribe((res => {
        const dialogRef = this.dialog.open(DialogPassword, {
          panelClass: 'custom-dialog-container',
          data: {
            msg: "Request Sent"
          }
  
        });
        
        dialogRef.afterClosed().subscribe(result => {
          //  console.log('The dialog was closed');
        }); 
      }))
      this.router.navigate(['/layout']);
  }


  //Event Emitter
  outputemitted(x: string) {
    if (this.leftBtn == "Back" && x == "left") {
      this.back();
      return;
    }

    if (this.rightBtn == "Send Invoice" && x == "right") {
      this.checkout();
      return;
    }
  }
}
