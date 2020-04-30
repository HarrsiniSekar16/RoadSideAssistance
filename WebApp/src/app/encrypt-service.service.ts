import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptServiceService {

  constructor() { }

  set(keys, value){
    var encrypted = CryptoJS.AES.encrypt(value.toString(), keys.toString());
    return encrypted.toString();
  }

  get(keys,value){
    var decrypted = CryptoJS.AES.decrypt(value.toString(), keys.toString());
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

}
