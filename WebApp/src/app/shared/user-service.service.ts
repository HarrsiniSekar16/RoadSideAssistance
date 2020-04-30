import { Injectable } from '@angular/core';
import { Iuser } from '../interface/IResponse';
import { EncryptServiceService } from '../encrypt-service.service';
import { Subject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class UserServiceService {
  private user : Iuser;
  constructor(private encdec: EncryptServiceService) { }
  private userSubj = new Subject();
  
  getSubj(): Subject<any>{
    return this.userSubj;
  }

  getUser(): Iuser{
    this.user = JSON.parse(this.encdec.get('123456$#@$^@1ERF',sessionStorage.getItem('auth')));
    return this.user;
  }

  reloadUser(modUser: Iuser){
    sessionStorage.removeItem('auth');
    sessionStorage.setItem("auth", this.encdec.set('123456$#@$^@1ERF',JSON.stringify(modUser)));
    this.userSubj.next(this.getUser());
  }
}