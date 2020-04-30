import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';

//Dialog PopUp for Register

@Component({
    selector: 'dialog-popupRegister',
    templateUrl: 'dialog-popupRegister.html',
  })
  
  export class DialogRegister { 
    constructor(
      public dialogRef: MatDialogRef<DialogRegister>,
      @Inject(MAT_DIALOG_DATA) public data: any) {}
  
      onNoClick(): void {
        this.dialogRef.close();
      }
  }
  
  //Dialog PopUp for Verify
  
  @Component({
    selector: 'dialog-popupVerify',
    templateUrl: 'dialog-popupVerify.html',
  })
  
  export class DialogVerify { 
    constructor(
      public dialogRef: MatDialogRef<DialogVerify>,
      @Inject(MAT_DIALOG_DATA) public data: any) {}
  
      onNoClick(): void {
        this.dialogRef.close();
      }
  }
  
  //Dialog PopUp for Resend
  @Component({
    selector: 'dialog-popupResend',
    templateUrl: 'dialog-popupResend.html',
  })
  
  export class DialogResend { 
    constructor(
      public dialogRef: MatDialogRef<DialogResend>,
      @Inject(MAT_DIALOG_DATA) public data: any) {}
  
      onNoClick(): void {
        this.dialogRef.close();
      }
  }
  
  //Dialog PopUp for Invalid Token
  @Component({
    selector: 'dialog-invalidtoken',
    templateUrl: 'dialog-invalidToken.html',
  })
  
  export class DialogInvalidToken { 
    constructor(
      public dialogRef: MatDialogRef<DialogInvalidToken>,
      @Inject(MAT_DIALOG_DATA) public data: any) {}
  
      onNoClick(): void {
        this.dialogRef.close();
      }
  }

  //Dialog PopUp for Invalid Token
  @Component({
    selector: 'dialog-invalidPassword',
    templateUrl: 'dialog-invalidPassword.html',
  })
  
  export class DialogPassword { 
    constructor(
      public dialogRef: MatDialogRef<DialogPassword>,
      @Inject(MAT_DIALOG_DATA) public data: any) {}
  
      onNoClick(): void {
        this.dialogRef.close();
      }
  }