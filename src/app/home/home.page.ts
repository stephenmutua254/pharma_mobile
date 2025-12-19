import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton } from '@ionic/angular/standalone';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton],
})
export class HomePage implements OnInit, OnDestroy {
  constructor(private loadSrv: LoadingService) {}
  
  ngOnDestroy(): void {
    this.loadSrv.setLoaded(false);
  }

  ngOnInit() {
    setTimeout(() => {
      this.loadSrv.setLoaded(true);
    }, 1000);
  }

}
