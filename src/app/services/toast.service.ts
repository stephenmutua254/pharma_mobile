import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private toastState = new BehaviorSubject<any>(null);

  getToastState() {
    return this.toastState.asObservable();
  }

  showSuccessToast(message: string) {
    this.toastState.next({message: message, icon: 'checkmark', color: 'success', duration: 1500});
  }

  showErrorToast(message: string) {
    this.toastState.next({message: message, icon: 'close-circle-outline', color: 'danger', duration: 2000});
  }

  showWariningToast(message: string) {
    this.toastState.next({message: message, icon: 'warning-outline', color: 'danger', duration: 2000});
  }

  showInfoToast(message: string) {
    this.toastState.next({message: message, icon: 'information-circle-outline', color: 'primary', duration: 2000});
  }

  clearToast() {
    this.toastState.next(null);
  }

}
