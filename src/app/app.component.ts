import { IonRouterOutlet, ModalController, Platform, NavController } from '@ionic/angular/standalone';
import { Component } from '@angular/core';
import { SharedModules } from './shared/shared.module';
import { Location } from '@angular/common';
import { routeTransitionAnimations } from './app.routes';
import { AuthService } from './services/auth.service';
import { LoadingService } from './services/loading.service';
import { Observable } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
import { SharedComponentsModule } from './shared/shared-components.module';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [SharedModules, SharedComponentsModule],
  animations: [trigger('enter', [
  transition('* => *', [
    style({ opacity: 0 }),
    animate('1s', style({ opacity: 1 }))
  ])
])]
})
export class AppComponent {

  private ignoreNextPopstate = false;

  loaded$!: Observable<boolean>;

  constructor(private modalCtrl: ModalController,
              private location: Location,
              private navCtrl: NavController,
              private loadingSrv: LoadingService,
              private platform: Platform,
              private authSrv: AuthService) {
                this.loaded$ = this.loadingSrv.loaded$;
                this.initializeBackButtonHandler();
                this.initializeBrowserBackButtonHandler();
                
              }

  getPage(outlet: IonRouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  logOut() {
    this.authSrv.logOut();
  }

  navigateTo(page: string) {
    this.navCtrl.navigateForward(page, {animated: false});
  }

  refresh(event: any) {
    // Optional delay to show the refresh animation
    setTimeout(() => {
      window.location.reload(); // Reloads the whole page
      event.target.complete(); // Completes the refresher animation
    }, 500);
  }

  private initializeBackButtonHandler() {
    this.platform.ready().then(() => {
      console.log('Platform is ready, registering back button handler');
      this.platform.backButton.subscribeWithPriority(10, async () => {
        console.log('Back button pressed (Ionic)');

        const modal = await this.closeModalIfOpen();
        if (!modal) {
          if (this.location.isCurrentPathEqualTo('/')) {
            console.log('Navigating to home page');
            window.location.href = '/';
          } else {
            console.log('Navigating to the previous page');
            this.location.back();
          }
        }
      });
    });
  }

  private initializeBrowserBackButtonHandler() {
    // Push initial history state
    window.history.pushState(null, '', window.location.href);
    
    window.addEventListener('popstate', async (event) => {
      if (this.ignoreNextPopstate) {
        console.log('Ignoring this popstate event');
        this.ignoreNextPopstate = false;
        return;
      }

      console.log('Browser back button pressed');

      const modal = await this.closeModalIfOpen();
      if (modal) {
        console.log('Modal closed, preventing navigation');
        this.ignoreNextPopstate = true; // Prevent the browser from navigating
        window.history.pushState(null, '', window.location.href); // Push the current state back
      } else {
        console.log('No modals open, letting the browser navigate.');
      }
    });
  }

  private async closeModalIfOpen(): Promise<boolean> {
    // Check for programmatically created modals
    const programmaticModal = await this.modalCtrl.getTop();
    if (programmaticModal) {
      console.log('Closing programmatic modal');
      await programmaticModal.dismiss();
      return true;
    }

    // Check for inline modals
    const inlineModals = Array.from(document.querySelectorAll('ion-modal[is-open="true"]'));
    if (inlineModals.length > 0) {
      const topmostInlineModal = inlineModals[inlineModals.length - 1];
      console.log('Closing inline modal');
      (topmostInlineModal as any).dismiss();
      return true;
    }

    return false;
  }
}
