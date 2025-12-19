import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedModules } from 'src/app/shared/shared.module';
import { IonThumbnail, NavController } from '@ionic/angular/standalone';
import { NgForm } from '@angular/forms';
import { LoadingService } from 'src/app/services/loading.service';
import { ApiService } from 'src/app/services/api.service';
import { ToastService } from 'src/app/services/toast.service';
import { AuthService } from 'src/app/services/auth.service';
import { CryptoService } from 'src/app/services/crypto.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [SharedModules, IonThumbnail]
})
export class LoginPage implements OnInit {
  @ViewChild('loginForm', {static: false}) loginForm: NgForm = {} as NgForm;
  
  constructor(private loadCtrl: LoadingService,
              private apiSrv: ApiService,
              private toastSrv: ToastService,
              private authSrv: AuthService,
              private cryptoSrv: CryptoService,
              private navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  login(loginForm: NgForm) {
    this.loadCtrl.showLoad('Authenticating...');

    const request = {
      action: this.cryptoSrv.encryptText('login-offline'),
      mobile: this.cryptoSrv.encryptText(loginForm.value.username),
      password: this.cryptoSrv.encryptText(loginForm.value.password)
    }

    this.apiSrv.login(request).then(async (resp) => {
      if(await this.apiSrv.checkResponseStatus(resp)) {
        this.loadCtrl.closeLoad();
        this.toastSrv.showSuccessToast('Login successfull');
        
        this.authSrv.setUserIsLogged(resp);
        // check if user is admin
        if(this.cryptoSrv.decryptText(resp.role) === 'admin') {
          await this.navCtrl.navigateForward('/dashboard');
        } else {
          await this.navCtrl.navigateForward('/sell');
        }
        
      }

    }).catch(error => {
      this.loadCtrl.closeLoad();
    });

  }

  ionViewDidLeave() {
    this.loginForm.reset();
  }

}
