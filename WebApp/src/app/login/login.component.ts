import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppServiceService } from '../app-service.service';
import { IResponse } from '../interface/IResponse';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { EncryptServiceService } from '../../app/encrypt-service.service';
import { UserServiceService } from '../shared/user-service.service';
import { userResponse } from '../interface/IResponse'
import { verificationResponse } from '../interface/IResponse';
import { MustMatch } from '../../app/helpers/must-match.validator';
import { MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { DialogRegister,DialogResend,DialogInvalidToken,DialogVerify,DialogPassword} from '../shared/dialog-components/dialog.component';
import { MatRadioChange, MatRadioButton}  from '@angular/material/radio';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  view: any;
  registerForm:FormGroup;
  verificationForm:FormGroup;
  submitted:boolean;
  mail: String;
  radioFilter:String;

  constructor(private _routes: Router,
    private route: ActivatedRoute,
    private appservice: AppServiceService,
    private EncrDecr: EncryptServiceService,
    private user: UserServiceService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    ) { }

  loginForm = new FormGroup({
    userEmail: new FormControl('', [Validators.required, Validators.email]),
    userPassword: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    sessionStorage.removeItem('jwt_token');
    sessionStorage.removeItem('auth');
    this.urlReader();
    this.submitted=false;
  
    this.registerForm = this.formBuilder.group({
    userFirstName: ['', Validators.required],
    userLastName: ['', Validators.required],
    userType: ['', Validators.required],
    
    userEmail: ['', [Validators.required, Validators.email]],
    userPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
    }, {
    validator: MustMatch('userPassword', 'confirmPassword')
    });
  
    this.verificationForm = new FormGroup({
    userEmail: new FormControl('', [Validators.required, Validators.email]),
    verificationCode: new FormControl('', Validators.required)
    });
  }

  //Authenticate Function For JWT Login
  authenticate() {
    let params = [];
    params.push(this.loginForm.get('userEmail').value);
    let body = {
      userPassword: this.EncrDecr.set('123456$#@$^@1ERF', this.loginForm.get('userPassword').value)
    }
    // authenticate the user and let him login
    if(this.loginForm.valid){
    const val = this.appservice.post<IResponse>('US-AU', body, params).subscribe(x => {
      if (x.auth == true) {
        sessionStorage.setItem("auth", this.EncrDecr.set('123456$#@$^@1ERF',JSON.stringify(x.user)));
        delete x.user
        sessionStorage.setItem("jwt_token", JSON.stringify(x));
        this._routes.navigate(['/layout']);
      } else {
        const dialogRef = this.dialog.open(DialogPassword, {
          panelClass: 'custom-dialog-container',
          data: {
            msg: "Email/Password is incorrect."
          }

        });
        
        dialogRef.afterClosed().subscribe(result => {
          //  console.log('The dialog was closed');
          this.mail = '';
        });
      }
    });
  }
}

  // Radio Group Change Trigger
  onChangeRadio(radioChange: MatRadioChange) {
    //  console.log(radioChange.value);
    this.radioFilter=radioChange.value;
    if(radioChange.value=="vendor"){
    this.registerForm.addControl('vendorLicense', new FormControl ('', [Validators.required, Validators.minLength(10)]));
    this.registerForm.addControl('companyName', new FormControl ('', [Validators.required]));
    }
    else{
    this.registerForm.removeControl('vendorLicense');
    this.registerForm.removeControl('companyName');
    }
 } 

  //Form Controls Retrieving Function
  get rf() { return this.registerForm.controls; }

  get vf() { return this.verificationForm.controls;}
  
  get lf() { return this.loginForm.controls;}
  
  //View Retriever
  urlReader() {
    this.route.url.subscribe(params => {
      this.view=params[0].path;
      //  console.log("Current View -- " + this.view);
    })
  }

  signUp(){
    this._routes.navigate(['/signUp']);
  }

  login(){
    this._routes.navigate(['/login']);
  }

  //Register Function
  register(){
    this.submitted = true;
    let body = {
      userEmail: this.registerForm.get('userEmail').value,
      userPassword: this.registerForm.get('userPassword').value,
      userType: this.registerForm.get('userType').value,
      userFirstName: this.registerForm.get('userFirstName').value,
      userLastName: this.registerForm.get('userLastName').value
    };

    if(this.radioFilter=="vendor"){
      body['vendorLicense'] = this.registerForm.get('vendorLicense').value;
      body['companyName'] = this.registerForm.get('companyName').value;
    }

    // Register Body Post
    if(this.registerForm.valid){
        this.appservice.post<userResponse>('US-AU', body).subscribe(y => {
          //  console.log("Posted User");
          const dialogRef = this.dialog.open(DialogRegister, {
            panelClass: 'custom-dialog-container',
            data: {
              mail: this.registerForm.get('userEmail').value
            }
          });
          
          dialogRef.afterClosed().subscribe(result => {
            //  console.log('The dialog was closed');
            this.mail = '';
          });
          this._routes.navigate(['/login']);
        
        },
        error => {
          if(error.error.msg.includes("E11000")){
            //  console.log(error.error.msg);
            const dialogRef = this.dialog.open(DialogInvalidToken, {
              panelClass: 'custom-dialog-container',
               data: { 
               msg: this.registerForm.get('userEmail').value + " already exists."
              }
            });
    
           dialogRef.afterClosed().subscribe(result => {
           //  console.log('The dialog was closed');
           this.mail = '';
            });
          }
        })
      } else {
        //  console.log("Validation Failed");
  }
}


// Verify/Resend function submission
verifyOrResend(buttontype){
  if(buttontype=="Verify"){
  let body = {
    userEmail: this.verificationForm.get('userEmail').value,
    verificationCode: this.verificationForm.get('verificationCode').value
  };
  if(this.verificationForm.valid){
    this.appservice.post<verificationResponse>('US-VE', body).subscribe(y => {
      //  console.log(y); 
      //  console.log("User Verified");
      const dialogRef = this.dialog.open(DialogVerify, {
        panelClass: 'custom-dialog-container',
        data: {
          mail: this.verificationForm.get('userEmail').value
      }
      });
      
      dialogRef.afterClosed().subscribe(result => {
        //  console.log('The dialog was closed');
        this.mail = '';
      });
      this._routes.navigate(['/login']);
  },
  error => {
    //  console.log(error.error.msg);
    const dialogRef = this.dialog.open(DialogInvalidToken, {
      panelClass: 'custom-dialog-container',
      data: { 
        msg: error.error.msg
    }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      //  console.log('The dialog was closed');
      this.mail = '';
    });
  })
}
} else if(buttontype=="Resend"){
    //  console.log("In Resend");
    let body = {
      userEmail: this.verificationForm.get('userEmail').value,
    };
    if(this.verificationForm.get('userEmail').valid){
      this.appservice.post<verificationResponse>('US-RVE', body).subscribe(y => {
        //  console.log("User Verified");
        const dialogRef = this.dialog.open(DialogResend, {
          panelClass: 'custom-dialog-container',
          data: {
            mail: this.verificationForm.get('userEmail').value
        }
        });
        
        dialogRef.afterClosed().subscribe(result => {
          //  console.log('The dialog was closed');
          this.mail = '';
        });
        this._routes.navigate(['/login']);
    },
    error => {
      //  console.log(error.error.msg);
      const dialogRef = this.dialog.open(DialogInvalidToken, {
      panelClass: 'custom-dialog-container',
      data: { 
        msg: error.error.msg
    }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      //  console.log('The dialog was closed');
      this.mail = '';
    });
    })   
}

}
}


//Error Message Retrieval For Register
getRegisterErrorMessage(x: any) {
  switch(x) {
    case "userFirstName":
      if (this.registerForm.get('userFirstName').hasError('required')) {
        return 'You must enter a value';
      }
    case "userEmail":
      if (this.registerForm.get('userEmail').hasError('required')) {
        return 'You must enter a value';
      } else if (this.registerForm.get('userEmail').hasError('email')){
        return this.registerForm.get('userEmail').hasError('email') ? 'Not a valid email' : '';
      }
    case "userLastName":
      if (this.registerForm.get('userLastName').hasError('required')) {
        return 'You must enter a value';
      }
    case "companyName":
      if (this.registerForm.get('companyName').hasError('required')) {
          return 'You must enter a value';
      }
    case "userType":
        if (this.registerForm.get('userType').hasError('required')) {
          return 'You must select a value';
        }
    case "vendorLicense":
        if (this.registerForm.get('vendorLicense').hasError('required')) {
            return 'You must select a value';
        } else
        if (this.registerForm.get('vendorLicense').hasError('minlength')){
          return this.registerForm.get('vendorLicense').hasError('minlength') ? 'License Length Invalid' : '';
        }
    case "userPassword":
      if (this.registerForm.get('userPassword').hasError('required')) {
        return 'You must enter a value';
      } else
      if (this.registerForm.get('userPassword').hasError('minlength')){
        return this.registerForm.get('userPassword').hasError('minlength') ? 'Password short (8 or more characters)' : '';
      }
    case "confirmPassword":
      if (this.registerForm.get('confirmPassword').hasError('required')) {
        return 'You must enter a value';
      } else
      if (this.registerForm.get('confirmPassword').hasError('mustMatch')){
        return this.registerForm.get('confirmPassword').hasError('mustMatch') ? 'Passwords don\'t match' : '';
      }

    }
  }

 //Error Message Retrieval For Verification
  getVerificationErrorMessage(x: any) {
  switch(x) {
    case "userEmail":
      if (this.verificationForm.get('userEmail').hasError('required')) {
        return 'You must enter a value';
      } else if (this.verificationForm.get('userEmail').hasError('email')){
        return this.verificationForm.get('userEmail').hasError('email') ? 'Not a valid email' : '';
      }
    case "verificationCode":
      if (this.verificationForm.get('verificationCode').hasError('required')) {
        return 'You must enter a value';
      }
    }
  }

  //Error Message Retrieval For Login
  getLoginErrorMessage(x: any) {
    switch(x) {
      case "userEmail":
        if (this.loginForm.get('userEmail').hasError('required')) {
          return 'You must enter a value';
        } else if (this.loginForm.get('userEmail').hasError('email')){
          return this.loginForm.get('userEmail').hasError('email') ? 'Not a valid email' : '';
        }
      case "userPassword":
        if (this.loginForm.get('userPassword').hasError('required')) {
          return 'You must enter a value';
        }
      }
    }

}










