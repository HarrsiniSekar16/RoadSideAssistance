import { Component, OnInit, AfterViewInit, Inject, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validator, AbstractControl, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { isBuffer } from 'util';
import { FitBoundsAccessor } from '@agm/core';
import { AppServiceService } from '../../app-service.service';
import { Iuser } from 'src/app/interface/IResponse';
import { UserServiceService } from 'src/app/shared/user-service.service';
import { MustMatch } from '../../helpers/must-match.validator';
import { EncryptServiceService } from 'src/app/encrypt-service.service';
import { userResponse } from 'src/app/interface/IResponse';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { routerTransition } from '../../shared/router-animations';
import { google } from 'google-maps';
import { Observable, Subscriber, Subject } from 'rxjs';
import { MatDialog} from '@angular/material/dialog';
import { DialogPassword} from '../../shared/dialog-components/dialog.component';
declare var google: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [routerTransition()]
})
export class ProfileComponent implements OnInit {

  btnDisabled: boolean = true;
  url = '';
  userImage: '';
  title: string = "Update Profile";
  switch: boolean = false;
  rightBtn: string = "Update";
  leftBtn: string = "";
  updateForm: FormGroup;
  user: Iuser;

//google map import
  address: any;
  lat: any;
  long: any;
  icon: string = 'https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|4286f4';


  constructor(private fb: FormBuilder,
    private userService: UserServiceService,
    private appservice: AppServiceService,
    private EncrDecr: EncryptServiceService,
    private appService: AppServiceService,
    public dialog: MatDialog) {

    this.user = this.userService.getUser();
    this.updateForm = this.fb.group({
      firstName: [this.user.userFirstName, [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      lastName: [this.user.userLastName, [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      email: [this.user.userEmail],
      mobile: [this.user.userMobileNumber, [Validators.minLength(10), Validators.maxLength(10)]],
      gender: [this.user.userGender],
      password: [this.user.userPassword],
      newPassword: ['', [Validators.minLength(6)]],
      confirmPassword: ['', [Validators.minLength(6)]],
      userImage: ['']
    }, {
      validator: MustMatch('newPassword', 'confirmPassword')
    });

 

  }

  public selectedFile: any;
  public blobUrl;


  ngOnInit(): void {

    //this.blobUrl = window.URL.createObjectURL(this.userImage);

    //User will not have to add address while Vendor needs to add address
    if (this.userService.getUser().userType === "vendor") {
      this.rightBtn = "Add Address";
      this.btnDisabled = false;
    }

    //extracting image in blob format from the db
    this.blobUrl = this.user.userImage;

  }



  get rf() { 
    return this.updateForm.controls; 
  }

  //Function to import photo from the local system on click of the profile picture
  onSelectFile(event) {
    // this.selectedFile= event.target.files[0];
    this.btnDisabled = false;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.blobUrl = reader.result as string;
        //   console.log(window.URL)
        // let bloburl = window.URL.createObjectURL(this.url);
        // console.log(bloburl);     
      }
    }
  }

  onClick(event) {
    this.btnDisabled = false;
  }

  public delete() {
    this.blobUrl = null;
  }

  //If the user has an address updated earlier, address form field will display the same, while a new vendor needs to add a new address if he/she has not
  addAddress() {
    this.switch = true;
    this.rightBtn = "Submit";
    this.leftBtn = "Back";
    if (this.userService.getUser().vendorLatitude == null && this.userService.getUser().vendorLongitude == null) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.showPosition(position);
      });
    } else {
      this.lat = parseFloat(this.user.vendorLatitude);
      this.long = parseFloat(this.user.vendorLongitude);
      this.appService.getExternal("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + this.lat + "," + this.long + "&key=AIzaSyCNH7ZuXjNdXqZFzlpOB0snpBZjoUC5jRo").subscribe(
        x => {
          x.results.slice(0, 1).forEach(y => this.address = y);
          this.address = this.address.formatted_address;
        }
      );
    }

  }

  back() {
    this.switch = false;
    this.leftBtn = "";
    this.rightBtn = "Add Address";
  }

  //importing the details entered in the update form and storing it to the db
  updateUser() {
    let body = {
      userFirstName: this.updateForm.get('firstName').value,
      userLastName: this.updateForm.get('lastName').value,
      userGender: this.updateForm.get('gender').value,
      userMobileNumber: this.updateForm.get('mobile').value,
      userPassword: this.updateForm.get('newPassword').value ? this.EncrDecr.set('123456$#@$^@1ERF', this.updateForm.get('newPassword').value) : this.userService.getUser().userPassword,
      userImage: this.blobUrl,
      vendorLatitude: this.lat,
      vendorLongitude: this.long
    };

    if (this.updateForm.valid) {
      let arr = [];
      arr.push(this.user.id);
      this.appservice.put<Iuser>('US-AU', body, arr).subscribe(y => {
        this.userService.reloadUser(y);
        console.log(body)

      });
      const dialogRef = this.dialog.open(DialogPassword, {
        panelClass: 'custom-dialog-container',
        data: {
          msg: "Details have been updated successfully."
        }

      });
      
      dialogRef.afterClosed().subscribe(result => {
        //  console.log('The dialog was closed');
      }); 
      this.btnDisabled = true;
    }
  }



  //Error handling messages

  getUpdateErrorMessage(x: any) {
    switch (x) {
      case "firstName":
        if (this.updateForm.get('firstName').hasError('required')) {
          return 'You must enter a value';
        }
        else if (this.updateForm.get('firstName').hasError('minLength')) {
          return this.updateForm.get('firstName').hasError('minLength') ? 'First Name should be atleast of 3 characters' : '';
        }
        else if (this.updateForm.get('firstName').hasError('maxLength')) {
          return this.updateForm.get('firstName').hasError('maxLength') ? 'First Name can be only to a max of 30 characters' : '';
        }
      case "lastName":
        if (this.updateForm.get('lastName').hasError('required')) {
          return 'You must enter a value';
        }
        else if (this.updateForm.get('lastName').hasError('minLength')) {
          return this.updateForm.get('lastName').hasError('minLength') ? 'Last Name should be atleast of 3 characters' : '';
        }
        else if (this.updateForm.get('lastName').hasError('maxLength')) {
          return this.updateForm.get('lastName').hasError('maxLength') ? 'Last Name can be only to a max of 30 characters' : '';
        }
      case "mobileNumber":
        if (this.updateForm.get('mobile').hasError('minLength')) {
          return this.updateForm.get('mobile').hasError('minLength') ? 'Please enter a valid mobile number' : '';
        }
      case "newPassword":
        if (this.updateForm.get('newPassword').hasError('minlength')) {
          return this.updateForm.get('newPassword').hasError('minlength') ? 'Password short (6 or more characters)' : '';
        }
      case "confirmPassword":
        if (this.updateForm.get('confirmPassword').hasError('mustMatch')) {
          return this.updateForm.get('confirmPassword').hasError('mustMatch') ? 'Passwords don\'t match' : '';
        }

    }
  }

  //Right Button and Left Button output

  outputemitted(x: string) {
    if (this.rightBtn == "Submit" && x == "right") {
      this.updateUser();
    }
    if (this.rightBtn == "Update" && x == "right") {
      this.updateUser();
    }
    if (this.rightBtn == "Add Address" && x == "right") {
      this.addAddress();
    }
    if (this.leftBtn == "Back" && x == "left") {
      this.back();
    }

  }

  emit() {
    this.switcher.emit();
  }

  //Current location import latitude and longitude
  @Output() switcher = new EventEmitter<string>();
  showPosition(position) {

    this.lat = position.coords.latitude;
    this.long = position.coords.longitude;
    this.appService.getExternal("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + this.lat + "," + this.long + "&key=AIzaSyCNH7ZuXjNdXqZFzlpOB0snpBZjoUC5jRo").subscribe(
      x => {
        x.results.slice(0, 1).forEach(y => this.address = y);
        this.address = this.address.formatted_address;
      }
    );
  }

  //get latitude and longitude for the given address
  getLatLong() {
    this.appService.getExternal("https://maps.googleapis.com/maps/api/geocode/json?address=" + this.address + "&key=AIzaSyCNH7ZuXjNdXqZFzlpOB0snpBZjoUC5jRo").subscribe(
      x => {
        x.results.slice(0, 1).forEach(y => {
          this.lat = y.geometry.location.lat;
          this.long = y.geometry.location.lng;
          //  console.log(this.lat)
        });
      }
    )
  }

  outputemit(x: any) {
    this.lat = x.lat;
    this.long = x.long;
  }

}