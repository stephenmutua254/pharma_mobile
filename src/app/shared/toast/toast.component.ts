import { Component, OnInit } from '@angular/core';
import { ToastService } from 'src/app/services/toast.service';
import { IonToast } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeCircleOutline, checkmark } from 'ionicons/icons';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  imports: [IonToast]
})
export class ToastComponent implements OnInit {

  
  position: string = 'top';
  positionAnchor: string = 'header';
  message: string = '';
  icon: string = 'checkmark';
  duration: number = 0;
  color: string = 'danger';

  isOpen = false;

  constructor(public toastSrv: ToastService) {
    addIcons({ 
      'close-circle-outline': closeCircleOutline,
      'checkmark': checkmark
    });
  }

  ngOnInit() {
    this.toastSrv.getToastState().subscribe((toastData) => {
      if(toastData) {
        this.message = toastData.message;
        this.icon = toastData.icon;
        this.color = toastData.color;
        this.duration = toastData.duration;
        this.isOpen = true;
      } else {
        this.icon = '';
        this.isOpen = false;
      }
    })
  }
}
