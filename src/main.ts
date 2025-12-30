import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { addIcons } from 'ionicons';
import { home, list, cashOutline, cogOutline, add, warningOutline, barChartOutline, closeCircleOutline, pencilOutline, trashOutline, chevronForwardOutline,
          exit, menu, checkmarkOutline, createOutline, settings, wallet, documentTextOutline, basketOutline,
          arrowUndoOutline, walletOutline } from 'ionicons/icons';

import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

// 2. Register the icons globally before bootstrapping the app
addIcons({ home, list, add, cogOutline,
          documentTextOutline,
          basketOutline, cashOutline,
          arrowUndoOutline,
          barChartOutline,
          closeCircleOutline,
          chevronForwardOutline,
          exit, menu, settings,
          walletOutline,
          createOutline,
          checkmarkOutline,
          wallet,
          warningOutline,
          pencilOutline,
          trashOutline
        });

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideHttpClient(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideAnimations()
  ],
});
