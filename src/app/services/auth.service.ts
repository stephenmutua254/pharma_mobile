import { NavController } from '@ionic/angular/standalone';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private navCtrl: NavController, private router: Router) {}
  
  logOut() {
    this.router.navigateByUrl('/login');
    // this.navCtrl.navigateRoot('/login', {
    //   animated: true,
    //   animationDirection: 'back' // You still get the "going back" animation
    // });
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
  
}
