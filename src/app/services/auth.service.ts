import { NavController, ModalController } from '@ionic/angular/standalone';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private navCtrl: NavController,
              private modalCtrl: ModalController,
              private router: Router) {}
  
  async logOut() {
    const modal = await this.closeModalIfOpen();
    if(modal) {
      localStorage.clear();
      this.router.navigateByUrl('/login');
    }
    
  }

  setUserIsLogged(userInfo: any) {

    const userToken = {
      access_token: userInfo.access_token,
      uid: userInfo.uid,
      nm: userInfo.nm
    };

    const tokenString = JSON.stringify(userToken);

    localStorage.setItem('ut', tokenString);
  }

  getUserToken(token: any) {
    const userToken = localStorage.getItem('ut');

    if(userToken) {
      const user = JSON.parse(userToken);

      if(user[token]) {
        return user[token]
      } else {
        return '';
      }
    } else {
      return '';
    }
  }




  private async closeModalIfOpen(): Promise<boolean> {
    // Check for programmatically created modals
    let i = 4;
    while(i>0) {
      const programmaticModal = await this.modalCtrl.getTop();
      if (programmaticModal) {
        await programmaticModal.dismiss();
        i--;
      } else {
        i=0;
      }
    }

    // Check for inline modals
    let j=4;
    while(j>0) {
      const inlineModals = Array.from(document.querySelectorAll('ion-modal[is-open="true"]'));
      if (inlineModals.length > 0) {
        const topmostInlineModal = inlineModals[inlineModals.length - 1];
        (topmostInlineModal as any).dismiss();
        j--;
      } else {
        j=0;
      }
    }
    
    return true;
    
  }
  
}
