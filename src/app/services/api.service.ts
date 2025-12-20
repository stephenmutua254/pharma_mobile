import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { LoadingService } from './loading.service';
import { ToastService } from './toast.service';
import { environment } from 'src/environments/environment';
import { firstValueFrom, throwError } from 'rxjs';
import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root',
})


export class ApiService {

  private readApi = environment.readApi;
  private postApi = environment.postApi;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private httpSrv: HttpClient,
              private authSrv: AuthService,
              private loadSrv: LoadingService,
              private cryptoSrv: CryptoService,
              private toastSrv: ToastService
  ) {}

  async read(data: any): Promise<any> {
    try {
      
      data.mac = this.cryptoSrv.encryptText('mobile');
      data.at = this.authSrv.getUserToken('access_token');
      data.atu = this.authSrv.getUserToken('uid');
        
      const request = this.httpSrv.post(this.readApi, data, this.httpOptions);

      // convert the request to a promise
      return await firstValueFrom(request);

    } catch (error) {
      this.handleError;
    }
  }

  async post(data: any): Promise<any> {
    try {
      
      data.mac = this.cryptoSrv.encryptText('mobile');
      data.at = this.authSrv.getUserToken('access_token');
      data.atu = this.authSrv.getUserToken('uid');
      const request = this.httpSrv.post(this.postApi, data, this.httpOptions);

      // convert the request to a promise
      return await firstValueFrom(request);

    } catch (error) {
      this.handleError;
    }
  }


  async checkResponseStatus(resp: any) {
    if(resp) {
      if(resp.status!='error') {
        if(resp.status!='error2') {
  
          return resp;
  
        } else {
          this.loadSrv.closeLoad();
          this.toastSrv.showErrorToast('Login again');
          await this.authSrv.logOut();
        }
      } else {
        this.loadSrv.closeLoad();
        this.toastSrv.showErrorToast(resp.message);
      }
    } else {
      this.loadSrv.closeLoad();
      this.toastSrv.showErrorToast('No response received!')
    }

  }


  handleError(error: HttpErrorResponse) {
    // return an observable with a user-facing error message
    // console.log(error.error.text);
    if (error.status === 401) {
      // session expired
      return throwError(() => new Error('401'));
    } else if (error.status === 402) {
      return throwError(() => new Error('402'));
    } else {
      console.log(error);
      return throwError(() => new Error('Something bad happened; please try again later.'));
    }
  }
}
