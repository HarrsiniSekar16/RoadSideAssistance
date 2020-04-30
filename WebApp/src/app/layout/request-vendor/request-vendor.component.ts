import { Component, OnInit } from '@angular/core';
import { AppServiceService } from 'src/app/app-service.service';
import { FormGroup, FormControl } from '@angular/forms';
import {routerTransition} from '../../shared/router-animations'
import { UserServiceService } from 'src/app/shared/user-service.service';
import { Iuser, IResponse } from 'src/app/interface/IResponse';
import { Router } from '@angular/router';
import { MatDialog} from '@angular/material/dialog';
import { DialogPassword} from '../../shared/dialog-components/dialog.component';

// https://vingenerator.org/
// https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/5XYKT3A17BG157871?format=json
@Component({
  selector: 'app-request-vendor',
  templateUrl: './request-vendor.component.html',
  styleUrls: ['./request-vendor.component.scss'],
  animations: [routerTransition()]
})
export class RequestVendorComponent implements OnInit {
  title : string = "Request Mechanic"
  btndisabled : boolean = true;
  vinData : any[];
  switch : boolean = false;
  rightBtn : string = "Find Mechanic";
  leftBtn : string = "";
  user : Iuser;
  lat : "";
  long : "";
  vendorId : any;
  duration : any;
  constructor(private _routes: Router, private appService: AppServiceService, private userService: UserServiceService, public dialog: MatDialog) {
    this.user = this.userService.getUser();
   }
  switcher : any;
  uploads: boolean = false;
  
  fileUpload = [];
  requestForm = new FormGroup({
    vehicleNumber: new FormControl(''),
    vehicleRegNumber: new FormControl(''),
    description : new FormControl(''),
    message : new FormControl(''),
  });

  ngOnInit(): void {   
  }

  checkInput(){
    let vin = this.requestForm?.get('vehicleNumber')?.value;
    if(vin?.length == 17 && this.requestForm.get('vehicleRegNumber').value != '' && this.requestForm.get('description').value != ''){
      this.appService.getExternal("https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/" + vin +"?format=json").subscribe(
         x=>{
          this.vinData = x.Results.filter(y=> {
            if((y.Variable == "Make" ||y.Variable == "Manufacturer Name"|| y.Variable == "Model"  ||y.Variable == "Engine Model") && y.Value != null) {
              return y;
            }
          })
          if(this.vinData.length > 1 ){
            //  console.log(this.requestForm.get('vehicleRegNumber').value);
            this.btndisabled = false;
          }
         }          
      );
    }else{
      this.btndisabled = true;
    }
  }
  findMechanic(){
    this.switch = true;
    this.rightBtn = "Submit Request";
    this.leftBtn = "Back";
  }
  back(){
    this.switch = false;
    this.leftBtn ="";
    this.rightBtn = "Find Mechanic";
  }
  outputemit(x : any){
    // console.log(x);
   this.lat = x.lat;
   this.long = x.long;
   this.vendorId = x.vendorId;
   this.duration = x.duration;
  }
  outputemitted(x: string){
    if(this.rightBtn == "Submit Request" && x == "right"){
      this.submit();
    }
    if(this.rightBtn == "Find Mechanic" && x == "right"){
      this.findMechanic();
    }
    if(this.leftBtn == "Back" && x == "left"){
      this.back();
    }    
  }
  submit(){
    let body = {
      "user_id" :  this.user.id,
      "message" : this.requestForm.get('message')?.value,
      "description": this.requestForm.get('description')?.value,
      "vin" : this.requestForm.get('vehicleNumber')?.value,
      "register_no" : this.requestForm.get("vehicleRegNumber")?.value,
      "image": this.fileUpload,
      "latitude": this.lat,
      "longitude":this.long,
      "vendor_id": this.vendorId,
      "state": "Open",
      "duration" : this.duration
    }
    this.appService.post('US-VEN',body).subscribe((res: any[]) => {
      const dialogRef = this.dialog.open(DialogPassword, {
        panelClass: 'custom-dialog-container',
        data: {
          msg: "Mechanic Request Submitted."
        }

      });
      
      dialogRef.afterClosed().subscribe(result => {
        //  console.log('The dialog was closed');
        this._routes.navigate(['/layout/history']);
      }); 
    });
    
   
  }
  onUploadClicked(x){
   for(let i = 0; i < x.length; i++){
    if(x[i].type == "image/png" || x[i].type == "image/jpg" || x[i].type == "image/jpeg"  ){
      let reader = new FileReader();
      reader.readAsDataURL(x[i]);
      reader.onload= () =>{
       let u = reader.result as string;
       this.fileUpload.push(u);
      }
    }else{
      this.uploads = true;
    }
   }
  }
}
