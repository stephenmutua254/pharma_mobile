import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private loadState = new BehaviorSubject<any>(null);
  private loadedSubject = new BehaviorSubject<boolean>(true);

  // Public Observable stream for other components to subscribe to
  loaded$: Observable<boolean> = this.loadedSubject.asObservable();
  
  constructor() {}

  setLoaded(isLoaded: boolean): void {
    this.loadedSubject.next(isLoaded);
  }

  getLoadState() {
    return this.loadState.asObservable();
  }

  showLoad(message: string) {
    this.loadState.next({message: message});
  }

  changeLoadMessage(message: string) {
    this.loadState.next({message: message});
  }

  closeLoad() {
    this.loadState.next(null);
  }

}
