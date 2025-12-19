import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';
import { IonLoading } from '@ionic/angular/standalone';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  imports: [IonLoading]
})
export class LoadingComponent implements OnInit {

  message: string = '';
  duration: number = 5000000000;

  isOpened = false;

  constructor(private loadSrv: LoadingService) { }

  ngOnInit() {
    this.loadSrv.getLoadState().subscribe((loadStatus) => {
        if(loadStatus) {
          if(this.isOpened==true) {
            this.message = loadStatus.message;
          } else {
            this.message = loadStatus.message;
            this.isOpened = true;
          }
        } else {
          this.isOpened = false;
        }
    })
  }


}
