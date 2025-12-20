import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { addIcons } from 'ionicons';
import { home, list, add, barChartOutline, chevronForwardOutline,
          exit, menu, settings, documentTextOutline,
          arrowUndoOutline, walletOutline } from 'ionicons/icons';

import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

// 2. Register the icons globally before bootstrapping the app
addIcons({ home, list, add, documentTextOutline,
          arrowUndoOutline, barChartOutline, chevronForwardOutline,
          exit, menu, settings, walletOutline });

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideHttpClient(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideAnimations()
  ],
});
