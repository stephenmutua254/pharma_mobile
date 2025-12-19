import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  AESKEY = CryptoJS.enc.Utf8.parse('bizonlinekeyforencryptinginfo444')
  AESIV = CryptoJS.enc.Utf8.parse('bizonlinekeyfore')

  constructor() { }

  encryptText(text: string) {
    return btoa(CryptoJS.AES.encrypt(text, this.AESKEY, {iv: this.AESIV}).toString());
  }

  decryptText(text: string) {
    return CryptoJS.AES.decrypt(atob(text), this.AESKEY, {iv: this.AESIV}).toString(CryptoJS.enc.Utf8);
  }

}
