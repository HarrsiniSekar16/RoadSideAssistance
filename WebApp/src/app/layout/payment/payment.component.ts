import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceService } from 'src/app/shared/user-service.service';
import { AppServiceService } from 'src/app/app-service.service';
import { DialogPassword} from '../../shared/dialog-components/dialog.component';
import { MatDialog} from '@angular/material/dialog';
declare var paypal;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})

export class PaymentComponent implements OnInit {
  @ViewChild('paypal',{static:true}) paypalElement: ElementRef;
  title:string="Payment Portal";
  leftBtn:string="Back"
  arr: any;
  planId: any;  
  subcripId: any;  
  total:any;
  basicAuth = 'Basic AV-tdAXW3xgH638gCZDrkIMImXU1YCZqmwFzlpY1UCHpdsvnxE6ElFGFosRXoL_lJSWhHc2wwtmCdkmjEJgXQmhwMdpKu2zFHi-Dx0M5iH5sJdpzwNEB0JicpK5__UTbYys2GXOx1TLcUF1SthBkPk1cCMnCYRas';  //Pass your ClientId + scret key
  
  // to get the total amount to be paid based on the service
  product = {
     price: this.total,
     description: "service"
  };

 // this will navigate the routed value from the history page
  constructor(private router: Router,private userService: UserServiceService,
    private appservice: AppServiceService,public dialog: MatDialog) {
    this.arr = this.router.getCurrentNavigation().extras.state.rowData;
    this.total= this.arr?.totalCost;
    }

  ngOnInit(){
    const self = this;  
    this.planId = 'P-4HX036352A911342YL2PBDHI';  //Default Plan Id
     paypal
     .Buttons({  
      createSubscription: function (data, actions) {  
        return actions.subscription.create({  
          'plan_id': self.planId,  
        });  
      },  
      onApprove: function (data, actions) {  
        //  console.log(data); 
        const dialogRef = this.dialog.open(DialogPassword, {
          panelClass: 'custom-dialog-container',
          data: {
            msg: "You have successfully created subscription : " + data.subscriptionID
          }
  
        });
        
        dialogRef.afterClosed().subscribe(result => {
          //  console.log('The dialog was closed');
        }); 
  
        self.getSubcriptionDetails(data.subscriptionID);  
      },  
      onCancel: function (data) {  
        // Show a cancel page, or return to cart  
        //  console.log(data);  
      },  
      onError: function (err) {  
        // Show an error page here, when an error occurs  
        //  console.log(err);  
      }  
  
    })
     .render(this.paypalElement.nativeElement);
  }
// get the subscription details
  getSubcriptionDetails(subcriptionId) {  
    const xhttp = new XMLHttpRequest();  
    xhttp.onreadystatechange = function () {  
      if (this.readyState === 4 && this.status === 200) {  
        //  console.log(JSON.parse(this.responseText));  
        alert(JSON.stringify(this.responseText));  
      }  
    };  
    xhttp.open('GET', 'https://api.sandbox.paypal.com/v1/billing/subscriptions/' + subcriptionId, true);  
    xhttp.setRequestHeader('Authorization', this.basicAuth);  
  
    xhttp.send();  
  }
  // back to the service history page
  back(){
      this.router.navigate(['/layout/history']);
  }
  // to emit the functions of the button clicked
  outputemitted(x: string) {
    if (this.leftBtn === "Back" && x == "left") {
      this.back();
      return;
    }

}
}
